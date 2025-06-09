-- Add order_index column to workout_exercises table if it doesn't exist
ALTER TABLE public.workout_exercises 
ADD COLUMN IF NOT EXISTS order_index integer DEFAULT 0;

-- Create index for order_index for better query performance
CREATE INDEX IF NOT EXISTS idx_workout_exercises_order_index 
ON public.workout_exercises(workout_id, order_index);

-- Update existing records to have proper order_index values
UPDATE public.workout_exercises 
SET order_index = ROW_NUMBER() OVER (PARTITION BY workout_id ORDER BY created_at)
WHERE order_index = 0 OR order_index IS NULL; 