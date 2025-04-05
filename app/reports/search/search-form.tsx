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
import { Badge } from "@/components/ui/badge";
import { X, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import type { SearchParams } from "@/type/SearchParams";

// Sample sectors - replace with your actual data
const sectors = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Energy",
  "Other",
];

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
];

interface SearchFormProps {
  initialParams: SearchParams;
  onSearch: (params: SearchParams) => void;
}

export function SearchForm({ initialParams, onSearch }: SearchFormProps) {
  const [keywords, setKeywords] = useState(initialParams.keywords || "");
  const [tags, setTags] = useState<string[]>(initialParams.tags || []);
  const [tagInput, setTagInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      keywords,
      tags,
      page: 1,
    });
  };

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleReset = () => {
    setKeywords("");
    setTags([]);

    onSearch({
      keywords: "",
      tags: [],
      page: 1,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="keywords">Keywords</Label>
          <Input
            id="keywords"
            placeholder="Search by title or description"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="tags">Tags</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                onClick={() => handleRemoveTag(tag)}
                variant="secondary"
                className="flex items-center cursor-pointer gap-1"
              >
                {tag}
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
                  e.preventDefault();
                  handleAddTag(tagInput);
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => handleAddTag(tagInput)}
            >
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
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button type="button" variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button type="submit">Search</Button>
      </div>
    </form>
  );
}
