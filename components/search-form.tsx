"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SearchParams } from "@/type/SearchParams";

const sectors = [
  "Education",
  "Technology",
  "Healthcare",
  "Business",
  "Engineering",
  "Psychology",
  "Urban Planning",
  "Energy",
  "Agriculture",
  "Security",
];

const availableTags = [
  "Machine Learning",
  "AI",
  "Data Analysis",
  "Sustainability",
  "Case Study",
  "Blockchain",
  "Supply Chain",
  "Social Media",
  "Mental Health",
  "Renewable Energy",
  "Development",
  "Healthcare",
  "Diagnostics",
  "Cybersecurity",
  "Infrastructure",
  "Circular Economy",
  "Business Models",
  "NLP",
  "Sentiment Analysis",
  "Data Science",
  "Urban Agriculture",
  "Food Security",
  "Education",
];

export function SearchForm({
  onSearch,
}: {
  onSearch: (searchParams: SearchParams) => void;
}) {
  const [keywords, setKeywords] = useState("");
  const [sector, setSector] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [showTagsPopover, setShowTagsPopover] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const searchParams: SearchParams = {
      keywords,
      sector: sector === "all" ? undefined : sector,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      fromDate: fromDate ? format(fromDate, "yyyy-MM-dd") : null,
      toDate: toDate ? format(toDate, "yyyy-MM-dd") : null,
    };

    onSearch(searchParams);
  };

  const handleReset = () => {
    setKeywords("");
    setSector("");
    setSelectedTags([]);
    setFromDate(undefined);
    setToDate(undefined);
    onSearch({});
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card p-6 rounded-lg border shadow-sm"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Keywords */}
        <div className="space-y-2">
          <Label htmlFor="keywords">Keywords</Label>
          <Input
            id="keywords"
            placeholder="Search in title or abstract"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>

        {/* Sector */}
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

        {/* Date Range */}
        <div className="space-y-2 lg:col-span-2">
          <Label>Date Range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !fromDate && !toDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fromDate && toDate
                  ? `${format(fromDate, "PPP")} - ${format(toDate, "PPP")}`
                  : fromDate
                  ? `From ${format(fromDate, "PPP")}`
                  : toDate
                  ? `Until ${format(toDate, "PPP")}`
                  : "Select date range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={{
                  from: fromDate,
                  to: toDate,
                }}
                onSelect={(range) => {
                  setFromDate(range?.from);
                  setToDate(range?.to);
                }}
                numberOfMonths={2}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Tags */}
      <div className="mt-6 space-y-2">
        <Label>Tags</Label>
        <Popover open={showTagsPopover} onOpenChange={setShowTagsPopover}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              {selectedTags.length > 0
                ? `${selectedTags.length} tag${
                    selectedTags.length > 1 ? "s" : ""
                  } selected`
                : "Select tags"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-4" align="start">
            <div className="grid grid-cols-2 gap-2">
              {availableTags.map((tag) => (
                <Label
                  key={tag}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-muted",
                    selectedTags.includes(tag) && "bg-muted"
                  )}
                  onClick={() => toggleTag(tag)}
                >
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() => {}}
                    className="h-4 w-4"
                  />
                  {tag}
                </Label>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button type="submit">Search</Button>
      </div>
    </form>
  );
}
