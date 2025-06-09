-- Create custom types
DO $$ 
BEGIN
  CREATE TYPE workout_type AS ENUM (
    'Strength Training',
    'Cardio',
    'HIIT',
    'Yoga',
    'Flexibility',
    'Custom'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ 
BEGIN
  CREATE TYPE difficulty_level AS ENUM (
    'Beginner',
    'Intermediate',
    'Advanced'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Handle existing exercises table
DO $$ 
DECLARE
  column_exists boolean;
BEGIN
  -- Check if exercises table exists
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'exercises') THEN
    -- Check if muscle_group column exists
    SELECT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'exercises' 
      AND column_name = 'muscle_group'
    ) INTO column_exists;

    IF column_exists THEN
      -- First alter the column type and default
      ALTER TABLE public.exercises 
        ALTER COLUMN muscle_group TYPE text[] USING ARRAY[muscle_group],
        ALTER COLUMN muscle_group SET DEFAULT ARRAY[]::text[];
      
      -- Then rename the column in a separate statement
      ALTER TABLE public.exercises 
        RENAME COLUMN muscle_group TO target_muscles;
    END IF;

    -- Add target_muscles if neither column exists
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'exercises' 
      AND column_name IN ('muscle_group', 'target_muscles')
    ) THEN
      ALTER TABLE public.exercises ADD COLUMN target_muscles text[] DEFAULT ARRAY[]::text[];
    END IF;

    -- Add other new columns
    ALTER TABLE public.exercises
      ADD COLUMN IF NOT EXISTS equipment text[] DEFAULT ARRAY[]::text[],
      ADD COLUMN IF NOT EXISTS difficulty difficulty_level DEFAULT 'Beginner'::difficulty_level,
      ADD COLUMN IF NOT EXISTS instructions text[] DEFAULT ARRAY[]::text[],
      ADD COLUMN IF NOT EXISTS tips text[] DEFAULT ARRAY[]::text[],
      ADD COLUMN IF NOT EXISTS video_url text,
      ADD COLUMN IF NOT EXISTS video_start_time integer,
      ADD COLUMN IF NOT EXISTS video_end_time integer;
  ELSE
    -- Create exercises table if it doesn't exist
    CREATE TABLE public.exercises (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      name text NOT NULL,
      description text,
      target_muscles text[] DEFAULT ARRAY[]::text[],
      equipment text[] DEFAULT ARRAY[]::text[],
      difficulty difficulty_level DEFAULT 'Beginner'::difficulty_level NOT NULL,
      instructions text[] DEFAULT ARRAY[]::text[],
      tips text[] DEFAULT ARRAY[]::text[],
      video_url text,
      video_start_time integer,
      video_end_time integer,
      created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
      updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
    );
  END IF;
END $$;

-- Create or update workouts table
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'workouts') THEN
    CREATE TABLE public.workouts (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
      name text NOT NULL,
      description text,
      type workout_type,
      duration interval,
      difficulty difficulty_level DEFAULT 'Beginner'::difficulty_level,
      created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
      updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
    );
  ELSE
    -- Add new columns to existing table
    ALTER TABLE public.workouts
      ADD COLUMN IF NOT EXISTS type workout_type,
      ADD COLUMN IF NOT EXISTS duration interval,
      ADD COLUMN IF NOT EXISTS difficulty difficulty_level DEFAULT 'Beginner'::difficulty_level;
  END IF;
END $$;

-- Create or update workout_exercises table
DO $$
DECLARE
  constraint_exists boolean;
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'workout_exercises') THEN
    CREATE TABLE public.workout_exercises (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      workout_id uuid REFERENCES public.workouts(id) ON DELETE CASCADE,
      exercise_id uuid REFERENCES public.exercises(id) ON DELETE CASCADE,
      sets integer NOT NULL,
      reps integer NOT NULL,
      instructions text[] DEFAULT ARRAY[]::text[],
      tips text[] DEFAULT ARRAY[]::text[],
      target_muscles text[] DEFAULT ARRAY[]::text[],
      equipment text[] DEFAULT ARRAY[]::text[],
      video_url text,
      video_start_time integer,
      video_end_time integer,
      created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
      updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
      CONSTRAINT valid_sets CHECK (sets > 0),
      CONSTRAINT valid_reps CHECK (reps > 0),
      CONSTRAINT valid_video_times CHECK (
        (video_start_time IS NULL AND video_end_time IS NULL) OR
        (video_start_time < video_end_time)
      )
    );
  ELSE
    -- Add new columns to existing table
    ALTER TABLE public.workout_exercises
      ADD COLUMN IF NOT EXISTS instructions text[] DEFAULT ARRAY[]::text[],
      ADD COLUMN IF NOT EXISTS tips text[] DEFAULT ARRAY[]::text[],
      ADD COLUMN IF NOT EXISTS target_muscles text[] DEFAULT ARRAY[]::text[],
      ADD COLUMN IF NOT EXISTS equipment text[] DEFAULT ARRAY[]::text[],
      ADD COLUMN IF NOT EXISTS video_url text,
      ADD COLUMN IF NOT EXISTS video_start_time integer,
      ADD COLUMN IF NOT EXISTS video_end_time integer;

    -- Check and add constraints
    SELECT EXISTS (
      SELECT FROM information_schema.table_constraints 
      WHERE table_schema = 'public' 
      AND table_name = 'workout_exercises' 
      AND constraint_name = 'valid_sets'
    ) INTO constraint_exists;
    
    IF NOT constraint_exists THEN
      ALTER TABLE public.workout_exercises ADD CONSTRAINT valid_sets CHECK (sets > 0);
    END IF;

    SELECT EXISTS (
      SELECT FROM information_schema.table_constraints 
      WHERE table_schema = 'public' 
      AND table_name = 'workout_exercises' 
      AND constraint_name = 'valid_reps'
    ) INTO constraint_exists;
    
    IF NOT constraint_exists THEN
      ALTER TABLE public.workout_exercises ADD CONSTRAINT valid_reps CHECK (reps > 0);
    END IF;

    SELECT EXISTS (
      SELECT FROM information_schema.table_constraints 
      WHERE table_schema = 'public' 
      AND table_name = 'workout_exercises' 
      AND constraint_name = 'valid_video_times'
    ) INTO constraint_exists;
    
    IF NOT constraint_exists THEN
      ALTER TABLE public.workout_exercises ADD CONSTRAINT valid_video_times 
        CHECK ((video_start_time IS NULL AND video_end_time IS NULL) OR (video_start_time < video_end_time));
    END IF;
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workout_exercises_target_muscles ON public.workout_exercises USING gin(target_muscles);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_equipment ON public.workout_exercises USING gin(equipment); 