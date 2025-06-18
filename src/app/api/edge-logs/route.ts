/**
 * API endpoint for receiving logs from Edge Runtime
 * 
 * This endpoint allows the edge-compatible logger to send logs
 * to be processed by the main Winston logger with file and database transports.
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

/**
 * Log entry interface for incoming edge logs
 */
interface EdgeLogEntry {
  timestamp: string;
  level: string;
  message: string;
  context?: {
    requestId: string;
    userId?: string;
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
    method?: string;
    url?: string;
    startTime: number;
  };
  metadata?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

/**
 * Handle POST requests to process edge logs
 */
export async function POST(request: NextRequest) {
  try {
    const logEntry: EdgeLogEntry = await request.json();
    
    // Validate the log entry
    if (!logEntry.level || !logEntry.message || !logEntry.timestamp) {
      return NextResponse.json(
        { error: 'Invalid log entry format' },
        { status: 400 }
      );
    }

    // Create metadata object for Winston
    const metadata: Record<string, any> = {
      source: 'edge-runtime',
      originalTimestamp: logEntry.timestamp,
      ...logEntry.context,
      ...logEntry.metadata,
    };

    // Add error details if present
    if (logEntry.error) {
      metadata.error = logEntry.error;
    }

    // Log using Winston with appropriate level
    const level = logEntry.level.toLowerCase();
    switch (level) {
      case 'debug':
        logger.debug(logEntry.message, metadata);
        break;
      case 'info':
        logger.info(logEntry.message, metadata);
        break;
      case 'warn':
        logger.warn(logEntry.message, metadata);
        break;
      case 'error':
        // If there's an error object, create an Error instance for Winston
        if (logEntry.error) {
          const error = new Error(logEntry.error.message);
          error.name = logEntry.error.name;
          error.stack = logEntry.error.stack;
          logger.error(logEntry.message, { ...metadata, error });
        } else {
          logger.error(logEntry.message, metadata);
        }
        break;
      default:
        logger.info(logEntry.message, metadata);
    }

    return NextResponse.json({ success: true });
    
  } catch (error) {
    // Log the processing error
    logger.error('Failed to process edge log entry', {
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'edge-logs-api',
    });

    return NextResponse.json(
      { error: 'Failed to process log entry' },
      { status: 500 }
    );
  }
}

/**
 * Handle GET requests (health check)
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'edge-logs',
    description: 'Endpoint for processing edge runtime logs',
  });
} 