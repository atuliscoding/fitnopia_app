-- Add new columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS fitness_level text DEFAULT 'beginner' NOT NULL,
ADD COLUMN IF NOT EXISTS goals text[] DEFAULT ARRAY['Get Fit'] NOT NULL; 