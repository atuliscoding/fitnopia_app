-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "citext";

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email citext not null unique,
  full_name text,
  avatar_url text,
  bio text,
  height numeric(5,2),
  weight numeric(5,2),
  fitness_goal text check (fitness_goal in ('WEIGHT_LOSS', 'MUSCLE_GAIN', 'GENERAL_FITNESS', 'ENDURANCE')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create workouts table
create table public.workouts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  duration interval,
  difficulty text check (difficulty in ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
  type text check (type in ('STRENGTH', 'CARDIO', 'HIIT', 'YOGA', 'CUSTOM')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create exercises table
create table public.exercises (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  muscle_group text[] not null,
  equipment text[],
  difficulty text check (difficulty in ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create workout_exercises table (junction table)
create table public.workout_exercises (
  id uuid default uuid_generate_v4() primary key,
  workout_id uuid references public.workouts(id) on delete cascade not null,
  exercise_id uuid references public.exercises(id) on delete cascade not null,
  sets int,
  reps int,
  weight numeric(6,2),
  duration interval,
  rest_duration interval,
  order_index int not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(workout_id, order_index)
);

-- Create progress table
create table public.progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  workout_id uuid references public.workouts(id) on delete cascade not null,
  exercise_id uuid references public.exercises(id) on delete cascade not null,
  sets_completed int,
  reps_completed int,
  weight numeric(6,2),
  duration interval,
  notes text,
  created_at timestamptz default now() not null
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.workouts enable row level security;
alter table public.exercises enable row level security;
alter table public.workout_exercises enable row level security;
alter table public.progress enable row level security;

-- Create policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can view their own workouts"
  on public.workouts for select
  using (auth.uid() = user_id);

create policy "Users can create their own workouts"
  on public.workouts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own workouts"
  on public.workouts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own workouts"
  on public.workouts for delete
  using (auth.uid() = user_id);

create policy "Exercises are viewable by all users"
  on public.exercises for select
  to authenticated
  using (true);

create policy "Users can view their workout exercises"
  on public.workout_exercises for select
  using (exists (
    select 1 from public.workouts
    where id = workout_exercises.workout_id
    and user_id = auth.uid()
  ));

create policy "Users can manage their workout exercises"
  on public.workout_exercises for all
  using (exists (
    select 1 from public.workouts
    where id = workout_exercises.workout_id
    and user_id = auth.uid()
  ));

create policy "Users can view their own progress"
  on public.progress for select
  using (user_id = auth.uid());

create policy "Users can create their own progress"
  on public.progress for insert
  with check (user_id = auth.uid());

-- Create functions
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

-- Create triggers
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 