import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST() {
  try {
    // In production, we would check for admin access here
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
    }

    console.log('Starting database migrations...');

    // Drop fitness_goal column if it exists
    await supabaseAdmin.rpc('exec_sql', {
      sql: `
        DO $$ 
        BEGIN
          IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'fitness_goal') 
          THEN
            ALTER TABLE public.profiles DROP COLUMN fitness_goal;
          END IF;
        END $$;
      `
    });

    // Add new columns and set defaults
    await supabaseAdmin.rpc('exec_sql', {
      sql: `
        ALTER TABLE public.profiles 
          ADD COLUMN IF NOT EXISTS name text,
          ADD COLUMN IF NOT EXISTS bio text DEFAULT '',
          ADD COLUMN IF NOT EXISTS fitness_level text DEFAULT 'beginner',
          ADD COLUMN IF NOT EXISTS goals text[] DEFAULT ARRAY['Get Fit']::text[],
          ALTER COLUMN height SET DEFAULT 170,
          ALTER COLUMN weight SET DEFAULT 70;
      `
    });

    // Update existing rows
    await supabaseAdmin.rpc('exec_sql', {
      sql: `
        UPDATE public.profiles 
        SET 
          name = COALESCE(name, 'User'),
          bio = COALESCE(bio, ''),
          fitness_level = COALESCE(fitness_level, 'beginner'),
          goals = COALESCE(goals, ARRAY['Get Fit']::text[]),
          height = COALESCE(height, 170),
          weight = COALESCE(weight, 70);
      `
    });

    console.log('Profile migrations completed');

    // Apply exercise performance and feedback tables migration
    console.log('Creating exercise performance and feedback tables...');
    await supabaseAdmin.rpc('exec_sql', {
      sql: `
        -- Create exercise_performance table to track individual exercise performance
        create table if not exists public.exercise_performance (
          id uuid default gen_random_uuid() primary key,
          user_id uuid references public.users(id) on delete cascade not null,
          session_id uuid references public.sessions(id) on delete cascade not null,
          workout_exercise_id uuid references public.workout_exercises(id) on delete cascade not null,
          exercise_name text not null, -- Store exercise name for denormalization
          sets_completed integer not null default 0,
          reps_completed integer not null default 0,
          weight_used numeric(6,2) default 0, -- Weight in kg/lbs
          duration_seconds integer default 0, -- For time-based exercises
          difficulty_rating integer check (difficulty_rating >= 1 and difficulty_rating <= 10), -- 1-10 scale
          notes text default '',
          completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null,
          updated_at timestamp with time zone default timezone('utc'::text, now()) not null
        );

        -- Create workout_feedback table to collect feedback after each workout
        create table if not exists public.workout_feedback (
          id uuid default gen_random_uuid() primary key,
          user_id uuid references public.users(id) on delete cascade not null,
          session_id uuid references public.sessions(id) on delete cascade not null,
          overall_rating integer not null check (overall_rating >= 1 and overall_rating <= 5), -- 1-5 star rating
          difficulty_rating integer not null check (difficulty_rating >= 1 and difficulty_rating <= 5), -- 1-5 scale (too easy to too hard)
          enjoyment_rating integer not null check (enjoyment_rating >= 1 and enjoyment_rating <= 5), -- 1-5 scale
          energy_level_before integer check (energy_level_before >= 1 and energy_level_before <= 10), -- 1-10 scale
          energy_level_after integer check (energy_level_after >= 1 and energy_level_after <= 10), -- 1-10 scale
          workout_duration_minutes integer default 0,
          exercises_completed integer default 0,
          exercises_skipped integer default 0,
          favorite_exercise text default '',
          least_favorite_exercise text default '',
          improvements_suggested text default '',
          additional_notes text default '',
          would_repeat boolean default true,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null,
          updated_at timestamp with time zone default timezone('utc'::text, now()) not null
        );

        -- Create user_preferences table to store workout questionnaire data
        create table if not exists public.user_preferences (
          id uuid default gen_random_uuid() primary key,
          user_id uuid references public.users(id) on delete cascade not null unique,
          fitness_goals text[] default '{}' not null, -- Array of goals
          preferred_workout_types text[] default '{}' not null, -- Array of workout types
          available_equipment text[] default '{}' not null, -- Array of equipment
          fitness_level text default 'BEGINNER' not null,
          workout_duration_preference integer default 30 not null, -- in minutes
          workout_frequency_per_week integer default 3 not null,
          preferred_workout_times text[] default '{}' not null, -- Array of times
          physical_limitations text[] default '{}' not null, -- Array of limitations
          motivation_factors text[] default '{}' not null, -- What motivates them
          workout_environment text default 'HOME' not null, -- HOME, GYM, OUTDOOR
          intensity_preference text default 'MODERATE' not null, -- LOW, MODERATE, HIGH
          focus_areas text[] default '{}' not null, -- Body areas to focus on
          health_conditions text[] default '{}' not null, -- Any health conditions
          experience_level text default 'BEGINNER' not null,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null,
          updated_at timestamp with time zone default timezone('utc'::text, now()) not null
        );
      `
    });

    console.log('Creating RLS policies...');
    await supabaseAdmin.rpc('exec_sql', {
      sql: `
        -- Enable Row Level Security
        alter table public.exercise_performance enable row level security;
        alter table public.workout_feedback enable row level security;
        alter table public.user_preferences enable row level security;

        -- Exercise performance policies
        drop policy if exists "Exercise performance is viewable by owner" on public.exercise_performance;
        create policy "Exercise performance is viewable by owner" on public.exercise_performance
          for select using (auth.uid() = user_id);

        drop policy if exists "Exercise performance is insertable by owner" on public.exercise_performance;
        create policy "Exercise performance is insertable by owner" on public.exercise_performance
          for insert with check (auth.uid() = user_id);

        drop policy if exists "Exercise performance is updatable by owner" on public.exercise_performance;
        create policy "Exercise performance is updatable by owner" on public.exercise_performance
          for update using (auth.uid() = user_id);

        drop policy if exists "Exercise performance is deletable by owner" on public.exercise_performance;
        create policy "Exercise performance is deletable by owner" on public.exercise_performance
          for delete using (auth.uid() = user_id);

        -- Workout feedback policies
        drop policy if exists "Workout feedback is viewable by owner" on public.workout_feedback;
        create policy "Workout feedback is viewable by owner" on public.workout_feedback
          for select using (auth.uid() = user_id);

        drop policy if exists "Workout feedback is insertable by owner" on public.workout_feedback;
        create policy "Workout feedback is insertable by owner" on public.workout_feedback
          for insert with check (auth.uid() = user_id);

        drop policy if exists "Workout feedback is updatable by owner" on public.workout_feedback;
        create policy "Workout feedback is updatable by owner" on public.workout_feedback
          for update using (auth.uid() = user_id);

        drop policy if exists "Workout feedback is deletable by owner" on public.workout_feedback;
        create policy "Workout feedback is deletable by owner" on public.workout_feedback
          for delete using (auth.uid() = user_id);

        -- User preferences policies
        drop policy if exists "User preferences are viewable by owner" on public.user_preferences;
        create policy "User preferences are viewable by owner" on public.user_preferences
          for select using (auth.uid() = user_id);

        drop policy if exists "User preferences are insertable by owner" on public.user_preferences;
        create policy "User preferences are insertable by owner" on public.user_preferences
          for insert with check (auth.uid() = user_id);

        drop policy if exists "User preferences are updatable by owner" on public.user_preferences;
        create policy "User preferences are updatable by owner" on public.user_preferences
          for update using (auth.uid() = user_id);

        drop policy if exists "User preferences are deletable by owner" on public.user_preferences;
        create policy "User preferences are deletable by owner" on public.user_preferences
          for delete using (auth.uid() = user_id);
      `
    });

    console.log('Creating indexes...');
    await supabaseAdmin.rpc('exec_sql', {
      sql: `
        -- Create indexes for better performance
        create index if not exists idx_exercise_performance_user_id on public.exercise_performance(user_id);
        create index if not exists idx_exercise_performance_session_id on public.exercise_performance(session_id);
        create index if not exists idx_exercise_performance_completed_at on public.exercise_performance(completed_at);

        create index if not exists idx_workout_feedback_user_id on public.workout_feedback(user_id);
        create index if not exists idx_workout_feedback_session_id on public.workout_feedback(session_id);
        create index if not exists idx_workout_feedback_created_at on public.workout_feedback(created_at);

        create index if not exists idx_user_preferences_user_id on public.user_preferences(user_id);
      `
    });

    console.log('Adding order_index to workout_exercises...');
    await supabaseAdmin.rpc('exec_sql', {
      sql: `
        -- Add order_index column to workout_exercises table if it doesn't exist
        ALTER TABLE public.workout_exercises 
        ADD COLUMN IF NOT EXISTS order_index integer DEFAULT 0;

        -- Create index for order_index for better query performance
        CREATE INDEX IF NOT EXISTS idx_workout_exercises_order_index 
        ON public.workout_exercises(workout_id, order_index);

        -- Update existing records to have proper order_index values
        UPDATE public.workout_exercises 
        SET order_index = ROW_NUMBER() OVER (PARTITION BY workout_id ORDER BY created_at)
        WHERE order_index = 0 OR order_index IS NULL;
      `
    });

    console.log('All migrations completed successfully!');

    return NextResponse.json({ success: true, message: 'All migrations applied successfully' });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ 
      error: 'Migration failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 