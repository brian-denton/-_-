/**
 * Logger demonstration component
 * Shows how to use the logging system in React components
 */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LogLevel = "error" | "warn" | "info" | "debug";

export function LoggerDemo() {
  const [message, setMessage] = useState("");
  const [level, setLevel] = useState<LogLevel>("info");
  const [loading, setLoading] = useState(false);
  const [lastRequestId, setLastRequestId] = useState<string>("");

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
          `Retrieved ${result.logs.length} recent logs. Check browser console for details.`
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
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Logger Demonstration</h2>
        <p className="text-gray-600">
          Test the Winston + Supabase + Drizzle logging system
        </p>
        {lastRequestId && (
          <p className="text-sm text-blue-600 mt-2">
            Last Request ID: {lastRequestId}
          </p>
        )}
      </div>

      {/* Custom Log Entry */}
      <div className="border rounded-lg p-4 space-y-4">
        <h3 className="text-lg font-semibold">Send Custom Log</h3>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Log Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as LogLevel)}
              className="w-full p-2 border rounded-md"
            >
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warn">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <Input
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
      <div className="border rounded-lg p-4 space-y-4">
        <h3 className="text-lg font-semibold">Test Scenarios</h3>
        <p className="text-sm text-gray-600">
          Try common logging scenarios to see how different events are captured
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">View Recent Logs</h3>
        <Button variant="secondary" onClick={viewLogs} className="w-full">
          📋 View Recent Logs (Console)
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          Logs will be displayed in the browser console
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">
          🔒 Privacy & Tracking Information
        </h4>
        <div className="text-sm text-blue-700 space-y-1">
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
