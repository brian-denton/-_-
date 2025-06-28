/**
 * Ollama client for local AI model inference
 * Connects to local Ollama instance running Qwen2:0.5b model
 */

export interface OllamaResponse {
	model: string;
	created_at: string;
	response: string;
	done: boolean;
	context?: number[];
	total_duration?: number;
	load_duration?: number;
	prompt_eval_count?: number;
	prompt_eval_duration?: number;
	eval_count?: number;
	eval_duration?: number;
}

export interface OllamaRequest {
	model: string;
	prompt: string;
	stream?: boolean;
	options?: {
		temperature?: number;
		top_p?: number;
		top_k?: number;
		repeat_penalty?: number;
		seed?: number;
		num_predict?: number;
	};
}

class OllamaClient {
	private baseUrl: string;
	private model: string;

	constructor(baseUrl = "http://localhost:11434", model = "qwen2:0.5b") {
		this.baseUrl = baseUrl;
		this.model = model;
	}

	/**
	 * Generate text using Ollama API
	 */
	async generate(prompt: string, options?: OllamaRequest["options"]): Promise<string> {
		try {
			const request: OllamaRequest = {
				model: this.model,
				prompt,
				stream: false,
				options: {
					temperature: 0.8,
					top_p: 0.9,
					num_predict: 200,
					...options,
				},
			};

			const response = await fetch(`${this.baseUrl}/api/generate`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(request),
			});

			if (!response.ok) {
				throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
			}

			const data: OllamaResponse = await response.json();
			return data.response.trim();
		} catch (error) {
			console.error("Ollama generation error:", error);
			throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : "Unknown error"}`);
		}
	}

	/**
	 * Check if Ollama is available and model is loaded
	 */
	async isAvailable(): Promise<boolean> {
		try {
			const response = await fetch(`${this.baseUrl}/api/tags`);
			if (!response.ok) return false;

			const data = await response.json();
			return data.models?.some((model: any) => model.name.includes(this.model.split(":")[0]));
		} catch {
			return false;
		}
	}

	/**
	 * Get model information
	 */
	async getModelInfo(): Promise<any> {
		try {
			const response = await fetch(`${this.baseUrl}/api/show`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name: this.model }),
			});

			if (!response.ok) {
				throw new Error(`Failed to get model info: ${response.statusText}`);
			}

			return await response.json();
		} catch (error) {
			console.error("Failed to get model info:", error);
			return null;
		}
	}
}

// Export singleton instance
export const ollamaClient = new OllamaClient();

// Export class for custom instances
export { OllamaClient };