/**
 * Database connection setup using Drizzle ORM with Supabase PostgreSQL
 * Configured for both development and production environments
 */
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Validate required environment variables
if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL environment variable is required");
}

/**
 * Create PostgreSQL client with optimized configuration
 * Disables prepared statements for Supabase connection pooling compatibility
 */
const client = postgres(process.env.DATABASE_URL, {
	// Disable prepared statements for Supabase connection pooling
	prepare: false,
	// Connection pool configuration
	max: 10, // Maximum number of connections
	idle_timeout: 20, // Close idle connections after 20 seconds
	max_lifetime: 60 * 30, // Maximum connection lifetime (30 minutes)
	// Enable SSL for production
	ssl: process.env.NODE_ENV === "production" ? "require" : false,
});

/**
 * Drizzle database instance with schema
 * Provides type-safe database operations
 */
export const db = drizzle(client, { schema });

/**
 * Close database connections (useful for testing and cleanup)
 */
export async function closeDatabase() {
	await client.end();
}

// Export schema for use in other parts of the application
export * from "./schema";
