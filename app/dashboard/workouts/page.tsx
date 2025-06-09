'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import WorkoutQuestionnaire, { WorkoutPreferences as QuestionnairePreferences } from '../../../components/WorkoutQuestionnaire';
import ExercisePlayer, { Exercise } from '../../../components/ExercisePlayer';
import { GeneratedWorkout, WorkoutPreferences } from '../../../lib/gemini';

interface Workout {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: string;
  exercises: Exercise[];
}

export default function WorkoutsPage() {
  const { data: session, status } = useSession();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);
  const [isWorkoutsFetched, setIsWorkoutsFetched] = useState(false);

  // Fetch saved workouts from database
  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!session?.user || isWorkoutsFetched) return;

      try {
        setIsLoading(true);
        const response = await fetch('/api/workouts');
        if (response.ok) {
          const data = await response.json();
          if (data.workouts) {
            setWorkouts(data.workouts);
          }
        } else {
          console.error('Failed to fetch workouts:', response.status);
        }
      } catch (error) {
        console.error('Error fetching workouts:', error);
        setError('Failed to load workouts');
      } finally {
        setIsWorkoutsFetched(true);
        setIsLoading(false);
      }
    };

    fetchWorkouts();
  }, [session, isWorkoutsFetched]);

  const filteredWorkouts = workouts.filter(workout => {
    const typeMatch = selectedType === 'all' || workout.type === selectedType;
    const difficultyMatch = selectedDifficulty === 'all' || workout.difficulty === selectedDifficulty;
    return typeMatch && difficultyMatch;
  });

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">You must be logged in to access workouts.</p>
          <a href="/auth/signin" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  const handleQuestionnaireSubmit = async (questionnairePreferences: QuestionnairePreferences) => {
    setIsLoading(true);
    setError(null);

    // Check if user is authenticated
    if (!session?.user) {
      setError('You must be logged in to generate workouts');
      setIsLoading(false);
      return;
    }

    try {
      // Map questionnaire preferences to API preferences
      const apiPreferences: WorkoutPreferences = {
        duration: questionnairePreferences.workoutDuration + ' minutes',
        difficulty: questionnairePreferences.fitnessLevel,
        type: 'Strength Training', // Default type, could be made configurable
        targetMuscles: questionnairePreferences.focusAreas,
        equipment: ['Dumbbells'], // Default equipment, could be made configurable
      };

      const response = await fetch('/api/workouts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences: apiPreferences }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate workout plan');
      }

      const responseData = await response.json();
      console.log('API Response:', responseData);
      
      const generatedWorkout: GeneratedWorkout = responseData.workout || responseData;
      console.log('Extracted workout:', generatedWorkout);

      // Validate that we have a proper workout with exercises
      if (!generatedWorkout || !generatedWorkout.exercises || !Array.isArray(generatedWorkout.exercises)) {
        console.error('Invalid workout data:', generatedWorkout);
        throw new Error('Invalid workout data received from server');
      }

      // Refetch workouts to include the newly generated one
      setIsWorkoutsFetched(false);
      setShowQuestionnaire(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExerciseComplete = () => {
    // Mark current exercise as completed
    setCompletedExercises(prev => new Set(Array.from(prev).concat([currentExerciseIndex])));
    
    if (selectedWorkout && currentExerciseIndex < selectedWorkout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      // Workout completed
      handleWorkoutComplete();
    }
  };

  const handleExerciseSkip = () => {
    if (selectedWorkout && currentExerciseIndex < selectedWorkout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      // Workout completed
      handleWorkoutComplete();
    }
  };

  const handleWorkoutComplete = () => {
    setSelectedWorkout(null);
    setCurrentExerciseIndex(0);
    setCompletedExercises(new Set());
    setWorkoutStartTime(null);
  };

  const handleWorkoutStart = async (workout: Workout) => {
    try {
      setIsLoading(true);
      
      // If the workout already has exercises, use it directly
      if (workout.exercises && workout.exercises.length > 0) {
        setSelectedWorkout(workout);
        setWorkoutStartTime(new Date());
        setCompletedExercises(new Set());
        setCurrentExerciseIndex(0);
        return;
      }

      // Fetch full workout details with exercises
      const response = await fetch(`/api/workouts/${workout.id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.workout) {
          setSelectedWorkout(data.workout);
          setWorkoutStartTime(new Date());
          setCompletedExercises(new Set());
          setCurrentExerciseIndex(0);
        } else {
          setError('Failed to load workout details');
        }
      } else {
        setError('Failed to load workout details');
      }
    } catch (error) {
      console.error('Error starting workout:', error);
      setError('Failed to load workout details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExerciseSelect = (index: number) => {
    setCurrentExerciseIndex(index);
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  const handleNextExercise = () => {
    if (selectedWorkout && currentExerciseIndex < selectedWorkout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  if (showQuestionnaire) {
    return (
      <div className="min-h-screen bg-gray-900 py-6 px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-white">Generating your personalized workout plan...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => setError(null)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
            >
              Try Again
            </button>
          </div>
        ) : (
          <WorkoutQuestionnaire onSubmit={handleQuestionnaireSubmit} />
        )}
      </div>
    );
  }

  if (selectedWorkout) {
    return (
      <div className="min-h-screen bg-gray-900 py-6 px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header with Better CTA Organization */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleWorkoutComplete}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <span>⬅️</span> Back to Workouts
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">{selectedWorkout.name}</h1>
              <p className="text-gray-400 text-sm">{selectedWorkout.description}</p>
            </div>
          </div>
          
          {/* Quick Action CTAs */}
          <div className="flex gap-3">
            <button 
              onClick={() => setShowQuestionnaire(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors text-sm flex items-center gap-2"
            >
              <span>✨</span> Generate New
            </button>
            <button 
              onClick={handleWorkoutComplete}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors text-sm flex items-center gap-2"
            >
              <span>🏁</span> End Workout
            </button>
          </div>
        </div>

        {/* Main Exercise Player */}
        <ExercisePlayer
          exercise={selectedWorkout.exercises[currentExerciseIndex]}
          onComplete={handleExerciseComplete}
          onSkip={handleExerciseSkip}
          onPrevious={handlePreviousExercise}
          onNext={handleNextExercise}
          hasNext={currentExerciseIndex < selectedWorkout.exercises.length - 1}
          hasPrevious={currentExerciseIndex > 0}
          currentIndex={currentExerciseIndex + 1}
          totalExercises={selectedWorkout.exercises.length}
        />
        
        {/* Enhanced Progress Overview Section */}
        <div className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 shadow-lg">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">💪 Workout Progress</h3>
              <p className="text-indigo-100">Stay motivated and track your progress</p>
            </div>
            
            {workoutStartTime && (
              <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                <p className="text-indigo-100 text-sm font-medium">⏱️ Time Elapsed</p>
                <p className="text-white font-bold text-2xl">
                  {Math.floor((new Date().getTime() - workoutStartTime.getTime()) / 1000 / 60)} min
                </p>
              </div>
            )}
          </div>
          
          {/* Progress Bar and Stats */}
          <div className="mb-6">
            <div className="flex justify-between text-white text-lg font-semibold mb-3">
              <span>Exercises Completed</span>
              <span>{completedExercises.size} / {selectedWorkout.exercises.length}</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-4 mb-4">
              <div 
                className="bg-white h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${Math.max(10, (completedExercises.size / selectedWorkout.exercises.length) * 100)}%` }}
              >
                <span className="text-indigo-600 text-xs font-bold">
                  {Math.round((completedExercises.size / selectedWorkout.exercises.length) * 100)}%
                </span>
              </div>
            </div>
            
            {/* Motivational Messages */}
            <div className="text-center">
              {completedExercises.size === 0 && (
                <p className="text-white text-lg opacity-90">💪 Let's get started! You've got this!</p>
              )}
              {completedExercises.size > 0 && completedExercises.size < selectedWorkout.exercises.length && (
                <p className="text-white text-lg opacity-90">🔥 Great progress! Keep pushing forward!</p>
              )}
              {completedExercises.size === selectedWorkout.exercises.length && (
                <div className="space-y-2">
                  <p className="text-white text-xl font-bold">🎉 Amazing job! Workout completed!</p>
                  <button
                    onClick={() => setShowQuestionnaire(true)}
                    className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Start Another Workout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Exercise Selection Panel */}
        <div className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">📋 Exercise Overview</h3>
              <p className="text-gray-400 text-sm">Click on any exercise to jump to it</p>
            </div>
            
            {/* Quick Exercise Navigation */}
            <div className="flex gap-2">
              <button
                onClick={handlePreviousExercise}
                disabled={currentExerciseIndex === 0}
                className={`p-2 rounded-lg transition-colors ${
                  currentExerciseIndex === 0
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                ⬅️
              </button>
              <button
                onClick={handleNextExercise}
                disabled={currentExerciseIndex >= selectedWorkout.exercises.length - 1}
                className={`p-2 rounded-lg transition-colors ${
                  currentExerciseIndex >= selectedWorkout.exercises.length - 1
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                ➡️
              </button>
            </div>
          </div>
          
          <div className="grid gap-3">
            {selectedWorkout.exercises && selectedWorkout.exercises.map((exercise, index) => (
              <button
                key={exercise.id}
                onClick={() => handleExerciseSelect(index)}
                className={`w-full flex items-center p-4 rounded-xl transition-all hover:transform hover:scale-[1.02] ${
                  index === currentExerciseIndex
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : completedExercises.has(index)
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 ${
                    index === currentExerciseIndex
                      ? 'bg-white bg-opacity-20'
                      : completedExercises.has(index)
                      ? 'bg-white bg-opacity-20'
                      : 'bg-gray-600'
                  }`}>
                    {completedExercises.has(index) ? '✓' : index + 1}
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold text-lg">{exercise.name}</div>
                    <div className="text-sm opacity-75">
                      {exercise.sets} sets × {exercise.reps} reps
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {index === currentExerciseIndex && (
                    <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full font-medium">
                      Current
                    </span>
                  )}
                  {completedExercises.has(index) && (
                    <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full font-medium">
                      Completed
                    </span>
                  )}
                  {!completedExercises.has(index) && index !== currentExerciseIndex && (
                    <span className="text-sm opacity-50 px-3 py-1">
                      Pending
                    </span>
                  )}
                  <div className="text-2xl">
                    {index === currentExerciseIndex ? '👈' : completedExercises.has(index) ? '✅' : '⏳'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header with Better CTA Hierarchy */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">💪 Your Workouts</h1>
            <p className="text-gray-400">Choose a workout or create a personalized plan</p>
          </div>
          
          {/* Primary CTA - Most Important Action */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <button
              onClick={() => setShowQuestionnaire(true)}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all transform hover:scale-105 shadow-lg font-semibold text-lg flex items-center justify-center gap-3"
            >
              <span className="text-2xl">✨</span>
              <div className="text-left">
                <div>Create Custom Workout</div>
                <div className="text-sm text-indigo-100">AI-powered & personalized</div>
              </div>
            </button>
            
            {/* Secondary Filter Controls */}
            <div className="flex gap-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 hover:border-gray-600 transition-colors focus:border-indigo-500 focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="Strength">💪 Strength</option>
                <option value="Cardio">🏃 Cardio</option>
                <option value="Flexibility">🧘 Flexibility</option>
                <option value="HIIT">⚡ HIIT</option>
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 hover:border-gray-600 transition-colors focus:border-indigo-500 focus:outline-none"
              >
                <option value="all">All Levels</option>
                <option value="Beginner">🌱 Beginner</option>
                <option value="Intermediate">🌿 Intermediate</option>
                <option value="Advanced">🌳 Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Enhanced Workout Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && !isWorkoutsFetched ? (
            /* Loading State */
            <div className="col-span-full text-center py-16">
              <div className="bg-gray-800 rounded-xl p-8 max-w-md mx-auto border border-gray-700">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4 mx-auto"></div>
                <h3 className="text-xl font-semibold text-white mb-2">Loading your workouts...</h3>
                <p className="text-gray-400">This won't take long!</p>
              </div>
            </div>
          ) : filteredWorkouts && filteredWorkouts.length > 0 ? filteredWorkouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-all hover:transform hover:scale-105 border border-gray-700 hover:border-gray-600 shadow-lg hover:shadow-xl"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-white leading-tight">{workout.name}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${
                  workout.difficulty === 'Beginner' ? 'bg-green-600 text-green-100' :
                  workout.difficulty === 'Intermediate' ? 'bg-yellow-600 text-yellow-100' :
                  'bg-red-600 text-red-100'
                }`}>
                  <span>
                    {workout.difficulty === 'Beginner' ? '🌱' : 
                     workout.difficulty === 'Intermediate' ? '🌿' : '🌳'}
                  </span>
                  {workout.difficulty}
                </span>
              </div>
              
              {/* Card Content */}
              <p className="text-gray-400 mb-4 line-clamp-2">{workout.description}</p>
              
              <div className="flex justify-between items-center text-sm text-gray-400 mb-6">
                <div className="flex items-center gap-1">
                  <span>⏱️</span>
                  <span>{workout.duration}</span>
                </div>
                <span className="px-3 py-1 bg-gray-700 rounded-full flex items-center gap-1">
                  <span>
                    {workout.type === 'Strength' ? '💪' : 
                     workout.type === 'Cardio' ? '🏃' : 
                     workout.type === 'Flexibility' ? '🧘' : 
                     workout.type === 'HIIT' ? '⚡' : '🏋️'}
                  </span>
                  {workout.type}
                </span>
              </div>
              
              {/* Primary CTA for Each Workout */}
              <button
                onClick={() => handleWorkoutStart(workout)}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all font-semibold text-lg flex items-center justify-center gap-2 transform hover:scale-105 shadow-lg"
              >
                <span>🚀</span>
                Start Workout
              </button>
            </div>
          )) : (
            /* Enhanced Empty State */
            <div className="col-span-full text-center py-16">
              <div className="bg-gray-800 rounded-xl p-8 max-w-md mx-auto border border-gray-700">
                <div className="text-6xl mb-4">💪</div>
                <h3 className="text-xl font-semibold text-white mb-2">No workouts found</h3>
                <p className="text-gray-400 mb-6">
                  {filteredWorkouts.length === 0 && workouts.length > 0 
                    ? "Try adjusting your filters to see more workouts."
                    : "Get started by creating your first personalized workout plan."}
                </p>
                <button
                  onClick={() => setShowQuestionnaire(true)}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all flex items-center gap-2 mx-auto"
                >
                  <span>✨</span>
                  Create Your First Workout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 