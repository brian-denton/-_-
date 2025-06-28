/**
 * API route for generating dynamic portfolio content using MobileBERT
 * Analyzes user context and generates personalized content
 */

import { NextRequest, NextResponse } from "next/server";
import { contentGenerator } from "@/lib/ai/content-generator";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
	try {
		logger.info("Generating dynamic portfolio content with MobileBERT");

		// Extract user agent for context analysis
		const userAgent = request.headers.get("user-agent") || "unknown";

		const startTime = Date.now();
		const content = await contentGenerator.generateContent(userAgent);
		const generationTime = Date.now() - startTime;

		logger.info("Content generation completed", {
			generationTime: `${generationTime}ms`,
			theme: content.theme,
			availability: content.availability,
			aiGenerated: content.aiGenerated,
			confidence: content.confidence,
			personalityTrait: content.personalityTrait,
			userAgent: userAgent.substring(0, 100) // Log first 100 chars for privacy
		});

		return NextResponse.json({
			success: true,
			content,
			metadata: {
				generatedAt: new Date().toISOString(),
				generationTime,
				model: "MobileBERT + Hugging Face",
				version: "2.0.0",
				aiGenerated: content.aiGenerated,
				confidence: content.confidence
			}
		});
	} catch (error) {
		logger.error("Failed to generate content", {
			error: error instanceof Error ? error.message : "Unknown error",
			stack: error instanceof Error ? error.stack : undefined
		});

		return NextResponse.json(
			{
				success: false,
				error: "Failed to generate content",
				message: error instanceof Error ? error.message : "Unknown error"
			},
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	// Allow manual content regeneration with custom parameters
	try {
		const body = await request.json();
		const { userAgent, forceRegenerate } = body;

		if (forceRegenerate) {
			logger.info("Manual content regeneration requested");
		}

		return GET(request);
	} catch {
		// If body parsing fails, fall back to GET
		return GET(request);
	}
}