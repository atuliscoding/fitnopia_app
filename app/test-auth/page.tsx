'use client';

import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { OAuthButtons } from '../../components/auth/OAuthButtons';

export default function TestAuthPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Authentication Test - Signed In</h1>
          
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Session Information</h2>
            <div className="space-y-2 text-gray-300">
              <p><strong>Email:</strong> {session.user?.email}</p>
              <p><strong>Name:</strong> {session.user?.name || 'Not provided'}</p>
              <p><strong>ID:</strong> {session.user?.id}</p>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/test-auth' })}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Authentication Test</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">OAuth Providers</h2>
            <OAuthButtons />
          </div>

          <div className="border-t border-gray-700 pt-6">
            <h2 className="text-xl font-semibold text-white mb-4">Test Credentials</h2>
            <p className="text-gray-400 text-sm mb-4">
              You can create an account through the signup page or use OAuth above.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => signIn('credentials', { 
                  email: 'test@example.com', 
                  password: 'testpassword',
                  callbackUrl: '/test-auth'
                })}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Test Credentials Sign In
              </button>
            </div>
          </div>

          <div className="text-center">
            <a 
              href="/auth/signup" 
              className="text-indigo-400 hover:text-indigo-300 text-sm"
            >
              Go to Signup Page
            </a>
            <span className="text-gray-500 mx-2">|</span>
            <a 
              href="/auth/signin" 
              className="text-indigo-400 hover:text-indigo-300 text-sm"
            >
              Go to Signin Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
