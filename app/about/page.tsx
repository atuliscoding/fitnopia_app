'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';

const stats = [
  { number: '10,000+', label: 'Active Users', description: 'Trusted by fitness enthusiasts worldwide' },
  { number: '500+', label: 'Workout Types', description: 'Diverse exercises for every fitness level' },
  { number: '98%', label: 'Success Rate', description: 'Users achieve their fitness goals' },
  { number: '24/7', label: 'AI Support', description: 'Always available personal trainer' }
];

const teamMembers = [
  {
    name: 'Atul Sharma',
    role: 'CEO & Co-Founder',
    image: '/avatars/ali.jpg',
    bio: 'Former Olympic trainer with 15+ years in fitness technology',
    specialties: ['Leadership', 'Fitness Science', 'AI Strategy']
  },
  {
    name: 'Asmeen Ray',
    role: 'CTO & Co-Founder',
    image: '/avatars/richard.jpg',
    bio: 'Machine learning expert from Stanford, passionate about health tech',
    specialties: ['AI Development', 'Data Science', 'Mobile Tech']
  },
  {
    name: 'Dr. Anisha Patel',
    role: 'Head of Fitness Science',
    image: '/avatars/anisha.jpg',
    bio: 'Sports medicine physician and research scientist',
    specialties: ['Exercise Physiology', 'Nutrition', 'Recovery Science']
  },
  {
    name: 'Shanai Williams',
    role: 'Head of Design',
    image: '/avatars/shanai.jpg',
    bio: 'UX designer focused on creating intuitive fitness experiences',
    specialties: ['User Experience', 'Product Design', 'Accessibility']
  }
];

const timeline = [
  {
    year: '2022',
    title: 'The Vision',
    description: 'Founded with the mission to democratize personal training through AI technology'
  },
  {
    year: '2023',
    title: 'AI Breakthrough',
    description: 'Developed proprietary AI algorithms for personalized workout generation'
  },
  {
    year: '2024',
    title: 'Community Growth',
    description: 'Reached 5,000+ active users and launched social features'
  },
  {
    year: '2025',
    title: 'Global Expansion',
    description: 'Scaling worldwide with advanced nutrition and recovery insights'
  }
];

const values = [
  {
    icon: '🎯',
    title: 'Personalization First',
    description: 'Every workout is tailored to your unique goals, fitness level, and preferences'
  },
  {
    icon: '🔬',
    title: 'Science-Based',
    description: 'All recommendations are backed by the latest exercise science and research'
  },
  {
    icon: '🤝',
    title: 'Community Driven',
    description: 'Building a supportive community where everyone can achieve their fitness goals'
  },
  {
    icon: '🚀',
    title: 'Innovation',
    description: 'Constantly pushing the boundaries of what\'s possible in fitness technology'
  }
];

export default function About() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
        <div className="relative text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Revolutionizing Fitness with AI
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            At Fitnopia, we believe everyone deserves access to world-class personal training. 
            Our AI-powered platform combines cutting-edge technology with proven fitness science 
            to create truly personalized workout experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={session ? "/dashboard" : "/auth/signup"}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-indigo-500 hover:to-purple-500 transition-all transform hover:scale-105"
            >
              {session ? "Go to Dashboard" : "Start Your Journey"}
            </Link>
            <Link
              href="/features"
              className="border border-gray-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-gray-800 p-8 rounded-2xl hover:bg-gray-750 transition-all duration-300 group-hover:scale-105">
                <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text mb-2">
                  {stat.number}
                </div>
                <div className="text-xl font-semibold mb-2">{stat.label}</div>
                <div className="text-gray-400 text-sm">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                We're on a mission to make personalized fitness coaching accessible to everyone, 
                regardless of their location, budget, or experience level. By harnessing the power 
                of artificial intelligence, we're breaking down barriers and creating a future 
                where everyone can achieve their fitness goals.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Our platform doesn't just provide workouts—it learns from you, adapts to your 
                progress, and grows with you on your fitness journey. It's like having a personal 
                trainer, nutritionist, and motivational coach all in one.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1 rounded-2xl">
                <div className="bg-gray-800 p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold mb-4">Why We Started Fitnopia</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-indigo-400 mr-3 mt-1">✨</span>
                      Make fitness coaching accessible to everyone
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-400 mr-3 mt-1">🧠</span>
                      Leverage AI to create truly personalized experiences
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-400 mr-3 mt-1">📱</span>
                      Remove barriers like time, location, and cost
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-400 mr-3 mt-1">💪</span>
                      Empower people to achieve their fitness goals
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            These principles guide everything we do and shape how we build products that truly serve our community.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-xl hover:bg-gray-750 transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Journey</h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            From a simple idea to a platform that's transforming how people approach fitness.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-indigo-500 to-purple-500"></div>
            
            {timeline.map((item, index) => (
              <div key={index} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <div className="bg-gray-800 p-6 rounded-xl hover:bg-gray-750 transition-colors">
                    <div className="text-2xl font-bold text-indigo-400 mb-2">{item.year}</div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-300">{item.description}</p>
                  </div>
                </div>
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-indigo-500 rounded-full border-4 border-gray-900"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Passionate experts from fitness, technology, and design working together to revolutionize your workout experience.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <div key={index} className="group">
              <div className="bg-gray-800 p-6 rounded-xl hover:bg-gray-750 transition-all duration-300 group-hover:scale-105">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 p-1">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="text-xl font-semibold text-center mb-1">{member.name}</h3>
                <p className="text-indigo-400 text-center mb-3 font-medium">{member.role}</p>
                <p className="text-gray-300 text-sm text-center mb-4">{member.bio}</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {member.specialties.map((specialty, specialtyIndex) => (
                    <span key={specialtyIndex} className="bg-gray-700 text-xs px-2 py-1 rounded-full">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Powered by Advanced Technology</h2>
          <p className="text-gray-300 text-lg mb-12">
            We leverage cutting-edge AI and machine learning to create the most personalized fitness experience possible.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-semibold mb-3">Machine Learning</h3>
              <p className="text-gray-300 text-sm">
                Advanced algorithms that learn from your workouts and continuously improve recommendations.
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-3">Real-time Analytics</h3>
              <p className="text-gray-300 text-sm">
                Instant feedback and insights to help you optimize your training and recovery.
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl">
              <div className="text-4xl mb-4">☁️</div>
              <h3 className="text-xl font-semibold mb-3">Cloud Infrastructure</h3>
              <p className="text-gray-300 text-sm">
                Scalable, secure, and reliable platform that grows with our community.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-3xl blur-3xl"></div>
          <div className="relative text-center bg-gradient-to-r from-indigo-600 to-purple-600 p-12 rounded-2xl">
            <h2 className="text-4xl font-bold mb-4">Join the Fitness Revolution</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Ready to experience the future of personalized fitness? Join thousands of users who have already transformed their lives with Fitnopia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={session ? "/dashboard" : "/auth/signup"}
                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all transform hover:scale-105"
              >
                {session ? "Go to Dashboard" : "Start Free Trial"}
              </Link>
              <Link
                href="/features"
                className="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-indigo-600 transition-colors"
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
