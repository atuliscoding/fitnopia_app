import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Session, Exercise, WorkoutPlan } from '@prisma/client';

interface WorkoutState {
  currentSession: (Session & {
    exercises: Exercise[];
  }) | null;
  currentPlan: WorkoutPlan | null;
  exerciseHistory: {
    [key: string]: {
      completions: number;
      skips: number;
      lastUsed: Date;
    };
  };
  preferences: {
    [key: string]: any;
  };
  setCurrentSession: (session: Session & { exercises: Exercise[] }) => void;
  setCurrentPlan: (plan: WorkoutPlan) => void;
  updateExerciseHistory: (exerciseId: string, completed: boolean) => void;
  updatePreferences: (key: string, value: any) => void;
  clearCurrentSession: () => void;
}

export const useStore = create<WorkoutState>()(
  persist(
    (set) => ({
      currentSession: null,
      currentPlan: null,
      exerciseHistory: {},
      preferences: {},

      setCurrentSession: (session) =>
        set({ currentSession: session }),

      setCurrentPlan: (plan) =>
        set({ currentPlan: plan }),

      updateExerciseHistory: (exerciseId, completed) =>
        set((state) => ({
          exerciseHistory: {
            ...state.exerciseHistory,
            [exerciseId]: {
              completions: state.exerciseHistory[exerciseId]?.completions || 0 + (completed ? 1 : 0),
              skips: state.exerciseHistory[exerciseId]?.skips || 0 + (completed ? 0 : 1),
              lastUsed: new Date(),
            },
          },
        })),

      updatePreferences: (key, value) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            [key]: value,
          },
        })),

      clearCurrentSession: () =>
        set({ currentSession: null }),
    }),
    {
      name: 'workout-storage',
      partialize: (state) => ({
        exerciseHistory: state.exerciseHistory,
        preferences: state.preferences,
      }),
    }
  )
); 