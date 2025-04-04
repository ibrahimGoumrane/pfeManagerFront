"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner"

export interface Report {
  id: string;
  title: string;
  description: string;
  previewUrl: string;
  pdfUrl: string;
  validated: boolean;
  userId: string;
  userName: string;
  userEmail: string;
  sectorId: string;
  sectorName: string;
  createdAt: string;
  tags?: string[];
}

interface DeleteReportProps {
  report: Report;
  onDelete: (id: string) => void;
}

export function DeleteReport({ report, onDelete }: DeleteReportProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would call the server action
      // await deleteReport(report.id)

      // For demo purposes, we'll just use the callback
      onDelete(report.id);

      toast.success('Report deleted' , {
        description: `"${report.title}" has been permanently deleted.`,
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      })
    } catch (error) {
      console.error("Failed to delete report:", error);
      toast.error('Failed to delete report' , {
        description: `Failed to delete report. Please try again.`,
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Report</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this report? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
