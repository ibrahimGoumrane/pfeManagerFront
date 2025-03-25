import { Sector, CreateSector, UpdateSector } from "@/type/sector";
import { fetchData } from "./main";

// Fetch all sectors
export const fetchSectors = async (): Promise<Sector[]> => {
  return (await fetchData<Sector[]>("/sectors", {
    method: "GET",
  })) as Sector[];
};

// Fetch a single sector
export const fetchSector = async (id: number): Promise<Sector> => {
  return (await fetchData<Sector>(`/sectors/${id}`, {
    method: "GET",
  })) as Sector;
};

// Create a sector
export const createSector = async (data: CreateSector): Promise<Sector> => {
  return (await fetchData<Sector>("/sectors", {
    method: "POST",
    body: JSON.stringify(data),
  })) as Sector;
};

// Update a sector
export const updateSector = async (
  id: number,
  data: UpdateSector
): Promise<Sector> => {
  return (await fetchData<Sector>(`/sectors/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })) as Sector;
};

// Delete a sector
export const deleteSector = async (id: number): Promise<boolean> => {
  await fetchData<boolean>(`/sectors/${id}`, {
    method: "DELETE",
  });
  return true;
};