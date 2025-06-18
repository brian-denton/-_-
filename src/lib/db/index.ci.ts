/**
 * CI-safe database connection setup
 * This version handles missing environment variables gracefully
 */
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Check if we're in CI environment
const isCI = process.env.CI === "true" || process.env.NODE_ENV === "test";

// Use mock database URL for CI if DATABASE_URL is not set
const databaseUrl =
	process.env.DATABASE_URL ||
	(isCI ? "postgresql://ci:ci@localhost:5432/ci_test" : undefined);

if (!databaseUrl && !isCI) {
	throw new Error("DATABASE_URL environment variable is required");
}

/**
 * Create PostgreSQL client with CI-safe configuration
 */
let client: postgres.Sql<{}>;

if (isCI && !process.env.DATABASE_URL) {
	// Mock client for CI - doesn't actually connect
	console.log("Using mock database client for CI environment");
	client = {} as postgres.Sql<{}>;
} else {
	client = postgres(databaseUrl!, {
		prepare: false,
		max: 10,
		idle_timeout: 20,
		max_lifetime: 60 * 30,
		ssl: process.env.NODE_ENV === "production" ? "require" : false,
	});
}

/**
 * Drizzle database instance with schema
 * In CI mode, this returns a mock instance
 */
export const db =
	isCI && !process.env.DATABASE_URL
		? ({} as ReturnType<typeof drizzle>)
		: drizzle(client, { schema });

// Export type for use in application
export type Database = typeof db;
