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
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { Report } from "@/type/report";
import { validateReport as validateReportApi } from "@/network/report"

interface ReportActionsProps {
  report: Report;
  onValidationChange: (id: number, validated: boolean) => void;
}

export function ReportActions({
  report,
  onValidationChange,
}: ReportActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleValidate = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would call the server action
      await validateReportApi(report.id, true);

      // For demo purposes, we'll just use the callback
      onValidationChange(report.id, true);

      toast.success("Report validated", {
        description: `"${report.title}" has been marked as validated.`,
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      }); 
    } catch (error) {
      console.error("Error validating report:", error);
      toast.error("Error", {
        description: `Error validating report: ${error}`,
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      });

    } finally {
      setIsLoading(false);
    }
  };

  const handleInvalidate = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would call the server action
      await validateReportApi(report.id, false);

      // For demo purposes, we'll just use the callback
      onValidationChange(report.id, false);

      toast.success("Report invalidated", {
        description: `"${report.title}" has been marked as not validated.`,
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      });
    } catch (error) {
      toast.error("Error", {
        description: `Error invalidating report: ${error}`,
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      });
      console.error("Error invalidating report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {report.validated ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-amber-500 border-amber-200 hover:bg-amber-50 hover:text-amber-600 cursor-pointer min-w-[88px]"
            >
              <X className="mr-1 h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:inline-block">
                Invalidate
              </span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Invalidate Report</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to mark this report as not validated? This
                action can be reversed later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleInvalidate}
                className="bg-amber-500 hover:bg-amber-600"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Invalidate"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="text-green-500 border-green-200 hover:bg-green-50 hover:text-green-600 min-w-[88px] cursor-pointer"
          onClick={handleValidate}
          disabled={isLoading}
        >
          <Check className="mr-1 h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:inline-block">
            {isLoading ? "Processing..." : "Validate"}
          </span>
        </Button>
      )}
    </>
  );
}
