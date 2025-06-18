/**
 * Database schema for logging system using Drizzle ORM
 * Defines tables for storing application logs with comprehensive metadata
 */
import { 
  pgTable, 
  uuid, 
  text, 
  timestamp, 
  jsonb, 
  varchar, 
  inet, 
  index,
  pgEnum
} from 'drizzle-orm/pg-core';

// Define log levels as an enum for type safety
export const logLevelEnum = pgEnum('log_level', [
  'error',
  'warn', 
  'info',
  'http',
  'verbose',
  'debug',
  'silly'
]);

/**
 * Main logs table for storing all application logs
 * Includes comprehensive metadata for debugging and analytics
 * Note: Column names match the actual database table structure (snake_case)
 */
export const logsTable = pgTable(
  'logs',
  {
    // Primary key
    id: uuid('id').defaultRandom().primaryKey(),
    
    // Log content
    level: logLevelEnum('level').notNull(),
    message: text('message').notNull(),
    meta: jsonb('meta'), // Additional metadata as JSON
    
    // Request context - mapping camelCase to snake_case database columns
    requestId: uuid('request_id'), // Correlate logs from same request
    userId: uuid('user_id'), // User who triggered the log (if applicable)
    sessionId: varchar('session_id', { length: 255 }), // Session identifier
    
    // Network information
    ipAddress: inet('ip_address'), // User's IP address
    userAgent: text('user_agent'), // Browser/client information
    
    // Request details
    method: varchar('method', { length: 10 }), // HTTP method (GET, POST, etc.)
    url: text('url'), // Request URL
    statusCode: varchar('status_code', { length: 5 }), // HTTP status code
    
    // Performance
    responseTime: varchar('response_time', { length: 20 }), // Response time in ms
    
    // Error details (for error logs)
    stack: text('stack'), // Error stack trace
    errorCode: varchar('error_code', { length: 50 }), // Application error code
    
    // Timing
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
    
    // Environment context
    environment: varchar('environment', { length: 20 }).notNull().default('development'),
    service: varchar('service', { length: 100 }).notNull().default('nextjs-app'),
    version: varchar('version', { length: 50 }), // Application version
  },
  (table) => ({
    // Indexes for efficient querying
    timestampIdx: index('logs_timestamp_idx').on(table.timestamp),
    levelIdx: index('logs_level_idx').on(table.level),
    userIdIdx: index('logs_user_id_idx').on(table.userId),
    requestIdIdx: index('logs_request_id_idx').on(table.requestId),
    environmentIdx: index('logs_environment_idx').on(table.environment),
    errorCodeIdx: index('logs_error_code_idx').on(table.errorCode),
  })
);

/**
 * Log sessions table for tracking user sessions
 * Helps correlate logs across multiple requests in a session
 */
export const logSessionsTable = pgTable(
  'log_sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    sessionId: varchar('session_id', { length: 255 }).notNull().unique(),
    userId: uuid('user_id'),
    ipAddress: inet('ip_address'),
    userAgent: text('user_agent'),
    startTime: timestamp('start_time', { withTimezone: true }).notNull().defaultNow(),
    lastActivity: timestamp('last_activity', { withTimezone: true }).notNull().defaultNow(),
    environment: varchar('environment', { length: 20 }).notNull().default('development'),
  },
  (table) => ({
    sessionIdIdx: index('log_sessions_session_id_idx').on(table.sessionId),
    userIdIdx: index('log_sessions_user_id_idx').on(table.userId),
    lastActivityIdx: index('log_sessions_last_activity_idx').on(table.lastActivity),
  })
);

// Type definitions for TypeScript
export type InsertLog = typeof logsTable.$inferInsert;
export type SelectLog = typeof logsTable.$inferSelect;
export type InsertLogSession = typeof logSessionsTable.$inferInsert;
export type SelectLogSession = typeof logSessionsTable.$inferSelect;

// Log level type for use in application
export type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly'; 