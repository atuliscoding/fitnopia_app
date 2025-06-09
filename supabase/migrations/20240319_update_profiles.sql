-- First, let's drop columns that we don't need anymore
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

-- Now add or modify the columns we need
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS name text,
  ADD COLUMN IF NOT EXISTS bio text DEFAULT '',
  ADD COLUMN IF NOT EXISTS fitness_level text DEFAULT 'beginner',
  ADD COLUMN IF NOT EXISTS goals text[] DEFAULT ARRAY['Get Fit']::text[],
  ALTER COLUMN height SET DEFAULT 170,
  ALTER COLUMN weight SET DEFAULT 70;

-- Update existing rows to have default values
UPDATE public.profiles 
SET 
  name = COALESCE(name, 'User'),
  bio = COALESCE(bio, ''),
  fitness_level = COALESCE(fitness_level, 'beginner'),
  goals = COALESCE(goals, ARRAY['Get Fit']::text[]),
  height = COALESCE(height, 170),
  weight = COALESCE(weight, 70); 