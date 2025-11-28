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
    // 1. ADMIN SUBDOMAIN ROUTING (yonetim.projectnexx.com) OR /admin PATH
    // ----------------------------------------------------------------------
    if (subdomain === "yonetim" || subdomain === "admin" || path.startsWith("/admin")) {
        // Rewrite everything to /admin path internally if on subdomain
        // e.g. yonetim.projectnexx.com/users -> /admin/users

        // IP RESTRICTION (VPN Check)
        // In production, you might want to enforce this.
        // For now, we'll check if ALLOWED_ADMIN_IPS is set.
        const allowedIps = process.env.ALLOWED_ADMIN_IPS?.split(",") || [];
        // Add localhost IPs automatically
        const localhostIps = ["127.0.0.1", "::1", "localhost"];
        const allAllowedIps = [...allowedIps, ...localhostIps];
        const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip");

        if (allowedIps.length > 0 && clientIp) {
            const isAllowed = allAllowedIps.some(ip => clientIp.includes(ip.trim()));
            if (!isAllowed) {
                return new NextResponse("Access Denied: VPN Required", { status: 403 });
            }
        }

        // AUTHENTICATION CHECK - require admin_session cookie
        // Allow /login page to bypass auth check
        // Also allow /admin/login explicitly
        if (path !== "/login" && !path.startsWith("/login?") && path !== "/admin/login" && !path.startsWith("/admin/login?")) {
            const adminSession = request.cookies.get("admin_session");
            if (!adminSession) {
                // If on main domain /admin, redirect to /admin/login
                if (path.startsWith("/admin")) {
                    return NextResponse.redirect(new URL("/admin/login", request.url));
                }
                return NextResponse.redirect(new URL("/login", request.url));
            }
        }

        // STATIC FILE ACCESS
        // Don't rewrite for secure uploads, serve them directly from public folder
        if (path.startsWith("/secure-uploads")) {
            return NextResponse.next();
        }

        // If we are on the main domain and path starts with /admin, we don't need to rewrite
        if (path.startsWith("/admin")) {
            const response = NextResponse.next();
            response.headers.set('x-subdomain', 'admin'); // Treat as admin
            return response;
        }

        // Rewrite the URL to the /admin folder for subdomains
        // We need to handle the path correctly. 
        // If the path is just "/", it should map to "/admin"
        // If the path is "/users", it should map to "/admin/users"
        const newUrl = new URL(`/admin${path === "/" ? "" : path}`, request.url);

        // Pass the subdomain as a header for easier debugging/usage
        const response = NextResponse.rewrite(newUrl);
        response.headers.set('x-subdomain', subdomain || 'admin');
        return response;
    }

    // ----------------------------------------------------------------------
    // 2. PREVENT DIRECT ACCESS TO /admin ON MAIN DOMAIN
    // ----------------------------------------------------------------------
    // REMOVED: We now allow /admin access on main domain for easier Vercel deployment
    // if (path.startsWith("/admin")) {
    //    return NextResponse.rewrite(new URL("/404", request.url));
    // }

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
