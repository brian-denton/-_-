/**
 * Shared TypeScript types for the logging system
 * Replaces `any` types with proper type definitions
 */

// Base metadata that can be logged
export interface BaseLogMetadata {
	[key: string]: string | number | boolean | null | undefined | object;
}

// HTTP-specific metadata
export interface HttpLogMetadata extends BaseLogMetadata {
	statusCode?: string | number;
	responseTime?: string | number;
	method?: string;
	url?: string;
	userAgent?: string;
	ipAddress?: string;
}

// Error-specific metadata
export interface ErrorLogMetadata extends BaseLogMetadata {
	stack?: string;
	errorCode?: string | number;
	name?: string;
}

// Authentication-specific metadata
export interface AuthLogMetadata extends BaseLogMetadata {
	userId?: string;
	authEvent?: "login" | "logout" | "signup" | "failed_login";
	sessionId?: string;
}

// Database-specific metadata
export interface DatabaseLogMetadata extends BaseLogMetadata {
	dbOperation?: "select" | "insert" | "update" | "delete";
	dbTable?: string;
	duration?: number;
	rowsAffected?: number;
}

// Generic log metadata type that encompasses all possible metadata
export type LogMetadata =
	| BaseLogMetadata
	| HttpLogMetadata
	| ErrorLogMetadata
	| AuthLogMetadata
	| DatabaseLogMetadata
	| Record<string, unknown>;

// Extended metadata for request contexts
export interface RequestContextMetadata extends BaseLogMetadata {
	requestId?: string;
	userId?: string;
	sessionId?: string;
	ipAddress?: string;
	userAgent?: string;
	method?: string;
	url?: string;
	startTime?: number;
}
