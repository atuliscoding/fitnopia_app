'use client';

import { useState } from 'react';
import type { Session, WorkoutPlan } from '../types/database';

interface WorkoutSessionProps {
  workoutPlan: WorkoutPlan;
  onComplete: (notes: string) => Promise<void>;
}

export function WorkoutSession({ workoutPlan, onComplete }: WorkoutSessionProps) {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try {
      await onComplete(notes);
      setIsCompleted(true);
    } catch (error) {
      console.error('Error completing workout:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-green-600">Workout Completed!</h3>
        <p className="mt-2 text-sm text-gray-500">Great job on completing your workout.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{workoutPlan.name}</h2>
        <p className="text-sm text-gray-500">{workoutPlan.description}</p>
      </div>

      <div className="space-y-4">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Session Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={4}
          placeholder="How was your workout? Any achievements or challenges?"
        />
      </div>

      <button
        onClick={handleComplete}
        disabled={loading}
        className="w-full inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? 'Completing...' : 'Complete Workout'}
      </button>
    </div>
  );
}

interface ActiveSessionBannerProps {
  session: Session;
  onResume: () => void;
}

export function ActiveSessionBanner({ session, onResume }: ActiveSessionBannerProps) {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            You have an active workout session
          </p>
          <button
            onClick={onResume}
            className="mt-2 text-sm font-medium text-yellow-700 hover:text-yellow-600"
          >
            Resume Session →
          </button>
        </div>
      </div>
    </div>
  );
} 