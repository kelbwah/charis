import useSWR from "swr";
import { whoami } from "@/services/auth";

export function useCurrentUser() {
  const { data, error } = useSWR("/api/auth/me", whoami, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });
  return {
    user: data ?? null,
    id: data?.id ?? null,
    userLoading: !error && !data,
    error,
  };
}
