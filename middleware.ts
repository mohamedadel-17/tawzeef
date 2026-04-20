// middleware.ts
import { auth } from "@/src/auth.config";

export default auth((req) => {
  const { nextUrl } = req;
  const { pathname } = nextUrl;
  const user = req.auth?.user as { role?: string } | undefined;
  const isLoggedIn = !!user;

  const isPublicRoute = ["/login", "/signup"].includes(pathname);
  const isAdminRoute = pathname.startsWith("/admin");
  const isUserRoute = pathname.startsWith("/home");

  if (isLoggedIn) {
    const role = user?.role;

    if (isPublicRoute) {
      return Response.redirect(new URL(role === "admin" ? "/admin" : "/home", nextUrl));
    }

    if (isAdminRoute && role !== "admin") {
      return Response.redirect(new URL("/home", nextUrl));
    }

    if (isUserRoute && role !== "user") {
      return Response.redirect(new URL("/admin", nextUrl));
    }
  }

  else {
    if (isAdminRoute || isUserRoute) {
      return Response.redirect(new URL("/login", nextUrl));
    }
  }

  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};