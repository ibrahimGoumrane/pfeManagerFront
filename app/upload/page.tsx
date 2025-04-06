"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { createReport } from "@/network/report";
import { CreateReport } from "@/type/report";
import { X, AlertCircle, CheckCircle } from "lucide-react";
import { fetchTags } from "@/network/tag";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function UploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pdfFile, setPdfFile] = useState<FileList | null>(null);
  const [previewImage, setPreviewImage] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  // Alert state
  const [alert, setAlert] = useState<{
    show: boolean;
    type: "error" | "success";
    title: string;
    message: string;
  }>({
    show: false,
    type: "error",
    title: "",
    message: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadTags = async () => {
      try {
        const response = await fetchTags();
        const tagNames = response.map((tag) => tag.name);
        setAvailableTags(tagNames);
        setFilteredTags(tagNames);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };

    loadTags();
  }, []);

  useEffect(() => {
    if (tagInput.trim() === "") {
      setFilteredTags(availableTags.filter((tag) => !tags.includes(tag)));
    } else {
      setFilteredTags(
        availableTags
          .filter((tag) => tag.toLowerCase().includes(tagInput.toLowerCase()))
          .filter((tag) => !tags.includes(tag))
      );
    }
  }, [tagInput, availableTags, tags]);

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 200);

    return () => clearInterval(interval);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setAlert({
        show: true,
        type: "error",
        title: "Missing title",
        message: "Please enter a title for your report",
      });
      return;
    }

    if (!pdfFile || pdfFile.length === 0) {
      setAlert({
        show: true,
        type: "error",
        title: "Missing PDF",
        message: "Please select a PDF file to upload",
      });
      return;
    }

    if (!previewImage || previewImage.length === 0) {
      setAlert({
        show: true,
        type: "error",
        title: "Missing preview image",
        message: "Please select a preview image for your report",
      });
      return;
    }

    try {
      setIsUploading(true);
      const cleanupProgress = simulateProgress();

      // Create FormData to handle file uploads
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("preview", previewImage[0]); // Send the actual File object
      formData.append("url", pdfFile[0]); // Send the actual File object
      formData.append("validated", "false");

      // Append tags as separate fields or as JSON
      tags.forEach((tag, index) => {
        formData.append(`tags[${index}]`, tag);
      });

      await createReport(formData);

      // Complete the progress bar
      setProgress(100);

      setAlert({
        show: true,
        type: "success",
        title: "Report uploaded successfully",
        message: "Your report has been uploaded and is pending validation.",
      });

      // Redirect to reports page after successful upload
      setTimeout(() => {
        router.push("/reports");
      }, 2000);

      cleanupProgress();
    } catch (error) {
      console.error("Upload error:", error);
      setAlert({
        show: true,
        type: "error",
        title: "Upload failed",
        message: "There was a problem uploading your report. Please try again.",
      });
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 max-w-4xl">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-pfebrand">
          Upload New Report
        </h1>
        <p className="text-muted-foreground">
          Share your final year project report with the community.
        </p>
      </div>

      {alert.show && (
        <Alert
          variant={alert.type === "error" ? "destructive" : "default"}
          className="mb-6 border-l-4 border-l-pfebrand shadow-sm"
        >
          {alert.type === "error" ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white p-8 rounded-lg shadow-md border border-gray-200"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-900 font-medium">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter the title of your report"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isUploading}
              required
              className="focus-visible:ring-pfebrand/30 border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-900 font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Write a brief description of your report..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isUploading}
              className="min-h-32 focus-visible:ring-pfebrand/30 border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="text-gray-900 font-medium">
              Tags
            </Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  onClick={() => !isUploading && handleRemoveTag(tag)}
                  variant="secondary"
                  className={`flex items-center gap-1 bg-pfebrand/10 text-pfebrand hover:bg-pfebrand/15 ${
                    isUploading ? "" : "cursor-pointer"
                  }`}
                >
                  {tag}
                  {!isUploading && <X className="h-3 w-3" />}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                disabled={isUploading}
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
                disabled={isUploading || !tagInput.trim()}
                className="border-pfebrand text-pfebrand hover:bg-pfebrand/10 hover:text-pfebrand"
              >
                Add
              </Button>
            </div>

            {filteredTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {filteredTags.slice(0, 10).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className={`border-pfebrand/20 text-pfebrand hover:bg-pfebrand/10 ${
                      isUploading ? "" : "cursor-pointer"
                    }`}
                    onClick={() => !isUploading && handleAddTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="preview" className="text-gray-900 font-medium">
              Preview Image <span className="text-red-500">*</span>
            </Label>
            <div className="flex flex-col gap-2">
              <Input
                ref={imageInputRef}
                id="preview"
                type="file"
                accept="image/*"
                onChange={(e) => setPreviewImage(e.target.files)}
                disabled={isUploading}
                required
                className="cursor-pointer border-gray-200 focus-visible:ring-pfebrand/30 file:text-pfebrand"
              />
              <p className="text-sm text-muted-foreground">
                Upload an image that represents your report (JPEG, PNG, etc.)
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pdf" className="text-gray-900 font-medium">
              PDF File <span className="text-red-500">*</span>
            </Label>
            <div className="flex flex-col gap-2">
              <Input
                ref={fileInputRef}
                id="pdf"
                type="file"
                accept=".pdf"
                onChange={(e) => setPdfFile(e.target.files)}
                disabled={isUploading}
                required
                className="cursor-pointer border-gray-200 focus-visible:ring-pfebrand/30 file:text-pfebrand"
              />
              <p className="text-sm text-muted-foreground">
                Upload your report in PDF format only
              </p>
            </div>
          </div>

          {isUploading && (
            <div className="space-y-2 mt-6 bg-pfebrand/5 p-4 rounded-md border border-pfebrand/20">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-pfebrand">Uploading...</span>
                <span className="font-medium text-pfebrand">{progress}%</span>
              </div>
              <Progress
                value={progress}
                className="h-2 bg-pfebrand/10"
                indicatorClassName="bg-pfebrand"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isUploading}
            className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isUploading}
            className="bg-pfebrand hover:bg-pfebrand/90"
          >
            {isUploading ? "Uploading..." : "Upload Report"}
          </Button>
        </div>
      </form>
    </div>
  );
}
