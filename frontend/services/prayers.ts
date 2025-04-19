import api, { clerkTokenHeaders } from "./api";
import { Prayer } from "./types";
import { AxiosResponse } from "axios";

export const createPrayer = (
  prayerData: Partial<Prayer>,
  token?: string
): Promise<AxiosResponse<Prayer>> => {
  return api.post<Prayer>("/prayers", prayerData, clerkTokenHeaders(token));
};

export const createPrayerResponse = (
  prayerId: string,
  status: string,
  token?: string | null
): Promise<AxiosResponse<any>> => {
  return api.post<any>(
    `/prayers/${prayerId}/response?status=${status}`,
    {},
    clerkTokenHeaders(token)
  );
};

export const getPrayerResponsesByUser = (
  token?: string | null
): Promise<AxiosResponse<Prayer[]>> => {
  return api.get<any>(`/prayers/user/responses`, clerkTokenHeaders(token));
};

export const getAllPrayersByUser = (
  token?: string | null
): Promise<AxiosResponse<Prayer[]>> => {
  return api.get<Prayer[]>("/prayers/user", clerkTokenHeaders(token));
};

export const getAllPrayers = (
  query: string = "",
  token?: string | null
): Promise<AxiosResponse<Prayer[]>> => {
  const url = query ? `/prayers?${query}` : "/prayers";
  return api.get<Prayer[]>(url, clerkTokenHeaders(token));
};

export const getPrayerById = (id: string): Promise<AxiosResponse<Prayer>> => {
  return api.get<Prayer>(`/prayers/${id}`);
};

export const getPrayerCountById = (
  id: string,
  token?: string | null
): Promise<AxiosResponse<any>> => {
  return api.get<any>(`/prayers/${id}/count`, clerkTokenHeaders(token));
};

export const updatePrayer = (
  id: string | null,
  prayerData: Partial<Prayer>
): Promise<AxiosResponse<Prayer>> => {
  return api.put<Prayer>(`/prayers/${id}`, prayerData);
};

export const updatePrayerResponse = (
  prayerId: string,
  status: string,
  token?: string | null
): Promise<AxiosResponse<any>> => {
  return api.put<any>(
    `/prayers/${prayerId}/response?status=${status}`,
    {},
    clerkTokenHeaders(token)
  );
};

export const deletePrayer = (
  id: string,
  token?: string | null
): Promise<AxiosResponse<any>> => {
  return api.delete<any>(`/prayers/${id}`, clerkTokenHeaders(token));
};
