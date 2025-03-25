import { Tag, CreateTag, UpdateTag } from "@/type/tag";
import { fetchData } from "./main";

// Fetch all tags
export const fetchTags = async (): Promise<Tag[]> => {
  return (await fetchData<Tag[]>("/tags", {
    method: "GET",
  })) as Tag[];
};

// Fetch a single tag
export const fetchTag = async (id: number): Promise<Tag> => {
  return (await fetchData<Tag>(`/tags/${id}`, {
    method: "GET",
  })) as Tag;
};

// Create a tag
export const createTag = async (data: CreateTag): Promise<Tag> => {
  return (await fetchData<Tag>("/tags", {
    method: "POST",
    body: JSON.stringify(data),
  })) as Tag;
};

// Update a tag
export const updateTag = async (
  id: number,
  data: UpdateTag
): Promise<Tag> => {
  return (await fetchData<Tag>(`/tags/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })) as Tag;
};

// Delete a tag
export const deleteTag = async (id: number): Promise<boolean> => {
  await fetchData<boolean>(`/tags/${id}`, {
    method: "DELETE",
  });
  return true;
};