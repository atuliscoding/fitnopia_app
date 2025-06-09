-- Update exercises table with new fields
ALTER TABLE public.exercises
  ADD COLUMN IF NOT EXISTS instructions text[] DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS tips text[] DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS video_start_time integer,
  ADD COLUMN IF NOT EXISTS video_end_time integer,
  ALTER COLUMN muscle_group TYPE text[] USING ARRAY[muscle_group],
  ALTER COLUMN muscle_group SET DEFAULT ARRAY[]::text[],
  ALTER COLUMN muscle_group RENAME TO target_muscles;

-- Update workout_plans table
ALTER TABLE public.workouts
  ADD COLUMN IF NOT EXISTS type text CHECK (type in ('Strength Training', 'Cardio', 'HIIT', 'Yoga', 'Flexibility', 'Custom')),
  ALTER COLUMN duration TYPE interval USING (duration || ' minutes')::interval,
  ALTER COLUMN difficulty TYPE text;

-- Update workout_exercises table
ALTER TABLE public.workout_exercises
  ADD COLUMN IF NOT EXISTS instructions text[] DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS tips text[] DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS target_muscles text[] DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS equipment text[] DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS video_url text,
  ADD COLUMN IF NOT EXISTS video_start_time integer,
  ADD COLUMN IF NOT EXISTS video_end_time integer;

-- Create an enum for workout types if not exists
DO $$ BEGIN
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

-- Create an enum for difficulty levels if not exists
DO $$ BEGIN
  CREATE TYPE difficulty_level AS ENUM (
    'Beginner',
    'Intermediate',
    'Advanced'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Update columns to use enums
ALTER TABLE public.workouts
  ALTER COLUMN type TYPE workout_type USING type::workout_type,
  ALTER COLUMN difficulty TYPE difficulty_level USING difficulty::difficulty_level;

ALTER TABLE public.exercises
  ALTER COLUMN difficulty TYPE difficulty_level USING difficulty::difficulty_level;

-- Add constraints
ALTER TABLE public.workout_exercises
  ADD CONSTRAINT valid_sets CHECK (sets > 0),
  ADD CONSTRAINT valid_reps CHECK (reps > 0),
  ADD CONSTRAINT valid_video_times CHECK (
    (video_start_time IS NULL AND video_end_time IS NULL) OR
    (video_start_time < video_end_time)
  );

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_exercises_target_muscles ON public.exercises USING gin(target_muscles);
CREATE INDEX IF NOT EXISTS idx_exercises_equipment ON public.exercises USING gin(equipment);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_target_muscles ON public.workout_exercises USING gin(target_muscles);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_equipment ON public.workout_exercises USING gin(equipment); 