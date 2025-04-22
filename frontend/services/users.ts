import api from "./api";
import { User } from "./types";
import { AxiosResponse } from "axios";
import { generateAuthHeaders } from "./api";

export const getUserById = (id: string): Promise<AxiosResponse<User>> => {
  return api.get<User>(`/users/${id}`, generateAuthHeaders());
};

export const getUserByClerkId = (
  clerkId: string
): Promise<AxiosResponse<User>> => {
  return api.get<User>(`/users/clerk/${clerkId}`, generateAuthHeaders());
};

export const getUserByEmail = (email: string): Promise<AxiosResponse<User>> => {
  return api.get<User>(`/users/${email}`);
};

export const getUsers = (): Promise<AxiosResponse<User[]>> => {
  return api.get<User[]>("/users");
};

export const createUser = (
  userData: Partial<User>
): Promise<AxiosResponse<User>> => {
  return api.post<User>("/users", userData);
};

export const updateUser = (
  id: string,
  userData: Partial<User>
): Promise<AxiosResponse<User>> => {
  return api.put<User>(`/users/${id}`, userData);
};

export const deleteUser = (
  id: string
): Promise<AxiosResponse<{ deleted: string }>> => {
  return api.delete<{ deleted: string }>(`/users/${id}`);
};
