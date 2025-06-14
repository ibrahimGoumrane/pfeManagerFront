import { UpdatePassword, UpdateUser, User } from "@/type/users";
import { fetchData } from "./main";

// Fetch all users
export const fetchUsers = async (): Promise<User[]> => {
  return (await fetchData<User[]>("/users", {
    method: "GET",
  })) as User[];
};

// Search for users
export const searchUsers = async (query: string): Promise<User[]> => {
  return (await fetchData<User[]>(`/users/search?query=${query}`, {
    method: "GET",
  })) as User[];
};

// Fetch a single user
export const fetchUser = async (id: number): Promise<User> => {
  return (await fetchData<User>(`/users/${id}`, {
    method: "GET",
  })) as User;
};

// Update a user
export const updateUser = async (
  id: number,
  data: UpdateUser
): Promise<User> => {
  return (await fetchData<User>(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })) as User;
};

//update user password
export const updateUserPassword = async (
  id: number,
  data: UpdatePassword
): Promise<User> => {
  return (await fetchData<User>(`/users/${id}/password`, {
    method: "POST",
    body: JSON.stringify(data),
  })) as User;
};

// Delete a user
export const deleteUser = async (id: number): Promise<boolean> => {
  await fetchData<boolean>(`/users/${id}`, {
    method: "DELETE",
  });
  return true;
};

// Fetch user Reports
export const fetchUserReports = async (userId: number): Promise<Report> => {
  return (await fetchData<Report>(`/users/${userId}/reports`, {
    method: "GET",
  })) as Report;
};
