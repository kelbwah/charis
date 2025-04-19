import { clerkMiddleware } from "@clerk/nextjs/server";
import {
  NextResponse,
  type NextRequest,
  type NextFetchEvent,
} from "next/server";

const isComingSoon = process.env.FEATURE_COMING_SOON === "true";
const clerk = clerkMiddleware();

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  const pathname = req.nextUrl.pathname;

  if (pathname === "/api/launch-emails") {
    return NextResponse.next();
  }

  if (
    !isComingSoon &&
    (pathname === "/coming-soon" || pathname === "/coming-soon/")
  ) {
    return NextResponse.rewrite(new URL("/404", req.url));
  }

  if (
    isComingSoon &&
    pathname !== "/coming-soon" &&
    pathname !== "/coming-soon/"
  ) {
    const url = req.nextUrl.clone();
    url.pathname = "/coming-soon";
    return NextResponse.redirect(url);
  }

  return clerk(req, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
