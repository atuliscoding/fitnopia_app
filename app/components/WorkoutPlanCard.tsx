import React from 'react';
import Image from 'next/image';
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
  created_at: string;
  updated_at: string;
}

interface WorkoutPlanCardProps {
  plan: WorkoutPlan;
}

export const WorkoutPlanCard: React.FC<WorkoutPlanCardProps> = ({ plan }) => {
  const cardImages = [
    '/images/workout-card-1.jpg',
    '/images/workout-card-2.jpg',
    '/images/workout-card-3.jpg'
  ];

  const randomImage = cardImages[Math.floor(Math.random() * cardImages.length)];

  return (
    <div className="bg-gray-700 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-200">
      <div className="relative h-48">
        <Image
          src={randomImage}
          alt={plan.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>
        <div className="absolute bottom-4 left-4">
          <h3 className="text-xl font-bold text-white">{plan.name}</h3>
          <p className="text-sm text-gray-300">
            Created {format(new Date(plan.created_at), 'MMM d, yyyy')}
          </p>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-gray-300 text-sm mb-4">{plan.description}</p>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-200">Exercises:</h4>
          <div className="space-y-1">
            {plan.exercises.slice(0, 3).map((exercise) => (
              <div key={exercise.id} className="flex justify-between items-center text-sm">
                <span className="text-gray-300">{exercise.name}</span>
                <span className="text-gray-400">
                  {exercise.sets}×{exercise.reps} @ {exercise.weight}kg
                </span>
              </div>
            ))}
            {plan.exercises.length > 3 && (
              <p className="text-sm text-gray-400 italic">
                +{plan.exercises.length - 3} more exercises
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors duration-200">
            Start Workout
          </button>
          <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-500 transition-colors duration-200">
            Edit Plan
          </button>
        </div>
      </div>
    </div>
  );
}; 