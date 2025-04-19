import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const backendApi = axios.create({
  baseURL: process.env.BACKEND_API_URL,
  headers: { "Content-Type": "application/json" },
});

// GET /api/prayers/:id/count -> forwards to https://localhost:6969/api/v1/prayers/:id/count
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const id = context.params.id;
  try {
    const authHeader = request.headers.get("Authorization");
    const response = await backendApi.get(`/prayers/${id}/count`, {
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
