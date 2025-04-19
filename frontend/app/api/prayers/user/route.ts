import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { Prayer } from "@/services/types";
import { normalizePrayer } from "@/services/api";

const backendApi = axios.create({
  baseURL: process.env.BACKEND_API_URL,
  headers: { "Content-Type": "application/json" },
});

// GET /api/prayers/user -> forwards to https://localhost:6969/api/v1/prayers/user
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    const response = await backendApi.get(`/prayers/user`, {
      headers: { Authorization: authHeader },
    });

    const rawPrayers = response.data;
    const prayers: Prayer[] = Array.isArray(rawPrayers)
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
