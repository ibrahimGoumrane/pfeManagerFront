"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchTags } from "@/network/tag";
import type { SearchParams } from "@/type/SearchParams";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface SearchFormProps {
  initialParams: SearchParams;
  onSearch: (params: SearchParams) => void;
}

export function SearchForm({ initialParams, onSearch }: SearchFormProps) {
  const [keywords, setKeywords] = useState(initialParams.keywords || "");
  const [tags, setTags] = useState<string[]>(initialParams.tags || []);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [filteredTags, setFilteredTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchAvailableTags = async () => {
      try {
        const response = await fetchTags();
        const tagNames = response.map((tag) => tag.name);
        setAvailableTags(tagNames);
        setFilteredTags(tagNames);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchAvailableTags();
  }, []);

  // Filter available tags when tagInput changes
  useEffect(() => {
    if (tagInput.trim() === "") {
      setFilteredTags(availableTags);
    } else {
      const filtered = availableTags.filter((tag) =>
        tag.toLowerCase().includes(tagInput.toLowerCase())
      );
      setFilteredTags(filtered);
    }
  }, [tagInput, availableTags]);

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
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow-md border border-gray-200"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="keywords" className="text-gray-900 font-medium">
            Keywords
          </Label>
          <Input
            id="keywords"
            placeholder="Search by title or description"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="focus-visible:ring-pfebrand/30 border-gray-200"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="tags" className="text-gray-900 font-medium">
            Tags
          </Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                onClick={() => handleRemoveTag(tag)}
                variant="secondary"
                className="flex items-center gap-1 bg-pfebrand/10 text-pfebrand hover:bg-pfebrand/15 cursor-pointer"
              >
                {tag}
                <X className="h-3 w-3" />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              id="tags"
              placeholder="Add a tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="focus-visible:ring-pfebrand/30 border-gray-200"
              onKeyDown={(e) => {
                if (e.key === "Enter" && tagInput.trim()) {
                  e.preventDefault();
                  handleAddTag(tagInput);
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => handleAddTag(tagInput)}
              disabled={!tagInput.trim()}
              className="border-pfebrand text-pfebrand hover:bg-pfebrand/10 hover:text-pfebrand"
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {filteredTags
              .filter((tag) => !tags.includes(tag))
              .map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="border-pfebrand/20 text-pfebrand hover:bg-pfebrand/10 cursor-pointer"
                  onClick={() => handleAddTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-gray-100 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        >
          Reset
        </Button>
        <Button type="submit" className="bg-pfebrand hover:bg-pfebrand/90">
          Search
        </Button>
      </div>
    </form>
  );
}
