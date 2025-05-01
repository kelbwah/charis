import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Check presence of tokens
  try {
    const backendRes = await fetch(`${process.env.BACKEND_API_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Service-Token": process.env.SERVICE_API_TOKEN!,
        Cookie: (await cookies()).toString(),
      },
      credentials: "include",
    });

    const resJSON = await backendRes.json();
    return NextResponse.json(resJSON, { status: backendRes.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}
