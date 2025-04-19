import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const publicBackendAPI = axios.create({
  baseURL: process.env.BACKEND_PUBLIC_API_URL, // e.g. "https://localhost:6969/api/v1"
  headers: { "Content-Type": "application/json" },
});

// POST /api/v1/launch-emails -> forwards to https://localhost:6969/api/v1/launch-emails
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await publicBackendAPI.post("/launch-emails", body, {});
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}
