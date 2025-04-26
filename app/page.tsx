'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role?: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Fetch user authentication status from localStorage
    const checkAuthStatus = () => {
      const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
      if (storedUser) {
        setIsLoggedIn(true);
        setUser(storedUser);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    // Initial check
    checkAuthStatus();

    // Add event listener for storage changes
    window.addEventListener('storage', checkAuthStatus);

    // Add scroll listener for navbar effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md text-gray-800' : 'bg-transparent text-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold">
                  <span>Pfe</span>
                  <span className={`${isScrolled ? 'bg-pfebrand text-white' : 'bg-white text-pfebrand'} px-2 rounded`}>Archive</span>
                </span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/archives" className={`font-medium hover:text-pfebrand transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}>Archives</Link>
              <Link href="/departments" className={`font-medium hover:text-pfebrand transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}>Departments</Link>
      
              
              {isLoggedIn ? (
                <>
                  <Link href="/submit-project" className={`font-medium hover:text-pfebrand transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
                    <div className="flex items-center">
                      <svg 
                        className="w-5 h-5 mr-1" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                      Submit Report
                    </div>
                  </Link>
                  <div className="relative ml-3">
                    <div>
                      <button
                        type="button"
                        className="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pfebrand"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                      >
                        <div className={`h-8 w-8 rounded-full bg-pfebrand flex items-center justify-center ${isScrolled ? 'text-white' : 'text-white'}`}>
                          {user?.name.charAt(0).toUpperCase()}
                        </div>
                        <span className={`ml-2 ${isScrolled ? 'text-gray-700' : 'text-white'}`}>{user?.name}</span>
                        <svg className={`ml-1 h-5 w-5 ${isScrolled ? 'text-gray-500' : 'text-white'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    
                    {isMenuOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                          <Link href="/reports/search" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                          <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</Link>
                          <Link href="/favorites" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Saved Reports</Link>
                          <button 
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/login">
                    <button className={`px-4 py-2 rounded-md font-medium transition-colors ${
                      isScrolled 
                        ? 'text-pfebrand border border-pfebrand hover:bg-pfebrand hover:text-white' 
                        : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                    }`}>
                      Sign In
                    </button>
                  </Link>
                  <Link href="/signup">
                    <button className="px-4 py-2 bg-pfebrand text-white rounded-md font-medium hover:bg-pfebrand/90 transition-colors shadow">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pfebrand"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden ${isScrolled ? 'bg-white' : 'bg-gray-900/95'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/archives" className={`block px-3 py-2 rounded-md font-medium ${isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-gray-800'}`}>Archives</Link>
            <Link href="/departments" className={`block px-3 py-2 rounded-md font-medium ${isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-gray-800'}`}>Departments</Link>
            <Link href="/about" className={`block px-3 py-2 rounded-md font-medium ${isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-gray-800'}`}>About</Link>
            
            {isLoggedIn ? (
              <>
                <Link href="/upload" className={`block px-3 py-2 rounded-md font-medium ${isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-gray-800'}`}>
                  <div className="flex items-center">
                    <svg 
                      className="w-5 h-5 mr-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Submit Report
                  </div>
                </Link>
                <div className={`px-3 py-2 font-medium ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-pfebrand flex items-center justify-center text-white">
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="ml-3">{user?.name}</span>
                  </div>
                </div>
                <Link href="/dashboard" className={`block px-3 py-2 rounded-md font-medium ${isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-gray-800'}`}>Dashboard</Link>
                <Link href="/profile" className={`block px-3 py-2 rounded-md font-medium ${isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-gray-800'}`}>Your Profile</Link>
                <Link href="/favorites" className={`block px-3 py-2 rounded-md font-medium ${isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-gray-800'}`}>Saved Reports</Link>
                <button 
                  onClick={handleLogout}
                  className={`w-full text-left block px-3 py-2 rounded-md font-medium ${isScrolled ? 'text-red-600 hover:bg-gray-100' : 'text-red-400 hover:bg-gray-800'}`}
                >
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 px-3 py-2">
                <Link href="/login">
                  <button className="w-full px-4 py-2 border border-pfebrand text-pfebrand rounded-md font-medium hover:bg-pfebrand hover:text-white transition-colors">
                    Sign In
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="w-full px-4 py-2 bg-pfebrand text-white rounded-md font-medium hover:bg-pfebrand/90 transition-colors">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-screen">
        {/* Background Image with gradient overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/50 to-pfebrand/30 z-10"></div>
          <Image
            src="/assets/ensamc.jpg"
            alt="ENSAM Casablanca"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
            className="brightness-75"
          />
        </div>

        {/* Overlay Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
              <span className="text-white">Pfe</span>
              <span className="text-pfebrand bg-white px-2 rounded">Archive</span>
            </h1>

            {isLoggedIn ? (
              <div className="animate-fade-in-up">
                <p className="text-xl sm:text-2xl font-medium mb-6">
                  Welcome back, <span className="font-bold">{user?.name}</span>!
                </p>
                <p className="text-lg mb-8">
                  Continue exploring ENSAM Casablanca&apos;s research projects and academic excellence.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/dashboard">
                    <button className="px-8 py-4 bg-pfebrand text-white font-medium rounded-md hover:bg-pfebrand/90 transition-all shadow-lg hover:shadow-xl">
                      Go to Dashboard
                    </button>
                  </Link>
                  <Link href="/upload">
                    <button className="px-8 py-4 bg-white text-pfebrand font-medium rounded-md hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl flex items-center justify-center">
                      <svg 
                        className="w-5 h-5 mr-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                      Submit Report
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in-up">
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
            )}
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>

      {/* Features Section - Different for logged in users */}
      {isLoggedIn ? (
        <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Continue Your Research Journey
            </h2>
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
              Pick up where you left off or discover new resources to enhance your academic pursuits.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Quick Access */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  Recent Activity
                </h3>
                <p className="text-gray-600 mb-4">
                  Resume your research where you left off with quick access to your recently viewed projects.
                </p>
                <Link href="/recent-activity" className="text-pfebrand font-medium hover:text-pfebrand/80">
                  View Recent Activity →
                </Link>
              </div>

              {/* Saved Items */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  Saved Projects
                </h3>
                <p className="text-gray-600 mb-4">
                  Access your collection of saved projects for reference and inspiration.
                </p>
                <Link href="/saved-projects" className="text-pfebrand font-medium hover:text-pfebrand/80">
                  View Saved Projects →
                </Link>
              </div>

              {/* Recommendations */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  Recommended For You
                </h3>
                <p className="text-gray-600 mb-4">
                  Discover projects tailored to your interests and academic focus.
                </p>
                <Link href="/recommendations" className="text-pfebrand font-medium hover:text-pfebrand/80">
                  View Recommendations →
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Use PfeArchive?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-pfebrand/10 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-pfebrand"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  Comprehensive Repository
                </h3>
                <p className="text-gray-600">
                  Access years of final year projects in one centralized location, organized by department, year, and topic.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-pfebrand/10 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-pfebrand"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  Advanced Search
                </h3>
                <p className="text-gray-600">
                  Find relevant projects using our powerful search functionality with filters for keywords, technologies, and supervisors.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-pfebrand/10 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-pfebrand"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  Inspiration & Resources
                </h3>
                <p className="text-gray-600">
                  Find inspiration for your own project and access valuable methodologies, frameworks, and best practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Section - Same for both logged in and out */}
      <div className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            PfeArchive by the Numbers
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            Join a growing community of ENSAM Casablanca students and alumni sharing knowledge and innovation.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-pfebrand mb-2">500+</div>
              <div className="text-gray-500 font-medium">Research Projects</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-pfebrand mb-2">12</div>
              <div className="text-gray-500 font-medium">Academic Departments</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-pfebrand mb-2">15+</div>
              <div className="text-gray-500 font-medium">Years of Archives</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-pfebrand mb-2">2,000+</div>
              <div className="text-gray-500 font-medium">Active Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - Different for logged in users */}
{isLoggedIn ? (
  <div className="bg-gradient-to-r from-pfebrand to-blue-700 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-white mb-6">
        Share Your Own Academic Work
      </h2>
      <p className="text-white/90 mb-8 text-lg">
        Contribute to the archive by sharing your own final year project or research work with the ENSAM community.
      </p>
      <Link href="/upload">
        <button className="px-8 py-4 bg-white text-pfebrand font-medium rounded-md hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl flex items-center justify-center mx-auto">
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Submit Your Project
        </button>
      </Link>
    </div>
  </div>
) : (
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
)}

{/* Footer */}
<footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
    <div className="mb-4 md:mb-0">
      <div className="text-xl font-bold">
        <span>Pfe</span>
        <span className="bg-white text-pfebrand px-2 rounded">Archive</span>
      </div>
      <p className="text-gray-400">A project by ENSAM Casablanca students</p>
    </div>
    <div className="flex flex-wrap gap-6 md:gap-8 justify-center">
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