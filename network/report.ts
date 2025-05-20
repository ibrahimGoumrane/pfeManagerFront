import { Report, CreateReport, UpdateReport } from "@/type/report";
import { fetchData } from "./main";

// Fetch all reports
export const fetchReports = async (): Promise<Report[]> => {
  return (await fetchData<Report[]>("/reports", {
    method: "GET",
  })) as Report[];
};

// Search for reports
export const searchReports = async (
  query: string = "",
  page = 1,
  tags: string[] = [],
  sector: string = "",
  fromDate: string = "",
  toDate: string = ""
): Promise<{
  reports: Report[];
  currentPage: number;
  hasMoreReports: boolean;
}> => {
  try {
    // Build URL with query parameters
    const queryParams = new URLSearchParams();
    queryParams.append("query", query);
    queryParams.append("currentPage", page.toString());

    // Add optional params only if they exist
    if (sector) queryParams.append("sector", sector);
    if (fromDate) queryParams.append("fromDate", fromDate);
    if (toDate) queryParams.append("toDate", toDate);

    // Add all tags as separate query parameters
    tags.forEach((tag) => queryParams.append("tags[]", tag));

    const response = await fetchData<{
      reports: Report[];
      currentPage: number;
      hasMoreReports: boolean;
    }>(`/search?${queryParams.toString()}`, {
      method: "GET",
    });

    return response as {
      reports: Report[];
      currentPage: number;
      hasMoreReports: boolean;
    };
  } catch (error) {
    console.error("Error fetching reports:", error);
    return { reports: [], currentPage: 1, hasMoreReports: false };
  }
};

// Fetch a single report
export const fetchReport = async (id: number): Promise<Report> => {
  return (await fetchData<Report>(`/reports/${id}`, {
    method: "GET",
  })) as Report;
};

// Create a report
export const createReport = async (formData: FormData): Promise<Report> => {
  return (await fetchData<Report>("/reports", {
    method: "POST",
    body: formData, // Send the FormData directly, don't stringify it
  })) as Report;
};

// Update a report
export const updateReport = async (
  id: number,
  data: UpdateReport
): Promise<Report> => {
  return (await fetchData<Report>(`/reports/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })) as Report;
};

// Validate a report
export const validateReport = async (
  id: number,
  newStatus: boolean
): Promise<Report> => {
  return (await fetchData<Report>(`/reports/${id}/validate`, {
    method: "PUT",
    body: JSON.stringify({ validated: newStatus }),
  })) as Report;
};

// Download a report
export const downloadReport = async (id: number): Promise<Blob> => {
  return (await fetchData<Blob>(`/reports/${id}/download`, {
    method: "GET",
  })) as Blob;
};

// Delete a report
export const deleteReport = async (id: number): Promise<boolean> => {
  await fetchData<boolean>(`/reports/${id}`, {
    method: "DELETE",
  });
  return true;
};
