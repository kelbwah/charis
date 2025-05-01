import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const backendApi = axios.create({
  baseURL: process.env.BACKEND_API_URL, // e.g. "https://localhost:6969/api/v1"
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// POST /api/token/refresh -> forwards to https://localhost:6969/api/v1/token/refresh
export async function POST(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie") || "";

  try {
    const backendRes = await backendApi.post(
      `/token/refresh`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "X-Service-Token": process.env.SERVICE_API_TOKEN,
          Cookie: cookieHeader,
        },
        withCredentials: true,
      }
    );

    const res = NextResponse.json(backendRes.data, {
      status: backendRes.status,
    });

    const setCookie = backendRes.headers["set-cookie"];
    if (setCookie) {
      if (Array.isArray(setCookie)) {
        setCookie.forEach((c) => res.headers.append("Set-Cookie", c));
      } else {
        res.headers.set("Set-Cookie", setCookie);
      }
    }

    return res;
  } catch (err: any) {
    const status = err.response?.status || 500;
    const body = err.response?.data || { error: err.message };
    return NextResponse.json(body, { status });
  }
}
