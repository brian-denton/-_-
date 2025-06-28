/**
 * React hook for managing dynamic AI-generated content
 * Fetches and caches content, handles loading states
 */

import { useEffect, useState } from "react";
import type { GeneratedContent } from "@/lib/ai/content-generator";

interface ContentResponse {
	success: boolean;
	content: GeneratedContent;
	metadata: {
		generatedAt: string;
		generationTime: number;
		model: string;
		version: string;
	};
}

interface UseDynamicContentReturn {
	content: GeneratedContent | null;
	isLoading: boolean;
	error: string | null;
	regenerate: () => Promise<void>;
	metadata: ContentResponse["metadata"] | null;
}

export function useDynamicContent(): UseDynamicContentReturn {
	const [content, setContent] = useState<GeneratedContent | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [metadata, setMetadata] = useState<ContentResponse["metadata"] | null>(null);

	const fetchContent = async () => {
		try {
			setIsLoading(true);
			setError(null);

			const response = await fetch("/api/generate-content", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

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
				cachedAt: Date.now()
			};
			localStorage.setItem("portfolio-content", JSON.stringify(cacheData));

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
			const cached = localStorage.getItem("portfolio-content");
			if (!cached) return null;

			const data = JSON.parse(cached);
			const cacheAge = Date.now() - data.cachedAt;
			const maxAge = 30 * 60 * 1000; // 30 minutes

			// Use cache if it's less than 30 minutes old
			if (cacheAge < maxAge) {
				return data;
			}

			// Cache is too old, remove it
			localStorage.removeItem("portfolio-content");
			return null;
		} catch {
			return null;
		}
	};

	const regenerate = async () => {
		// Clear cache before regenerating
		localStorage.removeItem("portfolio-content");
		await fetchContent();
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
	}, []);

	return {
		content,
		isLoading,
		error,
		regenerate,
		metadata
	};
}