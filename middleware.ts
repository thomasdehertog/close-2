import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Separate middleware chain
const middlewareChain = authMiddleware({
  publicRoutes: [
    "/sign-in",
    "/sign-up",
    "/api/edgestore/(.*)",
    "/preview/(.*)",
    "/"  // Add root path as public
  ],
  ignoredRoutes: [
    "/api/edgestore/(.*)"
  ],
  async afterAuth(auth, req) {
    const headers = await new Headers(req.headers);
    
    // Handle authentication routing
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }

    // Handle authenticated routing
    if (auth.userId) {
      const url = new URL(req.url);
      if (url.pathname === '/') {
        return NextResponse.rewrite(new URL('/dashboard', req.url));
      }
    }

    return NextResponse.next({
      request: { headers }
    });
  },
});

export default middlewareChain;

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 