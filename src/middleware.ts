import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession, decrypt } from "@/lib/auth-edge";

// Protected routes that require authentication
const protectedRoutes = ["/dashboard", "/post-listing", "/profile", "/account"];

// Auth routes that should not be accessible if already logged in
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
    // Update session expiration if it exists
    await updateSession(request);

    const currentUser = request.cookies.get("session")?.value;
    const path = request.nextUrl.pathname;

    // Check if the route is protected
    const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
    const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

    // If trying to access protected route without session
    if (isProtectedRoute && !currentUser) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // If trying to access auth route with session
    if (isAuthRoute && currentUser) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Role-based access control can be added here by decrypting the session
    if (currentUser && isProtectedRoute) {
        const payload = await decrypt(currentUser);
        // Example: if (path.startsWith("/admin") && payload.role !== "ADMIN") ...
    }

    // Admin Route Protection
    if (path.startsWith("/admin")) {
        const adminSession = request.cookies.get("admin_session")?.value;
        if (!adminSession) {
            // Return 404 to hide the admin panel existence
            return NextResponse.rewrite(new URL("/404", request.url));
        }

        // Verify admin session validity
        const payload = await decrypt(adminSession);
        if (!payload || payload.role !== "admin") {
            return NextResponse.rewrite(new URL("/404", request.url));
        }
    }

    // Allow access - add pathname to headers for components
    const response = NextResponse.next();
    response.headers.set('x-pathname', request.nextUrl.pathname);
    return response;
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
