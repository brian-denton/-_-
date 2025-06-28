"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Palette, Rocket, Users } from "lucide-react";

const skills = [
	"React", "Next.js", "TypeScript", "Node.js", "Python", "PostgreSQL",
	"Tailwind CSS", "Figma", "AWS", "Docker", "GraphQL", "MongoDB"
];

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

export function AboutSection() {
	return (
		<section className="py-20 bg-muted/30">
			<div className="container mx-auto px-4">
				<div className="max-w-6xl mx-auto">
					{/* Section Header */}
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Passionate developer with 5+ years of experience creating digital solutions 
							that bridge the gap between design and functionality.
						</p>
					</div>

					<div className="grid lg:grid-cols-2 gap-12 items-center">
						{/* Left Column - Story */}
						<div className="space-y-6">
							<div className="space-y-4">
								<h3 className="text-2xl font-semibold">My Journey</h3>
								<p className="text-muted-foreground leading-relaxed">
									Started as a curious designer who fell in love with code. What began as 
									tweaking CSS animations evolved into building full-stack applications that 
									serve thousands of users daily.
								</p>
								<p className="text-muted-foreground leading-relaxed">
									I believe great products are born from the intersection of beautiful design 
									and robust engineering. My goal is to create experiences that users love 
									and developers enjoy maintaining.
								</p>
							</div>

							{/* Skills */}
							<div className="space-y-4">
								<h4 className="text-lg font-semibold">Technologies I Love</h4>
								<div className="flex flex-wrap gap-2">
									{skills.map((skill) => (
										<Badge key={skill} variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
											{skill}
										</Badge>
									))}
								</div>
							</div>
						</div>

						{/* Right Column - Highlights */}
						<div className="grid sm:grid-cols-2 gap-4">
							{highlights.map((highlight, index) => (
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