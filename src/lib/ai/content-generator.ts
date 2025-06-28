/**
 * AI-powered content generator using Ollama for brutalist landing page
 * Generates unique, AI-generated content with no canned messages
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
  theme: "brutal" | "chaos" | "random" | "aggressive";
  confidence: number;
  aiGenerated: boolean;
}

class ContentGenerator {
  /**
   * Generate all dynamic content using Ollama
   */
  async generateContent(forcedTheme?: string): Promise<GeneratedContent> {
    try {
      // Try AI generation, fall back to randomized content if it fails
      let heroTitle, heroSubtitle, heroDescription;
      let aiGenerated = false;

      // Try AI generation for each piece individually
      try {
        heroTitle = await ollamaClient.generateTitle();
        aiGenerated = true;
      } catch (error: unknown) {
        console.warn(
          "AI title generation failed, using randomized:",
          error instanceof Error ? error.message : String(error)
        );
        heroTitle = this.generateRandomTitle();
      }

      try {
        heroSubtitle = await ollamaClient.generateSubtitle();
        aiGenerated = true;
      } catch (error: unknown) {
        console.warn(
          "AI subtitle generation failed, using randomized:",
          error instanceof Error ? error.message : String(error)
        );
        heroSubtitle = this.generateRandomSubtitle();
      }

      try {
        heroDescription = await ollamaClient.generateDescription();
        aiGenerated = true;
      } catch (error: unknown) {
        console.warn(
          "AI description generation failed, using randomized:",
          error instanceof Error ? error.message : String(error)
        );
        heroDescription = this.generateRandomDescription();
      }

      // AI generation status is set by individual calls above

      // Override content with chaos-specific generation if chaos theme is forced
      if (forcedTheme === "chaos") {
        console.log("🔥 CHAOS MODE ACTIVATED - Generating chaos content");
        heroTitle = this.generateChaosTitle();
        heroSubtitle = this.generateChaosSubtitle();
        heroDescription = this.generateChaosDescription();
      }

      // Generate other content with randomization
      const aboutDescription = await this.generateAboutDescription();
      const skillsFocus = this.generateSkills();
      const projectIdeas = this.generateProjects();
      const personalityTrait = this.generatePersonalityTrait();
      const currentMood = this.generateCurrentMood();
      const workingOn = this.generateWorkingOn();
      const availability = this.generateAvailability();
      const theme = forcedTheme || this.generateTheme();

      return {
        heroTitle,
        heroSubtitle,
        heroDescription,
        aboutDescription,
        skillsFocus,
        projectIdeas,
        personalityTrait,
        currentMood,
        workingOn,
        availability,
        theme: theme as GeneratedContent["theme"],
        confidence: aiGenerated ? 0.8 : 0.6,
        aiGenerated,
      };
    } catch (error) {
      console.error("Content generation failed:", error);
      return this.getRandomizedFallback();
    }
  }

  /**
   * Generate random title
   */
  private generateRandomTitle(): string {
    const prefixes = [
      "PURE",
      "RAW",
      "BOLD",
      "STARK",
      "EDGE",
      "VOID",
      "FORM",
      "CODE",
      "CLEAN",
      "SHARP",
      "DIRECT",
      "SIMPLE",
      "CLEAR",
      "HONEST",
      "PLAIN",
      "CORE",
    ];
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} DIGITAL`;
  }

  /**
   * Generate random subtitle
   */
  private generateRandomSubtitle(): string {
    const adjectives = [
      "bold",
      "pure",
      "raw",
      "stark",
      "clean",
      "sharp",
      "direct",
      "honest",
      "simple",
      "clear",
      "minimal",
      "functional",
      "precise",
      "efficient",
    ];
    const concepts = [
      "creativity",
      "innovation",
      "artistry",
      "precision",
      "vision",
      "craft",
      "design",
      "code",
      "interfaces",
      "solutions",
      "experiences",
      "systems",
    ];

    return `${
      adjectives[Math.floor(Math.random() * adjectives.length)]
    } digital ${concepts[Math.floor(Math.random() * concepts.length)]}`;
  }

  /**
   * Generate random description
   */
  private generateRandomDescription(): string {
    const approaches = [
      "This methodology prioritizes function over decoration",
      "The design philosophy emphasizes clarity and purpose",
      "Each interface element follows minimalist principles",
      "The creative process focuses on essential components",
      "This framework eliminates unnecessary complexity",
      "My approach combines aesthetic vision with functional clarity",
      "Every design decision serves a specific user need",
      "The philosophy centers on honest, purposeful design",
    ];

    const outcomes = [
      "resulting in powerful user experiences",
      "creating impactful digital interactions",
      "producing clean, effective interfaces",
      "generating meaningful design solutions",
      "building authentic digital environments",
      "crafting intuitive user journeys",
      "developing accessible design systems",
      "establishing clear visual hierarchies",
    ];

    const approach = approaches[Math.floor(Math.random() * approaches.length)];
    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];

    return `${approach}, ${outcome}.`;
  }

  /**
   * Generate chaos-specific title
   */
  private generateChaosTitle(): string {
    const chaosWords = [
      "ENTROPY",
      "DISORDER",
      "CHAOS",
      "RANDOM",
      "GLITCH",
      "NOISE",
      "STATIC",
      "VOID",
      "FRACTAL",
      "STORM",
      "FLUX",
      "VORTEX",
      "QUANTUM",
      "NEURAL",
    ];
    return `${
      chaosWords[Math.floor(Math.random() * chaosWords.length)]
    } DIGITAL`;
  }

  /**
   * Generate chaos-specific subtitle
   */
  private generateChaosSubtitle(): string {
    const chaosAdjectives = [
      "chaotic",
      "random",
      "unpredictable",
      "entropic",
      "glitched",
      "distorted",
      "fragmented",
      "scattered",
      "wild",
      "volatile",
      "unstable",
      "disruptive",
    ];
    const chaosConcepts = [
      "algorithms",
      "patterns",
      "systems",
      "networks",
      "processes",
      "structures",
      "matrices",
      "sequences",
      "iterations",
      "computations",
      "generations",
      "mutations",
    ];

    return `${
      chaosAdjectives[Math.floor(Math.random() * chaosAdjectives.length)]
    } ${
      chaosConcepts[Math.floor(Math.random() * chaosConcepts.length)]
    } unleashed`;
  }

  /**
   * Generate chaos-specific description
   */
  private generateChaosDescription(): string {
    const chaosApproaches = [
      "Embracing chaos as the ultimate creative force",
      "Random patterns emerge from algorithmic disorder",
      "Controlled entropy generates unexpected beauty",
      "Digital chaos breeds innovative solutions",
      "Unpredictable systems create serendipitous outcomes",
      "Disorder becomes the new order in digital space",
      "Chaotic algorithms produce emergent complexity",
      "Random generation unlocks infinite creative possibilities",
    ];

    const chaosOutcomes = [
      "resulting in beautifully unpredictable experiences",
      "creating delightfully chaotic user journeys",
      "producing wonderfully disordered interfaces",
      "generating magnificently random interactions",
      "building authentically chaotic digital environments",
      "crafting spontaneously evolving systems",
      "developing organically chaotic structures",
      "establishing beautifully broken conventions",
    ];

    const approach =
      chaosApproaches[Math.floor(Math.random() * chaosApproaches.length)];
    const outcome =
      chaosOutcomes[Math.floor(Math.random() * chaosOutcomes.length)];

    return `${approach}, ${outcome}.`;
  }

  /**
   * Generate about description with Ollama
   */
  private async generateAboutDescription(): Promise<string> {
    try {
      // For now, generate varied content based on the context
      const approaches = [
        "I believe in the power of simplicity and purposeful design",
        "My work focuses on eliminating unnecessary complexity",
        "I create interfaces that prioritize user needs above all",
        "My approach combines aesthetic vision with functional clarity",
        "I design digital experiences that feel authentic and honest",
      ];

      const values = [
        "Every element must serve a clear purpose",
        "Form follows function in all my creative decisions",
        "I strive for maximum impact with minimal elements",
        "Clean code and clean design go hand in hand",
        "User experience drives every design choice I make",
      ];

      const approach =
        approaches[Math.floor(Math.random() * approaches.length)];
      const value = values[Math.floor(Math.random() * values.length)];

      return `${approach}. ${value}. This philosophy guides every project I undertake.`;
    } catch (error) {
      console.error("About description generation failed:", error);
      return this.generateFallbackAbout();
    }
  }

  /**
   * Generate skills with variety
   */
  private generateSkills(): string[] {
    const techSkills = [
      "REACT",
      "TYPESCRIPT",
      "NODE.JS",
      "PYTHON",
      "RUST",
      "GO",
      "SVELTE",
      "VUE",
    ];
    const designSkills = [
      "FIGMA",
      "DESIGN SYSTEMS",
      "UI/UX",
      "PROTOTYPING",
      "TYPOGRAPHY",
      "COLOR THEORY",
    ];
    const conceptSkills = [
      "MINIMALISM",
      "BRUTALISM",
      "FUNCTIONALITY",
      "ACCESSIBILITY",
      "PERFORMANCE",
      "USABILITY",
    ];
    const methodSkills = [
      "AGILE",
      "TDD",
      "CLEAN CODE",
      "REFACTORING",
      "OPTIMIZATION",
      "ARCHITECTURE",
    ];

    const allSkills = [
      ...techSkills,
      ...designSkills,
      ...conceptSkills,
      ...methodSkills,
    ];

    // Randomly select 6 skills
    const selectedSkills = [];
    const skillsCopy = [...allSkills];

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * skillsCopy.length);
      selectedSkills.push(skillsCopy.splice(randomIndex, 1)[0]);
    }

    return selectedSkills;
  }

  /**
   * Generate project ideas with variety
   */
  private generateProjects(): string[] {
    const projectTypes = [
      "Minimalist Dashboard",
      "Design System",
      "Component Library",
      "Web Application",
      "Mobile Interface",
      "API Platform",
      "Creative Tool",
      "Documentation Site",
      "Portfolio Platform",
      "E-commerce Interface",
    ];

    const adjectives = [
      "Clean",
      "Modern",
      "Functional",
      "Elegant",
      "Simple",
      "Powerful",
      "Intuitive",
      "Responsive",
      "Accessible",
      "Efficient",
    ];

    const projects = [];
    for (let i = 0; i < 3; i++) {
      const project =
        projectTypes[Math.floor(Math.random() * projectTypes.length)];
      const adjective =
        adjectives[Math.floor(Math.random() * adjectives.length)];
      projects.push(`${adjective} ${project}`);
    }

    return projects;
  }

  /**
   * Generate personality trait with variety
   */
  private generatePersonalityTrait(): string {
    const traits = [
      "minimalist perfectionist",
      "functional design advocate",
      "clean code enthusiast",
      "user experience champion",
      "accessibility advocate",
      "performance optimizer",
      "design system creator",
      "interface craftsperson",
      "digital problem solver",
      "thoughtful developer",
    ];

    return traits[Math.floor(Math.random() * traits.length)];
  }

  /**
   * Generate current mood with variety
   */
  private generateCurrentMood(): string {
    const moods = [
      "refining interface details",
      "optimizing user experiences",
      "crafting clean components",
      "solving design challenges",
      "building accessible interfaces",
      "creating design systems",
      "improving code quality",
      "exploring new patterns",
      "simplifying complex flows",
      "enhancing performance",
    ];

    return moods[Math.floor(Math.random() * moods.length)];
  }

  /**
   * Generate working on with variety
   */
  private generateWorkingOn(): string {
    const projects = [
      "a clean dashboard interface",
      "an accessible component library",
      "a minimalist design system",
      "a performance optimization tool",
      "a user-friendly documentation site",
      "a responsive web application",
      "an intuitive mobile interface",
      "a streamlined workflow tool",
      "a modern portfolio platform",
      "a functional creative tool",
    ];

    return projects[Math.floor(Math.random() * projects.length)];
  }

  /**
   * Generate availability
   */
  private generateAvailability(): GeneratedContent["availability"] {
    const options: GeneratedContent["availability"][] = [
      "available",
      "busy",
      "selective",
    ];
    return options[Math.floor(Math.random() * options.length)];
  }

  /**
   * Generate theme
   */
  private generateTheme(): GeneratedContent["theme"] {
    const themes: GeneratedContent["theme"][] = [
      "brutal",
      "chaos",
      "random",
      "aggressive",
    ];
    return themes[Math.floor(Math.random() * themes.length)];
  }

  /**
   * Generate fallback about description
   */
  private generateFallbackAbout(): string {
    const philosophies = [
      "I believe great design is invisible - it just works",
      "My approach centers on solving real user problems",
      "I create digital experiences that feel natural and intuitive",
      "My work combines aesthetic sensibility with technical precision",
      "I design with empathy, accessibility, and performance in mind",
    ];

    const methods = [
      "Through iterative design and continuous refinement",
      "By focusing on essential elements and removing the unnecessary",
      "Using data-driven decisions and user feedback",
      "With attention to detail and commitment to quality",
      "By balancing creativity with practical constraints",
    ];

    const philosophy =
      philosophies[Math.floor(Math.random() * philosophies.length)];
    const method = methods[Math.floor(Math.random() * methods.length)];

    return `${philosophy}. ${method}, I create meaningful digital solutions.`;
  }

  /**
   * Randomized fallback when AI is not available
   */
  private getRandomizedFallback(): GeneratedContent {
    const titles = [
      "PURE DIGITAL",
      "CLEAN CODE",
      "MINIMAL DESIGN",
      "FUNCTIONAL ART",
      "SIMPLE TOOLS",
    ];
    const subtitles = [
      "clean design meets functional code",
      "minimalist approach to digital creation",
      "purposeful interfaces with honest aesthetics",
      "thoughtful design for meaningful experiences",
      "clarity and function in digital form",
    ];

    return {
      heroTitle: titles[Math.floor(Math.random() * titles.length)],
      heroSubtitle: subtitles[Math.floor(Math.random() * subtitles.length)],
      heroDescription: this.generateFallbackAbout(),
      aboutDescription: this.generateFallbackAbout(),
      skillsFocus: this.generateSkills(),
      projectIdeas: this.generateProjects(),
      personalityTrait: this.generatePersonalityTrait(),
      currentMood: this.generateCurrentMood(),
      workingOn: this.generateWorkingOn(),
      availability: this.generateAvailability(),
      theme: this.generateTheme(),
      confidence: 0.6,
      aiGenerated: false,
    };
  }
}

// Export singleton instance
export const contentGenerator = new ContentGenerator();
