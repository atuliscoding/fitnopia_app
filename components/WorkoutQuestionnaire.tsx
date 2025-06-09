'use client';

import React, { useState } from 'react';

export interface WorkoutPreferences {
  fitnessLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  fitnessGoals: string[];
  workoutDuration: '30' | '45' | '60';
  preferredTime: 'Morning' | 'Afternoon' | 'Evening';
  restDays: string[];
  focusAreas: string[];
  healthConditions: string[];
}

interface WorkoutQuestionnaireProps {
  onSubmit: (preferences: WorkoutPreferences) => void;
}

type ArrayFields = Extract<keyof WorkoutPreferences, 'fitnessGoals' | 'restDays' | 'focusAreas' | 'healthConditions'>;

export default function WorkoutQuestionnaire({ onSubmit }: WorkoutQuestionnaireProps) {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState<WorkoutPreferences>({
    fitnessLevel: 'Beginner',
    fitnessGoals: [],
    workoutDuration: '45',
    preferredTime: 'Morning',
    restDays: [],
    focusAreas: [],
    healthConditions: [],
  });

  const fitnessGoals = [
    'strength', 'cardio', 'flexibility', 'weight loss',
    'muscle gain', 'endurance', 'toning', 'athletic performance',
    'stress reduction'
  ];

  const focusAreas = [
    'chest', 'back', 'shoulders', 'arms', 'abs', 'core',
    'glutes', 'legs', 'calves', 'full body', 'upper body', 'lower body'
  ];

  const healthConditions = [
    'none', 'back pain', 'knee issues', 'shoulder pain',
    'high blood-pressure', 'heart condition', 'asthma',
    'diabetes', 'pregnancy', 'arthritis', 'osteoporosis',
    'limited mobility', 'recent injury', 'chronic fatigue'
  ];

  const weekDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  const handleMultiSelect = (field: ArrayFields, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 text-white">Current Fitness Level</h2>
            <div className="grid grid-cols-1 gap-4">
              {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                <button
                  key={level}
                  onClick={() => {
                    setPreferences(prev => ({ ...prev, fitnessLevel: level as any }));
                    setStep(2);
                  }}
                  className={`p-4 rounded-lg border transition-colors duration-200 ${
                    preferences.fitnessLevel === level
                      ? 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-700'
                      : 'bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700 hover:border-gray-600'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 text-white">Fitness Goals</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {fitnessGoals.map((goal) => (
                <button
                  key={goal}
                  onClick={() => handleMultiSelect('fitnessGoals', goal)}
                  className={`p-4 rounded-lg border transition-colors duration-200 ${
                    preferences.fitnessGoals.includes(goal)
                      ? 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-700'
                      : 'bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700 hover:border-gray-600'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 text-white">Workout Preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-gray-100">Preferred workout duration</label>
                <select
                  value={preferences.workoutDuration}
                  onChange={(e) => setPreferences(prev => ({ ...prev, workoutDuration: e.target.value as any }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-emerald-500 focus:ring-emerald-500"
                >
                  <option value="30">30 minutes (Short)</option>
                  <option value="45">45 minutes (Medium)</option>
                  <option value="60">60 minutes (Long)</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-gray-100">Preferred time of day</label>
                <select
                  value={preferences.preferredTime}
                  onChange={(e) => setPreferences(prev => ({ ...prev, preferredTime: e.target.value as any }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-emerald-500 focus:ring-emerald-500"
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-gray-100">Rest days</label>
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day) => (
                    <button
                      key={day}
                      onClick={() => handleMultiSelect('restDays', day)}
                      className={`p-2 rounded-lg border transition-colors duration-200 ${
                        preferences.restDays.includes(day)
                          ? 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-700'
                          : 'bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 text-white">Focus Areas</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {focusAreas.map((area) => (
                <button
                  key={area}
                  onClick={() => handleMultiSelect('focusAreas', area)}
                  className={`p-4 rounded-lg border transition-colors duration-200 ${
                    preferences.focusAreas.includes(area)
                      ? 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-700'
                      : 'bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700 hover:border-gray-600'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 text-white">Health Considerations</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {healthConditions.map((condition) => (
                <button
                  key={condition}
                  onClick={() => handleMultiSelect('healthConditions', condition)}
                  className={`p-4 rounded-lg border transition-colors duration-200 ${
                    preferences.healthConditions.includes(condition)
                      ? 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-700'
                      : 'bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700 hover:border-gray-600'
                  }`}
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-xl">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-white">Workout Questionnaire</h1>
          <span className="text-gray-200">Step {step} of 5</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div
            className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {renderStep()}

      <div className="flex justify-between mt-8">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="px-6 py-2 bg-gray-800 text-gray-100 rounded-lg border border-gray-700 hover:bg-gray-700 hover:border-gray-600 transition-colors duration-200"
          >
            Back
          </button>
        )}
        {step < 5 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 ml-auto"
          >
            Next
          </button>
        ) : (
          <button
            onClick={() => onSubmit(preferences)}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 ml-auto"
          >
            Create Workout Plan
          </button>
        )}
      </div>
    </div>
  );
} 