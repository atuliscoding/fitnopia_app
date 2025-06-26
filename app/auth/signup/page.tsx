'use client';

import * as React from 'react';
import Link from 'next/link';
import { SignUpForm } from '../../../components/auth/SignUpForm';
import { OAuthButtons } from '../../../components/auth/OAuthButtons';
import Navbar from '../../../components/Navbar';

export default function SignUp() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 pt-20">
        <div className="max-w-md w-full space-y-8">
        <div>
          <Link href="/" className="flex justify-center items-center space-x-3 group">
            {/* Logo Icon */}
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-110">
                <svg 
                  className="w-6 h-6 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {/* Modern fitness dumbbell icon */}
                  <path d="M6 10.5h1v3H6a1.5 1.5 0 0 1 0-3zM18 10.5a1.5 1.5 0 0 1 0 3h-1v-3h1z"/>
                  <rect x="2" y="9" width="2" height="6" rx="1"/>
                  <rect x="20" y="9" width="2" height="6" rx="1"/>
                  <rect x="7" y="11" width="10" height="2" rx="1"/>
                </svg>
              </div>
            </div>
            
            {/* Brand Text */}
            <span className="text-2xl font-black bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent" style={{ fontFamily: 'Orbitron, monospace' }}>
              Fitnopia
            </span>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link
              href="/auth/signin"
              className="font-medium text-indigo-400 hover:text-indigo-300"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-8">
          <div className="space-y-6">
            <OAuthButtons />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
    </>
  );
} 