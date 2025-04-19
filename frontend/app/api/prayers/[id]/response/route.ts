import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getAuth } from "@clerk/nextjs/server";

const backendApi = axios.create({
  baseURL: process.env.BACKEND_API_URL,
  headers: { "Content-Type": "application/json" },
});

// GET /api/prayers/:id/response -> forwards to https://localhost:6969/api/v1/prayers/:id/response
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { userId } = getAuth(request);
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const id = context.params.id;
  try {
    const authHeader = request.headers.get("Authorization");
    const response = await backendApi.get(`/prayers/${id}/response`, {
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

// POST /api/prayers/:id/response?status={status} -> forwards to https://localhost:6969/api/v1/prayers/:id/response
export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { userId } = getAuth(request);
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const id = context.params.id;
  const authHeader = request.headers.get("Authorization");
  try {
    const response = await backendApi.post(`/prayers/${id}/response`, null, {
      params: status ? { status } : {},
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

// PUT /api/prayers/:id/response?status={status} -> forwards to https://localhost:6969/api/v1/prayers/:id/response?status={status}
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { userId } = getAuth(request);
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const id = context.params.id;
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const authHeader = request.headers.get("Authorization");
  try {
    const response = await backendApi.put(`/prayers/${id}/response`, null, {
      params: status ? { status } : {},
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

// PUT /api/prayers/:id/response -> forwards to https://localhost:6969/api/v1/prayers/:id/response
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { userId } = getAuth(request);
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const id = context.params.id;
  try {
    const authHeader = request.headers.get("Authorization");
    const response = await backendApi.delete(`/prayers/${id}/response`, {
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
