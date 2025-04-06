'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchReport } from "@/network/report";
import { Report } from "@/type/report";
import { Tag } from "@/type/tag";

export default function ReportDetailsPage() {
  const { id } = useParams(); // Get the report ID from the URL
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl w-full text-center">
          <h2 className="text-red-600 text-xl font-semibold mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={handleBackClick}
            className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-2xl w-full text-center">
          <h2 className="text-gray-700 text-xl font-semibold mb-2">Report Not Found</h2>
          <p className="text-gray-600">The requested report could not be found.</p>
          <button
            onClick={handleBackClick}
            className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
          >
            Go Back
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={handleBackClick}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to Reports
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column - PDF Viewer */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-lg font-semibold text-gray-700 p-6 border-b border-gray-200">
            Report Document
          </h2>
          <div className="relative h-[600px] w-full border border-gray-200 rounded-lg overflow-hidden">
            <iframe
              src={report.url}
              className="w-full h-full"
              title="Report PDF"
            ></iframe>
          </div>
        </div>

        {/* Right column - Report Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            {report.title}
          </h1>

          {/* Tags */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500">Tags</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {report.tags && report.tags.length > 0 ? (
                report.tags.map((tag: Tag, index: number) => (
                                  <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                  >
                                    {tag.name}
                                  </span>
                                ))
              ) : (
                <p className="text-gray-500">No tags available</p>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500">Created by</h3>
            {report.user ? (
              <>
                <p className="text-gray-900">{report.user.name || "Unknown"}</p>
                <p className="text-gray-500">{report.user.email || "No email provided"}</p>
              </>
            ) : (
              <p className="text-gray-500">User information not available</p>
            )}
          </div>

          {/* Timestamps */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500">Timestamps</h3>
            <p className="text-gray-900">
              <span className="font-medium">Created:</span>{" "}
              {formattedDate(report.created_at)}
            </p>
            <p className="text-gray-900">
              <span className="font-medium">Last updated:</span>{" "}
              {formattedDate(report.updated_at)}
            </p>
          </div>

          {/* Validation Status */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">Validation Status</h3>
            <div
              className={`px-3 py-1 mt-2 rounded-full text-sm font-medium ${
                report.validated
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {report.validated ? "Validated" : "Pending Validation"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}