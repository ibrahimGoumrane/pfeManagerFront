"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Report } from "@/type/report";
import { searchReports } from "@/network/report";
import { ReportCard } from "./report-card";
import { SearchForm } from "./search-form";
import { SearchParams } from "@/type/SearchParams";

export default function SearchReportsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse search params from URL
  const initialParams: SearchParams = {
    keywords: searchParams.get("query") || "",
    tags: searchParams.getAll("tags") || [],
    page: Number.parseInt(searchParams.get("currentPage") || "1"),
  };

  const [params, setParams] = useState<SearchParams>(initialParams);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastReportElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setParams((prev) => ({ ...prev, page: (prev.page || 1) + 1 }));
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  // Function to fetch reports
  const fetchReports = async (newSearch = false) => {
    try {
      setIsLoading(true);
      setError(null);

      const { reports: newReports, hasMoreReports } = await searchReports(
        params.keywords || "",
        params.page || 1,
        params.tags || []
      );
      console.log(newReports);
      console.log(hasMoreReports);

      if (newSearch) {
        setReports(newReports);
      } else {
        setReports((prev) => [...prev, ...newReports]);
      }

      setHasMore(hasMoreReports);
    } catch (err) {
      setError("Failed to load reports. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = (searchParams: SearchParams) => {
    // Reset to page 1 for new searches
    const newParams = { ...searchParams, page: 1 };
    setParams(newParams);

    // Update URL with search params
    const queryParams = new URLSearchParams();
    if (newParams.keywords) queryParams.set("query", newParams.keywords);
    newParams.tags?.forEach((tag) => queryParams.append("tags", tag));

    router.push(`/reports/search?${queryParams.toString()}`);
  };

  // Fetch reports when params change
  useEffect(() => {
    const newSearch = params.page === 1;
    fetchReports(newSearch);
  }, [params]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Search Reports</h1>

      <SearchForm initialParams={params} onSearch={handleSearch} />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Results</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {reports.length === 0 && !isLoading ? (
          <div className="text-center py-8 text-gray-500">
            No reports found. Try adjusting your search criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report, index) => {
              if (reports.length === index + 1) {
                return (
                  <div ref={lastReportElementRef} key={report.id}>
                    <ReportCard report={report} />
                  </div>
                );
              } else {
                return <ReportCard key={report.id} report={report} />;
              }
            })}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
      </div>
    </div>
  );
}
