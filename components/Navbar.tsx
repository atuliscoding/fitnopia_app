'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  const dashboardLinks = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/workouts', label: 'Workouts' },
    { href: '/dashboard/progress', label: 'Progress' },
    { href: '/dashboard/profile', label: 'Profile' },
  ];

  const publicLinks = [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
  ];

  const navigationLinks = isDashboard ? dashboardLinks : publicLinks;

  return (
    <nav className="relative bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/50 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="flex items-center space-x-3 group"
            >
              {/* Logo Icon */}
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-110 logo-pulse">
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
                {/* Animated glow effect */}
                <div className="absolute inset-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-xl blur-md opacity-0 group-hover:opacity-40 transition-all duration-500"></div>
              </div>
              
              {/* Brand Text */}
              <span className="text-2xl fitnopia-brand gradient-text-enhanced">
                Fitnopia
              </span>
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-1">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  pathname === link.href
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {session ? (
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="ml-4 bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-2 rounded-lg hover:from-red-500 hover:to-red-400 transition-all duration-300 font-medium"
              >
                Sign Out
              </button>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <Link 
                  href="/auth/signin" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-gray-800/50"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300 font-medium shadow-lg shadow-purple-500/25"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-300"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`h-6 w-6 transform transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-gray-900/95 backdrop-blur-sm border-t border-gray-800/50">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                  pathname === link.href
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {session ? (
              <button
                onClick={() => {
                  signOut({ callbackUrl: '/' });
                  setIsMobileMenuOpen(false);
                }}
                className="w-full mt-4 bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-3 rounded-lg hover:from-red-500 hover:to-red-400 transition-all duration-300 text-left font-medium"
              >
                Sign Out
              </button>
            ) : (
              <div className="pt-4 border-t border-gray-800/50 space-y-2">
                <Link
                  href="/auth/signin"
                  className="block px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="block px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 transition-all duration-300 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 