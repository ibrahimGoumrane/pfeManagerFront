import { Report, CreateReport, UpdateReport } from "@/type/report";
import { fetchData } from "./main";

// Fetch all reports
export const fetchReports = async (): Promise<Report[]> => {
  return (await fetchData<Report[]>("/reports", {
    method: "GET",
  })) as Report[];
};

// Search for reports
export const searchReports = async (query: string): Promise<Report[]> => {
  return (await fetchData<Report[]>(`/reports/search?query=${query}`, {
    method: "GET",
  })) as Report[];
};

// Fetch a single report
export const fetchReport = async (id: number): Promise<Report> => {
  return (await fetchData<Report>(`/reports/${id}`, {
    method: "GET",
  })) as Report;
};

// Create a report
export const createReport = async (data: CreateReport): Promise<Report> => {
  return (await fetchData<Report>("/reports", {
    method: "POST",
    body: JSON.stringify(data),
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
export const validateReport = async (id: number): Promise<Report> => {
  return (await fetchData<Report>(`/reports/${id}/validate`, {
    method: "PUT",
  })) as Report;
};

// Download a report
export const downloadReport = async (id: number): Promise<Blob> => {
  return await fetchData<Blob>(`/reports/${id}/download`, {
    method: "GET",
 }) as Blob;
};

// Delete a report
export const deleteReport = async (id: number): Promise<boolean> => {
  await fetchData<boolean>(`/reports/${id}`, {
    method: "DELETE",
  });
  return true;
};