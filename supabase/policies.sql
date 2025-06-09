-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.workout_plans enable row level security;
alter table public.exercises enable row level security;
alter table public.sessions enable row level security;

-- Users policies
create policy "Users can read their own data"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own data"
  on public.users for update
  using (auth.uid() = id);

-- Profiles policies
create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = user_id);

-- Workout plans policies
create policy "Workout plans are viewable by owner"
  on public.workout_plans for select
  using (auth.uid() = user_id);

create policy "Workout plans are insertable by owner"
  on public.workout_plans for insert
  with check (auth.uid() = user_id);

create policy "Workout plans are updatable by owner"
  on public.workout_plans for update
  using (auth.uid() = user_id);

create policy "Workout plans are deletable by owner"
  on public.workout_plans for delete
  using (auth.uid() = user_id);

-- Sessions policies
create policy "Sessions are viewable by owner"
  on public.sessions for select
  using (auth.uid() = user_id);

create policy "Sessions are insertable by owner"
  on public.sessions for insert
  with check (auth.uid() = user_id);

create policy "Sessions are updatable by owner"
  on public.sessions for update
  using (auth.uid() = user_id);

create policy "Sessions are deletable by owner"
  on public.sessions for delete
  using (auth.uid() = user_id);

-- Function to enable user security
create or replace function public.enable_user_security(user_id uuid)
returns void as $$
begin
  -- Set the role claim for the user
  perform set_claim(user_id, 'role', 'authenticated');
  -- Set the user_id claim
  perform set_claim(user_id, 'user_id', user_id::text);
end;
$$ language plpgsql security definer; 