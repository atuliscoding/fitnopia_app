'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { ExerciseCard } from '../../../components/ExerciseCard';

interface Exercise {
  name: string;
  description?: string;
  sets: number;
  reps: number;
  instructions: string[];
  tips: string[];
  targetMuscles: string[];
  equipment: string[];
  videoUrl?: string;
  videoStartTime?: number;
  videoEndTime?: number;
}

interface Workout {
  name: string;
  description: string;
  duration: string;
  difficulty: string;
  type: string;
  exercises: Exercise[];
}

export default function TestWorkout() {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const generateWorkout = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/test/workout');
      const data = await response.json();
      setWorkout(data);
    } catch (err) {
      setError('Failed to generate workout');
      console.error(err);
    }
    setLoading(false);
  };

  const saveWorkout = async () => {
    if (!workout) return;
    
    setSaving(true);
    setError(null);
    try {
      const response = await fetch('/api/workouts/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workout),
      });

      if (!response.ok) {
        throw new Error('Failed to save workout');
      }

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(data.error || 'Failed to save workout');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save workout');
      console.error(err);
    }
    setSaving(false);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Test Workout Generation</h1>
        <div className="space-x-4">
          <Button 
            onClick={generateWorkout} 
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Workout'}
          </Button>
          <Button 
            onClick={saveWorkout} 
            disabled={saving || !workout}
            variant={success ? 'outline' : 'default'}
          >
            {saving ? 'Saving...' : success ? 'Saved!' : 'Save Workout'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {workout && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-2">{workout.name}</h2>
            <p className="text-gray-600 mb-4">{workout.description}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-semibold">Duration:</span> {workout.duration}
              </div>
              <div>
                <span className="font-semibold">Type:</span> {workout.type}
              </div>
              <div>
                <span className="font-semibold">Difficulty:</span> {workout.difficulty}
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workout.exercises.map((exercise, index) => (
              <ExerciseCard
                key={index}
                exercise={exercise}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}