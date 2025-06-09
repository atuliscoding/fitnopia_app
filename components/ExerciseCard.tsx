import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

interface ExerciseCardProps {
  exercise: Exercise;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{exercise.name}</CardTitle>
        {exercise.description && (
          <CardDescription>{exercise.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-semibold">Sets:</span> {exercise.sets}
            </div>
            <div>
              <span className="font-semibold">Reps:</span> {exercise.reps}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Target Muscles:</h4>
            <div className="flex flex-wrap gap-2">
              {exercise.targetMuscles.map((muscle, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Equipment:</h4>
            <div className="flex flex-wrap gap-2">
              {exercise.equipment.map((item, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-secondary/10 text-secondary rounded-md text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Instructions:</h4>
            <ol className="list-decimal list-inside space-y-1">
              {exercise.instructions.map((instruction, i) => (
                <li key={i} className="text-sm">{instruction}</li>
              ))}
            </ol>
          </div>

          {exercise.tips.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Tips:</h4>
              <ul className="list-disc list-inside space-y-1">
                {exercise.tips.map((tip, i) => (
                  <li key={i} className="text-sm">{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {exercise.videoUrl && (
            <div>
              <h4 className="font-semibold mb-2">Video:</h4>
              <a
                href={exercise.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Watch demonstration
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 