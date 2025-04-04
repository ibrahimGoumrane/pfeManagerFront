"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FileDown } from "lucide-react"

interface PdfDownloadProps {
  pdfUrl: string
  title: string
}

export function PdfDownload({ pdfUrl, title }: PdfDownloadProps) {
  const handleDownload = () => {
    // In a real app, this would trigger the download
    // For demo purposes, we'll just open the URL in a new tab
    window.open(pdfUrl, "_blank")
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="text-pfebrand hover:bg-pfebrand/10 cursor-pointer hover:text-pfebrand/80"
          >
            <FileDown className="h-4 w-4" />
            <span className="sr-only">Download PDF</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Download {title} PDF</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

