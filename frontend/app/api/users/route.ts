import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const backendApi = axios.create({
  baseURL: process.env.BACKEND_API_URL,
  headers: { "Content-Type": "application/json" },
});

// // GET /api/users -> forwards to https://localhost:6969/api/v1/users
// export async function GET(request: NextRequest) {
//   try {
//     const response = await backendApi.get('/users');
//     return NextResponse.json(response.data, { status: response.status });
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message },
//       { status: error.response?.status || 500 }
//     );
//   }
// }

// // POST /api/users -> forwards to https://localhost:6969/api/v1/users
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const response = await backendApi.post('/users', body);
//     return NextResponse.json(response.data, { status: response.status });
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message },
//       { status: error.response?.status || 500 }
//     );
//   }
// }
