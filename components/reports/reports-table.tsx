"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ReportActions } from "./report-actions"
import { ImagePreview } from "./image-preview"
import { PdfDownload } from "./pdf-download"
import { DeleteReport } from "./delete-report"
import { Check, X, Search, Filter, UserRound } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data - replace with actual data fetching
const mockReports = [
  {
    id: "1",
    title: "Q1 Financial Report",
    description: "Quarterly financial analysis for Q1 2023",
    previewUrl: "/placeholder.svg?height=200&width=300",
    pdfUrl: "/sample.pdf",
    validated: true,
    userId: "user1",
    userName: "John Doe",
    userEmail: "john@example.com",
    sectorId: "sector1",
    sectorName: "Finance",
    createdAt: "2023-04-15T10:30:00Z",
  },
  {
    id: "2",
    title: "Security Incident Report",
    description: "Analysis of recent security breach attempt",
    previewUrl: "/placeholder.svg?height=200&width=300",
    pdfUrl: "/sample.pdf",
    validated: false,
    userId: "user2",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    sectorId: "sector2",
    sectorName: "IT Security",
    createdAt: "2023-04-10T14:20:00Z",
  },
  {
    id: "3",
    title: "Annual Compliance Report",
    description: "Yearly compliance status and recommendations",
    previewUrl: "/placeholder.svg?height=200&width=300",
    pdfUrl: "/sample.pdf",
    validated: true,
    userId: "user3",
    userName: "Robert Johnson",
    userEmail: "robert@example.com",
    sectorId: "sector3",
    sectorName: "Legal",
    createdAt: "2023-03-28T09:15:00Z",
  },
  {
    id: "4",
    title: "Market Research Analysis",
    description: "Competitive landscape and market opportunities",
    previewUrl: "/placeholder.svg?height=200&width=300",
    pdfUrl: "/sample.pdf",
    validated: false,
    userId: "user1",
    userName: "John Doe",
    userEmail: "john@example.com",
    sectorId: "sector1",
    sectorName: "Finance",
    createdAt: "2023-03-20T16:45:00Z",
  },
  {
    id: "5",
    title: "Product Development Roadmap",
    description: "Strategic plan for upcoming product features",
    previewUrl: "/placeholder.svg?height=200&width=300",
    pdfUrl: "/sample.pdf",
    validated: true,
    userId: "user4",
    userName: "Sarah Williams",
    userEmail: "sarah@example.com",
    sectorId: "sector4",
    sectorName: "Product",
    createdAt: "2023-03-15T11:00:00Z",
  },
]

export function ReportsTable() {
  const [reports, setReports] = useState(mockReports)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "validated" | "not-validated">("all")

  const filteredReports = reports
    .filter(
      (report) =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.sectorName.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((report) => {
      if (filterStatus === "all") return true
      if (filterStatus === "validated") return report.validated
      if (filterStatus === "not-validated") return !report.validated
      return true
    })

  const handleValidationChange = (id: string, validated: boolean) => {
    setReports(reports.map((report) => (report.id === id ? { ...report, validated } : report)))
  }

  const handleDeleteReport = (id: string) => {
    setReports(reports.filter((report) => report.id !== id))
  }

  return (
    <Card className="shadow-md border-0">
      <CardHeader className="bg-gradient-to-r from-pfebrand/10 to-pfebrand/5  rounded-t-lg">
        <CardTitle className="text-pfebrand">All Reports</CardTitle>
        <CardDescription>Manage and validate reports submitted by users</CardDescription>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports, users, or sectors..."
              className="pl-8 border-pfebrand/20 focus-visible:ring-pfebrand/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 border-pfebrand/20 text-pfebrand">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => setFilterStatus("all")}
                  className={filterStatus === "all" ? "bg-pfebrand/10 text-pfebrand" : ""}
                >
                  All Reports
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterStatus("validated")}
                  className={filterStatus === "validated" ? "bg-pfebrand/10 text-pfebrand" : ""}
                >
                  Validated Only
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterStatus("not-validated")}
                  className={filterStatus === "not-validated" ? "bg-pfebrand/10 text-pfebrand" : ""}
                >
                  Not Validated Only
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-b-md overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-100">
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Preview</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>User</TableHead>
                <TableHead>PDF</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No reports found
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => (
                  <TableRow key={report.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{report.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{report.description}</TableCell>
                    <TableCell>
                      <ImagePreview imageUrl={report.previewUrl} title={report.title} />
                    </TableCell>
                    <TableCell>
                      {report.validated ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          <Check className="mr-1 h-3 w-3" />
                          Validated
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-800 hover:bg-red-50">
                          <X className="mr-1 h-3 w-3" />
                          Not Validated
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/users?id=${report.userId}`}
                        className="flex items-center gap-1 text-sm text-pfebrand hover:text-pfebrand/80 hover:underline"
                      >
                        <UserRound className="h-3 w-3" />
                        {report.userName}
                        <span className="text-xs text-slate-500">({report.sectorName})</span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <PdfDownload pdfUrl={report.pdfUrl} title={report.title} />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2 justify-between">
                        <ReportActions report={report} onValidationChange={handleValidationChange} />
                        <DeleteReport report={report} onDelete={handleDeleteReport} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

