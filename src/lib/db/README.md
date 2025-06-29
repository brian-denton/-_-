# Database Layer (Drizzle + PostgreSQL)

This directory hosts everything related to **persistence & logging**.  
It provides a type-safe connection powered by [`drizzle-orm`](https://github.com/drizzle-team/drizzle-orm) and a schema optimised for application log storage.

---

## File Overview

| File              | Purpose                                                                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **`schema.ts`**   | Declares the PostgreSQL tables (`logs`, `log_sessions`) using Drizzle's `pg-core` helpers. Generates reusable TypeScript types.          |
| **`index.ts`**    | Production/development runtime connection builder. Exports a `db` instance and helper `closeDatabase()` to terminate pooled connections. |
| **`index.ci.ts`** | CI-safe connection that returns a mock `db` when `DATABASE_URL` is not set, preventing test pipelines from hitting a real database.      |

---

## 1. `schema.ts`

### Tables

1. **`logsTable`** — Central store for every log line written by the application.
2. **`logSessionsTable`** — Captures session-level metadata to correlate multiple requests.

> Both tables include extensive indexes to keep analytical queries fast.

| Column                              | Type             | Description                                                               |
| ----------------------------------- | ---------------- | ------------------------------------------------------------------------- |
| `id`                                | `uuid` _(PK)_    | Auto-generated primary key.                                               |
| `level`                             | enum `log_level` | `error` \| `warn` \| `info` \| `http` \| `verbose` \| `debug` \| `silly`. |
| `message`                           | `text`           | Human readable message.                                                   |
| `meta`                              | `jsonb`          | Arbitrary structured metadata.                                            |
| `request_id` … `response_time`      | various          | Context extracted from HTTP layer.                                        |
| `stack`, `error_code`               | `text`/`varchar` | Error diagnostics fields.                                                 |
| `timestamp`                         | `timestamptz`    | Defaults to **NOW()**.                                                    |
| `environment`, `service`, `version` | `varchar`        | Deploy context.                                                           |

Type exports:

```ts
export type InsertLog = typeof logsTable.$inferInsert;
export type SelectLog = typeof logsTable.$inferSelect;
export type LogLevel =
  | "error"
  | "warn"
  | "info"
  | "http"
  | "verbose"
  | "debug"
  | "silly";
```

These are reused by logging utilities such as `postgres-transport.ts`.

---

## 2. `index.ts`

```ts
// src/lib/db/index.ts
export const db = drizzle(client, { schema });
export async function closeDatabase(): Promise<void> {
  /* … */
}
```

### Environment Variables

| Variable       | Required | Example                               | Purpose                                                                                  |
| -------------- | -------- | ------------------------------------- | ---------------------------------------------------------------------------------------- |
| `DATABASE_URL` | **Yes**  | `postgresql://user:pass@host:5432/db` | Connection string consumed by [`postgres`](https://github.com/porsager/postgres) driver. |
| `NODE_ENV`     | No       | `production`                          | Enables SSL (`ssl: "require"`) when set to `production`.                                 |

### Helper: `closeDatabase()`

| Parameter | Type | Default | Description                                                         |
| --------- | ---- | ------- | ------------------------------------------------------------------- |
| _(none)_  | –    | –       | Gracefully closes all connections (useful in tests or CLI scripts). |

---

## 3. `index.ci.ts`

CI pipelines often lack a real database. This wrapper prevents build failures by supplying a **mock** `db` instance when:

- `process.env.CI === "true"` **OR** `NODE_ENV === "test"`, **AND**
- `DATABASE_URL` is undefined.

| Export     | Type                          | Notes                               |
| ---------- | ----------------------------- | ----------------------------------- |
| `db`       | Mock or real Drizzle instance | Falls back to in-memory stub in CI. |
| `Database` | Utility type                  | `typeof db`. Handy for DI in tests. |

---

## Dependency / Usage Map

```mermaid
graph TD
    DB[("db instance")]
    LOGTABLE[("logsTable schema")]

    subgraph Logger
        PT["src/lib/logger/postgres-transport.ts"]
    end

    subgraph API
        LOGS_ROUTE["src/app/api/logs/route.ts"]
    end

    DB --> PT
    DB --> LOGS_ROUTE
    LOGTABLE --> PT
    LOGTABLE --> LOGS_ROUTE
```

### Narrative List

1. **`PostgresTransport`** batches application logs and inserts them into **`logsTable`** via the shared `db` instance.
2. **`/api/logs`** route reads, writes, and deletes log records directly through `db` & `logsTable`.
3. Drizzle generates fully-typed SQL so misuse is caught at compile time.

---

## Extending the Schema

1. Add new table or column in `schema.ts`.
2. Run `npx drizzle-kit push` (or equivalent migration command).
3. Re-build—TypeScript will surface new types for you to consume.

---

Made with ☕ & Drizzle.
