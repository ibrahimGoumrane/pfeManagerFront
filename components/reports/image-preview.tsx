"use client"

import Image from "next/image"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ImageIcon } from "lucide-react"

interface ImagePreviewProps {
  imageUrl: string
  title: string
}

export function ImagePreview({ imageUrl, title }: ImagePreviewProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-pfebrand hover:bg-pfebrand/10 cursor-pointer hover:text-pfebrand/80"
        >
          <ImageIcon className="h-4 w-4" />
          <span className="sr-only md:not-sr-only md:inline-block">Preview</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center p-4">
          <div className="relative overflow-hidden rounded-md border shadow-md">
            <Image src={imageUrl || "/placeholder.svg"} alt={title} width={600} height={400} className="object-cover" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

