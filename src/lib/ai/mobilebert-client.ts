/**
 * MobileBERT client for brutalist content generation
 * Specialized for generating chaotic, bold, and aggressive content
 */

import { HfInference } from "@huggingface/inference";

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

class MobileBERTClient {
	private hf: HfInference;
	private classificationModel: string;
	private qaModel: string;
	private zeroShotModel: string;

	constructor(apiKey?: string) {
		this.hf = new HfInference(apiKey || process.env.HUGGINGFACE_API_KEY);
		this.classificationModel = "google/mobilebert-uncased";
		this.qaModel = "distilbert-base-cased-distilled-squad";
		this.zeroShotModel = "facebook/bart-large-mnli";
	}

	/**
	 * Analyze user context for brutalist personality determination
	 */
	async analyzeBrutalistContext(userAgent: string, timeOfDay: string, dayOfWeek: string): Promise<PersonalityAnalysis> {
		const contextText = `User visiting brutalist site: ${userAgent} at ${timeOfDay} on ${dayOfWeek}`;
		
		const personalities = [
			"brutal and uncompromising",
			"chaotic and random", 
			"aggressive and bold",
			"raw and minimalist",
			"confrontational and direct",
			"geometric and structured"
		];

		try {
			const response = await this.hf.zeroShotClassification({
				model: this.zeroShotModel,
				inputs: contextText,
				parameters: {
					candidate_labels: personalities
				}
			});

			const topPersonality = response.labels[0];
			const confidence = response.scores[0];

			// Extract traits based on brutalist personality
			const traits = this.getBrutalistTraits(topPersonality);

			return {
				personality: topPersonality.split(' ')[0], // Get first word (brutal, chaotic, etc.)
				confidence,
				traits
			};
		} catch (error) {
			console.error("Brutalist context analysis error:", error);
			return {
				personality: "brutal",
				confidence: 0.5,
				traits: ["uncompromising", "bold", "raw"]
			};
		}
	}

	/**
	 * Generate brutalist content suggestions
	 */
	async generateBrutalistContent(personality: string, traits: string[]): Promise<ContentSuggestion[]> {
		const suggestions: ContentSuggestion[] = [];

		try {
			// Generate brutalist title suggestions
			const titleContext = `A ${personality} brutalist designer with traits: ${traits.join(', ')}. They create bold, uncompromising digital experiences.`;
			const titleQuestion = "What would be a powerful, aggressive title for this brutalist creator?";
			
			const titleSuggestion = await this.hf.questionAnswering({
				model: this.qaModel,
				inputs: {
					question: titleQuestion,
					context: titleContext
				}
			});

			suggestions.push({
				type: "heroTitle",
				content: this.enhanceBrutalistTitle(titleSuggestion.answer, personality),
				confidence: titleSuggestion.score
			});

			// Generate brutalist description suggestions
			const descContext = `A ${personality} brutalist who is ${traits.join(', ')}. They create raw, uncompromising digital experiences.`;
			const descQuestion = "What drives this brutalist creator and what do they believe in?";
			
			const descSuggestion = await this.hf.questionAnswering({
				model: this.qaModel,
				inputs: {
					question: descQuestion,
					context: descContext
				}
			});

			suggestions.push({
				type: "heroDescription",
				content: this.enhanceBrutalistDescription(descSuggestion.answer, personality),
				confidence: descSuggestion.score
			});

		} catch (error) {
			console.error("Brutalist content generation error:", error);
			return this.getFallbackBrutalistSuggestions(personality);
		}

		return suggestions;
	}

	/**
	 * Classify brutalist theme based on generated content
	 */
	async classifyBrutalistTheme(content: string): Promise<string> {
		const themes = [
			"brutal and uncompromising",
			"chaotic and random",
			"aggressive and confrontational", 
			"raw and minimalist"
		];

		try {
			const response = await this.hf.zeroShotClassification({
				model: this.zeroShotModel,
				inputs: content,
				parameters: {
					candidate_labels: themes
				}
			});

			return response.labels[0].split(' ')[0]; // Return first word
		} catch (error) {
			console.error("Brutalist theme classification error:", error);
			return "brutal";
		}
	}

	/**
	 * Extract brutalist skills and technologies
	 */
	async extractBrutalistSkills(context: string): Promise<string[]> {
		const skillsContext = `${context}. Brutalist design principles and bold technologies.`;
		const skillsQuestion = "What skills and approaches are most relevant for brutalist design?";

		try {
			const response = await this.hf.questionAnswering({
				model: this.qaModel,
				inputs: {
					question: skillsQuestion,
					context: skillsContext
				}
			});

			// Parse and enhance the skills for brutalist context
			return this.parseBrutalistSkills(response.answer);
		} catch (error) {
			console.error("Brutalist skills extraction error:", error);
			return ["BRUTALISM", "BOLD DESIGN", "RAW CSS", "TYPOGRAPHY"];
		}
	}

	/**
	 * Check if the service is available
	 */
	async isAvailable(): Promise<boolean> {
		try {
			await this.hf.zeroShotClassification({
				model: this.zeroShotModel,
				inputs: "test",
				parameters: {
					candidate_labels: ["test"]
				}
			});
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Get model information
	 */
	getModelInfo(): any {
		return {
			classificationModel: this.classificationModel,
			qaModel: this.qaModel,
			zeroShotModel: this.zeroShotModel,
			provider: "Hugging Face",
			type: "BERT-based models for brutalist content generation"
		};
	}

	// Helper methods for brutalist content

	private getBrutalistTraits(personality: string): string[] {
		const traitMap: Record<string, string[]> = {
			brutal: ["uncompromising", "raw", "bold", "functional"],
			chaotic: ["random", "unpredictable", "entropy-driven", "disorder-loving"],
			aggressive: ["confrontational", "loud", "direct", "unsubtle"],
			raw: ["minimalist", "stripped-down", "essential", "honest"],
			confrontational: ["challenging", "provocative", "bold", "direct"],
			geometric: ["structured", "angular", "precise", "mathematical"]
		};

		const key = personality.split(' ')[0].toLowerCase();
		return traitMap[key] || traitMap.brutal;
	}

	private enhanceBrutalistTitle(baseTitle: string, personality: string): string {
		const enhancements: Record<string, string[]> = {
			brutal: ["CONCRETE", "RAW", "UNCOMPROMISING", "BRUTAL"],
			chaotic: ["CHAOS", "RANDOM", "ENTROPY", "DISORDER"],
			aggressive: ["AGGRESSIVE", "BOLD", "LOUD", "CONFRONTATIONAL"],
			raw: ["MINIMAL", "STRIPPED", "ESSENTIAL", "PURE"]
		};

		const prefixes = enhancements[personality] || enhancements.brutal;
		const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
		
		return `${prefix} DIGITAL`;
	}

	private enhanceBrutalistDescription(baseDesc: string, personality: string): string {
		const templates: Record<string, string> = {
			brutal: "Raw, uncompromising digital brutalism. Bold statements through aggressive design. No decoration, only function and power.",
			chaotic: "Embracing chaos as creative force. Random generation meets intentional design. Beautiful disorder through algorithmic creativity.",
			aggressive: "Confrontational design that demands attention. Loud, bold, and unapologetically direct. Aggressive aesthetics for digital rebels.",
			raw: "Stripped to essentials. Minimal but powerful. Raw beauty through functional design and honest materials."
		};

		return templates[personality] || templates.brutal;
	}

	private parseBrutalistSkills(skillsText: string): string[] {
		const brutalistSkills = [
			"BRUTALISM", "CONCRETE", "RAW CSS", "BOLD TYPOGRAPHY", "GEOMETRIC FORMS",
			"STARK CONTRAST", "FUNCTIONAL DESIGN", "AGGRESSIVE AESTHETICS", "MINIMAL",
			"UNCOMPROMISING", "DIRECT", "CONFRONTATIONAL", "CHAOS", "RANDOMNESS",
			"ENTROPY", "DISORDER", "ALGORITHMIC", "GENERATION", "BOLD COLORS"
		];

		// Extract mentioned skills from the text
		const mentionedSkills = brutalistSkills.filter(skill => 
			skillsText.toLowerCase().includes(skill.toLowerCase())
		);

		// If no skills found, return a default brutalist set
		if (mentionedSkills.length === 0) {
			return ["BRUTALISM", "BOLD DESIGN", "RAW CSS", "CHAOS"];
		}

		// Return up to 6 skills
		return mentionedSkills.slice(0, 6);
	}

	private getFallbackBrutalistSuggestions(personality: string): ContentSuggestion[] {
		const fallbacks: Record<string, ContentSuggestion[]> = {
			brutal: [
				{
					type: "heroTitle",
					content: "CONCRETE DIGITAL",
					confidence: 0.8
				},
				{
					type: "heroDescription", 
					content: "Raw, uncompromising digital brutalism. Bold statements through aggressive design.",
					confidence: 0.8
				}
			],
			chaotic: [
				{
					type: "heroTitle",
					content: "CHAOS ENGINE",
					confidence: 0.8
				},
				{
					type: "heroDescription",
					content: "Embracing chaos as creative force. Random generation meets intentional design.",
					confidence: 0.8
				}
			]
		};

		return fallbacks[personality] || fallbacks.brutal;
	}
}

// Export singleton instance
export const mobileBERTClient = new MobileBERTClient();

// Export class for custom instances
export { MobileBERTClient };