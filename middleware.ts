import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ✅ Protected routes list
const protectedRoutes = ["/resumes", "/create-resume", "/edit", "/dashboard"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // 🟢 Allow public pages (login, register, home)
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname === "/" ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // 🔒 If visiting a protected route without token → redirect to login
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname); // optional: redirect back after login
    return NextResponse.redirect(loginUrl);
  }

  // ✅ If token exists → allow access
  return NextResponse.next();
}

// ✅ Define which routes this middleware runs on
export const config = {
  matcher: [
    "/resumes/:path*",
    "/create-resume",
    "/edit/:path*",
    "/dashboard/:path*",
  ],
};
