/**
 * MobileBERT client using Hugging Face Inference API
 * Adapted for content classification and intelligent content selection
 */

import { HfInference } from "@huggingface/inference";

export interface ContentClassification {
	label: string;
	score: number;
}

export interface MobileBERTResponse {
	classifications: ContentClassification[];
	selectedContent: any;
	confidence: number;
}

class MobileBERTClient {
	private hf: HfInference;
	private model: string;

	constructor(apiKey?: string, model = "google/mobilebert-uncased") {
		this.hf = new HfInference(apiKey);
		this.model = model;
	}

	/**
	 * Classify content to determine the best portfolio variant
	 */
	async classifyContent(text: string): Promise<ContentClassification[]> {
		try {
			const response = await this.hf.textClassification({
				model: this.model,
				inputs: text,
			});

			// Handle both single classification and array responses
			const classifications = Array.isArray(response) ? response : [response];
			
			return classifications.map(item => ({
				label: item.label,
				score: item.score
			}));
		} catch (error) {
			console.error("MobileBERT classification error:", error);
			throw new Error(`Failed to classify content: ${error instanceof Error ? error.message : "Unknown error"}`);
		}
	}

	/**
	 * Use question answering to extract specific information
	 */
	async extractInformation(context: string, question: string): Promise<string> {
		try {
			const response = await this.hf.questionAnswering({
				model: "distilbert-base-cased-distilled-squad", // Better for QA
				inputs: {
					question,
					context
				}
			});

			return response.answer;
		} catch (error) {
			console.error("Question answering error:", error);
			throw new Error(`Failed to extract information: ${error instanceof Error ? error.message : "Unknown error"}`);
		}
	}

	/**
	 * Analyze user context to determine portfolio personality
	 */
	async analyzeUserContext(userAgent: string, timeOfDay: string, dayOfWeek: string): Promise<string> {
		const contextText = `User visiting portfolio: ${userAgent} at ${timeOfDay} on ${dayOfWeek}`;
		
		// Define personality categories for classification
		const personalities = [
			"professional", "creative", "technical", "innovative", 
			"collaborative", "analytical", "visionary", "pragmatic"
		];

		try {
			// Use zero-shot classification to determine personality
			const response = await this.hf.zeroShotClassification({
				model: "facebook/bart-large-mnli",
				inputs: contextText,
				parameters: {
					candidate_labels: personalities
				}
			});

			return response.labels[0]; // Return the highest scoring personality
		} catch (error) {
			console.error("Context analysis error:", error);
			return "professional"; // Fallback
		}
	}

	/**
	 * Check if the service is available
	 */
	async isAvailable(): Promise<boolean> {
		try {
			// Simple test classification
			await this.hf.textClassification({
				model: this.model,
				inputs: "test"
			});
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Get model information
	 */
	async getModelInfo(): Promise<any> {
		try {
			// Note: Hugging Face doesn't provide a direct model info endpoint
			// This is a placeholder for consistency with the previous interface
			return {
				model: this.model,
				provider: "Hugging Face",
				type: "BERT-based classification model"
			};
		} catch (error) {
			console.error("Failed to get model info:", error);
			return null;
		}
	}
}

// Export singleton instance
export const mobileBERTClient = new MobileBERTClient(process.env.HUGGINGFACE_API_KEY);

// Export class for custom instances
export { MobileBERTClient };