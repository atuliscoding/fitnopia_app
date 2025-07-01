'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';

export default function Home() {
  const { data: session } = useSession();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20"></div>
      
      {/* Moving gradient orbs */}
      <div 
        className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse"
        style={{
          left: `${mousePosition.x * 0.02}px`,
          top: `${mousePosition.y * 0.02}px`,
          transform: 'translate(-50%, -50%)'
        }}
      ></div>
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl animate-bounce [animation-duration:3s]"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-indigo-500/25 to-purple-500/25 rounded-full blur-3xl animate-pulse [animation-duration:4s]"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_70%,transparent_110%)]"></div>
      
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative container mx-auto px-4 py-32">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 animate-fade-in">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full text-sm font-medium text-purple-300 mb-6">
              🚀 Powered by Advanced AI Technology
            </span>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
              Transform
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x [animation-delay:0.5s]">
              Your Fitness
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-gradient-x [animation-delay:1s]">
              Journey
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-3xl leading-relaxed animate-fade-in-up [animation-delay:1s]">
            Experience the future of fitness with our AI-powered platform. Get personalized workouts, 
            real-time form analysis, and achieve results faster than ever before.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-up [animation-delay:1.5s]">
            <Link
              href={session ? "/dashboard" : "/auth/signup"}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">{session ? "Enter Dashboard" : "Start Your Transformation"}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </Link>
            
            <Link
              href="/features"
              className="group px-8 py-4 border-2 border-purple-500/50 rounded-xl font-semibold text-lg backdrop-blur-sm hover:border-purple-400 transition-all duration-300 hover:scale-105 hover:bg-purple-500/10"
            >
              <span className="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                Explore Features
              </span>
            </Link>
          </div>
          
          <div className="mt-16 flex items-center gap-8 text-sm text-gray-400 animate-fade-in-up [animation-delay:2s]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>50K+ Active Users</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse [animation-delay:0.5s]"></div>
              <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse [animation-delay:1s]"></div>
              <span>AI-Powered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Next-Generation Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Cutting-edge technology meets proven fitness science to deliver unprecedented results
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-sm border border-purple-500/20 p-8 rounded-2xl hover:border-purple-400/40 transition-all duration-300 group-hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                AI-Powered Workouts
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Advanced machine learning algorithms create personalized workout plans that evolve with your progress, 
                ensuring optimal results every session.
              </p>
              <div className="mt-6 flex items-center text-sm text-purple-400 font-medium">
                <span>Learn More</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-sm border border-blue-500/20 p-8 rounded-2xl hover:border-blue-400/40 transition-all duration-300 group-hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                Real-Time Analytics
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Track your performance with precision. Get instant feedback, detailed metrics, 
                and insights that help you optimize every aspect of your fitness journey.
              </p>
              <div className="mt-6 flex items-center text-sm text-blue-400 font-medium">
                <span>Learn More</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-teal-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-sm border border-cyan-500/20 p-8 rounded-2xl hover:border-cyan-400/40 transition-all duration-300 group-hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">
                Global Community
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Connect with millions of fitness enthusiasts worldwide. Share achievements, 
                join challenges, and stay motivated with a supportive community.
              </p>
              <div className="mt-6 flex items-center text-sm text-cyan-400 font-medium">
                <span>Learn More</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-16">
          <Link
            href="/features"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/30 rounded-xl font-semibold hover:border-purple-400/50 transition-all duration-300 hover:scale-105"
          >
            <span className="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
              Explore All Features
            </span>
            <svg className="w-5 h-5 ml-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="relative container mx-auto px-4 py-24">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-12">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                The Future of Fitness is Here
              </h2>
              <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                Fitnopia combines cutting-edge AI technology with proven fitness principles to create
                a personalized workout experience that adapts, evolves, and grows with you. Our platform 
                doesn't just track your progress—it predicts and optimizes your path to success.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center group">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity"></div>
                    <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <div className="text-6xl font-black text-white">50K+</div>
                    </div>
                  </div>
                  <div className="text-purple-300 font-semibold text-lg">Active Users</div>
                  <div className="text-gray-400 text-sm mt-1">Growing every day</div>
                </div>
                
                <div className="text-center group">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity"></div>
                    <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <div className="text-6xl font-black text-white">500+</div>
                    </div>
                  </div>
                  <div className="text-blue-300 font-semibold text-lg">Workout Types</div>
                  <div className="text-gray-400 text-sm mt-1">AI-generated variety</div>
                </div>
                
                <div className="text-center group">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity"></div>
                    <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center">
                      <div className="text-6xl font-black text-white">98%</div>
                    </div>
                  </div>
                  <div className="text-cyan-300 font-semibold text-lg">Success Rate</div>
                  <div className="text-gray-400 text-sm mt-1">Proven results</div>
                </div>
              </div>
              
              <Link
                href="/about"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-xl font-semibold hover:border-gray-500/70 transition-all duration-300 hover:scale-105"
              >
                <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent">
                  Learn Our Story
                </span>
                <svg className="w-5 h-5 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}