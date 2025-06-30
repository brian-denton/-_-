/**
 * Next.js middleware for request logging and monitoring
 * Captures request details, timing, and user context
 * Uses edge-compatible logger to avoid Node.js runtime issues
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { checkRateLimit } from "./lib/security/rate-limit";
import {
  type EdgeRequestContext,
  extractEdgeRequestContext,
  logEdgeError,
  logEdgeHttpRequest,
} from "./lib/logger/edge-logger";

const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 50; // max requests per IP per window

function applySecurityHeaders(response: NextResponse, nonce: string) {
  const isDev = process.env.NODE_ENV === "development";

  // Generate CSP with nonce
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' ${
    isDev ? "'unsafe-eval' 'unsafe-inline'" : "'strict-dynamic'"
  };
    style-src 'self' 'nonce-${nonce}' 'unsafe-inline';
    img-src 'self' data: blob:;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    ${isDev ? "" : "upgrade-insecure-requests;"}
    connect-src 'self' ${isDev ? "ws: wss:" : ""};
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set("Content-Security-Policy", cspHeader);
}

/**
 * Main middleware function
 * Logs all incoming requests with comprehensive metadata
 */
export async function middleware(request: NextRequest) {
  const startTime = Date.now();

  // Generate nonce for CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // Extract request context for logging
  const context: EdgeRequestContext = {
    ...extractEdgeRequestContext(request),
    startTime,
  };

  try {
    if (request.nextUrl.pathname.startsWith("/api")) {
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "unknown";
      const allowed = checkRateLimit(ip, {
        windowMs: RATE_LIMIT_WINDOW,
        maxRequests: RATE_LIMIT_MAX,
      });
      if (!allowed) {
        return NextResponse.json(
          { error: "Too many requests" },
          { status: 429 }
        );
      }
    }

    // Create new headers and add nonce
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-nonce", nonce);

    // Continue with the request
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    // Add request ID to response headers for debugging
    response.headers.set("x-request-id", context.requestId);
    applySecurityHeaders(response, nonce);

    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Log the request after response is ready
    const statusCode = response.status;

    // Skip logging for certain paths to reduce noise
    const shouldSkipLogging = shouldSkipPath(request.nextUrl.pathname);

    if (!shouldSkipLogging) {
      logEdgeHttpRequest(context, statusCode, responseTime, {
        // Add any additional metadata here
        path: request.nextUrl.pathname,
        query: Object.fromEntries(request.nextUrl.searchParams),
        referer: request.headers.get("referer"),
      });
    }

    return response;
  } catch (error) {
    // Log any middleware errors
    const responseTime = Date.now() - startTime;

    logEdgeError(
      error instanceof Error ? error : new Error("Unknown middleware error"),
      context,
      {
        path: request.nextUrl.pathname,
        responseTime: `${responseTime}ms`,
      }
    );

    // Return error response
    const errorResponse = NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: 500,
        headers: {
          "x-request-id": context.requestId,
        },
      }
    );
    applySecurityHeaders(errorResponse, nonce);
    return errorResponse;
  }
}

/**
 * Determine if a path should be skipped from logging
 * Reduces noise from static assets and health checks
 */
function shouldSkipPath(pathname: string): boolean {
  const skipPatterns = [
    "/_next/static", // Next.js static assets
    "/_next/image", // Next.js image optimization
    "/favicon.ico", // Favicon requests
    "/api", // API routes handle their own logging
    "/robots.txt", // SEO files
    "/sitemap.xml", // SEO files
    "/health", // Health check endpoints
    "/ping", // Ping endpoints
    "/.well-known", // Well-known URIs
  ];

  return skipPatterns.some((pattern) => pathname.startsWith(pattern));
}

/**
 * Configure which paths the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: "/((?!_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
