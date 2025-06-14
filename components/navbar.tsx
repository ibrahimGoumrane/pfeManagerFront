'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role?: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
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

    checkAuthStatus();
    window.addEventListener('storage', checkAuthStatus);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage')); 
    setIsLoggedIn(false);
    setUser(null);
    setIsMenuOpen(false);
  };

  return (    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 shadow-lg text-gray-800' 
        : 'bg-white/30 text-gray-800'
    } backdrop-blur-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold">
                <span>Pfe</span>
                <span className={`${isScrolled ? 'bg-pfebrand text-white' : 'bg-white text-pfebrand'} px-2 rounded`}>Archive</span>
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6">            
            <Link href="/reports/search" className="font-medium text-gray-700 hover:text-pfebrand transition-colors">Look for reports</Link>
            <Link href="/upload" className="font-medium text-gray-700 hover:text-pfebrand transition-colors">Upload report</Link>
            
            {isLoggedIn ? (
              <div className="relative ml-3">
                <div>
                  <button
                    type="button"
                    className="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pfebrand"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <div className={`h-8 w-8 rounded-full bg-pfebrand flex items-center justify-center ${isScrolled ? 'text-white' : 'text-white'}`}>
                      {user?.name.charAt(0).toUpperCase()}
                    </div>                    <span className="ml-2 text-gray-700">{user?.name}</span>
                    <svg className="ml-1 h-5 w-5 text-gray-500"xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                {isMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                     <button 
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
        </div>
      </div>
    </nav>
  );
}