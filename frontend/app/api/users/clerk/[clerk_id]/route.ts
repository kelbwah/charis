import { NextRequest, NextResponse } from 'next/server'; 
import axios from 'axios';

const backendApi = axios.create({
  baseURL: process.env.BACKEND_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// GET /api/users/clerk/:clerk_id -> forwards to https://localhost:6969/api/v1/users
export async function GET(
    request: NextRequest,
    { params }: { params: { clerk_id: string } }
) {
  try {
    const authHeader = request.headers.get("Authorization")
    const response = await backendApi.get(`/users/clerk/${params.clerk_id}`, {
      headers: { Authorization: authHeader }
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}