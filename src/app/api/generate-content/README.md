# `/api/generate-content`

This serverless route produces **AI-generated landing-page content** or
re-generates it on demand. It is consumed by the `useDynamicContent` React hook
and, through that, by the `BrutalistHero` component.

_File location_: `src/app/api/generate-content/route.ts`

---

## Supported Methods

| Method | Description                                                           |
| ------ | --------------------------------------------------------------------- |
| `GET`  | Fetch cached/generated content (optionally force a theme via header). |
| `POST` | Force regeneration and/or request a specific theme.                   |

---

## GET

### Request

Optional header:

| Header    | Accepted Values                                 | Notes                                |
| --------- | ----------------------------------------------- | ------------------------------------ |
| `x-theme` | `brutal` \| `chaos` \| `random` \| `aggressive` | Overrides the randomly chosen theme. |

### Response JSON

```ts
interface Success {
  success: true;
  content: GeneratedContent; // see src/lib/ai/content-generator.ts
  metadata: {
    generatedAt: string; // ISO timestamp
    generationTime: number; // milliseconds
    model: string; // "Ollama"
    version: string; // API version
    aiGenerated: boolean; // at least one LLM call succeeded
    confidence: number; // aggregated confidence 0-1
  };
}

interface Failure {
  success: false;
  error: string;
  message: string;
}
```

Status codes: `200` (success) or `500` (failure).

---

## POST (Regenerate)

### Body (JSON)

| Field             | Type                                              | Required           | Purpose                                       |
| ----------------- | ------------------------------------------------- | ------------------ | --------------------------------------------- |
| `forceRegenerate` | `boolean`                                         | `true` if provided | Tells the route to bypass server-side caches. |
| `theme`           | `"brutal" \| "chaos" \| "random" \| "aggressive"` | No                 | Same as `x-theme` header but in body.         |

> Any other fields are ignored.

Response schema & status codes are identical to the `GET` method.

---

## Internal Flow

```mermaid
graph TD
    Req[Incoming HTTP request] -->|parse| Router[route.ts]
    Router -->|await| Generator[contentGenerator.generateContent()]
    Generator -->|may call| OllamaClient
    Router -->|log| Winston[logger]
    Router --> Resp[JSON response]
```

1. The handler records `startTime` to measure generation latency.
2. Delegates to the singleton `contentGenerator` (AI module).
3. Logs the outcome via `logger.info()` with extra metadata.
4. Returns a typed JSON payload.

---

## Related Files & Consumers

| File / Component                    | Relationship                                         |
| ----------------------------------- | ---------------------------------------------------- |
| `src/hooks/use-dynamic-content.ts`  | Calls this endpoint from the browser (GET / POST).   |
| `src/components/brutalist-hero.tsx` | Displays the data provided by the hook.              |
| `src/lib/ai/content-generator.ts`   | Implements `generateContent()` invoked by the route. |
| `src/lib/logger/index.ts`           | Used for structured logging within the route.        |

---

## Extending

- **New Themes** – Update the `theme` union in both this file &
  `GeneratedContent` interface.
- **Additional metadata** – Attach properties to the `metadata` object before
  returning.
- **Auth / Rate-limit** – Wrap handlers with middleware in `src/middleware.ts` or
  a custom util to restrict usage.

---

Made with ⚡ & TypeScript.
