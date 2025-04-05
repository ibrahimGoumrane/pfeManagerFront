"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { imageAddress } from "@/config/main";
interface PdfDownloadProps {
  pdfUrl: string;
  title: string;
}

export function PdfDownload({ pdfUrl, title }: PdfDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
  
    try {
      const fullUrl = imageAddress + pdfUrl;
  
      // Open the file in a new tab
      window.open(fullUrl, "_blank");
      toast.success("Opening and downloading PDF", {
        description: `${title} opened in a new tab.`,
      });
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Download failed", {
        description:
          "There was a problem downloading the file. Please try again.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
            className="text-pfebrand hover:bg-pfebrand/15 cursor-pointer hover:text-pfebrand/80"
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="h-4 w-4" />
            )}
            <span className="sr-only">Download PDF</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Download {title} PDF</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
