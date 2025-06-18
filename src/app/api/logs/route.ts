/**
 * API route for logging demonstration and log management
 * Shows how to use the logger in API routes with request context
 */
import { NextRequest, NextResponse } from 'next/server';
import { 
  extractRequestContext, 
  createRequestLogger, 
  logError,
  logger 
} from '@/lib/logger';
import { db, logsTable } from '@/lib/db';
import { desc, gte, and, eq } from 'drizzle-orm';

/**
 * GET /api/logs - Retrieve application logs
 * Supports filtering by level, date range, user, etc.
 */
export async function GET(request: NextRequest) {
  const context = extractRequestContext(request);
  const requestLogger = createRequestLogger(context);
  
  try {
    requestLogger.info('Retrieving application logs');
    
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const userId = searchParams.get('userId');
    const since = searchParams.get('since'); // ISO date string
    
    // Build query conditions
    const conditions = [];
    
    if (level) {
      conditions.push(eq(logsTable.level, level as any));
    }
    
    if (userId) {
      conditions.push(eq(logsTable.userId, userId));
    }
    
    if (since) {
      const sinceDate = new Date(since);
      conditions.push(gte(logsTable.timestamp, sinceDate));
    }
    
    // Query logs with filters
    const logs = await db
      .select()
      .from(logsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(logsTable.timestamp))
      .limit(limit)
      .offset(offset);
    
    requestLogger.info(`Retrieved ${logs.length} logs`, {
      filters: { level, userId, since },
      resultCount: logs.length,
    });
    
    return NextResponse.json({
      logs,
      pagination: {
        limit,
        offset,
        count: logs.length,
      },
    });
    
  } catch (error) {
    logError(
      error instanceof Error ? error : new Error('Failed to retrieve logs'),
      context,
      { operation: 'GET /api/logs' }
    );
    
    return NextResponse.json(
      { error: 'Failed to retrieve logs' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/logs - Create a test log entry
 * Demonstrates different logging levels and metadata
 */
export async function POST(request: NextRequest) {
  const context = extractRequestContext(request);
  const requestLogger = createRequestLogger(context);
  
  try {
    const body = await request.json();
    const { level, message, meta, userId } = body;
    
    // Validate input
    if (!level || !message) {
      requestLogger.warn('Invalid log creation request', { body });
      return NextResponse.json(
        { error: 'Level and message are required' },
        { status: 400 }
      );
    }
    
    // Create the log entry
    const logData = {
      ...context,
      userId,
      message,
      ...meta,
    };
    
    // Log at the specified level
    switch (level) {
      case 'error':
        requestLogger.error(message, logData);
        break;
      case 'warn':
        requestLogger.warn(message, logData);
        break;
      case 'info':
        requestLogger.info(message, logData);
        break;
      case 'debug':
        requestLogger.debug(message, logData);
        break;
      default:
        requestLogger.info(message, logData);
    }
    
    requestLogger.info('Test log entry created', {
      testLogLevel: level,
      testLogMessage: message,
    });
    
    return NextResponse.json({
      success: true,
      message: 'Log entry created',
      requestId: context.requestId,
    });
    
  } catch (error) {
    logError(
      error instanceof Error ? error : new Error('Failed to create log'),
      context,
      { operation: 'POST /api/logs' }
    );
    
    return NextResponse.json(
      { error: 'Failed to create log entry' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/logs - Clean up old logs
 * Removes logs older than specified retention period
 */
export async function DELETE(request: NextRequest) {
  const context = extractRequestContext(request);
  const requestLogger = createRequestLogger(context);
  
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    requestLogger.info(`Cleaning up logs older than ${days} days`, {
      cutoffDate: cutoffDate.toISOString(),
    });
    
    // Delete old logs
    const result = await db
      .delete(logsTable)
      .where(gte(logsTable.timestamp, cutoffDate));
    
    requestLogger.info('Log cleanup completed', {
      retentionDays: days,
      cutoffDate: cutoffDate.toISOString(),
    });
    
    return NextResponse.json({
      success: true,
      message: `Cleaned up logs older than ${days} days`,
      cutoffDate: cutoffDate.toISOString(),
    });
    
  } catch (error) {
    logError(
      error instanceof Error ? error : new Error('Failed to clean up logs'),
      context,
      { operation: 'DELETE /api/logs' }
    );
    
    return NextResponse.json(
      { error: 'Failed to clean up logs' },
      { status: 500 }
    );
  }
} 