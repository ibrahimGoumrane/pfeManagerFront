"use client"

import { useState } from "react"
import { SearchForm } from "@/components/search-form"
import { ReportCard } from "@/components/report-card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Define types
export type Report = {
  id: string
  title: string
  abstract: string
  sector: string
  tags: string[]
  date: string
  imageUrl: string
  isFavorite: boolean
}

export default function SearchPage() {
  const [reports, setReports] = useState<Report[]>(sampleReports)
  const [favorites, setFavorites] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const reportsPerPage = 6

  // Filter reports based on search criteria
  const handleSearch = (searchParams: any) => {
    let filteredReports = [...sampleReports]

    // Filter by keywords in title or abstract
    if (searchParams.keywords) {
      const keywords = searchParams.keywords.toLowerCase()
      filteredReports = filteredReports.filter(
        (report) => report.title.toLowerCase().includes(keywords) || report.abstract.toLowerCase().includes(keywords),
      )
    }

    // Filter by sector
    if (searchParams.sector) {
      filteredReports = filteredReports.filter((report) => report.sector === searchParams.sector)
    }

    // Filter by tags
    if (searchParams.tags && searchParams.tags.length > 0) {
      filteredReports = filteredReports.filter((report) =>
        searchParams.tags.some((tag: string) => report.tags.includes(tag)),
      )
    }

    // Filter by date range
    if (searchParams.fromDate) {
      filteredReports = filteredReports.filter((report) => new Date(report.date) >= new Date(searchParams.fromDate))
    }

    if (searchParams.toDate) {
      filteredReports = filteredReports.filter((report) => new Date(report.date) <= new Date(searchParams.toDate))
    }

    setReports(filteredReports)
    setCurrentPage(1)
  }

  // Toggle favorite status
  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }

  // Pagination logic
  const indexOfLastReport = currentPage * reportsPerPage
  const indexOfFirstReport = indexOfLastReport - reportsPerPage
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport)
  const totalPages = Math.ceil(reports.length / reportsPerPage)

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">FYP Reports Search</h1>

      <SearchForm onSearch={handleSearch} />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Search Results ({reports.length} reports found)</h2>

        {reports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No reports found matching your search criteria.</div>
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
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page}>
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}

// Sample data for demonstration
const sampleReports: Report[] = [
  {
    id: "1",
    title: "Machine Learning Approaches for Predicting Student Performance",
    abstract:
      "This research explores various machine learning algorithms to predict student academic performance based on historical data and behavioral patterns.",
    sector: "Education",
    tags: ["Machine Learning", "Education", "Data Analysis"],
    date: "2023-05-15",
    imageUrl: "/placeholder.svg?height=200&width=300",
    isFavorite: false,
  },
  {
    id: "2",
    title: "Sustainable Urban Planning: A Case Study of Singapore",
    abstract:
      "An analysis of Singapore's approach to sustainable urban planning, focusing on green infrastructure, public transportation, and energy efficiency.",
    sector: "Urban Planning",
    tags: ["Sustainability", "Urban Planning", "Case Study"],
    date: "2023-04-22",
    imageUrl: "/placeholder.svg?height=200&width=300",
    isFavorite: false,
  },
  {
    id: "3",
    title: "Blockchain Technology in Supply Chain Management",
    abstract:
      "This study examines the implementation of blockchain technology in supply chain management to enhance transparency, traceability, and efficiency.",
    sector: "Technology",
    tags: ["Blockchain", "Supply Chain", "Technology"],
    date: "2023-06-10",
    imageUrl: "/placeholder.svg?height=200&width=300",
    isFavorite: false,
  },
  {
    id: "4",
    title: "The Impact of Social Media on Mental Health Among Young Adults",
    abstract:
      "A comprehensive analysis of how social media usage affects the mental health and well-being of young adults aged 18-25.",
    sector: "Psychology",
    tags: ["Social Media", "Mental Health", "Psychology"],
    date: "2023-03-18",
    imageUrl: "/placeholder.svg?height=200&width=300",
    isFavorite: false,
  },
  {
    id: "5",
    title: "Renewable Energy Integration in Developing Countries",
    abstract:
      "This research investigates the challenges and opportunities of integrating renewable energy sources in developing countries' power grids.",
    sector: "Energy",
    tags: ["Renewable Energy", "Sustainability", "Development"],
    date: "2023-07-05",
    imageUrl: "/placeholder.svg?height=200&width=300",
    isFavorite: false,
  },
  {
    id: "6",
    title: "Artificial Intelligence in Healthcare Diagnostics",
    abstract:
      "An exploration of how artificial intelligence and machine learning are revolutionizing healthcare diagnostics and improving patient outcomes.",
    sector: "Healthcare",
    tags: ["AI", "Healthcare", "Diagnostics"],
    date: "2023-02-28",
    imageUrl: "/placeholder.svg?height=200&width=300",
    isFavorite: false,
  },
  {
    id: "7",
    title: "Cybersecurity Frameworks for Critical Infrastructure",
    abstract:
      "This study evaluates various cybersecurity frameworks designed to protect critical infrastructure from emerging threats and vulnerabilities.",
    sector: "Security",
    tags: ["Cybersecurity", "Infrastructure", "Security"],
    date: "2023-08-12",
    imageUrl: "/placeholder.svg?height=200&width=300",
    isFavorite: false,
  },
  {
    id: "8",
    title: "The Economics of Circular Economy Business Models",
    abstract:
      "An analysis of circular economy business models and their economic viability, sustainability impact, and implementation challenges.",
    sector: "Business",
    tags: ["Circular Economy", "Business Models", "Sustainability"],
    date: "2023-01-20",
    imageUrl: "/placeholder.svg?height=200&width=300",
    isFavorite: false,
  },
  {
    id: "9",
    title: "Natural Language Processing for Sentiment Analysis in Customer Reviews",
    abstract:
      "This research applies natural language processing techniques to analyze sentiment in customer reviews for business intelligence and product improvement.",
    sector: "Technology",
    tags: ["NLP", "Sentiment Analysis", "Data Science"],
    date: "2023-09-05",
    imageUrl: "/placeholder.svg?height=200&width=300",
    isFavorite: false,
  },
  {
    id: "10",
    title: "Urban Agriculture: Solutions for Food Security in Metropolitan Areas",
    abstract:
      "An investigation into urban agriculture practices and their potential to address food security challenges in densely populated metropolitan areas.",
    sector: "Agriculture",
    tags: ["Urban Agriculture", "Food Security", "Sustainability"],
    date: "2023-10-18",
    imageUrl: "/placeholder.svg?height=200&width=300",
    isFavorite: false,
  },
]

export { SearchPage }

