/**
 * Logger demonstration component
 * Shows how to use the logging system in React components
 */
"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LogLevel = "error" | "warn" | "info" | "debug";

export function LoggerDemo() {
	const [message, setMessage] = useState("");
	const [level, setLevel] = useState<LogLevel>("info");
	const [loading, setLoading] = useState(false);
	const [lastRequestId, setLastRequestId] = useState<string>("");
	const logLevelId = useId();
	const logMessageId = useId();

	/**
	 * Send a test log to the API
	 */
	const sendTestLog = async () => {
		if (!message.trim()) return;

		setLoading(true);

		try {
			const response = await fetch("/api/logs", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					level,
					message,
					meta: {
						source: "logger-demo-component",
						timestamp: new Date().toISOString(),
						userAction: "manual-test-log",
					},
					userId: "demo-user-123", // In real app, get from auth context
				}),
			});

			const result = await response.json();

			if (response.ok) {
				setLastRequestId(result.requestId);
				setMessage("");
				alert(`Log sent successfully! Request ID: ${result.requestId}`);
			} else {
				throw new Error(result.error || "Failed to send log");
			}
		} catch (error) {
			console.error("Failed to send test log:", error);
			alert("Failed to send log. Check console for details.");
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Trigger different logging scenarios
	 */
	const triggerScenario = async (scenario: string) => {
		setLoading(true);

		const scenarios = {
			"auth-success": {
				level: "info" as LogLevel,
				message: "User authentication successful",
				meta: {
					authMethod: "email",
					loginDuration: "1.2s",
					previousLogin: "2024-01-15T10:30:00Z",
				},
			},
			"auth-failure": {
				level: "warn" as LogLevel,
				message: "Authentication failed - invalid credentials",
				meta: {
					authMethod: "email",
					attemptCount: 3,
					accountLocked: false,
				},
			},
			"database-error": {
				level: "error" as LogLevel,
				message: "Database connection timeout",
				meta: {
					query: "SELECT * FROM users WHERE id = ?",
					timeout: "5000ms",
					retryAttempt: 2,
				},
			},
			"api-rate-limit": {
				level: "warn" as LogLevel,
				message: "API rate limit exceeded",
				meta: {
					endpoint: "/api/data",
					rateLimitHit: true,
					requestsPerMinute: 150,
					limit: 100,
				},
			},
			"performance-slow": {
				level: "warn" as LogLevel,
				message: "Slow API response detected",
				meta: {
					endpoint: "/api/heavy-operation",
					responseTime: "5400ms",
					threshold: "3000ms",
					optimization: "required",
				},
			},
		};

		const logData = scenarios[scenario as keyof typeof scenarios];

		if (!logData) {
			alert("Unknown scenario");
			setLoading(false);
			return;
		}

		try {
			const response = await fetch("/api/logs", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...logData,
					meta: {
						...logData.meta,
						source: "logger-demo-scenario",
						scenario,
					},
					userId: "demo-user-123",
				}),
			});

			const result = await response.json();

			if (response.ok) {
				setLastRequestId(result.requestId);
				alert(`Scenario "${scenario}" logged! Request ID: ${result.requestId}`);
			} else {
				throw new Error(result.error || "Failed to log scenario");
			}
		} catch (error) {
			console.error("Failed to log scenario:", error);
			alert("Failed to log scenario. Check console for details.");
		} finally {
			setLoading(false);
		}
	};

	/**
	 * View recent logs
	 */
	const viewLogs = async () => {
		try {
			const response = await fetch("/api/logs?limit=10");
			const result = await response.json();

			if (response.ok) {
				console.log("Recent logs:", result.logs);
				alert(
					`Retrieved ${result.logs.length} recent logs. Check browser console for details.`,
				);
			} else {
				throw new Error(result.error || "Failed to retrieve logs");
			}
		} catch (error) {
			console.error("Failed to retrieve logs:", error);
			alert("Failed to retrieve logs. Check console for details.");
		}
	};

	return (
		<div className="mx-auto max-w-2xl space-y-6 p-6">
			<div className="text-center">
				<h2 className="mb-2 font-bold text-2xl">Logger Demonstration</h2>
				<p className="text-gray-600">
					Test the Winston + Supabase + Drizzle logging system
				</p>
				{lastRequestId && (
					<p className="mt-2 text-blue-600 text-sm">
						Last Request ID: {lastRequestId}
					</p>
				)}
			</div>

			{/* Custom Log Entry */}
			<div className="space-y-4 rounded-lg border p-4">
				<h3 className="font-semibold text-lg">Send Custom Log</h3>

				<div className="space-y-3">
					<div>
						<label
							htmlFor={logLevelId}
							className="mb-1 block font-medium text-sm"
						>
							Log Level
						</label>
						<select
							id={logLevelId}
							value={level}
							onChange={(e) => setLevel(e.target.value as LogLevel)}
							className="w-full rounded-md border p-2"
						>
							<option value="debug">Debug</option>
							<option value="info">Info</option>
							<option value="warn">Warning</option>
							<option value="error">Error</option>
						</select>
					</div>

					<div>
						<label
							htmlFor={logMessageId}
							className="mb-1 block font-medium text-sm"
						>
							Message
						</label>
						<Input
							id={logMessageId}
							type="text"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							placeholder="Enter log message..."
							className="w-full"
						/>
					</div>

					<Button
						onClick={sendTestLog}
						disabled={loading || !message.trim()}
						className="w-full"
					>
						{loading ? "Sending..." : "Send Log"}
					</Button>
				</div>
			</div>

			{/* Scenario Testing */}
			<div className="space-y-4 rounded-lg border p-4">
				<h3 className="font-semibold text-lg">Test Scenarios</h3>
				<p className="text-gray-600 text-sm">
					Try common logging scenarios to see how different events are captured
				</p>

				<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
					<Button
						variant="outline"
						onClick={() => triggerScenario("auth-success")}
						disabled={loading}
					>
						✅ Auth Success
					</Button>

					<Button
						variant="outline"
						onClick={() => triggerScenario("auth-failure")}
						disabled={loading}
					>
						⚠️ Auth Failure
					</Button>

					<Button
						variant="outline"
						onClick={() => triggerScenario("database-error")}
						disabled={loading}
					>
						💥 DB Error
					</Button>

					<Button
						variant="outline"
						onClick={() => triggerScenario("api-rate-limit")}
						disabled={loading}
					>
						🚦 Rate Limit
					</Button>

					<Button
						variant="outline"
						onClick={() => triggerScenario("performance-slow")}
						disabled={loading}
						className="sm:col-span-2"
					>
						🐌 Slow Response
					</Button>
				</div>
			</div>

			{/* View Logs */}
			<div className="rounded-lg border p-4">
				<h3 className="mb-3 font-semibold text-lg">View Recent Logs</h3>
				<Button variant="secondary" onClick={viewLogs} className="w-full">
					📋 View Recent Logs (Console)
				</Button>
				<p className="mt-2 text-gray-500 text-xs">
					Logs will be displayed in the browser console
				</p>
			</div>

			{/* Privacy Notice */}
			<div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
				<h4 className="mb-2 font-semibold text-blue-800">
					🔒 Privacy & Tracking Information
				</h4>
				<div className="space-y-1 text-blue-700 text-sm">
					<p>
						<strong>IP Address:</strong> Captured for security and debugging
						purposes
					</p>
					<p>
						<strong>User Agent:</strong> Browser and device information logged
					</p>
					<p>
						<strong>Request ID:</strong> Unique identifier for request
						correlation
					</p>
					<p>
						<strong>Timestamps:</strong> All logs include precise timing
						information
					</p>
					<p>
						<strong>User ID:</strong> Associated with authenticated users when
						available
					</p>
				</div>
			</div>
		</div>
	);
}
