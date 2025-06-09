import { useState, useEffect, useRef } from 'react';
import { Session, Exercise } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { Dialog } from '@headlessui/react';
import { useStore } from '@/lib/store';

interface WorkoutPlayerProps {
  session: Session & {
    exercises: Exercise[];
  };
  onComplete: (feedback: any) => void;
  onSkip: (exerciseId: string) => void;
}

export default function WorkoutPlayer({ session, onComplete, onSkip }: WorkoutPlayerProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showSkipDialog, setShowSkipDialog] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const { data: authSession } = useSession();

  const currentExercise = session.exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === session.exercises.length - 1;

  // Auto-save progress every 15 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      saveProgress();
    }, 15000);

    return () => clearInterval(autoSaveInterval);
  }, [currentExerciseIndex]);

  // Timer logic
  useEffect(() => {
    if (!isPaused && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            clearInterval(timerRef.current);
            if (isResting) {
              setIsResting(false);
              return 45; // Exercise duration
            } else {
              if (!isLastExercise) {
                setIsResting(true);
                return 30; // Rest duration
              }
              return 0;
            }
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [isPaused, timeLeft, isResting, isLastExercise]);

  // Initialize exercise timer
  useEffect(() => {
    setTimeLeft(45); // 45 seconds per exercise
  }, [currentExerciseIndex]);

  const handleNext = () => {
    if (isLastExercise) {
      onComplete({
        completedAt: new Date(),
        feedback: {
          duration: session.exercises.length * 45,
          exercisesCompleted: currentExerciseIndex + 1,
        },
      });
    } else {
      setCurrentExerciseIndex((i) => i + 1);
    }
  };

  const handleSkip = () => {
    onSkip(currentExercise.id);
    setShowSkipDialog(false);
    handleNext();
  };

  const saveProgress = async () => {
    try {
      await fetch('/api/progress/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: session.id,
          currentExercise: currentExerciseIndex,
          timeLeft,
          isResting,
        }),
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Video Player */}
      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          src={currentExercise.videoUrl}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
          autoPlay
        />
        
        {/* Timer Overlay */}
        <div className="absolute top-4 right-4 bg-black/70 rounded-full p-4">
          <span className="text-2xl font-bold text-white">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Exercise Info */}
      <div className="mt-6 space-y-4">
        <h2 className="text-2xl font-bold">{currentExercise.name}</h2>
        <p className="text-gray-600">{currentExercise.description}</p>
        
        <div className="flex gap-2">
          {currentExercise.muscleGroups.map((muscle) => (
            <span
              key={muscle}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {muscle}
            </span>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-auto pt-6 flex justify-between">
        <button
          onClick={() => setShowSkipDialog(true)}
          className="px-6 py-2 text-gray-600 hover:text-gray-900"
        >
          Skip
        </button>

        <div className="flex gap-4">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            {isLastExercise ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>

      {/* Skip Dialog */}
      <Dialog
        open={showSkipDialog}
        onClose={() => setShowSkipDialog(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg p-6 max-w-sm">
            <Dialog.Title className="text-lg font-bold">
              Skip Exercise?
            </Dialog.Title>
            
            <Dialog.Description className="mt-2 text-gray-600">
              This will help us adjust your future workouts. Why would you like to skip this exercise?
            </Dialog.Description>

            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={() => setShowSkipDialog(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSkip}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirm Skip
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
} 