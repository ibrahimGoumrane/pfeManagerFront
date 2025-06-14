"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { imageAddress } from "@/config/main";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Report } from "@/type/report";
import {
  FileText,
  Calendar,
  User,
  ExternalLink,
  CheckCircle,
  Clock,
  BookOpen,
} from "lucide-react";

interface ReportCardProps {
  report: Report;
  viewMode?: "grid" | "list";
}

export function ReportCard({ report, viewMode = "grid" }: ReportCardProps) {
  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-300 group">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="relative w-full md:w-48 h-48 md:h-auto overflow-hidden">
            <Image
              src={imageAddress + report.preview || "/placeholder.svg"}
              unoptimized
              alt={report.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6">
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {report.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 ml-4">
                    {report.validated ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Validated
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-orange-200 text-orange-700 flex items-center gap-1"
                      >
                        <Clock className="w-3 h-3" />
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                  {report.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center text-sm text-gray-700">
                    <User className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="font-medium">
                      {report.user.name || "Unknown Author"}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                    <span>
                      {format(new Date(report.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-gray-100">
                <Link
                  href={`/reports/${report.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200">
                    <BookOpen className="w-4 h-4 mr-2" />
                    View Report
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-blue-300 hover:-translate-y-1 group bg-white">
      <CardHeader className="pb-3 space-y-3">
        <div className="relative w-full h-48 overflow-hidden rounded-lg">
          <Image
            src={imageAddress + report.preview || "/placeholder.svg"}
            unoptimized
            alt={report.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 right-3">
            {report.validated ? (
              <Badge className="bg-green-500 text-white shadow-lg">
                <CheckCircle className="w-3 h-3 mr-1" />
                Validated
              </Badge>
            ) : (
              <Badge className="bg-orange-500 text-white shadow-lg">
                <Clock className="w-3 h-3 mr-1" />
                Pending
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors font-bold">
          {report.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow pb-4">
        <p className="text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed">
          {report.description}
        </p>
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {report.user.name || "Unknown Author"}
              </p>
              <p className="text-xs text-gray-500">Author</p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <Calendar className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {format(new Date(report.created_at), "MMM d, yyyy")}
              </p>
              <p className="text-xs text-gray-500">Published</p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-end w-full gap-3">
          <Link
            href={`/reports/${report.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 group">
              <FileText className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              View Report
              <ExternalLink className="w-3 h-3 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
