import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
}

interface Session {
  id: string;
  user_id: string;
  workout_plan_id: string;
  start_time: string;
  end_time: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  workout_plan: WorkoutPlan;
}

export const ActiveSession: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActiveSession = async () => {
      try {
        const response = await fetch('/api/sessions/active');
        if (!response.ok) {
          throw new Error('Failed to fetch active session');
        }
        const data = await response.json();
        setSession(data.session);
      } catch (error) {
        console.error('Error fetching active session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveSession();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-xl animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-3 bg-gray-700 rounded w-full"></div>
          <div className="h-3 bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-300">No active session</h3>
          <p className="mt-1 text-sm text-gray-500">Start a workout to begin tracking your progress.</p>
        </div>
      </div>
    );
  }

  const formatDuration = (startTime: string) => {
    const start = new Date(startTime);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - start.getTime()) / (1000 * 60));
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
      <div className="bg-blue-600 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Active Workout</h2>
            <p className="text-sm text-blue-200">
              Started {format(new Date(session.start_time), 'h:mm a')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{formatDuration(session.start_time)}</p>
            <p className="text-sm text-blue-200">Duration</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-white mb-2">{session.workout_plan.name}</h3>
          <p className="text-sm text-gray-400">{session.workout_plan.description}</p>
        </div>

        <div className="space-y-4">
          {session.workout_plan.exercises.map((exercise, index) => (
            <div key={exercise.id} className="bg-gray-700/50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-white">{exercise.name}</h4>
                <span className="text-xs text-gray-400">
                  {exercise.sets} × {exercise.reps} @ {exercise.weight}kg
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: exercise.sets }).map((_, setIndex) => (
                  <button
                    key={setIndex}
                    className="h-2 bg-gray-600 rounded hover:bg-blue-600 transition-colors duration-200"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors duration-200">
            Pause
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200">
            Complete
          </button>
        </div>
      </div>
    </div>
  );
}; 