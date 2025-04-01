"use client";

import { useState } from "react";
import { SearchForm } from "@/components/search-form";
import { ReportCard } from "@/components/report-card";
import { Report } from "@/type/report";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { searchReports } from "@/network/report";
import { SearchParams } from "@/type/SearchParams";
export default function SearchPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 6;

  // Filter reports based on search criteria
  const handleSearch = async (searchParams: SearchParams) => {
    try {
      // Reset to first page when performing a new search
      setCurrentPage(1);

      // Convert the searchParams object to match the API requirements
      // Use keywords as the main query parameter
      const response = await searchReports(
        searchParams.keywords || "",
        searchParams.page || 1,
        searchParams.tags || []
      );

      setReports(response.reports);
    } catch (error) {
      console.error("Error searching reports:", error);
      setReports([]);
    }
  };

  // Toggle favorite status
  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Pagination logic
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(reports.length / reportsPerPage);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">FYP Reports Search</h1>

      <SearchForm onSearch={handleSearch} />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          Search Results ({reports.length} reports found)
        </h2>

        {reports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No reports found matching your search criteria.
          </div>
        ) : (
          <div className="grid gap-6">
            {currentReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                isFavorite={favorites.includes(report.id)}
                onToggleFavorite={() => toggleFavorite(report.id)}
              />
            ))}
          </div>
        )}

        {reports.length > reportsPerPage && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}

export { SearchPage };
