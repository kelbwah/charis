import axios, { AxiosInstance } from "axios";
import { Prayer } from "./types";

const api: AxiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const clerkTokenHeaders = (token: string | undefined | null) => {
  return {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
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
