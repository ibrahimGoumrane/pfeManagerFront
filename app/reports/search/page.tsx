"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Report } from "@/type/report";
import { searchReports } from "@/network/report";
import { ReportCard } from "./report-card";
import { SearchForm } from "./search-form";
import type { SearchParams } from "@/type/SearchParams";
import { Search, Filter, Grid, List, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

type ViewMode = "grid" | "list";
type SortOrder = "newest" | "oldest" | "title-asc" | "title-desc";

export default function SearchReportsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, loading } = useAuth();
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
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

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
        setTotalResults(newReports.length);
      } else {
        setReports((prev) => [...prev, ...newReports]);
        setTotalResults((prev) => prev + newReports.length);
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

  // Sort reports
  const sortReports = (reports: Report[], order: SortOrder): Report[] => {
    return [...reports].sort((a, b) => {
      switch (order) {
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  };

  // Fetch reports when params change
  useEffect(() => {
    const newSearch = params.page === 1;
    fetchReports(newSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const sortedReports = sortReports(reports, sortOrder);
  const hasActiveFilters =
    params.keywords || (params.tags && params.tags.length > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-16 z-40">
        <div className="container mx-auto py-8 px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  Search Reports
                </h1>
              </div>
              <p className="text-gray-600 text-lg">
                Discover final year project reports from ENSAM Casablanca
                students
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Search Stats */}
              {totalResults > 0 && (
                <Badge
                  variant="secondary"
                  className="px-4 py-2 text-sm font-medium"
                >
                  {totalResults} {totalResults === 1 ? "result" : "results"}{" "}
                  found
                </Badge>
              )}
              {hasActiveFilters && (
                <Badge className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200">
                  Filters active
                </Badge>
              )}

              {isAuthenticated && (
                <Button
                  onClick={() => router.push("/upload")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Create Report
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 sm:px-6">
        {/* Search Form */}
        <div className="mb-8">
          <SearchForm initialParams={params} onSearch={handleSearch} />
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <Badge className="ml-1 h-4 w-4 p-0 bg-blue-500" />
              )}
            </Button>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap">
                {params.keywords && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    &quot;{params.keywords}&quot;
                  </Badge>
                )}
                {params.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-none border-0 px-3"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-none border-0 px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Error State */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="flex items-center gap-3 p-6">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-800">
                    Error loading reports
                  </h3>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {reports.length === 0 && !isLoading && !error && (
            <Card className="border-gray-200">
              <CardContent className="text-center py-16 px-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No reports found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  We couldn&apos;t find any reports matching your search
                  criteria. Try adjusting your filters or search terms.
                </p>
                <Button
                  variant="outline"
                  onClick={() =>
                    handleSearch({ keywords: "", tags: [], page: 1 })
                  }
                  className="border-gray-300 hover:bg-gray-50"
                >
                  Clear all filters
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Results Grid/List */}
          {sortedReports.length > 0 && (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {sortedReports.map((report, index) => {
                if (sortedReports.length === index + 1) {
                  return (
                    <div ref={lastReportElementRef} key={report.id}>
                      <ReportCard report={report} viewMode={viewMode} />
                    </div>
                  );
                } else {
                  return (
                    <ReportCard
                      key={report.id}
                      report={report}
                      viewMode={viewMode}
                    />
                  );
                }
              })}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="flex items-center gap-3 text-gray-600">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="font-medium">Loading reports...</span>
              </div>
            </div>
          )}

          {/* End of Results */}
          {!isLoading && reports.length > 0 && !hasMore && (
            <Card className="border-gray-200 bg-gray-50">
              <CardContent className="text-center py-8">
                <p className="text-gray-600 font-medium">
                  You&apos;ve reached the end of the results
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Showing all {totalResults}{" "}
                  {totalResults === 1 ? "report" : "reports"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
