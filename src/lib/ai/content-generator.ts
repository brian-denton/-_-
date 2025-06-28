/**
 * AI-powered content generator for dynamic portfolio content
 * Uses Ollama with Qwen2:0.5b model to generate varied content
 */

import { ollamaClient } from "./ollama-client";

export interface GeneratedContent {
	heroTitle: string;
	heroSubtitle: string;
	heroDescription: string;
	aboutDescription: string;
	skillsFocus: string[];
	projectIdeas: string[];
	personalityTrait: string;
	currentMood: string;
	workingOn: string;
	availability: "available" | "busy" | "selective";
	theme: "professional" | "creative" | "technical" | "innovative";
}

export interface ContentPrompts {
	heroTitle: string;
	heroSubtitle: string;
	heroDescription: string;
	aboutDescription: string;
	skillsFocus: string;
	projectIdeas: string;
	personalityTrait: string;
	currentMood: string;
	workingOn: string;
}

class ContentGenerator {
	private prompts: ContentPrompts = {
		heroTitle: `Generate a creative, professional title for a full-stack developer's portfolio. Make it unique and engaging. Examples: "Code Architect & Digital Craftsman", "Full-Stack Innovator", "Creative Developer & Problem Solver". Return only the title, no quotes or extra text.`,
		
		heroSubtitle: `Generate a compelling subtitle for a developer portfolio that describes their expertise. Focus on modern technologies and impact. Examples: "Building scalable web applications with React & Node.js", "Crafting digital experiences that users love", "Transforming ideas into powerful software solutions". Return only the subtitle, no quotes.`,
		
		heroDescription: `Write a brief, engaging description (2-3 sentences) for a developer's hero section. Focus on passion, skills, and impact. Make it personal and professional. Return only the description, no quotes.`,
		
		aboutDescription: `Write a personal "About Me" description (3-4 sentences) for a full-stack developer. Include journey, passion, and what drives them. Make it authentic and engaging. Return only the description, no quotes.`,
		
		skillsFocus: `List 3-4 technical areas a full-stack developer might be focusing on currently. Examples: "AI Integration", "Performance Optimization", "Cloud Architecture", "Mobile Development", "DevOps", "UI/UX Design". Return as comma-separated list, no quotes.`,
		
		projectIdeas: `Generate 2-3 interesting project ideas a developer might be working on. Be creative but realistic. Examples: "AI-powered task manager", "Real-time collaboration platform", "Sustainable tech marketplace". Return as comma-separated list, no quotes.`,
		
		personalityTrait: `Generate a positive personality trait that would appeal to potential clients/employers. Examples: "detail-oriented", "innovative thinker", "collaborative leader", "problem solver", "creative visionary". Return only the trait, no quotes.`,
		
		currentMood: `Generate a current professional mood/state. Examples: "exploring new technologies", "optimizing for performance", "diving deep into AI", "building something amazing", "solving complex challenges". Return only the mood, no quotes.`,
		
		workingOn: `Generate what a developer might currently be working on. Be specific and interesting. Examples: "a machine learning recommendation engine", "optimizing database queries", "building a design system", "exploring WebAssembly". Return only the description, no quotes.`
	};

	/**
	 * Generate all dynamic content for the portfolio
	 */
	async generateContent(): Promise<GeneratedContent> {
		try {
			// Check if Ollama is available
			const isAvailable = await ollamaClient.isAvailable();
			if (!isAvailable) {
				console.warn("Ollama not available, using fallback content");
				return this.getFallbackContent();
			}

			// Generate all content pieces
			const [
				heroTitle,
				heroSubtitle,
				heroDescription,
				aboutDescription,
				skillsFocus,
				projectIdeas,
				personalityTrait,
				currentMood,
				workingOn
			] = await Promise.all([
				this.generateSingle("heroTitle"),
				this.generateSingle("heroSubtitle"),
				this.generateSingle("heroDescription"),
				this.generateSingle("aboutDescription"),
				this.generateSingle("skillsFocus"),
				this.generateSingle("projectIdeas"),
				this.generateSingle("personalityTrait"),
				this.generateSingle("currentMood"),
				this.generateSingle("workingOn")
			]);

			// Determine theme based on generated content
			const theme = this.determineTheme(heroTitle, heroSubtitle, personalityTrait);
			
			// Determine availability randomly
			const availability = this.getRandomAvailability();

			return {
				heroTitle: this.cleanText(heroTitle),
				heroSubtitle: this.cleanText(heroSubtitle),
				heroDescription: this.cleanText(heroDescription),
				aboutDescription: this.cleanText(aboutDescription),
				skillsFocus: this.parseList(skillsFocus),
				projectIdeas: this.parseList(projectIdeas),
				personalityTrait: this.cleanText(personalityTrait),
				currentMood: this.cleanText(currentMood),
				workingOn: this.cleanText(workingOn),
				availability,
				theme
			};
		} catch (error) {
			console.error("Content generation failed:", error);
			return this.getFallbackContent();
		}
	}

	/**
	 * Generate a single piece of content
	 */
	private async generateSingle(type: keyof ContentPrompts): Promise<string> {
		try {
			const prompt = this.prompts[type];
			const response = await ollamaClient.generate(prompt, {
				temperature: 0.8,
				top_p: 0.9,
				num_predict: 100
			});
			return response;
		} catch (error) {
			console.error(`Failed to generate ${type}:`, error);
			return this.getFallbackForType(type);
		}
	}

	/**
	 * Clean and format generated text
	 */
	private cleanText(text: string): string {
		return text
			.replace(/^["']|["']$/g, "") // Remove quotes
			.replace(/\n+/g, " ") // Replace newlines with spaces
			.trim();
	}

	/**
	 * Parse comma-separated lists
	 */
	private parseList(text: string): string[] {
		return text
			.split(",")
			.map(item => this.cleanText(item))
			.filter(item => item.length > 0)
			.slice(0, 4); // Limit to 4 items
	}

	/**
	 * Determine theme based on generated content
	 */
	private determineTheme(title: string, subtitle: string, trait: string): GeneratedContent["theme"] {
		const content = `${title} ${subtitle} ${trait}`.toLowerCase();
		
		if (content.includes("creative") || content.includes("design") || content.includes("art")) {
			return "creative";
		}
		if (content.includes("technical") || content.includes("engineer") || content.includes("architect")) {
			return "technical";
		}
		if (content.includes("innovative") || content.includes("cutting-edge") || content.includes("future")) {
			return "innovative";
		}
		return "professional";
	}

	/**
	 * Get random availability status
	 */
	private getRandomAvailability(): GeneratedContent["availability"] {
		const options: GeneratedContent["availability"][] = ["available", "busy", "selective"];
		const weights = [0.6, 0.2, 0.2]; // 60% available, 20% busy, 20% selective
		
		const random = Math.random();
		let cumulative = 0;
		
		for (let i = 0; i < options.length; i++) {
			cumulative += weights[i];
			if (random <= cumulative) {
				return options[i];
			}
		}
		
		return "available";
	}

	/**
	 * Fallback content when AI is not available
	 */
	private getFallbackContent(): GeneratedContent {
		const fallbacks = [
			{
				heroTitle: "Full-Stack Developer & Digital Innovator",
				heroSubtitle: "Building scalable web applications with modern technologies",
				heroDescription: "Passionate about creating exceptional digital experiences through clean code and thoughtful design. I transform complex problems into elegant solutions.",
				aboutDescription: "My journey in development started with curiosity and evolved into a passion for building products that make a difference. I believe great software comes from understanding both the technical and human sides of problems.",
				skillsFocus: ["React & Next.js", "Node.js & Python", "Cloud Architecture", "AI Integration"],
				projectIdeas: ["AI-powered analytics dashboard", "Real-time collaboration platform", "Sustainable tech marketplace"],
				personalityTrait: "innovative problem solver",
				currentMood: "exploring cutting-edge technologies",
				workingOn: "a machine learning recommendation system",
				availability: "available" as const,
				theme: "professional" as const
			},
			{
				heroTitle: "Creative Developer & Code Craftsman",
				heroSubtitle: "Crafting beautiful, performant web experiences",
				heroDescription: "I blend creativity with technical expertise to build applications that users love. Every line of code is written with purpose and passion.",
				aboutDescription: "From design to deployment, I enjoy every aspect of the development process. My background in both design and engineering helps me create products that are both beautiful and functional.",
				skillsFocus: ["UI/UX Design", "Performance Optimization", "TypeScript", "Design Systems"],
				projectIdeas: ["Interactive design portfolio", "Performance monitoring tool", "Creative coding playground"],
				personalityTrait: "detail-oriented creative",
				currentMood: "perfecting user experiences",
				workingOn: "an innovative design system framework",
				availability: "selective" as const,
				theme: "creative" as const
			}
		];

		return fallbacks[Math.floor(Math.random() * fallbacks.length)];
	}

	/**
	 * Get fallback for specific content type
	 */
	private getFallbackForType(type: keyof ContentPrompts): string {
		const fallbacks = {
			heroTitle: "Full-Stack Developer & Problem Solver",
			heroSubtitle: "Building exceptional web applications with modern technologies",
			heroDescription: "Passionate about creating digital solutions that make a difference.",
			aboutDescription: "I love turning complex problems into elegant solutions through code.",
			skillsFocus: "React, Node.js, TypeScript, Cloud Computing",
			projectIdeas: "AI-powered web app, Real-time dashboard, Mobile-first platform",
			personalityTrait: "innovative thinker",
			currentMood: "building something amazing",
			workingOn: "a next-generation web application"
		};

		return fallbacks[type];
	}
}

// Export singleton instance
export const contentGenerator = new ContentGenerator();