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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-pfebrand">
          Search Reports
        </h1>
        <p className="text-muted-foreground">
          Find final year project reports by keywords, tags, and more.
        </p>
      </div>

      <SearchForm initialParams={params} onSearch={handleSearch} />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          {reports.length > 0 ? `Results (${reports.length})` : "Results"}
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-800 px-4 py-3 rounded-lg mb-6 shadow-sm">
            {error}
          </div>
        )}

        {reports.length === 0 && !isLoading ? (
          <div className="text-center py-12 px-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <p className="text-muted-foreground">
              No reports found. Try adjusting your search criteria.
            </p>
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
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pfebrand"></div>
          </div>
        )}

        {!isLoading && reports.length > 0 && !hasMore && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              End of results. No more reports to load.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
