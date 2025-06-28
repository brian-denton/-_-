import { config } from "dotenv";
/**
 * Drizzle Kit configuration for database migrations and schema management
 * Configured for PostgreSQL database
 */
import { defineConfig } from "drizzle-kit";

// Load environment variables
config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL environment variable is required");
}

export default defineConfig({
	// Database configuration
	schema: "./src/lib/db/schema.ts",
	out: "./drizzle/migrations",
	dialect: "postgresql",

	// Database connection
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},

	// Migration settings
	migrations: {
		prefix: "timestamp", // Use timestamp naming format
	},

	// Development options
	verbose: true, // Show detailed output
	strict: true, // Require confirmation for destructive operations
});
