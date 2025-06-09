export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          height: number | null;
          weight: number | null;
          fitness_goal: 'WEIGHT_LOSS' | 'MUSCLE_GAIN' | 'GENERAL_FITNESS' | 'ENDURANCE' | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          height?: number | null;
          weight?: number | null;
          fitness_goal?: 'WEIGHT_LOSS' | 'MUSCLE_GAIN' | 'GENERAL_FITNESS' | 'ENDURANCE' | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          height?: number | null;
          weight?: number | null;
          fitness_goal?: 'WEIGHT_LOSS' | 'MUSCLE_GAIN' | 'GENERAL_FITNESS' | 'ENDURANCE' | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      workouts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          type: string | null;
          duration: string | null;
          difficulty: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          type?: string | null;
          duration?: string | null;
          difficulty?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          type?: string | null;
          duration?: string | null;
          difficulty?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      exercises: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          target_muscles: string[];
          equipment: string[];
          difficulty: string;
          instructions: string[];
          tips: string[];
          video_url: string | null;
          video_start_time: number | null;
          video_end_time: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          target_muscles?: string[];
          equipment?: string[];
          difficulty?: string;
          instructions?: string[];
          tips?: string[];
          video_url?: string | null;
          video_start_time?: number | null;
          video_end_time?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          target_muscles?: string[];
          equipment?: string[];
          difficulty?: string;
          instructions?: string[];
          tips?: string[];
          video_url?: string | null;
          video_start_time?: number | null;
          video_end_time?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      workout_exercises: {
        Row: {
          id: string;
          workout_id: string;
          exercise_id: string;
          sets: number;
          reps: number;
          instructions: string[];
          tips: string[];
          target_muscles: string[];
          equipment: string[];
          video_url: string | null;
          video_start_time: number | null;
          video_end_time: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workout_id: string;
          exercise_id: string;
          sets: number;
          reps: number;
          instructions?: string[];
          tips?: string[];
          target_muscles?: string[];
          equipment?: string[];
          video_url?: string | null;
          video_start_time?: number | null;
          video_end_time?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workout_id?: string;
          exercise_id?: string;
          sets?: number;
          reps?: number;
          instructions?: string[];
          tips?: string[];
          target_muscles?: string[];
          equipment?: string[];
          video_url?: string | null;
          video_start_time?: number | null;
          video_end_time?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      progress: {
        Row: {
          id: string;
          user_id: string;
          workout_id: string;
          exercise_id: string;
          sets_completed: number | null;
          reps_completed: number | null;
          weight: number | null;
          duration: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          workout_id: string;
          exercise_id: string;
          sets_completed?: number | null;
          reps_completed?: number | null;
          weight?: number | null;
          duration?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          workout_id?: string;
          exercise_id?: string;
          sets_completed?: number | null;
          reps_completed?: number | null;
          weight?: number | null;
          duration?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
} 