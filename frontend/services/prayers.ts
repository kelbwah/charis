import api, { generateAuthHeaders } from "./api";
import { Prayer } from "./types";
import { AxiosResponse } from "axios";

export const createPrayer = (
  prayerData: Partial<Prayer>
): Promise<AxiosResponse<Prayer>> => {
  return api.post<Prayer>("/prayers", prayerData, generateAuthHeaders());
};

export const createPrayerResponse = (
  prayerId: string,
  status: string
): Promise<AxiosResponse<any>> => {
  return api.post<any>(
    `/prayers/${prayerId}/response?status=${status}`,
    {},
    generateAuthHeaders()
  );
};

export const getPrayerResponsesByUser = (): Promise<
  AxiosResponse<Prayer[]>
> => {
  return api.get<any>(`/prayers/user/responses`, generateAuthHeaders());
};

export const getAllPrayersByUser = (): Promise<AxiosResponse<Prayer[]>> => {
  return api.get<Prayer[]>("/prayers/user", generateAuthHeaders());
};

export const getAllPrayers = (
  query: string = ""
): Promise<AxiosResponse<Prayer[]>> => {
  const url = query ? `/prayers?${query}` : "/prayers";
  return api.get<Prayer[]>(url, generateAuthHeaders());
};

export const getPrayerById = (id: string): Promise<AxiosResponse<Prayer>> => {
  return api.get<Prayer>(`/prayers/${id}`);
};

export const getPrayerCountById = (id: string): Promise<AxiosResponse<any>> => {
  return api.get<any>(`/prayers/${id}/count`, generateAuthHeaders());
};

export const updatePrayer = (
  id: string | null,
  prayerData: Partial<Prayer>
): Promise<AxiosResponse<Prayer>> => {
  return api.put<Prayer>(`/prayers/${id}`, prayerData);
};

export const updatePrayerResponse = (
  prayerId: string,
  status: string
): Promise<AxiosResponse<any>> => {
  return api.put<any>(
    `/prayers/${prayerId}/response?status=${status}`,
    {},
    generateAuthHeaders()
  );
};

export const deletePrayer = (id: string): Promise<AxiosResponse<any>> => {
  return api.delete<any>(`/prayers/${id}`, generateAuthHeaders());
};
