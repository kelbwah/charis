import { defaultHeaders } from "./api";
import { User, AuthResponse, RegisterPayload, LoginPayload } from "./types";

export const login = async (body: LoginPayload): Promise<AuthResponse> => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: defaultHeaders,
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Login Failed");
  return res.json();
};

export const register = async (
  body: RegisterPayload
): Promise<AuthResponse> => {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: defaultHeaders,
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
};

export async function whoami(): Promise<any> {
  let res = await fetch("/api/auth/me", {
    method: "GET",
    credentials: "include",
  });

  if (res.status === 401) {
    // try refreshing the token
    const refreshRes = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      // retry original request after refresh
      res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
      });
    } else {
      throw new Error("Unauthorized");
    }
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch user: ${res.status}`);
  }

  return res.json();
}

export const logout = async (): Promise<void> => {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  console.log("RESRESRES", res);
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
};
