import type { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
/**
 * Main Winston logger configuration with multiple transports
 * Supports console, file, and PostgreSQL database logging
 */
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { createPostgresTransport } from "./postgres-transport";
import type { LogMetadata } from "./types";

// Install uuid for request ID generation
// npm install uuid @types/uuid

/**
 * Custom log format for console output
 * Includes timestamp, level, and message with colors
 */
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.colorize(),
  winston.format.printf(
    ({ timestamp, level, message, stack, requestId, userId, ...meta }) => {
      let log = `${timestamp} [${level}]`;

      if (requestId) log += ` [${requestId}]`;
      if (userId) log += ` [User: ${userId}]`;

      log += `: ${message}`;

      if (stack) {
        log += `\n${stack}`;
      }

      // Add metadata if present
      const metaKeys = Object.keys(meta);
      if (metaKeys.length > 0) {
        log += `\n  Meta: ${JSON.stringify(meta, null, 2)}`;
      }

      return log;
    }
  )
);

/**
 * File format for structured logging
 * Uses JSON format for easy parsing and analysis
 */
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

/**
 * Create Winston logger with multiple transports
 */
function createLogger() {
  const transports: winston.transport[] = [];

  // Console transport (always enabled in development)
  if (process.env.NODE_ENV === "development") {
    transports.push(
      new winston.transports.Console({
        level: "debug",
        format: consoleFormat,
      })
    );
  } else {
    // Production console logging (errors only)
    transports.push(
      new winston.transports.Console({
        level: "error",
        format: consoleFormat,
      })
    );
  }

  // File transport (if enabled)
  if (process.env.LOG_TO_FILE === "true") {
    transports.push(
      new DailyRotateFile({
        filename: "logs/app-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        maxSize: "20m",
        maxFiles: process.env.LOG_RETENTION_DAYS || "30d",
        level: "info",
        format: fileFormat,
      })
    );

    // Separate error file
    transports.push(
      new DailyRotateFile({
        filename: "logs/error-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        maxSize: "20m",
        maxFiles: process.env.LOG_RETENTION_DAYS || "30d",
        level: "error",
        format: fileFormat,
      })
    );
  }

  // PostgreSQL database transport (if enabled)
  if (process.env.LOG_TO_DATABASE === "true") {
    transports.push(
      createPostgresTransport({
        level: "info",
        batchSize: 20,
        flushInterval: 10000, // 10 seconds
      })
    );
  }

  return winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    transports,
    // Handle uncaught exceptions
    exceptionHandlers: [
      new winston.transports.Console({ format: consoleFormat }),
      ...(process.env.LOG_TO_FILE === "true"
        ? [
            new winston.transports.File({
              filename: "logs/exceptions.log",
              format: fileFormat,
            }),
          ]
        : []),
    ],
    // Handle unhandled promise rejections
    rejectionHandlers: [
      new winston.transports.Console({ format: consoleFormat }),
      ...(process.env.LOG_TO_FILE === "true"
        ? [
            new winston.transports.File({
              filename: "logs/rejections.log",
              format: fileFormat,
            }),
          ]
        : []),
    ],
  });
}

// Create the main logger instance
export const logger = createLogger();

/**
 * Request context interface for enhanced logging
 */
export interface RequestContext {
  requestId: string;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  method?: string;
  url?: string;
  startTime: number;
}

/**
 * Extract request context from Next.js request
 */
export function extractRequestContext(request: NextRequest): RequestContext {
  const requestId = uuidv4();

  // Extract IP address (considering proxies)
  const ipAddress =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // Extract user agent
  const userAgent = request.headers.get("user-agent") || "unknown";

  return {
    requestId,
    ipAddress,
    userAgent,
    method: request.method,
    url: request.url,
    startTime: Date.now(),
  };
}

/**
 * Create a request-scoped logger with context
 */
export function createRequestLogger(context: RequestContext) {
  return {
    error: (message: string, meta?: LogMetadata) => {
      logger.error(message, { ...context, ...meta });
    },
    warn: (message: string, meta?: LogMetadata) => {
      logger.warn(message, { ...context, ...meta });
    },
    info: (message: string, meta?: LogMetadata) => {
      logger.info(message, { ...context, ...meta });
    },
    debug: (message: string, meta?: LogMetadata) => {
      logger.debug(message, { ...context, ...meta });
    },
    http: (statusCode: number, responseTime: number, meta?: LogMetadata) => {
      logger.http(`${context.method} ${context.url}`, {
        ...context,
        statusCode: statusCode.toString(),
        responseTime: `${responseTime}ms`,
        ...meta,
      });
    },
  };
}

/**
 * Log HTTP request details
 */
export function logHttpRequest(
  context: RequestContext,
  statusCode: number,
  responseTime: number,
  additionalMeta?: LogMetadata
) {
  const level =
    statusCode >= 500 ? "error" : statusCode >= 400 ? "warn" : "info";

  logger.log(
    level,
    `${context.method} ${context.url} - ${statusCode} (${responseTime}ms)`,
    {
      ...context,
      statusCode: statusCode.toString(),
      responseTime: `${responseTime}ms`,
      ...additionalMeta,
    }
  );
}

/**
 * Log error with stack trace and context
 */
export function logError(
  error: Error,
  context?: Partial<RequestContext>,
  additionalMeta?: LogMetadata
) {
  logger.error(error.message, {
    ...context,
    stack: error.stack,
    errorCode: (error as Error & { code?: string | number }).code,
    ...additionalMeta,
  });
}

/**
 * Log authentication events
 */
export function logAuth(
  event: "login" | "logout" | "signup" | "failed_login",
  userId?: string,
  context?: Partial<RequestContext>,
  additionalMeta?: LogMetadata
) {
  logger.info(`Auth event: ${event}`, {
    ...context,
    userId,
    authEvent: event,
    ...additionalMeta,
  });
}

/**
 * Log database operations
 */
export function logDatabase(
  operation: "select" | "insert" | "update" | "delete",
  table: string,
  context?: Partial<RequestContext>,
  additionalMeta?: LogMetadata
) {
  logger.debug(`Database ${operation} on ${table}`, {
    ...context,
    dbOperation: operation,
    dbTable: table,
    ...additionalMeta,
  });
}

/**
 * Global error handlers to prevent server crashes
 * Handles unhandled promise rejections and uncaught exceptions
 */
function setupGlobalErrorHandlers() {
  // Handle unhandled promise rejections
  process.on(
    "unhandledRejection",
    (reason: unknown, promise: Promise<unknown>) => {
      try {
        logger.error("Unhandled Promise Rejection", {
          reason: reason instanceof Error ? reason.message : String(reason),
          stack: reason instanceof Error ? reason.stack : undefined,
          promise: promise.toString(),
          source: "global-error-handler",
          rejection: true,
        });
      } catch (logError) {
        // If logging fails, at least log to console
        console.error("Failed to log unhandled rejection:", logError);
        console.error("Original rejection:", reason);
      }
    }
  );

  // Handle uncaught exceptions
  process.on("uncaughtException", (error: Error) => {
    try {
      logger.error("Uncaught Exception", {
        message: error.message,
        stack: error.stack,
        name: error.name,
        source: "global-error-handler",
        exception: true,
      });
    } catch (logError) {
      // If logging fails, at least log to console
      console.error("Failed to log uncaught exception:", logError);
      console.error("Original exception:", error);
    }

    // Exit gracefully after logging
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  });

  // Handle warnings (e.g., memory leaks)
  process.on("warning", (warning: Error) => {
    try {
      logger.warn("Process Warning", {
        message: warning.message,
        name: warning.name,
        stack: warning.stack,
        source: "global-error-handler",
        warning: true,
      });
    } catch (logError) {
      console.error("Failed to log process warning:", logError);
      console.error("Original warning:", warning);
    }
  });
}

// Initialize global error handlers
setupGlobalErrorHandlers();

// Export the main logger for direct use
export default logger;
