import { NextResponse } from "next/server";

export function proxy(request) {
  const response = NextResponse.next();
  const host = request.headers.get("host") || "";
  const canonicalHost = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://techx-shop.vercel.app"
  )
    .replace(/^https?:\/\//, "")
    .toLowerCase();

  // If request arrives on a Vercel preview or branch domain (not the primary production host or localhost)
  if (
    host.includes("vercel.app") &&
    host.toLowerCase() !== canonicalHost &&
    !host.startsWith("localhost")
  ) {
    // Prevent search engines from indexing preview, branch, or temporary deployment URLs
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
