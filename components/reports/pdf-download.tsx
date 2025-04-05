"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FileDown, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { fetchData } from "@/network/main"

interface PdfDownloadProps {
  pdfUrl: string
  title: string
}

export function PdfDownload({ pdfUrl, title }: PdfDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    
    try {
      // Fetch the PDF file
      const response = await fetchData<Response>(pdfUrl) as Response;
      
      if (!response.ok) {
        throw new Error(`Failed to download: ${response.statusText}`)
      }
      
      // Convert to blob
      const blob = await response.blob()
      
      // Create a blob URL
      const blobUrl = URL.createObjectURL(blob)
      
      // Create an anchor element and set properties
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf` // Sanitize filename
      
      // Append to the document, click and remove
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Revoke the blob URL to free memory
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100)
      
      toast.success("Download started", {
        description: `${title} is being downloaded to your device.`
      })
    } catch (error) {
      console.error("Download error:", error)
      toast.error("Download failed", {
        description: "There was a problem downloading the file. Please try again."
      })
    } finally {
      setIsDownloading(false)
    }
  }

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
  )
}