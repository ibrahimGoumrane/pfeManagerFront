import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Report } from "@/types/reports";
import { FileText, Calendar, User, ExternalLink } from "lucide-react";

// Set your backend URL here - could be imported from environment configuration
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

interface ReportCardProps {
  report: Report;
}

export function ReportCard({ report }: ReportCardProps) {
  // Format the preview URL to ensure it's an absolute URL or starts with /
  const getPreviewUrl = () => {
    if (!report.preview) {
      return "/placeholder.svg?height=160&width=320";
    }

    // If the URL already starts with http:// or https://, use it directly
    if (
      report.preview.startsWith("http://") ||
      report.preview.startsWith("https://")
    ) {
      return report.preview;
    }

    // Make sure the path always starts with a slash for proper joining
    const normalizedPath = report.preview.startsWith("/")
      ? report.preview
      : `/${report.preview}`;

    // If the URL already includes /storage, just prepend the backend URL
    if (normalizedPath.includes("/storage/")) {
      return `${BACKEND_URL}${normalizedPath}`;
    }

    // Otherwise, prepend the full path
    return `${BACKEND_URL}/storage${normalizedPath}`;
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden border-gray-200 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2 space-y-2">
        <div className="relative w-full h-40 mb-2 overflow-hidden rounded-md">
          <Image
            src={getPreviewUrl()}
            unoptimized
            alt={report.title}
            fill
            className="object-cover rounded-md hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardTitle className="line-clamp-2 text-gray-900">
          {report.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-500 line-clamp-3 mb-4">
          {report.description}
        </p>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <User className="h-4 w-4 mr-2 text-pfebrand/70" />
            <span className="text-gray-700">
              {report.user.name || "Unknown Author"}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-pfebrand/70" />
            <span className="text-gray-700">
              {format(new Date(report.created_at), "MMM d, yyyy")}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t border-gray-100">
        {report.validated ? (
          <Badge className="bg-pfebrand/10 text-pfebrand hover:bg-pfebrand/15">
            Validated
          </Badge>
        ) : (
          <Badge variant="outline" className="border-pfebrand/20 text-pfebrand">
            Pending
          </Badge>
        )}
        <Link
          href={`/reports/${report.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm text-pfebrand hover:text-pfebrand/80 hover:underline"
        >
          <FileText className="h-4 w-4 mr-1" />
          View Report
          <ExternalLink className="h-3 w-3 ml-1" />
        </Link>
      </CardFooter>
    </Card>
  );
}
