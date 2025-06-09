'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  height: number;
  weight: number;
  fitness_goal: string;
}

interface UserPreferences {
  fitness_goals: string[];
  preferred_workout_types: string[];
  available_equipment: string[];
  fitness_level: string;
  workout_duration_preference: number;
  workout_frequency_per_week: number;
  preferred_workout_times: string[];
  physical_limitations: string[];
  motivation_factors: string[];
  workout_environment: string;
  intensity_preference: string;
  focus_areas: string[];
  health_conditions: string[];
  experience_level: string;
}

const FITNESS_GOALS = [
  'Weight Loss', 'Muscle Gain', 'Endurance', 'Strength', 'Flexibility', 'General Fitness'
];

const WORKOUT_TYPES = [
  'Cardio', 'Strength Training', 'HIIT', 'Yoga', 'Pilates', 'Dance', 'Boxing', 'Swimming'
];

const EQUIPMENT_OPTIONS = [
  'Dumbbells', 'Barbell', 'Resistance Bands', 'Kettlebells', 'Pull-up Bar', 'Yoga Mat', 'None'
];

const WORKOUT_TIMES = [
  'Early Morning (5-7 AM)', 'Morning (7-9 AM)', 'Mid-Morning (9-11 AM)', 
  'Lunch (11 AM-1 PM)', 'Afternoon (1-4 PM)', 'Evening (4-7 PM)', 'Night (7-10 PM)'
];

const FOCUS_AREAS = [
  'Upper Body', 'Lower Body', 'Core', 'Arms', 'Legs', 'Back', 'Chest', 'Shoulders'
];

const MOTIVATION_FACTORS = [
  'Health Benefits', 'Weight Management', 'Stress Relief', 'Energy Boost', 'Social Activity', 'Competition'
];

export default function ProfilePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    bio: '',
    height: 0,
    weight: 0,
    fitness_goal: 'GENERAL_FITNESS'
  });
  const [preferences, setPreferences] = useState<UserPreferences>({
    fitness_goals: [],
    preferred_workout_types: [],
    available_equipment: [],
    fitness_level: 'BEGINNER',
    workout_duration_preference: 30,
    workout_frequency_per_week: 3,
    preferred_workout_times: [],
    physical_limitations: [],
    motivation_factors: [],
    workout_environment: 'HOME',
    intensity_preference: 'MODERATE',
    focus_areas: [],
    health_conditions: [],
    experience_level: 'BEGINNER'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Set basic info from session
      if (session?.user) {
        setProfile(prev => ({
          ...prev,
          name: session.user.name || '',
          email: session.user.email || ''
        }));
      }

      // Fetch preferences data
      const preferencesResponse = await fetch('/api/user-preferences');
      if (preferencesResponse.ok) {
        const preferencesResult = await preferencesResponse.json();
        if (preferencesResult.success && preferencesResult.data) {
          setPreferences(preferencesResult.data);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/user-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        alert('Preferences updated successfully!');
      } else {
        alert('Failed to update preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Error saving preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleArrayFieldChange = (field: keyof UserPreferences, value: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter(item => item !== value)
    }));
  };

  if (!session) {
    return <div className="p-6 text-white">Please log in to view your profile.</div>;
  }

  if (loading) {
    return (
      <div className="p-6 text-white">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="h-96 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === 'profile' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Personal Info
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === 'preferences' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Workout Preferences
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full px-3 py-2 bg-gray-600 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Workout Preferences</h2>
          
          <div className="space-y-8">
            {/* Fitness Goals */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Fitness Goals (Select all that apply)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {FITNESS_GOALS.map((goal) => (
                  <label key={goal} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.fitness_goals.includes(goal)}
                      onChange={(e) => handleArrayFieldChange('fitness_goals', goal, e.target.checked)}
                      className="rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-300">{goal}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Workout Types */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Preferred Workout Types</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {WORKOUT_TYPES.map((type) => (
                  <label key={type} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.preferred_workout_types.includes(type)}
                      onChange={(e) => handleArrayFieldChange('preferred_workout_types', type, e.target.checked)}
                      className="rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-300">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Available Equipment */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Available Equipment</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {EQUIPMENT_OPTIONS.map((equipment) => (
                  <label key={equipment} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.available_equipment.includes(equipment)}
                      onChange={(e) => handleArrayFieldChange('available_equipment', equipment, e.target.checked)}
                      className="rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-300">{equipment}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Workout Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Fitness Level</label>
                <select
                  value={preferences.fitness_level}
                  onChange={(e) => setPreferences(prev => ({ ...prev, fitness_level: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Workout Duration (minutes)</label>
                <input
                  type="number"
                  value={preferences.workout_duration_preference}
                  onChange={(e) => setPreferences(prev => ({ ...prev, workout_duration_preference: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Workouts per Week</label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={preferences.workout_frequency_per_week}
                  onChange={(e) => setPreferences(prev => ({ ...prev, workout_frequency_per_week: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Physical Limitations (optional)</label>
              <textarea
                value={preferences.physical_limitations.join(', ')}
                onChange={(e) => setPreferences(prev => ({ 
                  ...prev, 
                  physical_limitations: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                }))}
                rows={2}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter any physical limitations, separated by commas"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={savePreferences}
              disabled={saving}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 