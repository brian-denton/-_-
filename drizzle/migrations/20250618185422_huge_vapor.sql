DO $$ BEGIN
    CREATE TYPE "public"."log_level" AS ENUM('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "log_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"user_id" uuid,
	"ip_address" "inet",
	"user_agent" text,
	"start_time" timestamp with time zone DEFAULT now() NOT NULL,
	"last_activity" timestamp with time zone DEFAULT now() NOT NULL,
	"environment" varchar(20) DEFAULT 'development' NOT NULL,
	CONSTRAINT "log_sessions_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"level" "log_level" NOT NULL,
	"message" text NOT NULL,
	"meta" jsonb,
	"request_id" uuid,
	"user_id" uuid,
	"session_id" varchar(255),
	"ip_address" "inet",
	"user_agent" text,
	"method" varchar(10),
	"url" text,
	"status_code" varchar(5),
	"response_time" varchar(20),
	"stack" text,
	"error_code" varchar(50),
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"environment" varchar(20) DEFAULT 'development' NOT NULL,
	"service" varchar(100) DEFAULT 'nextjs-app' NOT NULL,
	"version" varchar(50)
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "log_sessions_session_id_idx" ON "log_sessions" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "log_sessions_user_id_idx" ON "log_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "log_sessions_last_activity_idx" ON "log_sessions" USING btree ("last_activity");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "logs_timestamp_idx" ON "logs" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "logs_level_idx" ON "logs" USING btree ("level");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "logs_user_id_idx" ON "logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "logs_request_id_idx" ON "logs" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "logs_environment_idx" ON "logs" USING btree ("environment");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "logs_error_code_idx" ON "logs" USING btree ("error_code");