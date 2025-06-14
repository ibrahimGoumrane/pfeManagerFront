"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Search,
  Upload,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { isAuthenticated, user, loading, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSignOut = () => {
    logout();
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }
  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 bg-slate-600  ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-md border-b border-gray-200/50"
            : "backdrop-blur-md border-b border-white/20"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center group">
                <Sparkles
                  className={`w-6 h-6 mr-2 transition-colors duration-300 ${
                    isScrolled ? "text-blue-600" : "text-white"
                  }`}
                />
                <span className="text-2xl font-black tracking-tight">
                  <span
                    className={`transition-colors duration-300 ${
                      isScrolled ? "text-gray-900" : "text-white"
                    }`}
                  >
                    Pfe
                  </span>
                  <span
                    className={`px-2 py-1 rounded-lg ml-1 transition-all duration-300 ${
                      isScrolled
                        ? "bg-blue-600 text-white"
                        : "bg-white/20 text-white backdrop-blur-sm border border-white/30"
                    }`}
                  >
                    Archive
                  </span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/reports/search"
                className={`flex items-center font-semibold transition-colors duration-200 ${
                  isScrolled
                    ? "text-gray-700 hover:text-blue-600"
                    : "text-white/90 hover:text-white"
                } group`}
              >
                <Search className="w-4 h-4 mr-2 transition-transform duration-200" />
                Look for reports
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <>
                  <Link
                    href="/upload"
                    className={`flex items-center font-semibold transition-colors duration-200 ${
                      isScrolled
                        ? "text-gray-700 hover:text-blue-600"
                        : "text-white/90 hover:text-white"
                    } group`}
                  >
                    <Upload className="w-4 h-4 mr-2 transition-transform duration-200" />
                    Upload report
                  </Link>
                  <div className="relative">
                    <button
                      type="button"
                      className={`flex items-center space-x-3 px-4 py-2 rounded-xl transition-colors duration-200 ${
                        isScrolled
                          ? "bg-gray-50 hover:bg-gray-100 text-gray-900 shadow-sm"
                          : "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/30"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {user?.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold truncate max-w-32">
                        {user?.name}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setIsMenuOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white/95 backdrop-blur-xl ring-1 ring-black/5 border border-gray-200/50 z-20 transition-opacity duration-150 ease-in-out opacity-100">
                          <div className="p-2">
                            <div className="px-4 py-3 border-b border-gray-200/50">
                              <p className="text-sm font-semibold text-gray-900">
                                {user?.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {user?.email}
                              </p>
                            </div>
                            <button
                              onClick={handleSignOut}
                              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 mt-2 group"
                            >
                              <LogOut className="w-4 h-4 mr-3" />
                              Sign out
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className={`font-semibold transition-colors duration-200 ${
                        isScrolled
                          ? "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                          : "text-white hover:text-white hover:bg-white/20 backdrop-blur-sm"
                      }`}
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-colors duration-200 rounded-lg">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isScrolled
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-white hover:bg-white/20 backdrop-blur-sm"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl shadow-lg border-t border-gray-200/50 transition-opacity duration-150 ease-in-out opacity-100">
            <div className="px-4 py-6 space-y-4">
              <Link
                href="/reports/search"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors duration-150 font-semibold group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Search className="w-5 h-5 mr-3" />
                Look for reports
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    href="/upload"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors duration-150 font-semibold group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Upload className="w-5 h-5 mr-3" />
                    Upload report
                  </Link>
                  <div className="border-t border-gray-200/50 pt-4 mt-4">
                    <div className="flex items-center px-4 py-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold mr-3">
                        {user?.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {user?.name}
                        </p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 font-semibold group"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-gray-200/50 pt-4 mt-4 space-y-3">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-semibold"
                    >
                      <User className="w-5 h-5 mr-3" />
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
