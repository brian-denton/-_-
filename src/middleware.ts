/**
 * Next.js middleware for request logging and monitoring
 * Captures request details, timing, and user context
 * Uses edge-compatible logger to avoid Node.js runtime issues
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
	type EdgeRequestContext,
	extractEdgeRequestContext,
	logEdgeError,
	logEdgeHttpRequest,
} from "./lib/logger/edge-logger";

/**
 * Main middleware function
 * Logs all incoming requests with comprehensive metadata
 */
export async function middleware(request: NextRequest) {
	const startTime = Date.now();

	// Extract request context for logging
	const context: EdgeRequestContext = {
		...extractEdgeRequestContext(request),
		startTime,
	};

	try {
		// Continue with the request
		const response = NextResponse.next();

		// Add request ID to response headers for debugging
		response.headers.set("x-request-id", context.requestId);

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
			},
		);

		// Return error response
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{
				status: 500,
				headers: {
					"x-request-id": context.requestId,
				},
			},
		);
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
 * Excludes API routes that handle their own logging
 */
export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - API routes (they handle their own logging)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
