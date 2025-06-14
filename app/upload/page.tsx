"use client";

import type React from "react";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createReport } from "@/network/report";
import { fetchTags } from "@/network/tag";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  X,
  AlertCircle,
  CheckCircle,
  Upload,
  FileText,
  ImageIcon,
  TagIcon,
  Plus,
  Trash2,
  CloudUpload,
  Sparkles,
  ArrowLeft,
  Info,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { fetchUserReports } from "@/network/users";

interface UploadState {
  show: boolean;
  type: "error" | "success" | "info";
  title: string;
  message: string;
}

export default function UploadPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [loadingReport, setLoadingReport] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [alert, setAlert] = useState<UploadState>({
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

  // Create preview URL when image is selected
  useEffect(() => {
    if (previewImage) {
      const url = URL.createObjectURL(previewImage);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [previewImage]);
  useEffect(() => {
    if (loading) return;
    if (!user) {
      return router.push("/login");
    }
    const checkUserReport = async () => {
      try {
        setLoadingReport(true);
        const report = await fetchUserReports(user.id);
        if (report) {
          router.push("/reports/search");
        }
      } catch (error) {
        console.error("Error checking user report:", error);
      } finally {
        setLoadingReport(false);
      }
    };
    checkUserReport();
  }, [loading, user, router]);

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
        return prev + Math.floor(Math.random() * 10);
      });
    }, 100);

    return () => clearInterval(interval);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find((file) => file.type === "application/pdf");
    const imageFile = files.find((file) => file.type.startsWith("image/"));

    if (pdfFile) {
      setPdfFile(pdfFile);
    }
    if (imageFile) {
      setPreviewImage(imageFile);
    }
  }, []);

  const handleFileSelect = (type: "pdf" | "image") => {
    if (type === "pdf") {
      fileInputRef.current?.click();
    } else {
      imageInputRef.current?.click();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setAlert({
        show: true,
        type: "error",
        title: "Missing Title",
        message: "Please enter a title for your report",
      });
      return;
    }

    if (!pdfFile) {
      setAlert({
        show: true,
        type: "error",
        title: "Missing PDF File",
        message: "Please select a PDF file to upload",
      });
      return;
    }

    if (!previewImage) {
      setAlert({
        show: true,
        type: "error",
        title: "Missing Preview Image",
        message: "Please select a preview image for your report",
      });
      return;
    }

    try {
      setIsUploading(true);
      const cleanupProgress = simulateProgress();

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("preview", previewImage);
      formData.append("url", pdfFile);
      formData.append("validated", "false");

      tags.forEach((tag, index) => {
        formData.append(`tags[${index}]`, tag);
      });

      await createReport(formData);

      setProgress(100);

      setAlert({
        show: true,
        type: "success",
        title: "Report Uploaded Successfully!",
        message: "Your report has been uploaded and is pending validation.",
      });

      setTimeout(() => {
        router.push("/reports/search");
      }, 2000);

      cleanupProgress();
    } catch (error) {
      console.error("Upload error:", error);
      setAlert({
        show: true,
        type: "error",
        title: "Upload Failed",
        message: "There was a problem uploading your report. Please try again.",
      });
      setIsUploading(false);
    }
  };

  if (loading || loadingReport) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-16 z-40">
        <div className="container mx-auto py-8 px-4 sm:px-6 max-w-6xl">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <CloudUpload className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Upload New Report
              </h1>
              <p className="text-lg text-gray-600">
                Share your final year project with the ENSAM community
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 sm:px-6 max-w-6xl">
        {/* Alert */}
        {alert.show && (
          <Alert
            className={`mb-8 border-0 shadow-lg ${
              alert.type === "error"
                ? "bg-red-50 border-l-4 border-l-red-500"
                : alert.type === "success"
                ? "bg-green-50 border-l-4 border-l-green-500"
                : "bg-blue-50 border-l-4 border-l-blue-500"
            }`}
          >
            {alert.type === "error" ? (
              <AlertCircle className="h-5 w-5 text-red-600" />
            ) : alert.type === "success" ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <Info className="h-5 w-5 text-blue-600" />
            )}
            <AlertTitle className="text-lg font-semibold">
              {alert.title}
            </AlertTitle>
            <AlertDescription className="text-base">
              {alert.message}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200/50">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="title"
                      className="text-gray-900 font-semibold text-base flex items-center gap-2"
                    >
                      Report Title
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter a descriptive title for your report..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={isUploading}
                      required
                      className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl shadow-sm"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="description"
                      className="text-gray-900 font-semibold text-base"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Provide a detailed description of your report, methodology, and key findings..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={isUploading}
                      className="min-h-32 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl shadow-sm resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Tags Section */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200/50">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <TagIcon className="w-6 h-6 text-green-600" />
                    </div>
                    Tags & Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {/* Selected Tags */}
                  {tags.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-gray-900 font-semibold text-base">
                        Selected Tags:
                      </Label>
                      <div className="flex flex-wrap gap-3">
                        {tags.map((tag) => (
                          <Badge
                            key={tag}
                            className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 cursor-pointer transition-all duration-200 px-4 py-2 text-sm font-medium flex items-center gap-2 hover:scale-105"
                            onClick={() => !isUploading && handleRemoveTag(tag)}
                          >
                            {tag}
                            {!isUploading && (
                              <X className="h-3 w-3 hover:scale-110 transition-transform" />
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add Tags */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="tags"
                      className="text-gray-900 font-semibold text-base"
                    >
                      Add Tags
                    </Label>
                    <div className="flex gap-3">
                      <div className="flex-1 relative">
                        <Input
                          id="tags"
                          placeholder="Type to search or add new tags..."
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          disabled={isUploading}
                          className="h-12 pl-10 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl shadow-sm"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && tagInput.trim()) {
                              e.preventDefault();
                              handleAddTag(tagInput);
                            }
                          }}
                        />
                        <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                      <Button
                        type="button"
                        onClick={() => handleAddTag(tagInput)}
                        disabled={isUploading || !tagInput.trim()}
                        className="bg-blue-600 hover:bg-blue-700 h-12 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Available Tags */}
                  {filteredTags.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-gray-900 font-semibold text-base">
                        Suggested Tags:
                      </Label>
                      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                        {filteredTags.slice(0, 15).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 cursor-pointer transition-all duration-200 px-3 py-1 text-sm font-medium hover:scale-105"
                            onClick={() => !isUploading && handleAddTag(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* File Upload Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* File Upload Area */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200/50">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Upload className="w-6 h-6 text-purple-600" />
                    </div>
                    File Uploads
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* PDF Upload */}
                  <div className="space-y-3">
                    <Label className="text-gray-900 font-semibold text-base flex items-center gap-2">
                      PDF Document
                      <span className="text-red-500">*</span>
                    </Label>
                    <div
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer ${
                        isDragOver
                          ? "border-blue-500 bg-blue-50"
                          : pdfFile
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => handleFileSelect("pdf")}
                    >
                      {pdfFile ? (
                        <div className="space-y-2">
                          <FileText className="w-12 h-12 text-green-600 mx-auto" />
                          <p className="font-semibold text-green-800">
                            {pdfFile.name}
                          </p>
                          <p className="text-sm text-green-600">
                            {formatFileSize(pdfFile.size)}
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPdfFile(null);
                            }}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <CloudUpload className="w-12 h-12 text-gray-400 mx-auto" />
                          <div>
                            <p className="font-semibold text-gray-700">
                              Drop PDF here or click to browse
                            </p>
                            <p className="text-sm text-gray-500">
                              PDF files only, max 50MB
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-3">
                    <Label className="text-gray-900 font-semibold text-base flex items-center gap-2">
                      Preview Image
                      <span className="text-red-500">*</span>
                    </Label>
                    <div
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer ${
                        previewImage
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"
                      }`}
                      onClick={() => handleFileSelect("image")}
                    >
                      {previewImage && previewUrl ? (
                        <div className="space-y-3">
                          <div className="relative w-full h-32 rounded-lg overflow-hidden">
                            <Image
                              src={previewUrl || "/placeholder.svg"}
                              alt="Preview"
                              fill={true}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="font-semibold text-green-800">
                            {previewImage.name}
                          </p>
                          <p className="text-sm text-green-600">
                            {formatFileSize(previewImage.size)}
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewImage(null);
                            }}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto" />
                          <div>
                            <p className="font-semibold text-gray-700">
                              Upload preview image
                            </p>
                            <p className="text-sm text-gray-500">
                              JPEG, PNG, WebP, max 10MB
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setPreviewImage(e.target.files?.[0] || null)
                      }
                      className="hidden"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Upload Progress */}
              {isUploading && (
                <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50 border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                        <div>
                          <p className="font-semibold text-blue-800">
                            Uploading Report...
                          </p>
                          <p className="text-sm text-blue-600">
                            {progress}% complete
                          </p>
                        </div>
                      </div>
                      <Progress value={progress} className="h-3 bg-blue-100" />
                      <p className="text-sm text-blue-700">
                        Please don&apos;t close this page while uploading.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Submit Actions */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isUploading}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 h-12 px-8 rounded-xl shadow-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isUploading || !title.trim() || !pdfFile || !previewImage
                  }
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Upload Report
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
