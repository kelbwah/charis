import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getAuth } from "@clerk/nextjs/server";

const backendApi = axios.create({
  baseURL: process.env.BACKEND_API_URL,
  headers: { "Content-Type": "application/json" },
});

// // GET /api/prayers/:id -> forwards to https://localhost:6969/api/v1/prayers/:id
// export async function GET(
//   request: NextRequest,
//   context: { params: { id: string } }
// ) {
//   const id = context.params.id;
//   try {
//     const response = await backendApi.get(`/prayers/${id}`);
//     return NextResponse.json(response.data, { status: response.status });
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message },
//       { status: error.response?.status || 500 }
//     );
//   }
// }

// // PUT /api/prayers/:id -> forwards to https://localhost:6969/api/v1/prayers/:id
// export async function PUT(
//   request: NextRequest,
//   context: { params: { id: string } }
// ) {
//   const id = context.params.id;
//   try {
//     const body = await request.json();
//     const response = await backendApi.put(`/prayers/${id}`, body);
//     return NextResponse.json(response.data, { status: response.status });
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message },
//       { status: error.response?.status || 500 }
//     );
//   }
// }

// DELETE /api/prayers/:id -> forwards to https://localhost:6969/api/v1/prayers/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = getAuth(request);
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const authHeader = request.headers.get("Authorization");
  const id = (await params).id;
  try {
    const response = await backendApi.delete(`/prayers/${id}`, {
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
