'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchReport } from "@/network/report";
import { Report } from "@/type/report";
import { Tag } from "@/type/tag";
import { imageAddress } from "@/config/main";

export default function ReportDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadReport = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchReport(Number(id));
        setReport(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "Failed to fetch report details");
      } finally {
        setIsLoading(false);
      }
    };

    loadReport();
  }, [id]);

  const handleBackClick = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading report data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white border-l-4 border-red-500 rounded-lg p-8 max-w-2xl w-full shadow-lg">
          <div className="flex items-center mb-4">
            <svg className="h-8 w-8 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-800">Error Loading Report</h2>
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBackClick}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Return to Reports
          </button>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white border-l-4 border-yellow-400 rounded-lg p-8 max-w-2xl w-full shadow-lg">
          <div className="flex items-center mb-4">
            <svg className="h-8 w-8 text-yellow-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-800">Report Not Found</h2>
          </div>
          <p className="text-gray-600 mb-6">The requested report could not be found or may have been deleted.</p>
          <button
            onClick={handleBackClick}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Return to Reports
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header area with breadcrumbs */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  <li>
                    <button
                      onClick={handleBackClick}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Reports
                    </button>
                  </li>
                  <li className="flex items-center">
                    <svg className="flex-shrink-0 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-2 font-medium text-gray-800">Report Details</span>
                  </li>
                </ol>
              </nav>
              <h1 className="mt-3 text-3xl font-bold text-gray-900 tracking-tight">{report.title}</h1>
            </div>
            <div className="mt-4 sm:mt-0">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  report.validated
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                <span className={`mr-1.5 h-2 w-2 rounded-full ${report.validated ? "bg-green-600" : "bg-yellow-500"}`}></span>
                {report.validated ? "Validated" : "Pending Validation"}
              </div>
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Report Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Report Information</h2>
                
                {/* Metadata sections */}
                <div className="space-y-6">
                  {/* Tags */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                      <svg className="mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {report.tags && report.tags.length > 0 ? (
                        report.tags.map((tag: Tag, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-sm"
                          >
                            {tag.name}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm italic">No tags available</p>
                      )}
                    </div>
                  </div>

                  {/* Author */}
                  <div className="pt-5 border-t border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                      <svg className="mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      Created by
                    </h3>
                    {report.user ? (
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 font-medium">
                            {report.user.name ? report.user.name.charAt(0).toUpperCase() : "U"}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{report.user.name || "Unknown"}</p>
                          <p className="text-xs text-gray-500">{report.user.email || "No email provided"}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm italic">User information not available</p>
                    )}
                  </div>

                  {/* Timestamps */}
                  <div className="pt-5 border-t border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                      <svg className="mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Timestamps
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Created:</span>
                        <span className="text-gray-900">{formattedDate(report.created_at)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Last updated:</span>
                        <span className="text-gray-900">{formattedDate(report.updated_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Report ID */}
                  <div className="pt-5 border-t border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                      <svg className="mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                      Report ID
                    </h3>
                    <p className="text-sm font-mono bg-gray-50 py-1 px-2 rounded border border-gray-200">{report.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - PDF Viewer */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  Report Document
                </h2>
                <a
                  href={imageAddress + report.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  <svg className="mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Download
                </a>
              </div>
              <div className="p-4">
                <div className="relative h-[700px] w-full border border-gray-200 rounded-lg overflow-hidden bg-gray-100">
                  <iframe
                    src={imageAddress + report.url}
                    className="w-full h-full"
                    title="Report PDF"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}