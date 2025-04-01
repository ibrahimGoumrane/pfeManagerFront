"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { X, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import type { SearchParams } from "@/types/reports"

// Sample sectors - replace with your actual data
const sectors = ["Technology", "Healthcare", "Finance", "Education", "Manufacturing", "Retail", "Energy", "Other"]

// Sample tags - replace with your actual data
const availableTags = [
  "Annual",
  "Quarterly",
  "Financial",
  "Research",
  "Market Analysis",
  "Sustainability",
  "Innovation",
  "Compliance",
]

interface SearchFormProps {
  initialParams: SearchParams
  onSearch: (params: SearchParams) => void
}

export function SearchForm({ initialParams, onSearch }: SearchFormProps) {
  const [keywords, setKeywords] = useState(initialParams.keywords || "")
  const [sector, setSector] = useState(initialParams.sector || "")
  const [tags, setTags] = useState<string[]>(initialParams.tags || [])
  const [fromDate, setFromDate] = useState<Date | undefined>(
    initialParams.fromDate ? new Date(initialParams.fromDate) : undefined,
  )
  const [toDate, setToDate] = useState<Date | undefined>(
    initialParams.toDate ? new Date(initialParams.toDate) : undefined,
  )
  const [tagInput, setTagInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch({
      keywords,
      sector,
      tags,
      fromDate: fromDate ? format(fromDate, "yyyy-MM-dd") : null,
      toDate: toDate ? format(toDate, "yyyy-MM-dd") : null,
      page: 1,
    })
  }

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
    }
    setTagInput("")
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleReset = () => {
    setKeywords("")
    setSector("")
    setTags([])
    setFromDate(undefined)
    setToDate(undefined)

    onSearch({
      keywords: "",
      sector: "",
      tags: [],
      fromDate: null,
      toDate: null,
      page: 1,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="keywords">Keywords</Label>
          <Input
            id="keywords"
            placeholder="Search by title or description"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sector">Sector</Label>
          <Select value={sector} onValueChange={setSector}>
            <SelectTrigger id="sector">
              <SelectValue placeholder="Select sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              {sectors.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="tags">Tags</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              id="tags"
              placeholder="Add a tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddTag(tagInput)
                }
              }}
            />
            <Button type="button" variant="outline" onClick={() => handleAddTag(tagInput)}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {availableTags
              .filter((tag) => !tags.includes(tag))
              .map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-secondary"
                  onClick={() => handleAddTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>From Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fromDate ? format(fromDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>To Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {toDate ? format(toDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={toDate}
                onSelect={setToDate}
                initialFocus
                disabled={(date) => (fromDate ? date < fromDate : false)}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button type="button" variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button type="submit">Search</Button>
      </div>
    </form>
  )
}

