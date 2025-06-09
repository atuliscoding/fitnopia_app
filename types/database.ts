export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  user_id: string;
  bio: string;
  height: number;
  weight: number;
  fitness_goal: 'GENERAL_FITNESS' | 'WEIGHT_LOSS' | 'MUSCLE_GAIN' | 'STRENGTH' | 'ENDURANCE';
  created_at: string;
  updated_at: string;
};

export type WorkoutPlan = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  created_at: string;
  updated_at: string;
};

export type Exercise = {
  id: string;
  name: string;
  description: string | null;
  muscle_group: 'CHEST' | 'BACK' | 'LEGS' | 'SHOULDERS' | 'ARMS' | 'CORE';
  equipment: string[];
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  created_at: string;
  updated_at: string;
};

export type WorkoutExercise = {
  id: string;
  workout_plan_id: string;
  exercise_id: string;
  sets: number;
  reps: number;
  rest_time: number;
  created_at: string;
  updated_at: string;
};

export type Session = {
  id: string;
  user_id: string;
  workout_plan_id: string | null;
  start_time: string;
  end_time: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}; 