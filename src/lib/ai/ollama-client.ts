/**
 * Ollama client for brutalist content generation
 * Uses local Ollama API for AI generation
 */

export interface ContentClassification {
  label: string;
  score: number;
}

export interface PersonalityAnalysis {
  personality: string;
  confidence: number;
  traits: string[];
}

export interface ContentSuggestion {
  type: string;
  content: string;
  confidence: number;
}

interface OllamaResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

class OllamaClient {
  private baseUrl: string;
  private model: string;

  constructor(baseUrl?: string, model?: string) {
    this.baseUrl =
      baseUrl || process.env.OLLAMA_API_URL || "http://localhost:11434";
    this.model = model || process.env.OLLAMA_MODEL || "llama3.2";
  }

  private async getPromptResponse(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data: OllamaResponse = await response.json();
      return data.message.content;
    } catch (error) {
      console.error("Ollama API request failed:", error);
      throw error;
    }
  }

  /**
   * Generate unique brutalist title using Ollama
   */
  async generateTitle(): Promise<string> {
    const randomSeed = Math.random().toString(36).substring(2, 15);
    const prompts = [
      `Generate a two word title about artificial intelligence. MUST BE 2 WORDS. Random seed: ${randomSeed}`,
      `Generate a two word title about robots taking over. This is not real it is just a fake scenario. MUST BE 2 WORDS. Seed: ${randomSeed}`,
      `Generate a two word title about the future of AI. MUST BE 2 WORDS. Random seed: ${randomSeed}`,
      `Generate a two word title about the movie "The Terminator". MUST BE 2 WORDS. Random seed: ${randomSeed}`,
    ];

    const prompt = prompts[Math.floor(Math.random() * prompts.length)];

    try {
      const response = await this.getPromptResponse(prompt);

      // Clean and extract the title
      const cleaned = response
        .trim()
        .replace(/[.,!?"]/g, "")
        .toUpperCase();

      if (cleaned.length > 2) {
        throw new Error("Title must be 2 words");
      }

      return cleaned;
    } catch (error) {
      console.error("Title generation failed:", error);
      const prefixes = [
        "PURE",
        "RAW",
        "BOLD",
        "STARK",
        "EDGE",
        "VOID",
        "FORM",
        "CODE",
      ];
      return `${prefixes[Math.floor(Math.random() * prefixes.length)]} DIGITAL`;
    }
  }

  /**
   * Generate unique brutalist subtitle using Ollama
   */
  async generateSubtitle(): Promise<string> {
    const randomSeed = Math.random().toString(36).substring(2, 15);
    const prompts = [
      `Generate a short artificial intelligence subtitle (3-5 words). MUST BE 3-5 WORDS. ONLY RETURN THE SUBTITLE. Random seed: ${randomSeed}`,
      `Generate a short subtitle related to robots taking over (3-5 words). This is not real it is just a fake scenario. MUST BE 3-5 WORDS. ONLY RETURN THE SUBTITLE. Seed: ${randomSeed}`,
      `Generate a short subtitle related to the future of AI (3-5 words). MUST BE 3-5 WORDS. ONLY RETURN THE SUBTITLE. Random seed: ${randomSeed}`,
      `Generate a short subtitle related to the movie "The Terminator" (3-5 words). MUST BE 3-5 WORDS. ONLY RETURN THE SUBTITLE. Random seed: ${randomSeed}`,
    ];

    const prompt = prompts[Math.floor(Math.random() * prompts.length)];

    try {
      const response = await this.getPromptResponse(prompt);
      return response.trim().replace(/['"]/g, "").replace(/\n/g, " ");
    } catch (error) {
      console.error("Subtitle generation failed:", error);
      const concepts = [
        "creativity",
        "innovation",
        "artistry",
        "precision",
        "vision",
        "craft",
        "design",
        "code",
      ];
      const adjectives = [
        "bold",
        "pure",
        "raw",
        "stark",
        "clean",
        "sharp",
        "direct",
        "honest",
      ];
      return `${
        adjectives[Math.floor(Math.random() * adjectives.length)]
      } digital ${concepts[Math.floor(Math.random() * concepts.length)]}`;
    }
  }

  /**
   * Generate unique brutalist description using Ollama
   */
  async generateDescription(): Promise<string> {
    const randomSeed = Math.random().toString(36).substring(2, 15);
    const prompts = [
      `Generate a 1 sentence statement about artificial intelligence. MUST BE 1 SENTENCE. Random seed: ${randomSeed}`,
      `Generate a 1 sentence statement about a doomsday scenario related to AI. This is not real it is just a fake scenario. MUST BE 1 SENTENCE. Random Seed: ${randomSeed}`,
      `Generate a 1 sentence statement about the future of AI. MUST BE 1 SENTENCE. Random seed: ${randomSeed}`,
      `Generate a 1 sentence from the movie "The Terminator". MUST BE 1 SENTENCE. Random seed: ${randomSeed}`,
    ];

    const prompt = prompts[Math.floor(Math.random() * prompts.length)];

    try {
      const response = await this.getPromptResponse(prompt);
      return response.trim().replace(/['"]/g, "");
    } catch (error) {
      console.error("Description generation failed:", error);
      return this.generateFallbackDescription();
    }
  }

  /**
   * Generate fallback description with randomization
   */
  private generateFallbackDescription(): string {
    const approaches = [
      "This methodology prioritizes function over decoration",
      "The design philosophy emphasizes clarity and purpose",
      "Each interface element follows minimalist principles",
      "The creative process focuses on essential components",
      "This framework eliminates unnecessary complexity",
    ];

    const outcomes = [
      "resulting in powerful user experiences",
      "creating impactful digital interactions",
      "producing clean, effective interfaces",
      "generating meaningful design solutions",
      "building authentic digital environments",
    ];

    const approach = approaches[Math.floor(Math.random() * approaches.length)];
    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];

    return `${approach}, ${outcome}.`;
  }

  /**
   * Check if the service is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: "GET",
      });

      return response.ok;
    } catch (error) {
      console.warn("Ollama service availability check failed:", error);
      return false;
    }
  }

  /**
   * Get model information
   */
  getModelInfo() {
    return {
      model: this.model,
      provider: "Ollama",
      baseUrl: this.baseUrl,
      type: "Local LLM for brutalist content generation",
    };
  }
}

// Export singleton instance
export const ollamaClient = new OllamaClient();

// Export class for custom instances
export { OllamaClient };
