'use client';

import * as React from 'react';
import { signIn } from 'next-auth/react';

export function OAuthButtons() {
  const [isLoading, setIsLoading] = React.useState<string | null>(null);

  const handleOAuthSignIn = async (provider: string) => {
    try {
      setIsLoading(provider);
      await signIn(provider, { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('OAuth sign in error:', error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Google OAuth Button */}
      <button
        onClick={() => handleOAuthSignIn('google')}
        disabled={isLoading === 'google'}
        className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 rounded-xl shadow-sm text-sm font-medium text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-all duration-300 group"
      >
        {isLoading === 'google' ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <img
            src="/google-logo.png"
            alt="Google"
            className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300"
          />
        )}
        {isLoading === 'google' ? 'Signing in...' : 'Continue with Google'}
      </button>

      {/* GitHub OAuth Button */}
      <button
        onClick={() => handleOAuthSignIn('github')}
        disabled={isLoading === 'github'}
        className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 rounded-xl shadow-sm text-sm font-medium text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-all duration-300 group"
      >
        {isLoading === 'github' ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <img
            src="/github-logo.png"
            alt="GitHub"
            className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300"
          />
        )}
        {isLoading === 'github' ? 'Signing in...' : 'Continue with GitHub'}
      </button>
    </div>
  );
} 