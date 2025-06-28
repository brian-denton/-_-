/**
 * AI-powered content generator using MobileBERT for intelligent portfolio content
 * Analyzes user context and generates personalized content
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
	theme: "professional" | "creative" | "technical" | "innovative";
	confidence: number;
	aiGenerated: boolean;
}

class ContentGenerator {
	/**
	 * Generate all dynamic content for the portfolio using MobileBERT
	 */
	async generateContent(userAgent?: string): Promise<GeneratedContent> {
		try {
			// Check if MobileBERT is available
			const isAvailable = await mobileBERTClient.isAvailable();
			if (!isAvailable) {
				console.warn("MobileBERT not available, using fallback content");
				return this.getFallbackContent();
			}

			// Analyze user context
			const timeOfDay = this.getTimeOfDay();
			const dayOfWeek = this.getDayOfWeek();
			const userAgentString = userAgent || "modern browser";

			const personalityAnalysis = await mobileBERTClient.analyzeUserContext(
				userAgentString,
				timeOfDay,
				dayOfWeek
			);

			// Generate content suggestions based on personality
			const contentSuggestions = await mobileBERTClient.generateContentSuggestions(
				personalityAnalysis.personality,
				personalityAnalysis.traits
			);

			// Extract specific content pieces
			const heroTitle = this.findSuggestion(contentSuggestions, "heroTitle")?.content || 
				this.generateTitleForPersonality(personalityAnalysis.personality);

			const heroDescription = this.findSuggestion(contentSuggestions, "heroDescription")?.content ||
				this.generateDescriptionForPersonality(personalityAnalysis.personality);

			// Generate subtitle based on personality
			const heroSubtitle = this.generateSubtitle(personalityAnalysis.personality);

			// Generate skills based on personality and context
			const skillsFocus = await this.generateSkills(personalityAnalysis.personality);

			// Generate other content
			const aboutDescription = this.generateAboutDescription(personalityAnalysis.personality, personalityAnalysis.traits);
			const projectIdeas = this.generateProjectIdeas(personalityAnalysis.personality);
			const currentMood = this.generateCurrentMood(personalityAnalysis.personality);
			const workingOn = this.generateWorkingOn(personalityAnalysis.personality);

			// Determine theme using MobileBERT
			const combinedContent = `${heroTitle} ${heroSubtitle} ${heroDescription}`;
			const theme = await mobileBERTClient.classifyTheme(combinedContent) as GeneratedContent["theme"];

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
	 * Generate skills based on personality
	 */
	private async generateSkills(personality: string): Promise<string[]> {
		const skillContext = `A ${personality} developer working with modern web technologies`;
		
		try {
			const skills = await mobileBERTClient.extractSkills(skillContext);
			return skills;
		} catch (error) {
			console.error("Skills generation failed:", error);
			return this.getDefaultSkills(personality);
		}
	}

	/**
	 * Helper methods
	 */
	private findSuggestion(suggestions: any[], type: string) {
		return suggestions.find(s => s.type === type);
	}

	private generateTitleForPersonality(personality: string): string {
		const titles: Record<string, string[]> = {
			professional: [
				"Senior Full-Stack Developer & Solutions Architect",
				"Lead Developer & Technical Consultant", 
				"Principal Engineer & Digital Strategist"
			],
			creative: [
				"Creative Developer & Digital Design Craftsman",
				"UI/UX Engineer & Visual Storyteller",
				"Design-Focused Developer & Creative Technologist"
			],
			technical: [
				"Technical Lead & Systems Architect",
				"Engineering Manager & Performance Specialist",
				"Backend Architect & Infrastructure Expert"
			],
			innovative: [
				"Innovation Engineer & Future-Tech Builder",
				"AI-Focused Developer & Technology Pioneer",
				"Next-Gen Developer & Emerging Tech Specialist"
			]
		};

		const options = titles[personality] || titles.professional;
		return options[Math.floor(Math.random() * options.length)];
	}

	private generateDescriptionForPersonality(personality: string): string {
		const descriptions: Record<string, string[]> = {
			professional: [
				"Building enterprise-grade applications with proven methodologies and industry best practices. Focused on delivering reliable, scalable solutions.",
				"Transforming complex business requirements into robust digital solutions. Passionate about clean architecture and maintainable code.",
				"Creating production-ready applications that drive business success. Expert in full-stack development and system design."
			],
			creative: [
				"Crafting beautiful, intuitive digital experiences that blend artistic vision with technical excellence. Every pixel has purpose.",
				"Designing and developing user-centered applications that delight and inspire. Where creativity meets cutting-edge technology.",
				"Building visually stunning, highly interactive web experiences. Passionate about design systems and user experience."
			],
			technical: [
				"Engineering high-performance applications with optimal algorithms and clean architecture. Deep expertise in system optimization.",
				"Solving complex technical challenges through innovative engineering solutions. Focused on scalability and performance.",
				"Building robust, efficient systems that handle scale. Expert in backend architecture and performance optimization."
			],
			innovative: [
				"Exploring cutting-edge technologies to build the future of web development. Passionate about AI integration and emerging frameworks.",
				"Pioneering next-generation web solutions with experimental technologies. Always pushing the boundaries of what's possible.",
				"Creating tomorrow's applications today. Focused on AI, machine learning, and revolutionary web technologies."
			]
		};

		const options = descriptions[personality] || descriptions.professional;
		return options[Math.floor(Math.random() * options.length)];
	}

	private generateSubtitle(personality: string): string {
		const subtitles: Record<string, string[]> = {
			professional: [
				"Building scalable web applications with modern technologies",
				"Delivering enterprise solutions that drive business growth",
				"Creating robust digital platforms for complex challenges"
			],
			creative: [
				"Crafting beautiful, user-centered digital experiences",
				"Designing and developing visually stunning applications",
				"Blending creativity with cutting-edge web technology"
			],
			technical: [
				"Engineering high-performance, scalable web systems",
				"Architecting robust backend solutions and APIs",
				"Optimizing applications for speed and reliability"
			],
			innovative: [
				"Exploring AI-powered web development solutions",
				"Building next-generation applications with emerging tech",
				"Pioneering the future of interactive web experiences"
			]
		};

		const options = subtitles[personality] || subtitles.professional;
		return options[Math.floor(Math.random() * options.length)];
	}

	private generateAboutDescription(personality: string, traits: string[]): string {
		const templates: Record<string, string> = {
			professional: `My journey in development has been driven by a commitment to excellence and reliability. As a ${traits.join(', ')} developer, I focus on building solutions that not only meet requirements but exceed expectations. I believe in the power of well-architected systems and clean, maintainable code.`,
			creative: `I started as a designer who fell in love with code, and that unique perspective shapes everything I build. Being ${traits.join(', ')}, I approach development as both an art and a science. My goal is to create digital experiences that are not just functional, but truly inspiring.`,
			technical: `My passion lies in solving complex technical challenges through elegant engineering solutions. As a ${traits.join(', ')} developer, I thrive on optimizing performance, designing scalable architectures, and diving deep into the technical details that make great software possible.`,
			innovative: `I'm constantly exploring the cutting edge of web development, always looking for ways to push boundaries and create something new. Being ${traits.join(', ')}, I love experimenting with emerging technologies and finding innovative solutions to traditional problems.`
		};

		return templates[personality] || templates.professional;
	}

	private generateProjectIdeas(personality: string): string[] {
		const projects: Record<string, string[]> = {
			professional: [
				"Enterprise dashboard with real-time analytics",
				"Scalable e-commerce platform with microservices",
				"Business process automation tool"
			],
			creative: [
				"Interactive portfolio with 3D animations",
				"Creative coding playground and showcase",
				"Design system documentation platform"
			],
			technical: [
				"High-performance API gateway",
				"Distributed caching optimization system",
				"Real-time monitoring and alerting platform"
			],
			innovative: [
				"AI-powered content generation platform",
				"Machine learning recommendation engine",
				"Blockchain-based decentralized application"
			]
		};

		return projects[personality] || projects.professional;
	}

	private generateCurrentMood(personality: string): string {
		const moods: Record<string, string[]> = {
			professional: ["optimizing business processes", "delivering reliable solutions", "building scalable systems"],
			creative: ["exploring design possibilities", "crafting beautiful interfaces", "experimenting with animations"],
			technical: ["solving complex algorithms", "optimizing performance", "architecting robust systems"],
			innovative: ["exploring AI integration", "experimenting with new frameworks", "building future-ready solutions"]
		};

		const options = moods[personality] || moods.professional;
		return options[Math.floor(Math.random() * options.length)];
	}

	private generateWorkingOn(personality: string): string {
		const projects: Record<string, string[]> = {
			professional: ["a comprehensive business analytics platform", "enterprise-grade API infrastructure", "scalable microservices architecture"],
			creative: ["an immersive 3D web experience", "a revolutionary design system", "interactive data visualization tools"],
			technical: ["a high-performance caching layer", "distributed system optimization", "advanced monitoring solutions"],
			innovative: ["an AI-powered development assistant", "next-generation web framework", "machine learning integration platform"]
		};

		const options = projects[personality] || projects.professional;
		return options[Math.floor(Math.random() * options.length)];
	}

	private getDefaultSkills(personality: string): string[] {
		const skills: Record<string, string[]> = {
			professional: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS", "Docker"],
			creative: ["React", "Next.js", "Tailwind CSS", "Figma", "Three.js", "Framer Motion"],
			technical: ["Node.js", "Python", "PostgreSQL", "Redis", "Kubernetes", "GraphQL"],
			innovative: ["React", "TypeScript", "AI/ML", "WebAssembly", "Blockchain", "Edge Computing"]
		};

		return skills[personality] || skills.professional;
	}

	private generateAvailability(): GeneratedContent["availability"] {
		const options: GeneratedContent["availability"][] = ["available", "busy", "selective"];
		const weights = [0.6, 0.2, 0.2];
		
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
				heroTitle: "Full-Stack Developer & Digital Innovator",
				heroSubtitle: "Building scalable web applications with modern technologies",
				heroDescription: "Passionate about creating exceptional digital experiences through clean code and thoughtful design. I transform complex problems into elegant solutions.",
				aboutDescription: "My journey in development started with curiosity and evolved into a passion for building products that make a difference. I believe great software comes from understanding both the technical and human sides of problems.",
				skillsFocus: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
				projectIdeas: ["AI-powered analytics dashboard", "Real-time collaboration platform", "Sustainable tech marketplace"],
				personalityTrait: "innovative problem solver",
				currentMood: "exploring cutting-edge technologies",
				workingOn: "a machine learning recommendation system",
				availability: "available" as const,
				theme: "professional" as const,
				confidence: 0.8,
				aiGenerated: false
			},
			{
				heroTitle: "Creative Developer & Code Craftsman",
				heroSubtitle: "Crafting beautiful, performant web experiences",
				heroDescription: "I blend creativity with technical expertise to build applications that users love. Every line of code is written with purpose and passion.",
				aboutDescription: "From design to deployment, I enjoy every aspect of the development process. My background in both design and engineering helps me create products that are both beautiful and functional.",
				skillsFocus: ["React", "TypeScript", "Tailwind CSS", "Figma", "Three.js", "Framer Motion"],
				projectIdeas: ["Interactive design portfolio", "Performance monitoring tool", "Creative coding playground"],
				personalityTrait: "detail-oriented creative",
				currentMood: "perfecting user experiences",
				workingOn: "an innovative design system framework",
				availability: "selective" as const,
				theme: "creative" as const,
				confidence: 0.8,
				aiGenerated: false
			}
		];

		return fallbacks[Math.floor(Math.random() * fallbacks.length)];
	}
}

// Export singleton instance
export const contentGenerator = new ContentGenerator();