'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';

export default function Home() {
  const { data: session } = useSession();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-5xl font-bold mb-6">
            Transform Your Fitness Journey with Fitnopia
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl">
            Your personal AI-powered fitness companion. Create customized workout plans,
            track your progress, and achieve your fitness goals.
          </p>
          <Link
            href={session ? "/dashboard" : "/auth/signup"}
            className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-indigo-500 transition-colors"
          >
            {session ? "Go to Dashboard" : "Get Started"}
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">AI-Powered Workouts</h3>
            <p className="text-gray-300">
              Get personalized workout plans tailored to your fitness level, goals, and preferences.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Progress Tracking</h3>
            <p className="text-gray-300">
              Track your workouts, monitor your progress, and stay motivated with detailed analytics.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Community Support</h3>
            <p className="text-gray-300">
              Join a community of fitness enthusiasts, share your achievements, and stay motivated together.
            </p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">About Fitnopia</h2>
          <p className="text-gray-300 mb-8">
            Fitnopia combines cutting-edge AI technology with proven fitness principles to create
            a personalized workout experience. Our platform adapts to your progress, preferences,
            and schedule to help you achieve your fitness goals effectively.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-indigo-500 mb-2">1000+</div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-500 mb-2">50+</div>
              <div className="text-gray-400">Workout Types</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-500 mb-2">95%</div>
              <div className="text-gray-400">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}