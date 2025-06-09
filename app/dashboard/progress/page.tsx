'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface ProgressStats {
  overview: {
    totalWorkouts: number;
    completedWorkouts: number;
    totalExercises: number;
    averageRating: number;
    totalWorkoutTimeHours: number;
  };
  chartData: Array<{
    date: string;
    workouts: number;
    exercises: number;
    duration: number;
  }>;
  exerciseTrends: Record<string, Array<{
    date: string;
    sets: number;
    reps: number;
    weight: number;
    difficulty: number;
  }>>;
  recentFeedback: Array<{
    overall_rating: number;
    difficulty_rating: number;
    enjoyment_rating: number;
    created_at: string;
  }>;
}

export default function ProgressPage() {
  const { data: session } = useSession();
  const [progressData, setProgressData] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  useEffect(() => {
    if (session) {
      fetchProgressData();
    }
  }, [session, selectedPeriod]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/progress/stats?period=${selectedPeriod}`);
      const result = await response.json();
      
      if (result.success) {
        setProgressData(result.data);
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return <div className="p-6 text-white">Please log in to view your progress.</div>;
  }

  if (loading) {
    return (
      <div className="p-6 text-white">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="h-80 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="p-6 text-white">
        <h1 className="text-3xl font-bold mb-6">Your Progress</h1>
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400 mb-4">No workout data found</p>
          <p className="text-sm text-gray-500">Start working out to see your progress here!</p>
        </div>
      </div>
    );
  }

  const { overview, chartData, exerciseTrends, recentFeedback } = progressData;

  // Data for rating chart
  const ratingData = recentFeedback.map(feedback => ({
    date: new Date(feedback.created_at).toLocaleDateString(),
    overall: feedback.overall_rating,
    difficulty: feedback.difficulty_rating,
    enjoyment: feedback.enjoyment_rating
  }));

  // Colors for charts
  const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Progress</h1>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 3 months</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Total Workouts</h3>
          <p className="text-3xl font-bold text-indigo-500">{overview.totalWorkouts}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Completed</h3>
          <p className="text-3xl font-bold text-green-500">{overview.completedWorkouts}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Total Exercises</h3>
          <p className="text-3xl font-bold text-blue-500">{overview.totalExercises}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Avg Rating</h3>
          <p className="text-3xl font-bold text-yellow-500">{overview.averageRating}/5</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Total Hours</h3>
          <p className="text-3xl font-bold text-purple-500">{overview.totalWorkoutTimeHours}h</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Workout Activity Chart */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Workout Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="workouts" stroke="#8B5CF6" strokeWidth={2} />
              <Line type="monotone" dataKey="exercises" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Workout Duration Chart */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Workout Duration</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="duration" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rating Trends */}
      {ratingData.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Rating Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ratingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis domain={[1, 5]} stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="overall" stroke="#8B5CF6" strokeWidth={2} name="Overall" />
              <Line type="monotone" dataKey="difficulty" stroke="#EF4444" strokeWidth={2} name="Difficulty" />
              <Line type="monotone" dataKey="enjoyment" stroke="#10B981" strokeWidth={2} name="Enjoyment" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Exercise Performance Trends */}
      {Object.keys(exerciseTrends).length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Exercise Performance Trends</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(exerciseTrends).slice(0, 4).map(([exerciseName, data], index) => (
              <div key={exerciseName} className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-medium mb-3">{exerciseName}</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                    <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke={COLORS[index % COLORS.length]} 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="mt-8 bg-gradient-to-r from-indigo-900 to-purple-900 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">💡 Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-300">
              🎯 You've completed <span className="font-semibold text-white">{overview.completedWorkouts}</span> out of <span className="font-semibold text-white">{overview.totalWorkouts}</span> workouts.
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-300">
              ⭐ Your average workout rating is <span className="font-semibold text-white">{overview.averageRating}/5</span>.
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-300">
              💪 You've performed <span className="font-semibold text-white">{overview.totalExercises}</span> exercises total.
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-300">
              ⏱️ Total workout time: <span className="font-semibold text-white">{overview.totalWorkoutTimeHours}</span> hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 