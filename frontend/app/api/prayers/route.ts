import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import type { Prayer } from "@/services/types";
import { normalizePrayer } from "@/services/api";

const backendApi = axios.create({
  baseURL: process.env.BACKEND_API_URL, // e.g. "https://localhost:6969/api/v1"
  headers: { "Content-Type": "application/json" },
});

// GET /api/prayers -> forwards to https://localhost:6969/api/v1/prayers

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const authHeader = request.headers.get("Authorization");

  const queryParams: Record<string, string> = {};
  for (const [key, value] of searchParams.entries()) {
    queryParams[key] = value;
  }

  try {
    const response = await backendApi.get("/prayers", {
      params: queryParams,
      headers: { Authorization: authHeader },
    });

    const rawPrayers = response.data;
    const prayers = Array.isArray(rawPrayers)
      ? rawPrayers.map(normalizePrayer)
      : [];

    return NextResponse.json(prayers, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}

// POST /api/prayers -> forwards to https://localhost:6969/api/v1/prayers
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  try {
    const body = await request.json();
    const response = await backendApi.post("/prayers", body, {
      headers: { Authorization: authHeader },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}
