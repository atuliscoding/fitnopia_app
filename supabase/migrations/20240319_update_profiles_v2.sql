-- Add new columns to profiles table
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS name text,
  ADD COLUMN IF NOT EXISTS fitness_level text DEFAULT 'beginner',
  ADD COLUMN IF NOT EXISTS goals text[] DEFAULT ARRAY['Get Fit']::text[];

-- Set default values for existing columns
ALTER TABLE public.profiles
  ALTER COLUMN bio SET DEFAULT '',
  ALTER COLUMN height SET DEFAULT 170,
  ALTER COLUMN weight SET DEFAULT 70;

-- Update existing rows with default values
UPDATE public.profiles 
SET 
  name = COALESCE(name, 'User'),
  fitness_level = COALESCE(fitness_level, 'beginner'),
  goals = COALESCE(goals, ARRAY['Get Fit']::text[]),
  bio = COALESCE(bio, ''),
  height = COALESCE(height, 170),
  weight = COALESCE(weight, 70); 