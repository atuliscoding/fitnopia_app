'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';

const pricingPlans = [
  {
    name: 'Starter',
    price: '$0',
    period: 'forever',
    description: 'Perfect for fitness newcomers',
    features: [
      'Basic AI workout plans',
      'Progress tracking dashboard',
      'Exercise library (50+ exercises)',
      'Community access',
      'Mobile app access',
      'Basic form guidance'
    ],
    cta: 'Start Free',
    highlighted: false,
    gradient: 'from-gray-600 to-gray-800',
    popular: false
  },
  {
    name: 'Pro',
    price: '$14.99',
    period: 'per month',
    description: 'For serious fitness enthusiasts',
    features: [
      'Advanced AI workout optimization',
      'Unlimited workout plans',
      'Full exercise library (500+ exercises)',
      'Real-time form analysis',
      'Nutrition tracking & insights',
      'Advanced progress analytics',
      'Priority support',
      'Wearable device integration'
    ],
    cta: 'Start Pro Trial',
    highlighted: true,
    gradient: 'from-purple-600 to-blue-600',
    popular: true
  },
  {
    name: 'Elite',
    price: '$29.99',
    period: 'per month',
    description: 'Maximum performance optimization',
    features: [
      'Everything in Pro',
      'Personal AI trainer',
      'Custom meal planning',
      '1-on-1 video consultations',
      'Advanced biometric analysis',
      'Recovery optimization',
      'Competition preparation',
      'White-glove support'
    ],
    cta: 'Go Elite',
    highlighted: false,
    gradient: 'from-pink-600 to-purple-600',
    popular: false
  }
];

const features = [
  {
    title: 'AI-Powered Personalization',
    description: 'Machine learning algorithms that adapt to your unique fitness profile and goals.',
    icon: '🧠'
  },
  {
    title: 'Real-Time Form Analysis',
    description: 'Advanced computer vision provides instant feedback on your exercise form.',
    icon: '📱'
  },
  {
    title: 'Comprehensive Analytics',
    description: 'Deep insights into your performance, progress, and optimization opportunities.',
    icon: '📊'
  },
  {
    title: 'Global Community',
    description: 'Connect with millions of fitness enthusiasts worldwide for motivation.',
    icon: '🌍'
  }
];

const faqs = [
  {
    question: 'Can I change plans anytime?',
    answer: 'Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect immediately.'
  },
  {
    question: 'Is there a free trial?',
    answer: 'We offer a 14-day free trial for Pro and Elite plans. No credit card required to start.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, Apple Pay, and Google Pay for your convenience.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 30-day money-back guarantee if you\'re not completely satisfied.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use enterprise-grade encryption and never share your personal data with third parties.'
  },
  {
    question: 'Can I use it offline?',
    answer: 'Yes! Our mobile app allows you to download workouts and use them offline when needed.'
  }
];

export default function Pricing() {
  const { data: session } = useSession();
  const [isAnnual, setIsAnnual] = useState(false);
  const [activeTab, setActiveTab] = useState('pricing');

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-black"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/25 to-pink-500/25 rounded-full blur-3xl animate-pulse [animation-delay:1s]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30"></div>
      </div>
      
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
              Choose Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Fitness Journey
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform your body and mind with plans designed for every fitness level. 
            Start free and unlock premium features as you grow.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-12">
            <span className={`mr-3 ${!isAnnual ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-3 ${isAnnual ? 'text-white' : 'text-gray-400'}`}>
              Annual
              <span className="ml-1 text-sm bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent font-semibold">
                (Save 20%)
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="relative container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`group relative ${
                plan.highlighted ? 'scale-105 z-10' : ''
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-bold animate-pulse">
                    Most Popular
                  </span>
                </div>
              )}
              
              {/* Glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${plan.gradient} opacity-20 rounded-3xl blur-xl group-hover:opacity-40 transition-all duration-500`}></div>
              
              {/* Main card */}
              <div className={`relative bg-gray-900/80 backdrop-blur-sm border rounded-3xl p-8 transition-all duration-500 group-hover:scale-105 ${
                plan.highlighted
                  ? 'border-purple-500/50 bg-gradient-to-br from-purple-900/30 to-blue-900/30'
                  : 'border-gray-700/50 hover:border-gray-600/70'
              }`}>
                
                <div className="text-center">
                  {/* Plan name and description */}
                  <h3 className={`text-2xl font-bold mb-2 bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                    {plan.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                  
                  {/* Price */}
                  <div className="mb-8">
                    <span className="text-5xl font-black text-white">
                      {plan.price === '$0' ? plan.price : 
                        isAnnual && plan.price !== '$0' ? 
                          `$${(parseFloat(plan.price.slice(1)) * 0.8).toFixed(2)}` : 
                          plan.price
                      }
                    </span>
                    <span className="text-gray-400 ml-2">
                      /{isAnnual && plan.price !== '$0' ? 'month (billed annually)' : plan.period}
                    </span>
                    {isAnnual && plan.price !== '$0' && (
                      <div className="text-sm text-green-400 mt-1">
                        Save ${((parseFloat(plan.price.slice(1)) * 12) - (parseFloat(plan.price.slice(1)) * 0.8 * 12)).toFixed(2)}/year
                      </div>
                    )}
                  </div>
                  
                  {/* Features list */}
                  <ul className="space-y-4 mb-8 text-left">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-sm">
                        <div className={`w-2 h-2 bg-gradient-to-r ${plan.gradient} rounded-full mt-2 mr-3 flex-shrink-0`}></div>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* CTA Button */}
                  <Link
                    href={session ? "/dashboard" : "/auth/signup"}
                    className={`block w-full py-4 px-6 rounded-xl font-bold text-center transition-all duration-300 hover:scale-105 ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-400 hover:to-blue-400 shadow-lg shadow-purple-500/25'
                        : `bg-gradient-to-r ${plan.gradient} text-white hover:shadow-lg`
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="relative container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Why Choose Fitnopia?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Advanced technology meets proven fitness science to deliver unprecedented results
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 p-8 rounded-2xl hover:border-gray-600/70 transition-all duration-300 group-hover:scale-105">
                <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="relative container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to know about Fitnopia pricing and features
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 p-6 rounded-2xl hover:border-gray-600/70 transition-all duration-300">
                <h3 className="text-lg font-bold mb-3 text-white">{faq.question}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative container mx-auto px-4 py-24">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-3xl animate-pulse"></div>
          <div className="relative text-center bg-gradient-to-br from-purple-600/80 to-blue-600/80 backdrop-blur-sm p-16 rounded-3xl border border-purple-500/30">
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to Transform Your Life?
            </h2>
            <p className="text-xl mb-12 max-w-3xl mx-auto text-purple-100">
              Join over 50,000 people who have already started their fitness transformation with Fitnopia. 
              Your future self will thank you.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href={session ? "/dashboard" : "/auth/signup"}
                className="px-12 py-5 bg-white text-purple-600 rounded-2xl font-bold text-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105"
              >
                {session ? "Go to Dashboard" : "Start Free Today"}
              </Link>
              <Link
                href="/features"
                className="px-12 py-5 border-2 border-white text-white rounded-2xl font-bold text-xl hover:bg-white hover:text-purple-600 transition-all duration-300 hover:scale-105"
              >
                Explore Features
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
