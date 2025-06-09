'use client';

import React, { useState } from 'react';

interface WorkoutFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  workoutName: string;
  exercisesCompleted: number;
  workoutDuration: number;
}

interface FeedbackData {
  overall_rating: number;
  difficulty_rating: number;
  enjoyment_rating: number;
  energy_level_before: number;
  energy_level_after: number;
  favorite_exercise: string;
  least_favorite_exercise: string;
  improvements_suggested: string;
  additional_notes: string;
  would_repeat: boolean;
}

export default function WorkoutFeedbackModal({
  isOpen,
  onClose,
  sessionId,
  workoutName,
  exercisesCompleted,
  workoutDuration
}: WorkoutFeedbackModalProps) {
  const [feedback, setFeedback] = useState<FeedbackData>({
    overall_rating: 5,
    difficulty_rating: 3,
    enjoyment_rating: 5,
    energy_level_before: 5,
    energy_level_after: 5,
    favorite_exercise: '',
    least_favorite_exercise: '',
    improvements_suggested: '',
    additional_notes: '',
    would_repeat: true
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const response = await fetch('/api/workout-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          workout_duration_minutes: Math.round(workoutDuration / 60), // Convert seconds to minutes
          exercises_completed: exercisesCompleted,
          exercises_skipped: 0, // Could be calculated
          ...feedback
        }),
      });

      if (response.ok) {
        onClose();
        // Could show a success message
        alert('Thank you for your feedback!');
      } else {
        console.error('Failed to submit feedback');
        alert('Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ 
    value, 
    onChange, 
    max = 5 
  }: { 
    value: number; 
    onChange: (value: number) => void; 
    max?: number 
  }) => (
    <div className="flex space-x-1">
      {[...Array(max)].map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onChange(index + 1)}
          className={`w-6 h-6 ${
            index < value ? 'text-yellow-400' : 'text-gray-400'
          } hover:text-yellow-300 transition-colors`}
        >
          ★
        </button>
      ))}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Workout Feedback</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">{workoutName}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
            <div>Duration: {Math.round(workoutDuration / 60)} minutes</div>
            <div>Exercises Completed: {exercisesCompleted}</div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Overall Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Overall Rating
            </label>
            <StarRating
              value={feedback.overall_rating}
              onChange={(value) => setFeedback(prev => ({ ...prev, overall_rating: value }))}
            />
          </div>

          {/* Difficulty Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Difficulty Level (1 = Too Easy, 5 = Too Hard)
            </label>
            <StarRating
              value={feedback.difficulty_rating}
              onChange={(value) => setFeedback(prev => ({ ...prev, difficulty_rating: value }))}
            />
          </div>

          {/* Enjoyment Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              How much did you enjoy this workout?
            </label>
            <StarRating
              value={feedback.enjoyment_rating}
              onChange={(value) => setFeedback(prev => ({ ...prev, enjoyment_rating: value }))}
            />
          </div>

          {/* Energy Levels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Energy Level Before (1-10)
              </label>
              <StarRating
                value={feedback.energy_level_before}
                max={10}
                onChange={(value) => setFeedback(prev => ({ ...prev, energy_level_before: value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Energy Level After (1-10)
              </label>
              <StarRating
                value={feedback.energy_level_after}
                max={10}
                onChange={(value) => setFeedback(prev => ({ ...prev, energy_level_after: value }))}
              />
            </div>
          </div>

          {/* Favorite Exercise */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Favorite Exercise (optional)
            </label>
            <input
              type="text"
              value={feedback.favorite_exercise}
              onChange={(e) => setFeedback(prev => ({ ...prev, favorite_exercise: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Which exercise did you enjoy most?"
            />
          </div>

          {/* Least Favorite Exercise */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Least Favorite Exercise (optional)
            </label>
            <input
              type="text"
              value={feedback.least_favorite_exercise}
              onChange={(e) => setFeedback(prev => ({ ...prev, least_favorite_exercise: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Which exercise was most challenging?"
            />
          </div>

          {/* Improvements */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Suggested Improvements (optional)
            </label>
            <textarea
              value={feedback.improvements_suggested}
              onChange={(e) => setFeedback(prev => ({ ...prev, improvements_suggested: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="How could this workout be improved?"
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Additional Notes (optional)
            </label>
            <textarea
              value={feedback.additional_notes}
              onChange={(e) => setFeedback(prev => ({ ...prev, additional_notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Any other thoughts about this workout?"
            />
          </div>

          {/* Would Repeat */}
          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={feedback.would_repeat}
                onChange={(e) => setFeedback(prev => ({ ...prev, would_repeat: e.target.checked }))}
                className="rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-300">I would repeat this workout</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </div>
    </div>
  );
} 