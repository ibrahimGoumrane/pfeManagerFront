import { Sector } from "./sector";

export type User = {
  id: number;
  name: string;
  email: string;
  sector:Sector;
  created_at: string;
  updatedAt: string;
  role: string;
};

export type CreateUser = {
  name: string;
  email: string;
  password: string;
};

export type UpdateUser = {
  name: string;
  email: string;
};
export type UpdatePassword = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};
export type DeleteUser = {
  id: number;
};
export type AuthUser = {
  user: User;
  token: string;
};
