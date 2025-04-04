"use client"

import { Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { Report } from "@/components/reports/delete-report"

interface ReportCardProps {
  report: Report
  isFavorite: boolean
  onToggleFavorite: () => void
}

export function ReportCard({ report, isFavorite, onToggleFavorite }: ReportCardProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
      <div className="md:w-1/4 flex-shrink-0">
        <Image
          src={report.previewUrl || "/placeholder.svg"}
          alt={`Preview for ${report.title}`}
          width={300}
          height={200}
          className="w-full h-auto rounded-md object-cover aspect-video"
        />
      </div>

      <div className="md:w-3/4 flex flex-col">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold">{report.title}</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFavorite}
            className="flex-shrink-0"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
        </div>

        <div className="text-sm text-muted-foreground mt-1">
          {report.sectorName} 
        </div>

        <p className="mt-2 line-clamp-3">{report.description}</p>

        <div className="mt-auto pt-3 flex flex-wrap gap-2">
          {report.tags?.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

