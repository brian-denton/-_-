/**
 * AI-powered content generator using MobileBERT for brutalist landing page
 * Generates random, chaotic content with brutalist themes
 */

import { mobileBERTClient } from "./mobilebert-client";

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
	theme: "brutal" | "chaos" | "random" | "aggressive";
	confidence: number;
	aiGenerated: boolean;
}

class ContentGenerator {
	/**
	 * Generate all dynamic content for the brutalist landing page using MobileBERT
	 */
	async generateContent(userAgent?: string): Promise<GeneratedContent> {
		try {
			// Check if MobileBERT is available
			const isAvailable = await mobileBERTClient.isAvailable();
			if (!isAvailable) {
				console.warn("MobileBERT not available, using fallback content");
				return this.getFallbackContent();
			}

			// Analyze user context for brutalist themes
			const timeOfDay = this.getTimeOfDay();
			const dayOfWeek = this.getDayOfWeek();
			const userAgentString = userAgent || "unknown browser";

			// Generate brutalist personality analysis
			const personalityAnalysis = await mobileBERTClient.analyzeBrutalistContext(
				userAgentString,
				timeOfDay,
				dayOfWeek
			);

			// Generate chaotic content suggestions
			const contentSuggestions = await mobileBERTClient.generateBrutalistContent(
				personalityAnalysis.personality,
				personalityAnalysis.traits
			);

			// Extract specific content pieces with brutalist themes
			const heroTitle = this.generateBrutalistTitle(personalityAnalysis.personality);
			const heroSubtitle = this.generateBrutalistSubtitle(personalityAnalysis.personality);
			const heroDescription = this.generateBrutalistDescription(personalityAnalysis.personality);

			// Generate skills with brutalist/tech focus
			const skillsFocus = await this.generateBrutalistSkills(personalityAnalysis.personality);

			// Generate other content
			const aboutDescription = this.generateBrutalistAbout(personalityAnalysis.personality, personalityAnalysis.traits);
			const projectIdeas = this.generateBrutalistProjects(personalityAnalysis.personality);
			const currentMood = this.generateBrutalistMood(personalityAnalysis.personality);
			const workingOn = this.generateBrutalistWork(personalityAnalysis.personality);

			// Determine theme using MobileBERT
			const combinedContent = `${heroTitle} ${heroSubtitle} ${heroDescription}`;
			const theme = await mobileBERTClient.classifyBrutalistTheme(combinedContent) as GeneratedContent["theme"];

			// Generate availability
			const availability = this.generateAvailability();

			return {
				heroTitle,
				heroSubtitle,
				heroDescription,
				aboutDescription,
				skillsFocus,
				projectIdeas,
				personalityTrait: personalityAnalysis.traits[0],
				currentMood,
				workingOn,
				availability,
				theme,
				confidence: personalityAnalysis.confidence,
				aiGenerated: true
			};

		} catch (error) {
			console.error("Content generation failed:", error);
			return this.getFallbackContent();
		}
	}

	/**
	 * Generate brutalist skills
	 */
	private async generateBrutalistSkills(personality: string): Promise<string[]> {
		const skillContext = `A ${personality} brutalist designer working with bold, aggressive technologies`;
		
		try {
			const skills = await mobileBERTClient.extractBrutalistSkills(skillContext);
			return skills;
		} catch (error) {
			console.error("Skills generation failed:", error);
			return this.getDefaultBrutalistSkills(personality);
		}
	}

	/**
	 * Generate brutalist titles
	 */
	private generateBrutalistTitle(personality: string): string {
		const titles: Record<string, string[]> = {
			brutal: [
				"CONCRETE DIGITAL",
				"RAW CODE MACHINE",
				"BRUTAL INTERFACE",
				"AGGRESSIVE DESIGN",
				"UNCOMPROMISING TECH"
			],
			chaos: [
				"RANDOM GENERATOR",
				"CHAOS ENGINE",
				"DISORDER MACHINE",
				"ENTROPY CREATOR",
				"UNPREDICTABLE AI"
			],
			random: [
				"ALGORITHMIC CHAOS",
				"DIGITAL ANARCHY",
				"RANDOM BRUTALISM",
				"CHAOTIC GENERATOR",
				"UNPREDICTABLE FORCE"
			],
			aggressive: [
				"BOLD STATEMENT",
				"AGGRESSIVE INTERFACE",
				"UNSUBTLE DESIGN",
				"LOUD DIGITAL",
				"CONFRONTATIONAL CODE"
			]
		};

		const options = titles[personality] || titles.brutal;
		return options[Math.floor(Math.random() * options.length)];
	}

	private generateBrutalistSubtitle(personality: string): string {
		const subtitles: Record<string, string[]> = {
			brutal: [
				"Raw, unfiltered digital experience",
				"Concrete meets code in brutal harmony",
				"Uncompromising design philosophy",
				"Bold statements through brutal aesthetics"
			],
			chaos: [
				"Embracing digital disorder and randomness",
				"Controlled chaos through algorithmic generation",
				"Beautiful destruction of design conventions",
				"Random patterns creating unexpected beauty"
			],
			random: [
				"Every visit generates new possibilities",
				"Algorithmic randomness meets brutal design",
				"Unpredictable content, consistent boldness",
				"Random generation with purposeful chaos"
			],
			aggressive: [
				"Loud, bold, and unapologetically direct",
				"Confrontational design that demands attention",
				"Aggressive aesthetics for digital rebels",
				"Unsubtle beauty in computational aggression"
			]
		};

		const options = subtitles[personality] || subtitles.brutal;
		return options[Math.floor(Math.random() * options.length)];
	}

	private generateBrutalistDescription(personality: string): string {
		const descriptions: Record<string, string[]> = {
			brutal: [
				"This is brutalism applied to digital space. Raw, uncompromising, and boldly functional. Every element serves a purpose, stripped of unnecessary decoration.",
				"Concrete aesthetics meet digital innovation. Bold typography, stark contrasts, and geometric forms create an uncompromising user experience.",
				"Brutalist design philosophy translated into code. Functional beauty through aggressive simplicity and unsubtle visual hierarchy."
			],
			chaos: [
				"Controlled chaos through algorithmic generation. Every element is randomly created yet purposefully designed to create beautiful disorder.",
				"Embracing randomness as a design principle. Chaotic generation creates unexpected patterns and serendipitous digital experiences.",
				"Digital entropy as aesthetic choice. Random generation meets intentional design to create controlled beautiful chaos."
			],
			random: [
				"Pure algorithmic creativity. Every visit generates new content, new layouts, new experiences. Randomness becomes the ultimate design tool.",
				"Computational creativity unleashed. Random generation creates infinite possibilities within brutalist design constraints.",
				"Algorithmic art meets functional design. Random content generation within structured brutalist aesthetic principles."
			],
			aggressive: [
				"Uncompromising digital aggression. Bold colors, sharp edges, and confrontational typography create an intense user experience.",
				"Aggressive aesthetics for the digital age. Loud, bold, and unapologetically direct in every design decision.",
				"Confrontational design that refuses to be ignored. Aggressive visual hierarchy demands attention and engagement."
			]
		};

		const options = descriptions[personality] || descriptions.brutal;
		return options[Math.floor(Math.random() * options.length)];
	}

	private generateBrutalistAbout(personality: string, traits: string[]): string {
		const templates: Record<string, string> = {
			brutal: `I am a digital brutalist, committed to raw, uncompromising design. As a ${traits.join(', ')} creator, I believe in the power of bold statements and functional beauty. No decoration for decoration's sake.`,
			chaos: `I embrace chaos as a creative force. Being ${traits.join(', ')}, I find beauty in randomness and order in disorder. Every creation is an experiment in controlled entropy.`,
			random: `I am an algorithmic artist, using randomness as my primary tool. As a ${traits.join(', ')} generator, I create infinite possibilities through computational creativity and structured chaos.`,
			aggressive: `I create confrontational digital experiences. Being ${traits.join(', ')}, I believe design should be bold, loud, and unapologetically direct. Subtlety is overrated.`
		};

		return templates[personality] || templates.brutal;
	}

	private generateBrutalistProjects(personality: string): string[] {
		const projects: Record<string, string[]> = {
			brutal: [
				"Concrete UI Framework",
				"Raw Typography System",
				"Brutalist Component Library"
			],
			chaos: [
				"Random Layout Generator",
				"Chaos Design System",
				"Entropy-Based Interface"
			],
			random: [
				"Algorithmic Art Platform",
				"Random Content Engine",
				"Generative Design Tool"
			],
			aggressive: [
				"Confrontational Interface",
				"Aggressive Typography Engine",
				"Bold Statement Generator"
			]
		};

		return projects[personality] || projects.brutal;
	}

	private generateBrutalistMood(personality: string): string {
		const moods: Record<string, string[]> = {
			brutal: ["creating uncompromising interfaces", "building raw digital experiences", "designing without compromise"],
			chaos: ["embracing beautiful disorder", "generating controlled chaos", "creating random beauty"],
			random: ["exploring algorithmic creativity", "generating infinite possibilities", "creating computational art"],
			aggressive: ["making bold statements", "designing confrontational experiences", "creating aggressive aesthetics"]
		};

		const options = moods[personality] || moods.brutal;
		return options[Math.floor(Math.random() * options.length)];
	}

	private generateBrutalistWork(personality: string): string {
		const projects: Record<string, string[]> = {
			brutal: ["a concrete digital manifesto", "raw interface architecture", "uncompromising design system"],
			chaos: ["a beautiful chaos generator", "controlled entropy platform", "random beauty engine"],
			random: ["an algorithmic art installation", "computational creativity tool", "infinite possibility generator"],
			aggressive: ["a confrontational digital experience", "aggressive aesthetic framework", "bold statement platform"]
		};

		const options = projects[personality] || projects.brutal;
		return options[Math.floor(Math.random() * options.length)];
	}

	private getDefaultBrutalistSkills(personality: string): string[] {
		const skills: Record<string, string[]> = {
			brutal: ["CONCRETE", "RAW CSS", "BOLD TYPOGRAPHY", "GEOMETRIC FORMS", "STARK CONTRAST", "FUNCTIONAL BEAUTY"],
			chaos: ["RANDOMNESS", "ENTROPY", "DISORDER", "CHAOS THEORY", "ALGORITHMIC ART", "CONTROLLED CHAOS"],
			random: ["ALGORITHMS", "GENERATION", "PROBABILITY", "RANDOMIZATION", "COMPUTATIONAL ART", "INFINITE LOOPS"],
			aggressive: ["BOLD COLORS", "SHARP EDGES", "LOUD DESIGN", "CONFRONTATION", "UNSUBTLE", "AGGRESSIVE TYPOGRAPHY"]
		};

		return skills[personality] || skills.brutal;
	}

	private generateAvailability(): GeneratedContent["availability"] {
		const options: GeneratedContent["availability"][] = ["available", "busy", "selective"];
		const weights = [0.4, 0.3, 0.3];
		
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

	private getTimeOfDay(): string {
		const hour = new Date().getHours();
		if (hour < 6) return "early morning";
		if (hour < 12) return "morning";
		if (hour < 17) return "afternoon";
		if (hour < 21) return "evening";
		return "night";
	}

	private getDayOfWeek(): string {
		const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		return days[new Date().getDay()];
	}

	/**
	 * Fallback content when AI is not available
	 */
	private getFallbackContent(): GeneratedContent {
		const fallbacks = [
			{
				heroTitle: "BRUTAL DIGITAL",
				heroSubtitle: "Raw, uncompromising design meets algorithmic chaos",
				heroDescription: "This is brutalism for the digital age. Bold, uncompromising, and randomly generated. Every visit creates new chaos within structured design principles.",
				aboutDescription: "I am a digital brutalist, embracing chaos as a creative force. Raw aesthetics meet computational creativity to create uncompromising digital experiences.",
				skillsFocus: ["BRUTALISM", "CHAOS", "RANDOMNESS", "BOLD DESIGN", "RAW CSS", "AGGRESSIVE TYPOGRAPHY"],
				projectIdeas: ["Chaos Generator", "Brutal Interface", "Random Beauty Engine"],
				personalityTrait: "uncompromising brutalist",
				currentMood: "creating digital chaos",
				workingOn: "a brutal randomness engine",
				availability: "available" as const,
				theme: "brutal" as const,
				confidence: 0.8,
				aiGenerated: false
			},
			{
				heroTitle: "CHAOS ENGINE",
				heroSubtitle: "Algorithmic randomness meets brutal aesthetics",
				heroDescription: "Pure computational creativity. Random generation creates infinite possibilities within brutalist design constraints. Embrace the beautiful chaos.",
				aboutDescription: "I create through controlled chaos and algorithmic randomness. Every element is generated, every visit is unique, every experience is brutally honest.",
				skillsFocus: ["ALGORITHMS", "RANDOMNESS", "CHAOS THEORY", "BRUTAL DESIGN", "ENTROPY", "GENERATION"],
				projectIdeas: ["Random Interface Generator", "Chaos Design System", "Algorithmic Brutalism"],
				personalityTrait: "chaotic generator",
				currentMood: "embracing beautiful disorder",
				workingOn: "an entropy-based design platform",
				availability: "selective" as const,
				theme: "chaos" as const,
				confidence: 0.8,
				aiGenerated: false
			}
		];

		return fallbacks[Math.floor(Math.random() * fallbacks.length)];
	}
}

// Export singleton instance
export const contentGenerator = new ContentGenerator();