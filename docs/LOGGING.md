# Application Logging System

## Overview

This application uses a comprehensive logging system built with **Winston**, **Supabase PostgreSQL**, and **Drizzle ORM** to provide application-wide logging with IP address and browser tracking capabilities.

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Application   │ -> │   Winston Logger │ -> │  Supabase DB    │
│   Components    │    │                  │    │  (PostgreSQL)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              v
                       ┌──────────────────┐
                       │  Console & Files │
                       │   (Development)  │
                       └──────────────────┘
```

## Features

### 🔍 **Comprehensive Metadata Capture**

- **User IP Address** - Extracted from `x-forwarded-for`, `x-real-ip` headers
- **User Agent** - Full browser and device information
- **Request ID** - Unique identifier for correlating logs across requests
- **Session Tracking** - Session ID for user activity correlation
- **Performance Metrics** - Response times and status codes
- **Error Stack Traces** - Full error context with stack traces

### 🚀 **Multiple Transport Support**

- **Console Logging** - Colored output for development
- **File Rotation** - Daily rotating files with configurable retention
- **Database Storage** - Structured logging to Supabase PostgreSQL
- **Batched Writes** - Efficient database writes with configurable batching

### 🔒 **Privacy Compliance**

- **Configurable Tracking** - Enable/disable user tracking features
- **Data Retention** - Automatic log cleanup with configurable retention periods
- **Anonymization Support** - Optional IP address anonymization

## Database Schema

The logging system uses two main tables:

### `logs` Table

```sql
- id (UUID, Primary Key)
- level (ENUM: error, warn, info, http, verbose, debug, silly)
- message (TEXT)
- meta (JSONB) - Additional metadata
- request_id (UUID) - Request correlation
- user_id (UUID) - User identification
- session_id (VARCHAR) - Session tracking
- ip_address (INET) - User IP address
- user_agent (TEXT) - Browser information
- method (VARCHAR) - HTTP method
- url (TEXT) - Request URL
- status_code (VARCHAR) - HTTP response code
- response_time (VARCHAR) - Response duration
- stack (TEXT) - Error stack trace
- error_code (VARCHAR) - Application error code
- timestamp (TIMESTAMPTZ) - Log creation time
- environment (VARCHAR) - deployment environment
- service (VARCHAR) - Service identifier
- version (VARCHAR) - Application version
```

### `log_sessions` Table

```sql
- id (UUID, Primary Key)
- session_id (VARCHAR, Unique)
- user_id (UUID)
- ip_address (INET)
- user_agent (TEXT)
- start_time (TIMESTAMPTZ)
- last_activity (TIMESTAMPTZ)
- environment (VARCHAR)
```

## Configuration

### Environment Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres

# Logging Configuration
LOG_LEVEL=info                    # Minimum log level
LOG_TO_DATABASE=true              # Enable database logging
LOG_TO_FILE=true                  # Enable file logging
LOG_RETENTION_DAYS=30             # Log retention period

# Application
NODE_ENV=development              # Environment setting

# Edge Runtime Logging
EDGE_LOG_ENDPOINT=http://localhost:3000/api/edge-logs  # Optional forwarding
```

### Winston Configuration Levels

```typescript
{
  error: 0,    // Critical errors that need immediate attention
  warn: 1,     // Warning conditions that should be monitored
  info: 2,     // General informational messages
  http: 3,     // HTTP request/response logging
  verbose: 4,  // Detailed operational information
  debug: 5,    // Debug information for development
  silly: 6     // Extremely detailed debug information
}
```

## Usage Examples

### Basic Logging

```typescript
import { logger } from "@/lib/logger";

// Simple logging
logger.info("User logged in successfully");
logger.error("Database connection failed", {
  dbHost: "localhost",
  error: error.message,
});
```

### Request-Scoped Logging

```typescript
import { extractRequestContext, createRequestLogger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  const context = extractRequestContext(request);
  const requestLogger = createRequestLogger(context);

  requestLogger.info("Processing user registration");

  try {
    // Your logic here
    requestLogger.info("User registered successfully", { userId: newUser.id });
  } catch (error) {
    requestLogger.error("Registration failed", { error: error.message });
  }
}
```

### Specialized Logging Functions

```typescript
import { logAuth, logDatabase, logError, logHttpRequest } from "@/lib/logger";

// Authentication events
logAuth("login", userId, context, { method: "email" });

// Database operations
logDatabase("insert", "users", context, { recordId: user.id });

// Error logging with context
logError(new Error("Payment processing failed"), context, {
  orderId: "12345",
  amount: 99.99,
});

// HTTP request logging
logHttpRequest(context, 200, 1250, { cached: false });
```

### In API Routes (Node.js Runtime)

```typescript
import { logger, logHttpRequest, logError } from "@/lib/logger";

export async function GET(request: NextRequest) {
  const context = extractRequestContext(request);

  try {
    // Your API logic here
    const result = await someOperation();

    logger.info("Operation completed successfully", {
      ...context,
      operation: "getData",
      resultCount: result.length,
    });

    return NextResponse.json(result);
  } catch (error) {
    logError(error, context, { operation: "getData" });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
```

### In Middleware (Edge Runtime)

```typescript
import {
  extractEdgeRequestContext,
  logEdgeHttpRequest,
  logEdgeError,
} from "@/lib/logger/edge-logger";

export async function middleware(request: NextRequest) {
  const context = extractEdgeRequestContext(request);
  const startTime = Date.now();

  try {
    const response = NextResponse.next();
    const responseTime = Date.now() - startTime;

    logEdgeHttpRequest(context, response.status, responseTime);

    return response;
  } catch (error) {
    logEdgeError(error, context);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
```

### In React Components

```typescript
import { logger } from "@/lib/logger";

function MyComponent() {
  const handleAction = async () => {
    try {
      await performAction();
      logger.info("User action completed", {
        component: "MyComponent",
        action: "performAction",
      });
    } catch (error) {
      logger.error("Action failed", {
        component: "MyComponent",
        error: error.message,
      });
    }
  };
}
```

## Privacy & Compliance

### What Data Is Collected

✅ **Collected by Default:**

- IP addresses (for security and debugging)
- User agent strings (browser/device information)
- Request timestamps and response times
- HTTP methods and URLs (excluding sensitive query parameters)
- User IDs (when authenticated)
- Error stack traces and messages

⚠️ **Privacy Considerations:**

- IP addresses are considered PII in some jurisdictions (GDPR, CCPA)
- User agent strings can be used for device fingerprinting
- Log data includes user activity patterns

### Compliance Features

1. **Data Retention**: Automatic cleanup of old logs
2. **Anonymization**: Optional IP address anonymization
3. **Access Control**: Database-level access restrictions
4. **Audit Trail**: Immutable log records for compliance

### GDPR Compliance

```typescript
// Example: Anonymize IP addresses for GDPR compliance
const anonymizeIP = (ip: string) => {
  const parts = ip.split(".");
  parts[3] = "0"; // Replace last octet
  return parts.join(".");
};
```

## Database Migrations

### Initial Setup

```bash
# Install dependencies
npm install winston winston-daily-rotate-file drizzle-orm postgres @supabase/supabase-js drizzle-kit uuid

# Generate migration
npx drizzle-kit generate

# Apply migration (for development)
npx drizzle-kit push
```

### Production Deployment

```bash
# For production, use proper migration commands
npx drizzle-kit migrate
```

## Monitoring & Alerting

### Log Level Monitoring

- **ERROR** logs should trigger immediate alerts
- **WARN** logs should be monitored for patterns
- **INFO** logs provide operational visibility
- **HTTP** logs enable performance monitoring

### Performance Metrics

```typescript
// Example: Monitor slow requests
if (responseTime > 3000) {
  logger.warn("Slow request detected", {
    url: request.url,
    responseTime: `${responseTime}ms`,
    threshold: "3000ms",
  });
}
```

### Database Queries for Monitoring

```sql
-- Recent error logs
SELECT * FROM logs
WHERE level = 'error'
AND timestamp > NOW() - INTERVAL '1 hour'
ORDER BY timestamp DESC;

-- Response time analysis
SELECT
  url,
  AVG(CAST(REPLACE(response_time, 'ms', '') AS INTEGER)) as avg_response_time,
  COUNT(*) as request_count
FROM logs
WHERE level = 'http'
AND timestamp > NOW() - INTERVAL '24 hours'
GROUP BY url
ORDER BY avg_response_time DESC;

-- Error frequency by user
SELECT
  user_id,
  COUNT(*) as error_count,
  MAX(timestamp) as last_error
FROM logs
WHERE level = 'error'
AND user_id IS NOT NULL
AND timestamp > NOW() - INTERVAL '7 days'
GROUP BY user_id
ORDER BY error_count DESC;
```

## API Endpoints

### GET /api/logs

Retrieve application logs with filtering support.

**Query Parameters:**

- `level` - Filter by log level
- `limit` - Number of records (default: 50)
- `offset` - Pagination offset (default: 0)
- `userId` - Filter by user ID
- `since` - ISO date string for time filtering

### POST /api/logs

Create test log entries for development/testing.

**Request Body:**

```json
{
  "level": "info",
  "message": "Test log message",
  "meta": {
    "source": "manual-test"
  },
  "userId": "optional-user-id"
}
```

### DELETE /api/logs

Clean up old logs based on retention policy.

**Query Parameters:**

- `days` - Retention period (default: 30)

### GET /api/edge-logs

Retrieve edge runtime logs.

**Query Parameters:**

- `limit` - Number of records (default: 50)
- `offset` - Pagination offset (default: 0)

## Development

### Testing the Logger

1. Visit the homepage to see the Logger Demo component
2. Use the demo interface to create test logs
3. Try different scenarios (auth, errors, performance)
4. View logs via the API or database directly

### Local Development Setup

1. Set up Supabase project
2. Copy `.env.example` to `.env.local`
3. Configure environment variables
4. Run database migrations
5. Start the development server

```bash
npm run dev
```

## Production Deployment

### Performance Considerations

1. **Batch Size**: Adjust `batchSize` for optimal database performance
2. **Flush Interval**: Balance between real-time logging and performance
3. **Log Levels**: Use appropriate log levels to avoid excessive data
4. **Database Indexing**: Ensure proper indexes are in place

### Security Considerations

1. **Database Access**: Use least-privilege access for the logging service
2. **Sensitive Data**: Avoid logging sensitive information (passwords, tokens)
3. **Log Injection**: Sanitize user inputs before logging
4. **Rate Limiting**: Implement rate limiting for log creation endpoints

## Troubleshooting

### Common Issues

**Database Connection Issues:**

- Verify `DATABASE_URL` is correct
- Check Supabase connection pooling settings
- Ensure `prepare: false` for connection pooling compatibility

**Missing Logs in Database:**

- Check if `LOG_TO_DATABASE=true` in environment
- Verify database permissions
- Check Winston transport initialization

**High Database Usage:**

- Adjust batch size and flush interval
- Implement log level filtering
- Set up proper retention policies

### Debug Mode

```typescript
// Enable debug logging
process.env.LOG_LEVEL = "debug";

// View Winston internals
logger.on("error", (error) => {
  console.error("Winston error:", error);
});
```

## Future Enhancements

- [ ] Log aggregation dashboard
- [ ] Real-time log streaming
- [ ] Advanced search and filtering
- [ ] Log analytics and insights
- [ ] Integration with monitoring services (DataDog, New Relic)
- [ ] Automated alerting rules
- [ ] Log anonymization pipeline
- [ ] Performance optimization with caching
