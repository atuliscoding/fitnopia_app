'use client';

import React, { useState, useEffect, useRef } from 'react';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  videoUrl: string;
  videoStartTime?: number;
  videoEndTime?: number;
  instructions: string[];
  tips: string[];
}

interface ExercisePlayerProps {
  exercise: Exercise;
  onComplete: () => void;
  onSkip: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  currentIndex?: number;
  totalExercises?: number;
}

const ExercisePlayer = ({ 
  exercise, 
  onComplete, 
  onSkip, 
  onPrevious, 
  onNext, 
  hasNext = false, 
  hasPrevious = false, 
  currentIndex = 1, 
  totalExercises = 1 
}: ExercisePlayerProps) => {
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [showTips, setShowTips] = useState(false);
  const videoRef = useRef<HTMLIFrameElement | HTMLVideoElement>(null);

  const REST_TIME = 60; // Rest time in seconds
  const isLastSet = currentSet === exercise.sets;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isResting) {
      setIsResting(false);
      if (isLastSet) {
        onComplete();
      } else {
        setCurrentSet((set) => set + 1);
      }
    }

    return () => clearInterval(interval);
  }, [isPaused, timeLeft, isResting, isLastSet, onComplete]);

  const handleSetComplete = () => {
    if (isLastSet) {
      onComplete();
    } else {
      setIsResting(true);
      setTimeLeft(REST_TIME);
      setIsPaused(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Function to get YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Function to create YouTube embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return null;

    let embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=1&rel=0`;
    
    // Add start time if provided
    if (exercise.videoStartTime !== undefined) {
      embedUrl += `&start=${exercise.videoStartTime}`;
    }
    
    // Add end time if provided
    if (exercise.videoEndTime !== undefined) {
      embedUrl += `&end=${exercise.videoEndTime}`;
    }

    // Add loop parameter if both start and end times are provided
    if (exercise.videoStartTime !== undefined && exercise.videoEndTime !== undefined) {
      embedUrl += '&loop=1&playlist=' + videoId;
    }

    return embedUrl;
  };

  // Check if the video URL is a YouTube video
  const isYouTubeVideo = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  // Handle video end for local videos
  const handleVideoEnd = () => {
    if (videoRef.current instanceof HTMLVideoElement) {
      videoRef.current.currentTime = exercise.videoStartTime || 0;
      videoRef.current.play();
    }
  };

  // Handle video time update for local videos
  const handleTimeUpdate = () => {
    if (
      videoRef.current instanceof HTMLVideoElement &&
      exercise.videoEndTime &&
      videoRef.current.currentTime >= exercise.videoEndTime
    ) {
      videoRef.current.currentTime = exercise.videoStartTime || 0;
    }
  };

  const embedUrl = isYouTubeVideo(exercise.videoUrl) ? getYouTubeEmbedUrl(exercise.videoUrl) : null;

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 rounded-xl overflow-hidden">
      {/* Video Section */}
      <div className="relative aspect-video">
        {embedUrl ? (
          <iframe
            ref={videoRef as React.RefObject<HTMLIFrameElement>}
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : !isYouTubeVideo(exercise.videoUrl) ? (
          <video
            ref={videoRef as React.RefObject<HTMLVideoElement>}
            src={exercise.videoUrl}
            className="w-full h-full"
            controls
            autoPlay
            loop
            onEnded={handleVideoEnd}
            onTimeUpdate={handleTimeUpdate}
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <p className="text-gray-400">Video not available</p>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-white">{exercise.name}</h2>
              <p className="text-gray-300">
                Set {currentSet} of {exercise.sets} • {exercise.reps} reps
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-300">Exercise</p>
              <p className="text-lg font-semibold text-white">{currentIndex} / {totalExercises}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section - Reorganized with better hierarchy */}
      <div className="p-6 space-y-6">
        {isResting ? (
          /* REST STATE - Simplified with clear focus */
          <div className="text-center space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">💪 Rest Time</h3>
              <div className="text-5xl font-bold text-indigo-400 mb-4">
                {formatTime(timeLeft)}
              </div>
              <p className="text-gray-400">Get ready for the next set!</p>
            </div>
            
            {/* Primary Rest Control */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 ${
                isPaused 
                  ? 'bg-green-600 hover:bg-green-500 text-white' 
                  : 'bg-yellow-600 hover:bg-yellow-500 text-white'
              }`}
            >
              {isPaused ? '▶️ Resume Timer' : '⏸️ Pause Timer'}
            </button>
          </div>
        ) : (
          /* EXERCISE STATE - Well-organized CTAs */
          <div className="space-y-6">
            {/* Exercise Information Toggle */}
            <div className="flex justify-center">
              <button
                onClick={() => setShowTips(!showTips)}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <span>{showTips ? '🔼' : '🔽'}</span>
                {showTips ? 'Hide Instructions' : 'Show Instructions & Tips'}
              </button>
            </div>

            {/* Expandable Instructions and Tips */}
            {showTips && (
              <div className="bg-gray-800 rounded-lg p-6 space-y-4 border border-gray-700">
                <div>
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    📋 Instructions:
                  </h4>
                  <ul className="list-decimal list-inside text-gray-300 space-y-2">
                    {exercise.instructions.map((instruction, index) => (
                      <li key={index} className="leading-relaxed">{instruction}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    💡 Tips:
                  </h4>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    {exercise.tips.map((tip, index) => (
                      <li key={index} className="leading-relaxed">{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* PRIMARY ACTION AREA - Most Important CTAs */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6">
              <div className="text-center mb-4">
                <h3 className="text-white text-lg font-semibold mb-2">
                  Ready to perform this exercise?
                </h3>
                <p className="text-indigo-100 text-sm">
                  Complete {exercise.reps} reps for set {currentSet} of {exercise.sets}
                </p>
              </div>
              
              {/* Main Exercise Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleSetComplete}
                  className="flex-1 max-w-xs px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <span>✅</span>
                  {isLastSet ? 'Complete Exercise' : `Complete Set ${currentSet}`}
                </button>
                
                <button
                  onClick={onSkip}
                  className="flex-1 max-w-xs px-8 py-4 bg-gray-600 hover:bg-gray-500 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <span>⏭️</span>
                  Skip This Exercise
                </button>
              </div>
            </div>
            
            {/* NAVIGATION AREA - Exercise Navigation */}
            {(onPrevious || onNext) && (
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex justify-between items-center">
                  <button
                    onClick={onPrevious}
                    disabled={!hasPrevious}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                      hasPrevious 
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white transform hover:scale-105' 
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <span>⬅️</span>
                    Previous
                  </button>
                  
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">Exercise Navigation</p>
                    <p className="text-white font-semibold">
                      {currentIndex} of {totalExercises}
                    </p>
                  </div>
                  
                  <button
                    onClick={onNext}
                    disabled={!hasNext}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                      hasNext 
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white transform hover:scale-105' 
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Next
                    <span>➡️</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExercisePlayer; 