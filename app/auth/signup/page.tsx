'use client';

import * as React from 'react';
import Link from 'next/link';
import { SignUpForm } from '../../../components/auth/SignUpForm';
import { OAuthButtons } from '../../../components/auth/OAuthButtons';

export default function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link href="/" className="flex justify-center">
            <img
              className="h-12 w-auto"
              src="/logo.png"
              alt="Fitnopia"
            />
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
  );
} 