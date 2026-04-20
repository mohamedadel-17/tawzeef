// middleware.ts
import { auth } from "@/src/auth.config";

export default auth((req) => {
  const isLoggedIn = !!req.auth; 
  const { nextUrl } = req;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = ["/login", "/signup"].includes(nextUrl.pathname);
  
  const isProtectedRoute = nextUrl.pathname.startsWith("/home") || nextUrl.pathname.startsWith("/admin");

  if (isApiAuthRoute) return;

  if (isPublicRoute) {
    if (isLoggedIn && (req.auth?.user as any)?.role === "admin") {
      return Response.redirect(new URL("/admin", nextUrl));
    }
    if (isLoggedIn && (req.auth?.user as any)?.role === "user") {
      return Response.redirect(new URL("/home", nextUrl));
    }
    return;
  }

  if (!isLoggedIn && isProtectedRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  if (nextUrl.pathname.startsWith("/admin") && (req.auth?.user as any)?.role !== "admin") {
    return Response.redirect(new URL("/home", nextUrl));
  }

  return; 
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};