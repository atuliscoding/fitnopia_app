import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

interface Profile {
  id: string;
  user_id: string;
  name: string;
  bio: string;
  height: number;
  weight: number;
  fitness_level: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  created_at: string;
  updated_at: string;
}

type FormData = {
  name: string;
  bio: string;
  height: number;
  weight: number;
  fitness_level: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
};

export const ProfileSummary: React.FC = () => {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    bio: '',
    height: 170,
    weight: 70,
    fitness_level: 'beginner',
    goals: ['Get Fit']
  });

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      setProfile(data.profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create profile');
      }

      const data = await response.json();
      setProfile(data.profile);
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-xl animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-3 bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
          <div className="h-3 bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    if (isCreating) {
      return (
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4">Create Your Profile</h3>
          <form onSubmit={handleCreateProfile} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-300">
                Bio
              </label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-300">
                  Height (cm)
                </label>
                <input
                  type="number"
                  id="height"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-300">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="fitness_level" className="block text-sm font-medium text-gray-300">
                  Fitness Level
                </label>
                <select
                  id="fitness_level"
                  value={formData.fitness_level}
                  onChange={(e) => setFormData({ ...formData, fitness_level: e.target.value as 'beginner' | 'intermediate' | 'advanced' })}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Goals
              </label>
              <div className="space-y-2">
                {['Get Fit', 'Build Muscle', 'Lose Weight', 'Improve Strength', 'Increase Flexibility'].map((goal) => (
                  <label key={goal} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.goals.includes(goal)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, goals: [...formData.goals, goal] });
                        } else {
                          setFormData({ ...formData, goals: formData.goals.filter(g => g !== goal) });
                        }
                      }}
                      className="rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-300">{goal}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
              >
                Create Profile
              </button>
            </div>
          </form>
        </div>
      );
    }

    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-300">No profile found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your profile.</p>
          <div className="mt-6">
            <button
              onClick={() => setIsCreating(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  const calculateBMI = () => {
    const heightInMeters = profile.height / 100;
    return (profile.weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
      <div className="relative h-32">
        <Image
          src="/images/profile-background.jpg"
          alt="Profile background"
          fill
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900"></div>
        <div className="absolute bottom-4 left-4">
          <h2 className="text-xl font-bold text-white">{profile.name}</h2>
          <p className="text-sm text-gray-300">{profile.fitness_level} level</p>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-700/50 p-3 rounded-lg">
            <p className="text-sm text-gray-400">Bio</p>
            <p className="text-sm text-white">{profile.bio || 'No bio yet'}</p>
          </div>
          <div className="bg-gray-700/50 p-3 rounded-lg">
            <p className="text-sm text-gray-400">BMI</p>
            <p className="text-lg font-semibold text-white">{calculateBMI()}</p>
          </div>
          <div className="bg-gray-700/50 p-3 rounded-lg">
            <p className="text-sm text-gray-400">Weight</p>
            <p className="text-lg font-semibold text-white">{profile.weight} kg</p>
          </div>
          <div className="bg-gray-700/50 p-3 rounded-lg">
            <p className="text-sm text-gray-400">Height</p>
            <p className="text-lg font-semibold text-white">{profile.height} cm</p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-300">Goals</h3>
          <div className="flex flex-wrap gap-2">
            {profile.goals.map((goal, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium text-blue-300 bg-blue-900/30 rounded-full"
              >
                {goal}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button 
            onClick={() => {
              setFormData({
                name: profile.name,
                bio: profile.bio,
                height: profile.height,
                weight: profile.weight,
                fitness_level: profile.fitness_level,
                goals: profile.goals
              });
              setIsCreating(true);
            }}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}; 