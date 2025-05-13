import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtectedRoute = path === "/flifo" || path.startsWith("/flifo/")
  const isAuthenticated = request.cookies.has("auth")
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(path)}`, request.url))
  }
  return NextResponse.next()
}
export const config = {
  matcher: ["/flifo", "/flifo/:path*"],
}
