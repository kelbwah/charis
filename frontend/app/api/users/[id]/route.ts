import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import type { User } from "@/services/types";
import { getAuth } from "@clerk/nextjs/server";

const backendApi = axios.create({
  baseURL: process.env.BACKEND_API_URL,
  headers: { "Content-Type": "application/json" },
});

function normalizeUser(apiUser: any): User {
  return {
    id: apiUser.ID,
    clerk_id: apiUser.ClerkID,
    email: apiUser.Email,
    username: apiUser.Username,
    avatar_src: apiUser.AvatarSrc,
    created_at: apiUser.CreatedAt,
    updated_at: apiUser.UpdatedAt,
  };
}

// GET /api/users/:id -> forwards to https://localhost:6969/api/v1/users/:id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = getAuth(request);
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const id = (await params).id;
  const authHeader = request.headers.get("Authorization");

  try {
    const response = await backendApi.get(`/users/${id}`, {
      headers: { Authorization: authHeader },
    });
    const user = normalizeUser(response.data);
    return NextResponse.json(user, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}

// // PUT /api/users/:id -> forwards to https://localhost:6969/api/v1/users/:id
// export async function PUT(
//   request: NextRequest,
//   context: { params: { id: string } }
// ) {
//   const id = context.params.id;
//   try {
//     const body = await request.json();
//     const response = await backendApi.put(`/users/${id}`, body);
//     return NextResponse.json(response.data, { status: response.status });
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message },
//       { status: error.response?.status || 500 }
//     );
//   }
// }

// // DELETE /api/users/:id -> forwards to https://localhost:6969/api/v1/users/:id
// export async function DELETE(
//   request: NextRequest,
//   context: { params: { id: string } }
// ) {
//   const id = context.params.id;
//   try {
//     const response = await backendApi.delete(`/users/${id}`);
//     return NextResponse.json(response.data, { status: response.status });
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message },
//       { status: error.response?.status || 500 }
//     );
//   }
// }
