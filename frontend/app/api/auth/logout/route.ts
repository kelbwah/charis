import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const backendRes = await fetch(`${process.env.BACKEND_API_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Service-Token": process.env.SERVICE_API_TOKEN!,
        Cookie: (await cookies()).toString(),
      },
      credentials: "include",
      body: "",
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
    console.log(error.message);
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}
