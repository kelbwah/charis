import { NextRequest, NextResponse } from "next/server";

// POST /api/auth/login -> forwards to https://localhost:6969/api/v1/login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendRes = await fetch(`${process.env.BACKEND_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Service-Token": process.env.SERVICE_API_TOKEN!,
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const responseBody = await backendRes.json();
    const res = NextResponse.json(responseBody, {
      status: backendRes.status,
    });

    const setCookie = backendRes.headers.get("set-cookie");
    if (setCookie) {
      res.headers.set("set-cookie", setCookie);
    }

    return res;
  } catch (error: any) {
    console.error("Login Error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}
