"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { imageAddress } from "@/config/main";
import { fetchReport } from "@/network/report";
import type { Report } from "@/type/report";
import type { Tag } from "@/type/tag";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Home,
  Loader2,
  Share2,
  TagIcon,
  User,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReportDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    if (!id) return;

    const loadReport = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchReport(Number(id));
        setReport(data);
        // Simulate view count increment
        setViewCount(Math.floor(Math.random() * 1000) + 100);
      } catch (err) {
        setError((err as Error).message || "Failed to fetch report details");
      } finally {
        setIsLoading(false);
      }
    };

    loadReport();
  }, [id]);

  const handleBackClick = () => {
    router.back();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: report?.title,
          text: report?.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
          <CardContent className="flex flex-col items-center justify-center py-16 px-8">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
              Loading Report
            </h3>
            <p className="text-gray-600 text-center">
              Please wait while we fetch the report details...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-6 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl border-0 shadow-2xl bg-white/90 backdrop-blur-xl">
          <CardContent className="p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Error Loading Report
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleBackClick}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to Reports
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl border-0 shadow-2xl bg-white/90 backdrop-blur-xl">
          <CardContent className="p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Report Not Found
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                The requested report could not be found or may have been
                deleted.
              </p>
              <Button
                onClick={handleBackClick}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-sm mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="text-gray-600 hover:text-blue-600"
            >
              <Home className="w-4 h-4 mr-1" />
              Home
            </Button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/reports/search")}
              className="text-gray-600 hover:text-blue-600"
            >
              Reports
            </Button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">Report Details</span>
          </nav>

          {/* Header Content */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                    {report.title}
                  </h1>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{viewCount} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(report.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Badge
                className={`px-4 py-2 text-sm font-semibold flex items-center gap-2 ${
                  report.validated
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-orange-100 text-orange-800 border-orange-200"
                }`}
              >
                {report.validated ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
                {report.validated ? "Validated" : "Pending"}
              </Badge>

              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="border-gray-300"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>

              <Button
                asChild
                className="bg-blue-600 hover:bg-blue-700 shadow-lg"
              >
                <a
                  href={imageAddress + report.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Sidebar - Report Information */}
          <div className="xl:col-span-1 space-y-6">
            {/* Author Information */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="w-5 h-5 text-blue-600" />
                  Author
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                {report.user ? (
                  <div className="flex items-center gap-4">
                    <span className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg overflow-hidden">
                      {report.user.name
                        ? report.user.name.charAt(0).toUpperCase()
                        : "U"}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {report.user.name || "Unknown"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {report.user.email || "No email provided"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    User information not available
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TagIcon className="w-5 h-5 text-blue-600" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                {report.tags && report.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {report.tags.map((tag: Tag, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors px-3 py-1"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No tags available</p>
                )}
              </CardContent>
            </Card>

            {/* Report Details */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Report ID</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      #{report.id}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Created</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(report.created_at)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Last Updated</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(report.updated_at)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {report.description && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {report.description}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content - PDF Viewer */}
          <div className="xl:col-span-3">
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    Report Document
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                      <a
                        href={imageAddress + report.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open in New Tab
                      </a>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative">
                  <div className="aspect-[4/5] w-full bg-gray-100 rounded-b-lg overflow-hidden">
                    <iframe
                      src={imageAddress + report.url}
                      className="w-full h-full border-0"
                      title="Report PDF"
                      loading="lazy"
                    />
                  </div>
                  {/* Loading overlay for iframe */}
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center pointer-events-none opacity-0 transition-opacity duration-300">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                      <p className="text-gray-600 font-medium">
                        Loading document...
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
