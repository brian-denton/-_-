/**
 * MobileBERT client using Hugging Face Inference API
 * Provides intelligent content classification and generation for portfolio
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
	 * Analyze user context to determine portfolio personality
	 */
	async analyzeUserContext(userAgent: string, timeOfDay: string, dayOfWeek: string): Promise<PersonalityAnalysis> {
		const contextText = `User visiting portfolio: ${userAgent} at ${timeOfDay} on ${dayOfWeek}`;
		
		const personalities = [
			"professional and corporate focused",
			"creative and design oriented", 
			"technical and engineering focused",
			"innovative and cutting-edge",
			"collaborative and team oriented",
			"analytical and data driven"
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

			// Extract traits based on personality
			const traits = this.getTraitsForPersonality(topPersonality);

			return {
				personality: topPersonality.split(' ')[0], // Get first word (professional, creative, etc.)
				confidence,
				traits
			};
		} catch (error) {
			console.error("Context analysis error:", error);
			return {
				personality: "professional",
				confidence: 0.5,
				traits: ["reliable", "experienced", "skilled"]
			};
		}
	}

	/**
	 * Generate content suggestions based on personality and context
	 */
	async generateContentSuggestions(personality: string, traits: string[]): Promise<ContentSuggestion[]> {
		const suggestions: ContentSuggestion[] = [];

		try {
			// Generate hero title suggestions
			const titleContext = `A ${personality} developer with traits: ${traits.join(', ')}. They are skilled in modern web development.`;
			const titleQuestion = "What would be a compelling professional title for this developer?";
			
			const titleSuggestion = await this.hf.questionAnswering({
				model: this.qaModel,
				inputs: {
					question: titleQuestion,
					context: titleContext
				}
			});

			suggestions.push({
				type: "heroTitle",
				content: this.enhanceTitle(titleSuggestion.answer, personality),
				confidence: titleSuggestion.score
			});

			// Generate description suggestions
			const descContext = `A ${personality} developer who is ${traits.join(', ')}. They build modern web applications.`;
			const descQuestion = "What motivates this developer and what do they focus on?";
			
			const descSuggestion = await this.hf.questionAnswering({
				model: this.qaModel,
				inputs: {
					question: descQuestion,
					context: descContext
				}
			});

			suggestions.push({
				type: "heroDescription",
				content: this.enhanceDescription(descSuggestion.answer, personality),
				confidence: descSuggestion.score
			});

		} catch (error) {
			console.error("Content generation error:", error);
			// Return fallback suggestions
			return this.getFallbackSuggestions(personality);
		}

		return suggestions;
	}

	/**
	 * Classify content theme based on generated text
	 */
	async classifyTheme(content: string): Promise<string> {
		const themes = [
			"professional and business oriented",
			"creative and artistic",
			"technical and engineering focused", 
			"innovative and futuristic"
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
			console.error("Theme classification error:", error);
			return "professional";
		}
	}

	/**
	 * Extract skills and technologies from context
	 */
	async extractSkills(context: string): Promise<string[]> {
		const skillsContext = `${context}. Modern web development technologies and frameworks.`;
		const skillsQuestion = "What technologies and skills are most relevant?";

		try {
			const response = await this.hf.questionAnswering({
				model: this.qaModel,
				inputs: {
					question: skillsQuestion,
					context: skillsContext
				}
			});

			// Parse and enhance the skills
			return this.parseSkills(response.answer);
		} catch (error) {
			console.error("Skills extraction error:", error);
			return ["React", "TypeScript", "Node.js", "Next.js"];
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
			type: "BERT-based models for classification and QA"
		};
	}

	// Helper methods

	private getTraitsForPersonality(personality: string): string[] {
		const traitMap: Record<string, string[]> = {
			professional: ["reliable", "experienced", "detail-oriented", "results-driven"],
			creative: ["innovative", "artistic", "visionary", "design-focused"],
			technical: ["analytical", "systematic", "problem-solving", "engineering-minded"],
			innovative: ["forward-thinking", "cutting-edge", "experimental", "pioneering"],
			collaborative: ["team-oriented", "communicative", "supportive", "inclusive"],
			analytical: ["data-driven", "logical", "methodical", "research-oriented"]
		};

		const key = personality.split(' ')[0].toLowerCase();
		return traitMap[key] || traitMap.professional;
	}

	private enhanceTitle(baseTitle: string, personality: string): string {
		const enhancements: Record<string, string[]> = {
			professional: ["Senior", "Lead", "Principal", "Expert"],
			creative: ["Creative", "Innovative", "Visionary", "Design-Focused"],
			technical: ["Technical", "Engineering", "Systems", "Architecture"],
			innovative: ["Next-Gen", "Cutting-Edge", "Future-Forward", "Advanced"]
		};

		const prefixes = enhancements[personality] || enhancements.professional;
		const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
		
		return `${prefix} Full-Stack Developer & Digital Craftsman`;
	}

	private enhanceDescription(baseDesc: string, personality: string): string {
		const templates: Record<string, string> = {
			professional: "Building robust, scalable applications with proven methodologies and industry best practices. Focused on delivering reliable solutions that drive business success.",
			creative: "Crafting beautiful, intuitive digital experiences that blend artistic vision with technical excellence. Passionate about design systems and user-centered development.",
			technical: "Engineering high-performance applications with clean architecture and optimal algorithms. Deep expertise in system design and technical problem-solving.",
			innovative: "Exploring cutting-edge technologies to build the future of web development. Passionate about AI integration, emerging frameworks, and next-generation solutions."
		};

		return templates[personality] || templates.professional;
	}

	private parseSkills(skillsText: string): string[] {
		const commonSkills = [
			"React", "Next.js", "TypeScript", "JavaScript", "Node.js", "Python",
			"PostgreSQL", "MongoDB", "AWS", "Docker", "Kubernetes", "GraphQL",
			"Tailwind CSS", "Figma", "Git", "CI/CD", "Microservices", "API Design"
		];

		// Extract mentioned skills from the text
		const mentionedSkills = commonSkills.filter(skill => 
			skillsText.toLowerCase().includes(skill.toLowerCase())
		);

		// If no skills found, return a default set
		if (mentionedSkills.length === 0) {
			return ["React", "TypeScript", "Node.js", "Next.js"];
		}

		// Return up to 6 skills
		return mentionedSkills.slice(0, 6);
	}

	private getFallbackSuggestions(personality: string): ContentSuggestion[] {
		const fallbacks: Record<string, ContentSuggestion[]> = {
			professional: [
				{
					type: "heroTitle",
					content: "Senior Full-Stack Developer & Solutions Architect",
					confidence: 0.8
				},
				{
					type: "heroDescription", 
					content: "Building enterprise-grade applications with proven methodologies and industry best practices.",
					confidence: 0.8
				}
			],
			creative: [
				{
					type: "heroTitle",
					content: "Creative Developer & Digital Design Craftsman",
					confidence: 0.8
				},
				{
					type: "heroDescription",
					content: "Crafting beautiful, intuitive digital experiences that blend artistic vision with technical excellence.",
					confidence: 0.8
				}
			]
		};

		return fallbacks[personality] || fallbacks.professional;
	}
}

// Export singleton instance
export const mobileBERTClient = new MobileBERTClient();

// Export class for custom instances
export { MobileBERTClient };