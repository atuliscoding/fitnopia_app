-- Create exercise_performance table to track individual exercise performance
create table public.exercise_performance (
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
create table public.workout_feedback (
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
create table public.user_preferences (
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

-- Enable Row Level Security
alter table public.exercise_performance enable row level security;
alter table public.workout_feedback enable row level security;
alter table public.user_preferences enable row level security;

-- Exercise performance policies
create policy "Exercise performance is viewable by owner" on public.exercise_performance
  for select using (auth.uid() = user_id);

create policy "Exercise performance is insertable by owner" on public.exercise_performance
  for insert with check (auth.uid() = user_id);

create policy "Exercise performance is updatable by owner" on public.exercise_performance
  for update using (auth.uid() = user_id);

create policy "Exercise performance is deletable by owner" on public.exercise_performance
  for delete using (auth.uid() = user_id);

-- Workout feedback policies
create policy "Workout feedback is viewable by owner" on public.workout_feedback
  for select using (auth.uid() = user_id);

create policy "Workout feedback is insertable by owner" on public.workout_feedback
  for insert with check (auth.uid() = user_id);

create policy "Workout feedback is updatable by owner" on public.workout_feedback
  for update using (auth.uid() = user_id);

create policy "Workout feedback is deletable by owner" on public.workout_feedback
  for delete using (auth.uid() = user_id);

-- User preferences policies
create policy "User preferences are viewable by owner" on public.user_preferences
  for select using (auth.uid() = user_id);

create policy "User preferences are insertable by owner" on public.user_preferences
  for insert with check (auth.uid() = user_id);

create policy "User preferences are updatable by owner" on public.user_preferences
  for update using (auth.uid() = user_id);

create policy "User preferences are deletable by owner" on public.user_preferences
  for delete using (auth.uid() = user_id);

-- Create indexes for better performance
create index idx_exercise_performance_user_id on public.exercise_performance(user_id);
create index idx_exercise_performance_session_id on public.exercise_performance(session_id);
create index idx_exercise_performance_completed_at on public.exercise_performance(completed_at);

create index idx_workout_feedback_user_id on public.workout_feedback(user_id);
create index idx_workout_feedback_session_id on public.workout_feedback(session_id);
create index idx_workout_feedback_created_at on public.workout_feedback(created_at);

create index idx_user_preferences_user_id on public.user_preferences(user_id); 