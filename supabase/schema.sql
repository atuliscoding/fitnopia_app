-- Create users table
create table public.users (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text unique not null,
  password text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create profiles table
create table public.profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  bio text default '' not null,
  height numeric(5,2) default 0 not null,
  weight numeric(5,2) default 0 not null,
  fitness_goal text default 'GENERAL_FITNESS' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create workout_plans table
create table public.workout_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  description text,
  difficulty text default 'BEGINNER' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create exercises table
create table public.exercises (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  muscle_group text not null,
  equipment text[],
  difficulty text default 'BEGINNER' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create workout_exercises table (junction table for workout_plans and exercises)
create table public.workout_exercises (
  id uuid default gen_random_uuid() primary key,
  workout_plan_id uuid references public.workout_plans(id) on delete cascade not null,
  exercise_id uuid references public.exercises(id) on delete cascade not null,
  sets integer default 3 not null,
  reps integer default 10 not null,
  rest_time integer default 60 not null, -- in seconds
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create sessions table
create table public.sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  workout_plan_id uuid references public.workout_plans(id) on delete set null,
  start_time timestamp with time zone default timezone('utc'::text, now()) not null,
  end_time timestamp with time zone,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.workout_plans enable row level security;
alter table public.exercises enable row level security;
alter table public.workout_exercises enable row level security;
alter table public.sessions enable row level security;

-- Users policies
create policy "Users can read their own data" on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own data" on public.users
  for update using (auth.uid() = id);

-- Profiles policies
create policy "Profiles are viewable by owner" on public.profiles
  for select using (auth.uid() = user_id);

create policy "Profiles are updatable by owner" on public.profiles
  for update using (auth.uid() = user_id);

-- Workout plans policies
create policy "Workout plans are viewable by owner" on public.workout_plans
  for select using (auth.uid() = user_id);

create policy "Workout plans are insertable by owner" on public.workout_plans
  for insert with check (auth.uid() = user_id);

create policy "Workout plans are updatable by owner" on public.workout_plans
  for update using (auth.uid() = user_id);

create policy "Workout plans are deletable by owner" on public.workout_plans
  for delete using (auth.uid() = user_id);

-- Exercises policies (publicly readable)
create policy "Exercises are viewable by all" on public.exercises
  for select using (true);

-- Workout exercises policies
create policy "Workout exercises are viewable by workout plan owner" on public.workout_exercises
  for select using (
    exists (
      select 1 from public.workout_plans wp
      where wp.id = workout_exercises.workout_plan_id
      and wp.user_id = auth.uid()
    )
  );

create policy "Workout exercises are insertable by workout plan owner" on public.workout_exercises
  for insert with check (
    exists (
      select 1 from public.workout_plans wp
      where wp.id = workout_exercises.workout_plan_id
      and wp.user_id = auth.uid()
    )
  );

create policy "Workout exercises are updatable by workout plan owner" on public.workout_exercises
  for update using (
    exists (
      select 1 from public.workout_plans wp
      where wp.id = workout_exercises.workout_plan_id
      and wp.user_id = auth.uid()
    )
  );

create policy "Workout exercises are deletable by workout plan owner" on public.workout_exercises
  for delete using (
    exists (
      select 1 from public.workout_plans wp
      where wp.id = workout_exercises.workout_plan_id
      and wp.user_id = auth.uid()
    )
  );

-- Sessions policies
create policy "Sessions are viewable by owner" on public.sessions
  for select using (auth.uid() = user_id);

create policy "Sessions are insertable by owner" on public.sessions
  for insert with check (auth.uid() = user_id);

create policy "Sessions are updatable by owner" on public.sessions
  for update using (auth.uid() = user_id);

create policy "Sessions are deletable by owner" on public.sessions
  for delete using (auth.uid() = user_id); 