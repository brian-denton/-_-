/**
 * Drizzle Kit configuration for CI/testing environments
 * Uses mock database URL and minimal configuration
 */
import { defineConfig } from "drizzle-kit";

// Use mock database URL for CI
const DATABASE_URL =
	process.env.DATABASE_URL || "postgresql://ci:ci@localhost:5432/ci_test";

export default defineConfig({
	// Database configuration
	schema: "./src/lib/db/schema.ts",
	out: "./drizzle/migrations",
	dialect: "postgresql",

	// Database connection (mocked for CI)
	dbCredentials: {
		url: DATABASE_URL,
	},

	// Migration settings
	migrations: {
		prefix: "supabase",
	},

	// Development options - less verbose for CI
	verbose: false,
	strict: false, // Don't require confirmation in CI
});
