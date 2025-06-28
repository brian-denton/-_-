/**
 * Dynamic About Section with AI-generated content
 * Adapts based on the generated personality and focus areas
 */

"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Code, Palette, Rocket, Users, Brain, Zap, Target, Heart } from "lucide-react";
import { useDynamicContent } from "@/hooks/use-dynamic-content";

const iconMap = {
	"React": Code,
	"Node.js": Code,
	"TypeScript": Code,
	"AI": Brain,
	"Design": Palette,
	"Performance": Zap,
	"Cloud": Rocket,
	"UI/UX": Palette,
	"DevOps": Target,
	"Mobile": Code,
	"default": Heart
};

const getIconForSkill = (skill: string) => {
	const key = Object.keys(iconMap).find(k => skill.toLowerCase().includes(k.toLowerCase()));
	return iconMap[key as keyof typeof iconMap] || iconMap.default;
};

export function DynamicAboutSection() {
	const { content, isLoading } = useDynamicContent();

	const highlights = [
		{
			icon: Code,
			title: "Clean Code",
			description: "Writing maintainable, scalable, and efficient code that stands the test of time."
		},
		{
			icon: Palette,
			title: "Design Systems",
			description: "Creating cohesive design languages that enhance user experience and brand identity."
		},
		{
			icon: Rocket,
			title: "Performance",
			description: "Optimizing applications for speed, accessibility, and seamless user interactions."
		},
		{
			icon: Users,
			title: "Collaboration",
			description: "Working effectively with cross-functional teams to deliver exceptional products."
		}
	];

	// Customize highlights based on theme
	const getCustomizedHighlights = () => {
		if (!content) return highlights;

		const customHighlights = [...highlights];
		
		if (content.theme === "creative") {
			customHighlights[1] = {
				icon: Palette,
				title: "Creative Vision",
				description: "Blending artistic creativity with technical expertise to create visually stunning applications."
			};
		} else if (content.theme === "technical") {
			customHighlights[0] = {
				icon: Brain,
				title: "Technical Excellence",
				description: "Deep understanding of algorithms, architecture patterns, and system optimization."
			};
		} else if (content.theme === "innovative") {
			customHighlights[2] = {
				icon: Zap,
				title: "Innovation",
				description: "Exploring cutting-edge technologies and pushing the boundaries of what's possible."
			};
		}

		return customHighlights;
	};

	return (
		<section className="py-20 bg-muted/30">
			<div className="container mx-auto px-4">
				<div className="max-w-6xl mx-auto">
					{/* Section Header */}
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
						{isLoading ? (
							<Skeleton className="h-6 w-2/3 mx-auto" />
						) : (
							<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
								{content?.personalityTrait ? 
									`A ${content.personalityTrait} with 5+ years of experience creating digital solutions that bridge the gap between design and functionality.` :
									"Passionate developer with 5+ years of experience creating digital solutions that bridge the gap between design and functionality."
								}
							</p>
						)}
					</div>

					<div className="grid lg:grid-cols-2 gap-12 items-center">
						{/* Left Column - Story */}
						<div className="space-y-6">
							<div className="space-y-4">
								<h3 className="text-2xl font-semibold">My Journey</h3>
								{isLoading ? (
									<div className="space-y-2">
										<Skeleton className="h-4 w-full" />
										<Skeleton className="h-4 w-full" />
										<Skeleton className="h-4 w-3/4" />
										<Skeleton className="h-4 w-full" />
										<Skeleton className="h-4 w-2/3" />
									</div>
								) : (
									<>
										<p className="text-muted-foreground leading-relaxed">
											{content?.aboutDescription || 
												"Started as a curious designer who fell in love with code. What began as tweaking CSS animations evolved into building full-stack applications that serve thousands of users daily."
											}
										</p>
										<p className="text-muted-foreground leading-relaxed">
											I believe great products are born from the intersection of beautiful design 
											and robust engineering. My goal is to create experiences that users love 
											and developers enjoy maintaining.
										</p>
									</>
								)}
							</div>

							{/* Skills */}
							<div className="space-y-4">
								<h4 className="text-lg font-semibold">Current Focus Areas</h4>
								{isLoading ? (
									<div className="flex flex-wrap gap-2">
										{[...Array(6)].map((_, i) => (
											<Skeleton key={i} className="h-6 w-20" />
										))}
									</div>
								) : (
									<div className="flex flex-wrap gap-2">
										{content?.skillsFocus?.map((skill) => (
											<Badge key={skill} variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
												{skill}
											</Badge>
										)) || (
											["React", "Next.js", "TypeScript", "Node.js", "Python", "PostgreSQL"].map((skill) => (
												<Badge key={skill} variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
													{skill}
												</Badge>
											))
										)}
									</div>
								)}
							</div>

							{/* Current Projects */}
							{!isLoading && content?.projectIdeas && (
								<div className="space-y-4">
									<h4 className="text-lg font-semibold">What I'm Building</h4>
									<div className="space-y-2">
										{content.projectIdeas.map((project, index) => (
											<div key={index} className="flex items-start gap-3">
												<div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
												<span className="text-sm text-muted-foreground">{project}</span>
											</div>
										))}
									</div>
								</div>
							)}
						</div>

						{/* Right Column - Highlights */}
						<div className="grid sm:grid-cols-2 gap-4">
							{getCustomizedHighlights().map((highlight, index) => (
								<Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
									<CardContent className="p-6">
										<div className="space-y-3">
											<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
												<highlight.icon className="h-6 w-6 text-primary" />
											</div>
											<h4 className="font-semibold">{highlight.title}</h4>
											<p className="text-sm text-muted-foreground leading-relaxed">
												{highlight.description}
											</p>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}