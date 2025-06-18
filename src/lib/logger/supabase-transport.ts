/**
 * Custom Winston transport for logging to Supabase database
 * Stores logs in PostgreSQL using Drizzle ORM with comprehensive metadata
 */
import Transport from "winston-transport";
import { db, type InsertLog, type LogLevel, logsTable } from "../db";

interface SupabaseTransportOptions extends Transport.TransportStreamOptions {
	tableName?: string;
	batchSize?: number;
	flushInterval?: number;
	includeUserTracking?: boolean;
}

interface LogInfo {
	level: string;
	message: string;
	timestamp?: string;
	requestId?: string;
	userId?: string;
	sessionId?: string;
	ipAddress?: string;
	userAgent?: string;
	method?: string;
	url?: string;
	statusCode?: string;
	responseTime?: string;
	stack?: string;
	errorCode?: string;
	environment?: string;
	service?: string;
	version?: string;
	[key: string]: unknown;
}

/**
 * Custom Winston transport for Supabase database logging
 * Provides batched logging with comprehensive metadata capture
 */
export class SupabaseTransport extends Transport {
	private batchSize: number;
	private flushInterval: number;
	private includeUserTracking: boolean;
	private logBatch: InsertLog[] = [];
	private flushTimer?: NodeJS.Timeout;

	constructor(opts: SupabaseTransportOptions = {}) {
		super(opts);

		this.batchSize = opts.batchSize || 10; // Batch size for database writes
		this.flushInterval = opts.flushInterval || 5000; // 5 seconds
		this.includeUserTracking = opts.includeUserTracking ?? true;

		// Start periodic flush timer
		this.startFlushTimer();

		// Handle process shutdown gracefully
		process.on("beforeExit", () => this.flush());
		process.on("SIGINT", () => this.flush());
		process.on("SIGTERM", () => this.flush());
	}

	/**
	 * Main logging method called by Winston
	 * Transforms Winston log info into database record
	 */
	log(info: LogInfo, callback: () => void): void {
		setImmediate(() => {
			this.emit("logged", info);
		});

		try {
			const logRecord = this.transformLogInfo(info);
			this.addToBatch(logRecord);
			callback();
		} catch (error) {
			this.emit("error", error);
			callback();
		}
	}

	/**
	 * Transform Winston log info into database record format
	 * Only includes defined values to avoid SQL insertion errors
	 */
	private transformLogInfo(info: LogInfo): InsertLog {
		const now = new Date();

		// Extract metadata from the info object
		const {
			level,
			message,
			timestamp,
			requestId,
			userId,
			sessionId,
			ipAddress,
			userAgent,
			method,
			url,
			statusCode,
			responseTime,
			stack,
			errorCode,
			environment,
			service,
			version,
			...meta
		} = info;

		// Validate required fields
		if (!level || !message) {
			throw new Error("Log level and message are required");
		}

		// Build the log record, only including defined values with proper validation
		const logRecord: InsertLog = {
			level: level as LogLevel,
			message: String(message), // Ensure message is a string
			timestamp: timestamp ? new Date(timestamp) : now,
			environment: environment || process.env.NODE_ENV || "development",
			service: service || "nextjs-app",
		};

		// Only add optional fields if they have valid values
		if (Object.keys(meta).length > 0) {
			// Ensure meta is serializable JSON
			try {
				logRecord.meta = JSON.parse(JSON.stringify(meta));
			} catch (error) {
				console.warn("Failed to serialize meta object, skipping:", error);
			}
		}

		// Validate and add UUID fields
		if (requestId && this.isValidUUID(requestId)) {
			logRecord.requestId = requestId;
		}
		if (userId && this.isValidUUID(userId)) {
			logRecord.userId = userId;
		}

		// Validate and add string fields with length constraints
		if (sessionId && String(sessionId).length <= 255) {
			logRecord.sessionId = String(sessionId);
		}
		if (ipAddress) {
			logRecord.ipAddress = String(ipAddress);
		}
		if (userAgent) {
			logRecord.userAgent = String(userAgent);
		}
		if (method && String(method).length <= 10) {
			logRecord.method = String(method);
		}
		if (url) {
			logRecord.url = String(url);
		}
		if (statusCode && String(statusCode).length <= 5) {
			logRecord.statusCode = String(statusCode);
		}
		if (responseTime && String(responseTime).length <= 20) {
			logRecord.responseTime = String(responseTime);
		}
		if (stack) {
			logRecord.stack = String(stack);
		}
		if (errorCode && String(errorCode).length <= 50) {
			logRecord.errorCode = String(errorCode);
		}
		if (version && String(version).length <= 50) {
			logRecord.version = String(version);
		}

		return logRecord;
	}

	/**
	 * Validate if a string is a valid UUID format
	 */
	private isValidUUID(uuid: string): boolean {
		const uuidRegex =
			/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		return uuidRegex.test(uuid);
	}

	/**
	 * Add log record to batch for efficient database writing
	 */
	private addToBatch(logRecord: InsertLog): void {
		this.logBatch.push(logRecord);

		// Flush if batch is full
		if (this.logBatch.length >= this.batchSize) {
			this.flush();
		}
	}

	/**
	 * Flush pending logs to database with improved error handling
	 */
	private async flush(): Promise<void> {
		if (this.logBatch.length === 0) return;

		const logsToFlush = [...this.logBatch];
		this.logBatch = [];

		try {
			// Validate each log record before attempting insert
			const validatedLogs = logsToFlush.map((log, index) => {
				try {
					// Ensure all required fields are present
					if (!log.level || !log.message) {
						throw new Error(
							`Log ${index}: Missing required fields (level: ${log.level}, message: ${log.message})`,
						);
					}

					// Ensure timestamp is valid
					if (log.timestamp && Number.isNaN(log.timestamp.getTime())) {
						log.timestamp = new Date();
					}

					return log;
				} catch (error) {
					console.error(
						`Log validation failed for record ${index}:`,
						error,
						log,
					);
					throw error;
				}
			});

			// Attempt to insert all logs in batch
			await db.insert(logsTable).values(validatedLogs);

			// Log successful batch write for debugging (only in development)
			if (process.env.NODE_ENV === "development") {
				console.log(
					`✅ Successfully wrote ${validatedLogs.length} logs to database`,
				);
			}
		} catch (error) {
			// Enhanced error logging with more context
			const errorMessage =
				error instanceof Error ? error.message : String(error);

			// Prevent recursive logging by using console instead of logger
			console.error("❌ Database logging error:", {
				error: errorMessage,
				batchSize: logsToFlush.length,
				sampleLog: logsToFlush[0], // Include first log for debugging
				timestamp: new Date().toISOString(),
			});

			// Try to insert logs individually to identify problematic records
			await this.retryIndividualInserts(logsToFlush);

			// Emit error but don't throw to prevent application crash
			this.emit(
				"error",
				new Error(`Failed to write logs to database: ${errorMessage}`),
			);
		}
	}

	/**
	 * Retry failed batch insert by attempting individual inserts
	 * This helps identify which specific log records are causing issues
	 */
	private async retryIndividualInserts(logs: InsertLog[]): Promise<void> {
		for (const log of logs) {
			try {
				await db.insert(logsTable).values([log]);
			} catch (error) {
				// Log specific record that failed
				console.error("Failed to insert individual log record:", {
					log,
					error: error instanceof Error ? error.message : String(error),
				});
			}
		}
	}

	/**
	 * Start periodic flush timer
	 */
	private startFlushTimer(): void {
		this.flushTimer = setInterval(() => {
			this.flush().catch((error) => {
				this.emit("error", error);
			});
		}, this.flushInterval);
	}

	/**
	 * Stop the transport and flush remaining logs
	 */
	close(): void {
		if (this.flushTimer) {
			clearInterval(this.flushTimer);
		}

		this.flush().catch((error) => {
			this.emit("error", error);
		});
	}
}

/**
 * Factory function to create Supabase transport instance
 */
export function createSupabaseTransport(
	options: SupabaseTransportOptions = {},
): SupabaseTransport {
	return new SupabaseTransport({
		level: "info",
		// format: null, // We handle formatting in transformLogInfo
		...options,
	});
}
