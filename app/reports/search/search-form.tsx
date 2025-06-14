"use client"

import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchTags } from "@/network/tag"
import type { SearchParams } from "@/type/SearchParams"
import { X, Search, Tag, RotateCcw, Plus, Filter } from "lucide-react"
import { useEffect, useState } from "react"

interface SearchFormProps {
  initialParams: SearchParams
  onSearch: (params: SearchParams) => void
}

export function SearchForm({ initialParams, onSearch }: SearchFormProps) {
  const [keywords, setKeywords] = useState(initialParams.keywords || "")
  const [tags, setTags] = useState<string[]>(initialParams.tags || [])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [filteredTags, setFilteredTags] = useState<string[]>([])
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const fetchAvailableTags = async () => {
      try {
        const response = await fetchTags()
        const tagNames = response.map((tag) => tag.name)
        setAvailableTags(tagNames)
        setFilteredTags(tagNames.slice(0, 10)) // Show first 10 tags initially
      } catch (error) {
        console.error("Error fetching tags:", error)
      }
    }

    fetchAvailableTags()
  }, [])

  // Filter available tags when tagInput changes
  useEffect(() => {
    if (tagInput.trim() === "") {
      setFilteredTags(isExpanded ? availableTags : availableTags.slice(0, 10))
    } else {
      const filtered = availableTags.filter((tag) => tag.toLowerCase().includes(tagInput.toLowerCase()))
      setFilteredTags(filtered)
    }
  }, [tagInput, availableTags, isExpanded])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch({
      keywords,
      tags,
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
    setTags([])
    setTagInput("")

    onSearch({
      keywords: "",
      tags: [],
      page: 1,
    })
  }

  const hasActiveFilters = keywords || tags.length > 0

  return (
    <Card className="border-gray-200 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Filter className="w-5 h-5 text-blue-600" />
          </div>
          Search & Filter Reports
          {hasActiveFilters && (
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
              {(keywords ? 1 : 0) + tags.length} active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Keywords Search */}
          <div className="space-y-3">
            <Label htmlFor="keywords" className="text-gray-900 font-semibold flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-600" />
              Keywords
            </Label>
            <div className="relative">
              <Input
                id="keywords"
                placeholder="Search by title, description, or author..."
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="pl-10 pr-10 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl shadow-sm"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              {keywords && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setKeywords("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Tags Section */}
          <div className="space-y-4">
            <Label className="text-gray-900 font-semibold flex items-center gap-2">
              <Tag className="w-4 h-4 text-blue-600" />
              Tags
            </Label>

            {/* Selected Tags */}
            {tags.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Selected tags:</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 cursor-pointer transition-colors px-3 py-1 text-sm font-medium flex items-center gap-2"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag}
                      <X className="h-3 w-3 hover:scale-110 transition-transform" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Tag Input */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl shadow-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && tagInput.trim()) {
                      e.preventDefault()
                      handleAddTag(tagInput)
                    }
                  }}
                />
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleAddTag(tagInput)}
                disabled={!tagInput.trim() || tags.includes(tagInput)}
                className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 px-4 h-11 rounded-xl shadow-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>

            {/* Available Tags */}
            {filteredTags.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">Available tags:</p>
                  {availableTags.length > 10 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      {isExpanded ? "Show less" : `Show all (${availableTags.length})`}
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {filteredTags
                    .filter((tag) => !tags.includes(tag))
                    .map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 cursor-pointer transition-all duration-200 px-3 py-1 text-sm font-medium hover:scale-105"
                        onClick={() => handleAddTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-base"
            >
              <Search className="w-5 h-5 mr-2" />
              Search Reports
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={!hasActiveFilters}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 h-12 px-6 rounded-xl shadow-sm transition-all duration-200 font-medium"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
