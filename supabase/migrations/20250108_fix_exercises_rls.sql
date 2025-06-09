-- Add missing RLS policies for exercises table to allow workout generation

-- Allow authenticated users to insert exercises (needed for workout generation)
CREATE POLICY "Authenticated users can insert exercises" ON public.exercises
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update exercises (needed for upsert operations)
CREATE POLICY "Authenticated users can update exercises" ON public.exercises
  FOR UPDATE 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Add missing policies for the workouts table (since it was renamed from workout_plans)
-- Enable RLS on workouts table if not already enabled
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own workouts
CREATE POLICY "Users can view their own workouts" ON public.workouts
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow users to insert their own workouts
CREATE POLICY "Users can insert their own workouts" ON public.workouts
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own workouts
CREATE POLICY "Users can update their own workouts" ON public.workouts
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own workouts
CREATE POLICY "Users can delete their own workouts" ON public.workouts
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Update workout_exercises policies to work with the new workouts table
CREATE POLICY "Users can view workout exercises for their workouts" ON public.workout_exercises
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.workouts w
      WHERE w.id = workout_exercises.workout_id
      AND w.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert workout exercises for their workouts" ON public.workout_exercises
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workouts w
      WHERE w.id = workout_exercises.workout_id
      AND w.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update workout exercises for their workouts" ON public.workout_exercises
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.workouts w
      WHERE w.id = workout_exercises.workout_id
      AND w.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workouts w
      WHERE w.id = workout_exercises.workout_id
      AND w.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete workout exercises for their workouts" ON public.workout_exercises
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.workouts w
      WHERE w.id = workout_exercises.workout_id
      AND w.user_id = auth.uid()
    )
  ); 