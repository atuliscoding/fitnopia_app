'use client';

import React, { useState } from 'react';

interface Exercise {
  id: string;
  name: string;
  description: string;
  sets: number;
  reps: number;
  weight: number;
  rest_time: number;
  notes?: string;
}

interface WorkoutPlan {
  id?: string;
  name: string;
  description: string;
  exercises: Exercise[];
}

interface Props {
  initialPlan?: WorkoutPlan;
  onSave: (plan: WorkoutPlan) => void;
  onCancel: () => void;
}

export default function WorkoutPlan({ initialPlan, onSave, onCancel }: Props) {
  const [plan, setPlan] = useState<WorkoutPlan>(
    initialPlan || {
      name: '',
      description: '',
      exercises: [],
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(plan);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Plan Name
        </label>
        <input
          type="text"
          id="name"
          value={plan.name}
          onChange={(e) => setPlan({ ...plan, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Description
        </label>
        <textarea
          id="description"
          value={plan.description || ''}
          onChange={(e) => setPlan({ ...plan, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Save Plan
        </button>
      </div>
    </form>
  );
}

interface WorkoutPlanListProps {
  plans: WorkoutPlan[];
  onSelect: (plan: WorkoutPlan) => void;
}

export function WorkoutPlanList({ plans, onSelect }: WorkoutPlanListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Your Workout Plans</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="rounded-lg border border-gray-200 p-4 hover:border-indigo-500 cursor-pointer"
            onClick={() => onSelect(plan)}
          >
            <h3 className="font-medium">{plan.name}</h3>
            <p className="text-sm text-gray-500">{plan.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 