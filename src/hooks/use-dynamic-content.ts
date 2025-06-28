/**
 * React hook for managing dynamic AI-generated content with MobileBERT
 * Fetches and caches content, handles loading states
 */

import { useEffect, useState } from "react";
import type { GeneratedContent } from "@/lib/ai/content-generator";

interface ContentResponse {
  success: boolean;
  content: GeneratedContent;
  error?: string;
  metadata: {
    generatedAt: string;
    generationTime: number;
    model: string;
    version: string;
    aiGenerated: boolean;
    confidence: number;
  };
}

interface UseDynamicContentReturn {
  content: GeneratedContent | null;
  isLoading: boolean;
  error: string | null;
  regenerate: () => Promise<void>;
  chaosMode: () => Promise<void>;
  metadata: ContentResponse["metadata"] | null;
}

export function useDynamicContent(): UseDynamicContentReturn {
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ContentResponse["metadata"] | null>(
    null
  );

  const fetchContent = async (forceRegenerate = false, theme?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const method = forceRegenerate ? "POST" : "GET";
      const userAgent =
        typeof window !== "undefined" && navigator?.userAgent
          ? navigator.userAgent
          : "unknown";
      const body = forceRegenerate
        ? JSON.stringify({
            forceRegenerate: true,
            userAgent: userAgent,
            theme: theme,
          })
        : undefined;

      console.log("📤 Request body:", body);

      console.log("🚀 Making request:", method, "/api/generate-content");

      const response = await fetch("/api/generate-content", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        ...(body && { body }),
      });

      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ContentResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to generate content");
      }

      setContent(data.content);
      setMetadata(data.metadata);

      // Cache content in localStorage with timestamp
      const cacheData = {
        content: data.content,
        metadata: data.metadata,
        cachedAt: Date.now(),
      };
      localStorage.setItem(
        "portfolio-content-mobilebert",
        JSON.stringify(cacheData)
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Failed to fetch dynamic content:", err);

      // Try to load from cache if available
      const cached = loadFromCache();
      if (cached) {
        setContent(cached.content);
        setMetadata(cached.metadata);
        setError(null); // Clear error if we have cached content
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromCache = () => {
    try {
      const cached = localStorage.getItem("portfolio-content-mobilebert");
      if (!cached) return null;

      const data = JSON.parse(cached);
      const cacheAge = Date.now() - data.cachedAt;
      const maxAge = 30 * 60 * 1000; // 30 minutes

      // Use cache if it's less than 30 minutes old
      if (cacheAge < maxAge) {
        return data;
      }

      // Cache is too old, remove it
      localStorage.removeItem("portfolio-content-mobilebert");
      return null;
    } catch {
      return null;
    }
  };

  const regenerate = async () => {
    // Clear cache before regenerating
    localStorage.removeItem("portfolio-content-mobilebert");
    await fetchContent(true);
  };

  const chaosMode = async () => {
    // Clear cache and force chaos theme
    console.log("🎯 Chaos mode triggered - sending chaos theme");
    localStorage.removeItem("portfolio-content-mobilebert");
    await fetchContent(true, "chaos");
  };

  useEffect(() => {
    // Try to load from cache first
    const cached = loadFromCache();
    if (cached) {
      setContent(cached.content);
      setMetadata(cached.metadata);
      setIsLoading(false);
      return;
    }

    // No valid cache, fetch new content
    fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    content,
    isLoading,
    error,
    regenerate,
    chaosMode,
    metadata,
  };
}
