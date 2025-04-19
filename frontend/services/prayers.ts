import api, { serviceTokenHeader } from "./api";
import { Prayer } from "./types";
import { AxiosResponse } from "axios";

export const createPrayer = (
  prayerData: Partial<Prayer>
): Promise<AxiosResponse<Prayer>> => {
  return api.post<Prayer>("/prayers", prayerData, serviceTokenHeader());
};

export const createPrayerResponse = (
  prayerId: string,
  status: string
): Promise<AxiosResponse<any>> => {
  return api.post<any>(
    `/prayers/${prayerId}/response?status=${status}`,
    {},
    serviceTokenHeader()
  );
};

export const getPrayerResponsesByUser = (): Promise<
  AxiosResponse<Prayer[]>
> => {
  return api.get<any>(`/prayers/user/responses`, serviceTokenHeader());
};

export const getAllPrayersByUser = (): Promise<AxiosResponse<Prayer[]>> => {
  return api.get<Prayer[]>("/prayers/user", serviceTokenHeader());
};

export const getAllPrayers = (
  query: string = ""
): Promise<AxiosResponse<Prayer[]>> => {
  const url = query ? `/prayers?${query}` : "/prayers";
  return api.get<Prayer[]>(url, serviceTokenHeader());
};

export const getPrayerById = (id: string): Promise<AxiosResponse<Prayer>> => {
  return api.get<Prayer>(`/prayers/${id}`);
};

export const getPrayerCountById = (id: string): Promise<AxiosResponse<any>> => {
  return api.get<any>(`/prayers/${id}/count`, serviceTokenHeader());
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
    serviceTokenHeader()
  );
};

export const deletePrayer = (id: string): Promise<AxiosResponse<any>> => {
  return api.delete<any>(`/prayers/${id}`, serviceTokenHeader());
};
