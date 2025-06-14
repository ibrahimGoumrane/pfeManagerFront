"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Upload,
  Clock,
  Bookmark,
  ThumbsUp,
  BookOpen,
  Users,
  Calendar,
  TrendingUp,
  ArrowDown,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";

export default function Home() {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="min-h-screen pt-16 flex flex-col">
        {/* Hero Section */}
        <div className="relative h-screen overflow-hidden">
          {/* Background with enhanced gradient */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/70 to-blue-900/60 z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-20"></div>
            <Image
              src="/placeholder.svg?height=1080&width=1920"
              alt="ENSAM Casablanca"
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority
              className="brightness-75 scale-105 animate-slow-zoom"
            />
          </div>

          {/* Floating particles effect */}
          <div className="absolute inset-0 z-5">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-float"></div>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/40 rounded-full animate-float-delayed"></div>
            <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-blue-300/20 rounded-full animate-float-slow"></div>
          </div>

          {/* Enhanced overlay content */}
          <div className="relative z-30 flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8 text-white text-center">
            <div className="max-w-4xl mx-auto">
              {/* Logo with enhanced styling */}
              <div className="mb-8 animate-fade-in">
                <div className="inline-flex items-center gap-2 mb-4">
                  <Sparkles className="w-8 h-8 text-blue-400 animate-pulse" />
                  <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight">
                    <span className="text-white drop-shadow-lg">Pfe</span>
                    <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent px-3 py-1 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                      Archive
                    </span>
                  </h1>
                  <Sparkles className="w-8 h-8 text-blue-400 animate-pulse" />
                </div>
              </div>

              {isAuthenticated ? (
                <div className="animate-fade-in-up space-y-8">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <p className="text-2xl sm:text-3xl font-bold mb-2">
                      Welcome back,{" "}
                      <span className="text-blue-400">{user?.name}</span>! 👋
                    </p>
                    <p className="text-lg text-white/90">
                      Continue exploring ENSAM Casablanca&apos;s research
                      excellence
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <Link href="/reports/search">
                      <Button
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 group"
                      >
                        <Search className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                        Find Reports
                      </Button>
                    </Link>
                    <Link href="/upload">
                      <Button
                        size="lg"
                        variant="outline"
                        className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-8 py-4 rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 group"
                      >
                        <Upload className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition-transform" />
                        Submit Report
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="animate-fade-in-up space-y-8">
                  <div className="space-y-6">
                    <p className="text-xl sm:text-2xl font-light text-white/90 leading-relaxed">
                      Preserving knowledge, inspiring innovation
                    </p>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                      <p className="text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
                        Your gateway to ENSAM Casablanca&apos;s legacy of
                        excellence. Access, explore, and build upon years of
                        final year projects from brilliant minds.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/reports/search">
                      <Button
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl shadow-xl hover:shadow-blue-500/20 transition-all duration-200 ease-in-out hover:scale-[1.03] group"
                      >
                        <Search className="w-5 h-5 mr-2 group-hover:rotate-6 transition-transform duration-200 ease-out" />
                        Search Reports
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button
                        size="lg"
                        variant="outline"
                        className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-8 py-4 rounded-xl shadow-xl transition-all duration-200 ease-in-out hover:scale-[1.03]"
                      >
                        Create Account
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
            <div className="flex flex-col items-center space-y-2 animate-bounce">
              <span className="text-white/70 text-sm font-medium">
                Scroll to explore
              </span>
              <ArrowDown className="w-6 h-6 text-white/70" />
            </div>
          </div>
        </div>

        {/* Features Section */}
        {isAuthenticated ? (
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <Badge
                  variant="secondary"
                  className="mb-4 px-4 py-2 text-sm font-medium"
                >
                  Welcome Back
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Continue Your Research Journey
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Pick up where you left off or discover new resources to
                  enhance your academic pursuits.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">
                      Recent Activity
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Resume your research where you left off with quick access
                      to your recently viewed projects.
                    </p>
                    <Link
                      href="/reports/search"
                      className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
                    >
                      View Recent Activity
                      <ArrowDown className="w-4 h-4 ml-2 rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Bookmark className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">
                      Saved Projects
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Access your collection of saved projects for reference and
                      inspiration.
                    </p>
                    <Link
                      href="/reports/search"
                      className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700 transition-colors group"
                    >
                      View Saved Projects
                      <ArrowDown className="w-4 h-4 ml-2 rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <ThumbsUp className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">
                      Recommended For You
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Discover projects tailored to your interests and academic
                      focus.
                    </p>
                    <Link
                      href="/reports/search"
                      className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors group"
                    >
                      View Recommendations
                      <ArrowDown className="w-4 h-4 ml-2 rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <Badge
                  variant="secondary"
                  className="mb-4 px-4 py-2 text-sm font-medium"
                >
                  Why Choose Us
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Why Use PfeArchive?
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Discover the power of collaborative academic excellence
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">
                      Comprehensive Repository
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Access years of final year projects in one centralized
                      location, organized by department, year, and topic.
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Search className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">
                      Advanced Search
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Find relevant projects using our powerful search
                      functionality with filters for keywords, technologies, and
                      supervisors.
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">
                      Inspiration & Resources
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Find inspiration for your own project and access valuable
                      methodologies, frameworks, and best practices.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Statistics Section */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-900 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-400/20 to-transparent"></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <Badge
                variant="secondary"
                className="mb-4 px-4 py-2 text-sm font-medium bg-white/10 text-white border-white/20"
              >
                Our Impact
              </Badge>
              <h2 className="text-4xl font-bold text-white mb-4">
                PfeArchive by the Numbers
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Join a growing community of ENSAM Casablanca students and alumni
                sharing knowledge and innovation.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center group hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8 text-blue-400 mr-2" />
                    <div className="text-5xl font-black text-white group-hover:text-blue-400 transition-colors">
                      500+
                    </div>
                  </div>
                  <div className="text-white/80 font-semibold text-lg">
                    Research Projects
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center group hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-purple-400 mr-2" />
                    <div className="text-5xl font-black text-white group-hover:text-purple-400 transition-colors">
                      12
                    </div>
                  </div>
                  <div className="text-white/80 font-semibold text-lg">
                    Academic Departments
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center group hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center mb-4">
                    <Calendar className="w-8 h-8 text-green-400 mr-2" />
                    <div className="text-5xl font-black text-white group-hover:text-green-400 transition-colors">
                      15+
                    </div>
                  </div>
                  <div className="text-white/80 font-semibold text-lg">
                    Years of Archives
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center group hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center mb-4">
                    <TrendingUp className="w-8 h-8 text-orange-400 mr-2" />
                    <div className="text-5xl font-black text-white group-hover:text-orange-400 transition-colors">
                      2K+
                    </div>
                  </div>
                  <div className="text-white/80 font-semibold text-lg">
                    Active Users
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Enhanced CTA Section */}
        {isAuthenticated ? (
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <div className="mb-8">
                <Sparkles className="w-12 h-12 text-white/80 mx-auto mb-4 animate-pulse" />
                <h2 className="text-4xl font-bold text-white mb-6">
                  Share Your Own Academic Work
                </h2>
                <p className="text-white/90 mb-8 text-xl leading-relaxed">
                  Contribute to the archive by sharing your own final year
                  project or research work with the ENSAM community.
                </p>
              </div>
              <Link href="/upload">
                <Button
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-gray-100 px-10 py-4 rounded-xl shadow-2xl hover:shadow-white/25 transition-all duration-300 hover:scale-105 group text-lg font-semibold"
                >
                  <Upload className="w-6 h-6 mr-3 group-hover:-translate-y-1 transition-transform" />
                  Submit Your Project
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <div className="mb-8">
                <Sparkles className="w-12 h-12 text-white/80 mx-auto mb-4 animate-pulse" />
                <h2 className="text-4xl font-bold text-white mb-6">
                  Ready to explore ENSAM Casablanca&apos;s academic excellence?
                </h2>
                <p className="text-white/90 mb-8 text-xl leading-relaxed">
                  Join PfeArchive today and discover the wealth of knowledge
                  from generations of ENSAM Casablanca students.
                </p>
              </div>
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-gray-100 px-10 py-4 rounded-xl shadow-2xl hover:shadow-white/25 transition-all duration-300 hover:scale-105 text-lg font-semibold"
                >
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Enhanced Footer */}
        <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center gap-2 text-2xl font-bold mb-2">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                  <span>Pfe</span>
                  <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent px-2 py-1 bg-white/10 rounded-lg">
                    Archive
                  </span>
                </div>
                <p className="text-slate-400">
                  A project by ENSAM Casablanca students
                </p>
              </div>
              <div className="text-center text-slate-500 text-sm  border-slate-800 pt-6">
                © {new Date().getFullYear()} PfeArchive. All rights reserved.
                Made with ❤️ by ENSAM Casablanca students.
              </div>
            </div>
            <div className="text-center text-slate-500 text-sm border-t border-slate-800 pt-6"></div>
          </div>
        </footer>
      </main>
    </div>
  );
}
