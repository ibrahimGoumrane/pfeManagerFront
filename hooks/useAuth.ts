"use client";
import { useEffect, useState } from "react";
import { UnauthorizedError } from "../errors/main";
import {
  getLoggedInUser,
  login as loginApi,
  logout as logoutApi,
  register,
} from "../network/auth";
import { updateUser, updateUserPassword } from "@/network/users";
import { signUp } from "../type/auth";
import { UpdatePassword, UpdateUser, User } from "@/type/users";
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    async function checkUser() {
      try {
        const Newuser = await getLoggedInUser();
        if (Newuser) {
          setIsAuthenticated(true);
          setUser(Newuser);
          if (Newuser.role === "admin") {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          setLoading(false);
        }
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const user = await loginApi(email, password);
    setIsAuthenticated(true);
    setUser(user.user);
    localStorage.setItem("authToken", user.token);
    return user.user;
  };

  const signup = async (user: signUp): Promise<User> => {
    const newUser = await register(user);
    setIsAuthenticated(true);
    setUser(newUser.user);
    localStorage.setItem("authToken", newUser.token);
    return newUser.user;
  };

  const userUpdate = async (data: UpdateUser): Promise<User | null> => {
    if (!user) return null;
    const updatedUser = await updateUser(user?.id, data);
    setUser(updatedUser);
    return updatedUser;
  };
  const userPasswordUpdate = async (
    data: UpdatePassword
  ): Promise<User | null> => {
    if (!user) return null;
    const updatedUser = await updateUserPassword(user?.id, data);
    setUser(updatedUser);
    return updatedUser;
  };

  const logout = async () => {
    await logoutApi();
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    isAdmin,
    loading,
    user,
    login,
    signup,
    logout,
    userUpdate,
    userPasswordUpdate,
  };
};
