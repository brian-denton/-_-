/**
 * API route for generating dynamic portfolio content using MobileBERT
 * Analyzes user context and generates personalized content
 */

import { type NextRequest, NextResponse } from "next/server";
import { contentGenerator } from "@/lib/ai/content-generator";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    logger.info("Generating dynamic portfolio content with Ollama");

    // Extract user agent for context analysis
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Check for forced theme from POST request
    const forcedTheme = request.headers.get('x-theme') || undefined;
    
    if (forcedTheme) {
      console.log("🎨 API received forced theme:", forcedTheme);
    }
    
    const startTime = Date.now();
    const content = await contentGenerator.generateContent(forcedTheme);
    const generationTime = Date.now() - startTime;

    logger.info("Content generation completed", {
      generationTime: `${generationTime}ms`,
      theme: content.theme,
      availability: content.availability,
      aiGenerated: content.aiGenerated,
      confidence: content.confidence,
      personalityTrait: content.personalityTrait,
      userAgent: userAgent.substring(0, 100), // Log first 100 chars for privacy
    });

    return NextResponse.json({
      success: true,
      content,
      metadata: {
        generatedAt: new Date().toISOString(),
        generationTime,
        model: "Ollama",
        version: "2.0.0",
        aiGenerated: content.aiGenerated,
        confidence: content.confidence,
      },
    });
  } catch (error) {
    logger.error("Failed to generate content", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate content",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Allow manual content regeneration with custom parameters
  console.log("🎬 POST route called");
  try {
    const body = await request.json();
    console.log("📋 POST body received:", body);
    const { forceRegenerate, theme } = body;

    if (forceRegenerate) {
      logger.info("Manual content regeneration requested", { theme });
    }

    // Generate content directly with theme parameter
    if (theme) {
      console.log("📨 POST route using theme:", theme);
      
      const userAgent = request.headers.get("user-agent") || "unknown";
      const startTime = Date.now();
      const content = await contentGenerator.generateContent(theme);
      const generationTime = Date.now() - startTime;

      logger.info("Content generation completed", {
        generationTime: `${generationTime}ms`,
        theme: content.theme,
        availability: content.availability,
        aiGenerated: content.aiGenerated,
        confidence: content.confidence,
        personalityTrait: content.personalityTrait,
        userAgent: userAgent.substring(0, 100),
      });

      return NextResponse.json({
        success: true,
        content,
        metadata: {
          generatedAt: new Date().toISOString(),
          generationTime,
          model: "Ollama",
          version: "2.0.0",
          aiGenerated: content.aiGenerated,
          confidence: content.confidence,
        },
      });
    }

    return GET(request);
  } catch (error) {
    console.log("❌ POST route error:", error);
    logger.error("Failed to generate content in POST", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate content",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
