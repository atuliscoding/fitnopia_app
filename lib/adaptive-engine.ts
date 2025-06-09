import { supabase } from './supabase-client';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  fitness_level: 'beginner' | 'intermediate' | 'advanced';
  fitness_goal: string;
  height: number | null;
  weight: number | null;
  created_at: string;
  updated_at: string;
}

interface Exercise {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  equipment_needed: string[];
  muscle_groups: string[];
  created_at: string;
  updated_at: string;
}

interface WorkoutPlan {
  id?: string;
  user_id: string;
  name: string;
  description: string;
  exercises: {
    exercise_id: string;
    sets: number;
    reps: number;
    weight: number;
    rest_time: number;
    notes?: string;
  }[];
  created_at?: string;
  updated_at?: string;
}

export async function generateWorkoutPlan(userId: string): Promise<WorkoutPlan> {
  try {
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      throw new Error('Failed to fetch user profile');
    }

    // Get suitable exercises based on user's fitness level and goal
    const { data: exercises, error: exercisesError } = await supabase
      .from('exercises')
      .select('*')
      .eq('difficulty', profile.fitness_level)
      .eq('category', profile.fitness_goal)
      .limit(5);

    if (exercisesError || !exercises) {
      throw new Error('Failed to fetch exercises');
    }

    // Create workout plan
    const workoutPlan: WorkoutPlan = {
      user_id: userId,
      name: `${profile.fitness_goal} Workout`,
      description: `A ${profile.fitness_level} level workout focusing on ${profile.fitness_goal}`,
      exercises: exercises.map(exercise => ({
        exercise_id: exercise.id,
        sets: 3,
        reps: 12,
        weight: 0,
        rest_time: 60,
        notes: '',
      })),
    };

    return workoutPlan;
  } catch (error) {
    console.error('Error generating workout plan:', error);
    throw error;
  }
} 