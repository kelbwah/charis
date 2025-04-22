import axios, { AxiosInstance } from "axios";
import { Prayer } from "./types";

const api: AxiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const serviceToken = process.env.SERVICE_API_TOKEN;

export const generateAuthHeaders = (jwtAuthToken: string) => {
  return {
    headers: {
      "X-Service-Token": serviceToken,
      Authorization: `Bearer ${jwtAuthToken}`,
    },
  };
};

export function normalizePrayer(apiPrayer: any): Prayer {
  return {
    id: apiPrayer.ID,
    prayer_title: apiPrayer.PrayerTitle,
    prayer_request: apiPrayer.PrayerRequest,
    category: apiPrayer.Category,
    related_scripture: apiPrayer.RelatedScripture?.String || null,
    created_at: apiPrayer.CreatedAt,
    updated_at: apiPrayer.UpdatedAt,
    is_anonymous: apiPrayer.IsAnonymous,
    user_id: apiPrayer.UserID,
  };
}

export default api;
