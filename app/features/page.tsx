'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';

const features = [
  {
    title: 'AI-Powered Workout Plans',
    description: 'Experience the future of fitness with neural networks that create perfectly tailored routines just for you.',
    icon: '🤖',
    gradient: 'from-purple-500 to-pink-500',
    benefits: [
      'Quantum-enhanced personalization algorithms',
      'Adaptive difficulty with machine learning',
      'Goal-oriented exercise optimization',
      'Biometric-based recovery prediction'
    ]
  },
  {
    title: 'Real-Time Performance Analytics',
    description: 'Advanced sensors and AI provide instant feedback with precision that rivals professional sports labs.',
    icon: '📊',
    gradient: 'from-blue-500 to-cyan-500',
    benefits: [
      'Motion capture form analysis',
      'Real-time muscle activation tracking',
      'Predictive performance modeling',
      'Holographic progress visualization'
    ]
  },
  {
    title: 'Immersive Video Training',
    description: 'Step into virtual training environments with photorealistic AI trainers and interactive experiences.',
    icon: '🎥',
    gradient: 'from-green-500 to-teal-500',
    benefits: [
      'AR/VR exercise environments',
      'AI trainer personality matching',
      'Spatial audio coaching',
      'Multi-dimensional form correction'
    ]
  },
  {
    title: 'Quantum Session Optimization',
    description: 'Revolutionary workout sessions that adapt in real-time using quantum computing principles.',
    icon: '⚡',
    gradient: 'from-yellow-500 to-orange-500',
    benefits: [
      'Quantum-state workout adaptation',
      'Neural sync rest periods',
      'Biofeedback integration',
      'Molecular recovery tracking'
    ]
  },
  {
    title: 'Precision Nutrition AI',
    description: 'Molecular-level nutrition optimization powered by advanced AI and genomic analysis.',
    icon: '�',
    gradient: 'from-pink-500 to-rose-500',
    benefits: [
      'DNA-based meal optimization',
      'Metabolic pathway analysis',
      'Circadian nutrition timing',
      'Supplement synthesis recommendations'
    ]
  },
  {
    title: 'Neural Network Community',
    description: 'Connect through advanced neural interfaces with a global network of fitness consciousness.',
    icon: '🌐',
    gradient: 'from-indigo-500 to-purple-500',
    benefits: [
      'Consciousness-linked motivation',
      'Quantum entangled goal sharing',
      'Holographic achievement displays',
      'Telepathic coaching sessions'
    ]
  },
  {
    title: 'Omnidimensional Sync',
    description: 'Seamlessly sync across all realities and dimensions for a truly universal fitness experience.',
    icon: '🌌',
    gradient: 'from-violet-500 to-purple-500',
    benefits: [
      'Multi-dimensional data sync',
      'Parallel universe backup',
      'Time-dilated workout sessions',
      'Quantum encryption security'
    ]
  },
  {
    title: 'Predictive Analytics Matrix',
    description: 'See into your fitness future with advanced AI that models thousands of possible outcomes.',
    icon: '�',
    gradient: 'from-cyan-500 to-blue-500',
    benefits: [
      'Future performance prediction',
      'Timeline optimization algorithms',
      'Probability matrix analysis',
      'Dimensional goal forecasting'
    ]
  }
];

const pricingPlans = [
  {
    name: 'Quantum Free',
    price: '$0',
    period: 'forever',
    features: [
      'Basic AI workout plans',
      'Progress tracking dashboard',
      'Exercise library (50+ exercises)',
      'Community access',
      'Mobile app access',
      'Basic form guidance'
    ],
    cta: 'Begin Journey',
    highlighted: false,
    gradient: 'from-gray-600 to-gray-800'
  },
  {
    name: 'Neural Pro',
    price: '$14.99',
    period: 'per month',
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
    cta: 'Evolve Now',
    highlighted: true,
    gradient: 'from-purple-600 to-blue-600'
  },
  {
    name: 'Quantum Elite',
    price: '$29.99',
    period: 'per month',
    features: [
      'Everything in Neural Pro',
      'Personal AI trainer',
      'Custom meal planning',
      '1-on-1 video consultations',
      'Advanced biometric analysis',
      'Recovery optimization',
      'Competition preparation',
      'White-glove support'
    ],
    cta: 'Transcend Reality',
    highlighted: false,
    gradient: 'from-pink-600 to-purple-600'
  }
];

export default function Features() {
  const { data: session } = useSession();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  const [isMounted, setIsMounted] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  
  // Function to calculate display price based on billing cycle
  const getDisplayPrice = (monthlyPrice: string) => {
    if (monthlyPrice === '$0') return '$0';
    
    const monthly = parseFloat(monthlyPrice.replace('$', ''));
    if (isAnnual) {
      const annual = Math.round(monthly * 12 * 0.8); // 20% discount
      return `$${annual}`;
    }
    return monthlyPrice;
  };
  
  const getDisplayPeriod = () => {
    return isAnnual ? 'per year' : 'per month';
  };
  
  useEffect(() => {
    setIsMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    // Set initial window size
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-black"></div>
        
        {/* Dynamic orbs following mouse */}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl transition-all duration-1000 ease-out"
          style={{
            left: `${mousePosition.x * 0.05}px`,
            top: `${mousePosition.y * 0.05}px`,
            transform: 'translate(-50%, -50%)'
          }}
        ></div>
        <div 
          className="absolute w-64 h-64 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-full blur-2xl transition-all duration-700 ease-out"
          style={{
            right: isMounted ? `${(windowSize.width - mousePosition.x) * 0.03}px` : '100px',
            top: `${mousePosition.y * 0.08}px`,
            transform: 'translate(50%, -50%)'
          }}
        ></div>
        
        {/* Animated grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-float`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>
      </div>
      
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="text-center max-w-5xl mx-auto">
          <div className="mb-8">
            <span className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full text-lg font-semibold text-purple-300 mb-8 animate-pulse">
              ⚡ Next-Generation Fitness Technology
            </span>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
              Revolutionary
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x [animation-delay:0.5s]">
              Features
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-gradient-x [animation-delay:1s]">
              Await
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Step into the future of fitness with technologies that seemed impossible just years ago. 
            Our quantum-enhanced platform combines AI, machine learning, and advanced biometrics 
            to create experiences beyond imagination.
          </p>
          
          <Link
            href={session ? "/dashboard" : "/auth/signup"}
            className="group relative inline-block px-12 py-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-bold text-xl overflow-hidden transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/25"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="relative z-10">{session ? "Enter The Matrix" : "Begin Evolution"}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative container mx-auto px-4 py-24">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Quantum-Enhanced Capabilities
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Each feature represents a breakthrough in fitness technology, powered by algorithms 
            that learn and evolve with every interaction.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group relative">
              {/* Glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-20 rounded-3xl blur-xl group-hover:opacity-40 transition-all duration-500`}></div>
              
              {/* Main card */}
              <div className="relative bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 p-8 rounded-3xl hover:border-gray-600/70 transition-all duration-500 group-hover:scale-105 group-hover:bg-gray-900/80">
                {/* Icon with animated background */}
                <div className="relative mb-6">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-all duration-500`}></div>
                  <div className={`relative w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                    <span className="text-3xl filter drop-shadow-lg">{feature.icon}</span>
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {feature.title}
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                  {feature.description}
                </p>
                
                {/* Benefits list */}
                <ul className="space-y-3">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-start text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      <div className={`w-1.5 h-1.5 bg-gradient-to-r ${feature.gradient} rounded-full mt-2 mr-3 flex-shrink-0`}></div>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Hover reveal button */}
                <div className="mt-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <button className={`w-full py-3 bg-gradient-to-r ${feature.gradient} rounded-xl font-semibold text-white hover:scale-105 transition-transform duration-300`}>
                    Explore Feature
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Showcase */}
      <div className="relative container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Powered by Future Technology
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Built on a foundation of quantum computing, neural networks, and advanced biometrics
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: '🧠', title: 'Neural Networks', desc: 'Deep learning algorithms' },
            { icon: '⚛️', title: 'Quantum Computing', desc: 'Infinite optimization power' },
            { icon: '🔬', title: 'Biotech Integration', desc: 'Molecular-level insights' },
            { icon: '🌌', title: 'Spatial Computing', desc: 'Multi-dimensional interfaces' }
          ].map((tech, index) => (
            <div key={index} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 p-8 rounded-2xl text-center hover:border-gray-600/70 transition-all duration-500 group-hover:scale-105">
                <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-500">{tech.icon}</div>
                <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">{tech.title}</h3>
                <p className="text-gray-400 text-sm">{tech.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="relative container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Choose Your Evolution
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Select the perfect tier for your transformation journey. Each plan unlocks new dimensions of possibility.
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
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`group relative ${
                plan.highlighted ? 'scale-105 z-10' : ''
              }`}
            >
              {/* Glow effect for highlighted plan */}
              {plan.highlighted && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-3xl blur-2xl animate-pulse"></div>
              )}
              
              {/* Main card */}
              <div className={`relative bg-gray-900/80 backdrop-blur-sm border rounded-3xl p-8 transition-all duration-500 group-hover:scale-105 ${
                plan.highlighted
                  ? 'border-purple-500/50 bg-gradient-to-br from-purple-900/30 to-blue-900/30'
                  : 'border-gray-700/50 hover:border-gray-600/70'
              }`}>
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-bold animate-pulse">
                      Most Advanced
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <h3 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                    {plan.name}
                  </h3>
                  <div className="mb-8">
                    <span className="text-5xl font-black text-white">{getDisplayPrice(plan.price)}</span>
                    <span className="text-gray-400 ml-2">/{plan.price === '$0' ? plan.period : getDisplayPeriod()}</span>
                  </div>
                  
                  <ul className="space-y-4 mb-8 text-left">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-sm">
                        <div className={`w-2 h-2 bg-gradient-to-r ${plan.gradient} rounded-full mt-2 mr-3 flex-shrink-0`}></div>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    href={session ? "/dashboard" : "/auth/signup"}
                    className={`block w-full py-4 px-6 rounded-xl font-bold text-center transition-all duration-300 hover:scale-105 ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-400 hover:to-blue-400'
                        : `bg-gradient-to-r ${plan.gradient} text-white hover:scale-105`
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

      {/* Final CTA */}
      <div className="relative container mx-auto px-4 py-24">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-3xl animate-pulse"></div>
          <div className="relative text-center bg-gradient-to-br from-purple-600/80 to-blue-600/80 backdrop-blur-sm p-16 rounded-3xl border border-purple-500/30">
            <h2 className="text-5xl font-bold mb-6 text-white">
              Ready to Transcend Reality?
            </h2>
            <p className="text-xl mb-12 max-w-3xl mx-auto text-purple-100">
              Join the evolution of human potential. Experience fitness technology that seemed 
              impossible just yesterday, available today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href={session ? "/dashboard" : "/auth/signup"}
                className="group relative px-12 py-5 bg-white text-purple-600 rounded-2xl font-bold text-xl overflow-hidden transition-all duration-500 hover:scale-110"
              >
                <span className="relative z-10">{session ? "Enter the Matrix" : "Begin Evolution"}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
              <Link
                href="/about"
                className="px-12 py-5 border-2 border-white text-white rounded-2xl font-bold text-xl hover:bg-white hover:text-purple-600 transition-all duration-500 hover:scale-105"
              >
                Discover Our Vision
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
