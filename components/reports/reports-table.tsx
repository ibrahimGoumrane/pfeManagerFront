"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReportActions } from "./report-actions";
import { Report } from "@/type/report";
import { ImagePreview } from "./image-preview";
import { PdfDownload } from "./pdf-download";
import { DeleteReport } from "./delete-report";
import { Check, X, Search, Filter, UserRound, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { fetchReports as fetchReportsApi  } from "@/network/report";
import { fetchSectors as fetchSectorsApi  } from "@/network/sector";

interface ReportsTableProps {
  reportId: string;
}

export function ReportsTable({ reportId }: ReportsTableProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "validated" | "not-validated"
  >("all");
  const [filterSector, setFilterSector] = useState<string>("");
  const [availableSectors, setAvailableSectors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true);

  const filteredReports = reports
    .filter(
      (report) =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.user.sector.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((report) => {
      if (filterStatus === "validated") return report.validated;
      if (filterStatus === "not-validated") return !report.validated;
      return true;
    }).filter((report) => {
      if (filterSector === "") return true;
      return report.user.sector.name === filterSector;
    });

  const handleValidationChange = async (id: number, validated: boolean) => {
      // Update the local state if API call succeeds
      setReports(
        reports.map((report) =>
          report.id === +id ? { ...report, validated } : report
        )
      );
  };

  const handleDeleteReport = async (id: number) => {
      // Update the local state if API call succeeds
      setReports(reports.filter((report) => report.id !== +id));
  };
  

  // Fetch reports from the server
  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      
      try {
        const data = await fetchReportsApi();
        setReports(data);
      } catch (err) {
        console.error('Failed to fetch reports:', err);
        toast.error('Failed to load reports', {
          description: 'Using sample data instead. Please try again later.',
        });

      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    async function fetchSectors() {
      try {
        const sectors = await fetchSectorsApi();
        setAvailableSectors(sectors.map((sector) => sector.name));
      } catch (error) {
        console.error("Error fetching sectors:", error);
      }
    }
    fetchSectors();
  }, []);

  return (
    <Card className="shadow-md border-0">
      <CardHeader className="bg-gradient-to-r from-pfebrand/10 to-pfebrand/5 rounded-t-lg">
        <CardTitle className="text-pfebrand/80">All Reports</CardTitle>
        <CardDescription>
          Manage and validate reports submitted by users
        </CardDescription>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-pfebrand" />
            <Input
              placeholder="Search reports, users, or sectors..."
              className="pl-8 border-pfebrand/30 focus-visible:ring-pfebrand/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-pfebrand/30 text-pfebrand/80"
              >
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
                  className={
                    filterStatus === "all" ? "bg-pfebrand/20 text-pfebrand/80" : ""
                  }
                >
                  All Reports
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterStatus("validated")}
                  className={
                    filterStatus === "validated"
                      ? "bg-pfebrand/20 text-pfebrand/80"
                      : ""
                  }
                >
                  Validated Only
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterStatus("not-validated")}
                  className={
                    filterStatus === "not-validated"
                      ? "bg-pfebrand/30 text-pfebrand/80"
                      : ""
                  }
                >
                  Not Validated Only
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filter by Sector</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => setFilterSector("")}
                  className={
                    filterSector === "" ? "bg-pfebrand/30 text-pfebrand/80" : ""
                  }
                >
                  All Sectors
                </DropdownMenuItem>
                {
                  availableSectors.map((sector) => (
                    <DropdownMenuItem
                      key={sector}
                      onClick={() => setFilterSector(sector)}
                      className={
                        filterSector === sector
                          ? "bg-pfebrand/30 text-pfebrand/80"
                          : ""
                      }
                    >
                      {sector}
                    </DropdownMenuItem>
                  ))
                }
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-b-md overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-pfebrand" />
              <span className="ml-2 text-pfebrand/80">Loading reports...</span>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-100">
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Preview</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>PDF</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No reports found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report) => (
                    <TableRow 
                      key={report.id} 
                      className={`border-l-4 border-transparent transition-all hover:bg-pfebrand/30/50 hover:border-pfebg-pfebrand/300/30 ${
                        reportId && report.id === +reportId
                          ? "bg-pfebrand/30 border-l-4 border-pfebg-pfebrand/300 shadow-sm" 
                          : ""
                      }`}
                    >
                      <TableCell className="font-medium">
                        {reportId && report.id === +reportId
                          ? <span className="text-pfebrand">{report.title.slice(0, 30)}{report.title.length > 30 ? "..." : ""}</span> 
                          : <>{report.title.slice(0, 30)}{report.title.length > 30 ? "..." : ""}</>
                        }
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {reportId && report.id === +reportId
                          ? <span className="text-pfebrand">{report.description}</span>
                          : report.description
                        }
                      </TableCell>
                      <TableCell>
                        <ImagePreview
                          imageUrl={report.preview}
                          title={report.title}
                        />
                      </TableCell>
                      <TableCell>
                        {report.validated ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <Check className="mr-1 h-3 w-3" />
                            Validated
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-red-50 text-red-800 hover:bg-red-50"
                          >
                            <X className="mr-1 h-3 w-3" />
                            Not Validated
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/users/${report.user.id}`}
                          className={`flex items-center gap-1 text-sm ${
                            reportId && report.id === +reportId
                              ? "text-pfebrand hover:text-pfebrand/80"
                              : "text-pfebrand hover:text-pfebrand/80"
                          } hover:underline`}
                        >
                          <UserRound className="h-3 w-3" />
                          {report.user.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {reportId && report.id === +reportId
                          ? <span className="text-pfebrand">{report.user.sector.name}</span>
                          : report.user.sector.name
                        }
                      </TableCell>
                      <TableCell>
                        <PdfDownload pdfUrl={report.url} title={report.title} />
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2 justify-between">
                          <ReportActions
                            report={report}
                            onValidationChange={handleValidationChange}
                          />
                          <DeleteReport
                            report={report}
                            onDelete={handleDeleteReport}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}