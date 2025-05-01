import { NextRequest, NextResponse } from "next/server";

const PUBLIC_API = [
  "/api/launch-emails",
  "/api/register",
  "/api/login",
  "/api/auth/refresh",
];

const PROTECTED_PAGES = [
  "/profile",
  "/dashboard",
  "/prayers",
  "/users",
  "/submit",
];

export default async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  if (
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    /\.(css|js|png|jpg|jpeg|svg|ico|webmanifest)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (
    PUBLIC_API.includes(pathname) ||
    PUBLIC_API.some((p) => pathname.startsWith(p + "/"))
  ) {
    return NextResponse.next();
  }

  const isProtected = PROTECTED_PAGES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (isProtected && !accessToken) {
    if (refreshToken) {
      const refreshResponse = await fetch(`${origin}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: req.cookies.toString(),
        },
      });

      if (refreshResponse.ok) {
        const setCookie = refreshResponse.headers.get("set-cookie");
        const res = NextResponse.next();
        if (setCookie) {
          res.headers.set("set-cookie", setCookie);
        }
        return res;
      }

      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/auth";
      redirectUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/auth";
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
