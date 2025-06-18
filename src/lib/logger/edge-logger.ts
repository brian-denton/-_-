/**
 * Edge Runtime Compatible Logger
 * 
 * A lightweight logging utility designed specifically for Next.js Edge Runtime
 * environments like middleware. This logger avoids Node.js-specific modules
 * that are not available in the Edge Runtime.
 */

import { NextRequest } from 'next/server';

/**
 * Log levels enum for type safety
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * Request context interface for edge logging
 */
export interface EdgeRequestContext {
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
 * Log entry structure for consistent formatting
 */
interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  context?: EdgeRequestContext;
  metadata?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

/**
 * Edge-compatible logger class
 * Uses only console output and fetch for external logging
 */
class EdgeLogger {
  private minLevel: LogLevel;
  private enableConsole: boolean;
  private logEndpoint?: string;

  constructor() {
    // Configure based on environment
    this.minLevel = this.getLogLevel();
    this.enableConsole = process.env.NODE_ENV === 'development';
    this.logEndpoint = process.env.EDGE_LOG_ENDPOINT;
  }

  /**
   * Get log level from environment
   */
  private getLogLevel(): LogLevel {
    const envLevel = process.env.LOG_LEVEL?.toLowerCase();
    switch (envLevel) {
      case 'debug': return LogLevel.DEBUG;
      case 'info': return LogLevel.INFO;
      case 'warn': return LogLevel.WARN;
      case 'error': return LogLevel.ERROR;
      default: return LogLevel.INFO;
    }
  }

  /**
   * Create a formatted log entry
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: EdgeRequestContext,
    metadata?: Record<string, any>,
    error?: Error
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel[level],
      message,
    };

    if (context) {
      entry.context = context;
    }

    if (metadata) {
      entry.metadata = metadata;
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    return entry;
  }

  /**
   * Format log entry for console output
   */
  private formatConsoleMessage(entry: LogEntry): string {
    let message = `[${entry.timestamp}] ${entry.level.toUpperCase()}`;
    
    if (entry.context?.requestId) {
      message += ` [${entry.context.requestId}]`;
    }
    
    if (entry.context?.userId) {
      message += ` [User: ${entry.context.userId}]`;
    }
    
    message += `: ${entry.message}`;

    if (entry.metadata) {
      message += `\n  Metadata: ${JSON.stringify(entry.metadata, null, 2)}`;
    }

    if (entry.error?.stack) {
      message += `\n${entry.error.stack}`;
    }

    return message;
  }

  /**
   * Send log to external endpoint asynchronously
   */
  private async sendToEndpoint(entry: LogEntry): Promise<void> {
    if (!this.logEndpoint) return;

    try {
      // Use fetch in fire-and-forget mode
      fetch(this.logEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      }).catch(() => {
        // Silently ignore fetch errors to prevent cascading issues
      });
    } catch {
      // Silently ignore errors
    }
  }

  /**
   * Core logging method
   */
  private log(
    level: LogLevel,
    message: string,
    context?: EdgeRequestContext,
    metadata?: Record<string, any>,
    error?: Error
  ): void {
    // Skip if below minimum level
    if (level < this.minLevel) return;

    const entry = this.createLogEntry(level, message, context, metadata, error);

    // Console output
    if (this.enableConsole) {
      const consoleMessage = this.formatConsoleMessage(entry);
      
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(consoleMessage);
          break;
        case LogLevel.INFO:
          console.info(consoleMessage);
          break;
        case LogLevel.WARN:
          console.warn(consoleMessage);
          break;
        case LogLevel.ERROR:
          console.error(consoleMessage);
          break;
      }
    }

    // Send to external endpoint (async, non-blocking)
    if (this.logEndpoint) {
      this.sendToEndpoint(entry);
    }
  }

  /**
   * Debug level logging
   */
  debug(message: string, context?: EdgeRequestContext, metadata?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context, metadata);
  }

  /**
   * Info level logging
   */
  info(message: string, context?: EdgeRequestContext, metadata?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context, metadata);
  }

  /**
   * Warning level logging
   */
  warn(message: string, context?: EdgeRequestContext, metadata?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context, metadata);
  }

  /**
   * Error level logging
   */
  error(message: string, context?: EdgeRequestContext, metadata?: Record<string, any>, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, metadata, error);
  }
}

// Create singleton logger instance
export const edgeLogger = new EdgeLogger();

/**
 * Extract request context from Next.js request for edge runtime
 */
export function extractEdgeRequestContext(request: NextRequest): EdgeRequestContext {
  // Generate a simple request ID without uuid dependency
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Extract IP address (considering proxies)
  const ipAddress = 
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown';
  
  // Extract user agent
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
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
 * Log HTTP requests in edge runtime
 */
export function logEdgeHttpRequest(
  context: EdgeRequestContext,
  statusCode: number,
  responseTime: number,
  additionalMeta?: Record<string, any>
): void {
  const metadata = {
    statusCode,
    responseTime: `${responseTime}ms`,
    ...additionalMeta,
  };

  const message = `${context.method} ${context.url} ${statusCode} ${responseTime}ms`;
  
  if (statusCode >= 500) {
    edgeLogger.error(message, context, metadata);
  } else if (statusCode >= 400) {
    edgeLogger.warn(message, context, metadata);
  } else {
    edgeLogger.info(message, context, metadata);
  }
}

/**
 * Log errors in edge runtime
 */
export function logEdgeError(
  error: Error,
  context?: Partial<EdgeRequestContext>,
  additionalMeta?: Record<string, any>
): void {
  edgeLogger.error(
    `Middleware Error: ${error.message}`,
    context as EdgeRequestContext,
    additionalMeta,
    error
  );
} 