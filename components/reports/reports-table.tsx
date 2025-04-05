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



export function ReportsTable() {
  const [reports, setReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "validated" | "not-validated"
  >("all");
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <Card className="shadow-md border-0">
      <CardHeader className="bg-gradient-to-r from-indigo-600/10 to-indigo-600/5 rounded-t-lg">
        <CardTitle className="text-indigo-700">All Reports</CardTitle>
        <CardDescription>
          Manage and validate reports submitted by users
        </CardDescription>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports, users, or sectors..."
              className="pl-8 border-indigo-600/20 focus-visible:ring-indigo-600/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-indigo-600/20 text-indigo-700"
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
                    filterStatus === "all" ? "bg-indigo-50 text-indigo-700" : ""
                  }
                >
                  All Reports
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterStatus("validated")}
                  className={
                    filterStatus === "validated"
                      ? "bg-indigo-50 text-indigo-700"
                      : ""
                  }
                >
                  Validated Only
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterStatus("not-validated")}
                  className={
                    filterStatus === "not-validated"
                      ? "bg-indigo-50 text-indigo-700"
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
                {/* You would dynamically generate these based on available sectors */}
                <DropdownMenuItem onClick={() => setSearchTerm("Finance")}>
                  Finance
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchTerm("IT Security")}>
                  IT Security
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchTerm("Legal")}>
                  Legal
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchTerm("Product")}>
                  Product
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-b-md overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <span className="ml-2 text-indigo-700">Loading reports...</span>
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
                    <TableRow key={report.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium">
                        {report.title.slice(0, 30)}
                        {report.title.length > 30 ? "..." : ""}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {report.description}

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
                          href={`/admin/users?id=${report.user.id}`}
                          className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                          <UserRound className="h-3 w-3" />
                          {report.user.name}
                        </Link>
                      </TableCell>
                      <TableCell>{report.user.sector.name}</TableCell>
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