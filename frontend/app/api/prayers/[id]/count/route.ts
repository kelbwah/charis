import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getAuth } from "@clerk/nextjs/server";

const backendApi = axios.create({
  baseURL: process.env.BACKEND_API_URL,
  headers: { "Content-Type": "application/json" },
});

// GET /api/prayers/:id/count -> forwards to https://localhost:6969/api/v1/prayers/:id/count
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = getAuth(request);
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const id = (await params).id;
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
