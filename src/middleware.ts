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
    const url = request.nextUrl;
    const path = url.pathname;

    // Hostname handling for Subdomains
    const hostname = request.headers.get("host") || "";
    const allowedDomains = ["localhost:3000", "sahibinden.com", "projectnexx.com"]; // Add your production domains

    // Check if we are on a subdomain
    // For localhost: admin.localhost:3000
    // For production: yonetim.projectnexx.com
    const isLocal = hostname.includes("localhost");
    const rootDomain = isLocal ? "localhost:3000" : (process.env.ROOT_DOMAIN || "projectnexx.com");

    // Extract subdomain
    // admin.localhost:3000 -> admin
    // yonetim.projectnexx.com -> yonetim
    const currentHost = hostname.replace(`.${rootDomain}`, "");
    const isSubdomain = hostname !== rootDomain && hostname.endsWith(rootDomain);
    const subdomain = isSubdomain ? currentHost : null;

    // ----------------------------------------------------------------------
    // 1. ADMIN SUBDOMAIN ROUTING (yonetim.projectnexx.com)
    // ----------------------------------------------------------------------
    if (subdomain === "yonetim" || subdomain === "admin") {
        // Rewrite everything to /admin path internally
        // e.g. yonetim.projectnexx.com/users -> /admin/users

        // IP RESTRICTION (VPN Check)
        // In production, you might want to enforce this.
        // For now, we'll check if ALLOWED_ADMIN_IPS is set.
        const allowedIps = process.env.ALLOWED_ADMIN_IPS?.split(",") || [];
        const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip");

        if (allowedIps.length > 0 && clientIp) {
            const isAllowed = allowedIps.some(ip => clientIp.includes(ip.trim()));
            if (!isAllowed) {
                return new NextResponse("Access Denied: VPN Required", { status: 403 });
            }
        }

        // Rewrite the URL to the /admin folder
        // We need to handle the path correctly. 
        // If the path is just "/", it should map to "/admin"
        // If the path is "/users", it should map to "/admin/users"
        const newUrl = new URL(`/admin${path === "/" ? "" : path}`, request.url);

        // Pass the subdomain as a header for easier debugging/usage
        const response = NextResponse.rewrite(newUrl);
        response.headers.set('x-subdomain', subdomain);
        return response;
    }

    // ----------------------------------------------------------------------
    // 2. PREVENT DIRECT ACCESS TO /admin ON MAIN DOMAIN
    // ----------------------------------------------------------------------
    if (path.startsWith("/admin")) {
        // If someone tries to access projectnexx.com/admin, redirect them or show 404
        // We want them to use yonetim.projectnexx.com
        return NextResponse.rewrite(new URL("/404", request.url));
    }

    // ----------------------------------------------------------------------
    // 3. STANDARD AUTH & PROTECTION
    // ----------------------------------------------------------------------

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

    // Allow access - add pathname to headers for components
    const response = NextResponse.next();
    response.headers.set('x-pathname', path);
    return response;
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
