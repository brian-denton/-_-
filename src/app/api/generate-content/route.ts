/**
 * API route for generating dynamic portfolio content
 * Uses Ollama with Qwen2:0.5b model for content generation
 */

import { NextResponse } from "next/server";
import { contentGenerator } from "@/lib/ai/content-generator";
import { logger } from "@/lib/logger";

export async function GET() {
	try {
		logger.info("Generating dynamic portfolio content");

		const startTime = Date.now();
		const content = await contentGenerator.generateContent();
		const generationTime = Date.now() - startTime;

		logger.info("Content generation completed", {
			generationTime: `${generationTime}ms`,
			theme: content.theme,
			availability: content.availability,
			aiGenerated: true
		});

		return NextResponse.json({
			success: true,
			content,
			metadata: {
				generatedAt: new Date().toISOString(),
				generationTime,
				model: "qwen2:0.5b",
				version: "1.0.0"
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

export async function POST() {
	// Allow manual content regeneration
	return GET();
}