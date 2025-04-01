'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative h-screen">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/ensamc.jpg"
            alt="ENSAM Casablanca"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
            className="brightness-50"
          />
        </div>
        
        {/* Overlay Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="text-white">Pfe</span>
              <span className="text-pfebrand bg-white px-2 rounded">Archive</span>
            </h1>
            
            <p className="text-xl sm:text-2xl font-light mb-8">
              Preserving knowledge, inspiring innovation - Your gateway to ENSAM Casablanca&apos;s legacy of excellence
            </p>
            
            <p className="text-base sm:text-lg mb-12 max-w-2xl mx-auto">
              Access, explore, and build upon years of final year projects from ENSAM Casablanca students. Discover research, methodologies, and innovations from previous generations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <button className="px-8 py-4 bg-pfebrand text-white font-medium rounded-md hover:bg-pfebrand/90 transition-all shadow-lg hover:shadow-xl">
                  Sign In
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-8 py-4 bg-white text-pfebrand font-medium rounded-md hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl">
                  Create Account
                </button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll Down Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Use PfeArchive?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-pfebrand/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-pfebrand" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Comprehensive Repository</h3>
              <p className="text-gray-600">
                Access years of final year projects in one centralized location, organized by department, year, and topic.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-pfebrand/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-pfebrand" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Advanced Search</h3>
              <p className="text-gray-600">
                Find relevant projects using our powerful search functionality with filters for keywords, technologies, and supervisors.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-pfebrand/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-pfebrand" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Inspiration & Resources</h3>
              <p className="text-gray-600">
                Find inspiration for your own project and access valuable methodologies, frameworks, and best practices.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-pfebrand py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to explore ENSAM Casablanca&apos;s academic excellence?
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Join PfeArchive today and discover the wealth of knowledge from generations of ENSAM Casablanca students.
          </p>
          <Link href="/signup">
            <button className="px-8 py-4 bg-white text-pfebrand font-medium rounded-md hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl">
              Get Started Now
            </button>
          </Link>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">PfeArchive</h3>
            <p className="text-gray-400">A project by ENSAM Casablanca students</p>
          </div>
          <div className="flex gap-8">
            <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
              Contact
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy
            </Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} PfeArchive. All rights reserved.
        </div>
      </footer>
    </div>
  );
}