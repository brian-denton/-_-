"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Building, Calendar } from "lucide-react";

const experiences = [
	{
		company: "TechCorp Solutions",
		position: "Senior Full-Stack Developer",
		period: "2022 - Present",
		location: "San Francisco, CA",
		description: "Lead development of enterprise web applications serving 100K+ users. Architected microservices infrastructure and mentored junior developers.",
		achievements: [
			"Reduced application load time by 40% through optimization",
			"Led team of 5 developers on major product redesign",
			"Implemented CI/CD pipeline reducing deployment time by 60%"
		],
		technologies: ["React", "Node.js", "AWS", "PostgreSQL", "Docker"]
	},
	{
		company: "StartupXYZ",
		position: "Frontend Developer",
		period: "2020 - 2022",
		location: "Remote",
		description: "Built responsive web applications from concept to deployment. Collaborated closely with design team to implement pixel-perfect UIs.",
		achievements: [
			"Developed component library used across 3 products",
			"Improved mobile performance by 50%",
			"Implemented accessibility standards achieving WCAG 2.1 AA compliance"
		],
		technologies: ["Vue.js", "TypeScript", "Sass", "Jest", "Figma"]
	},
	{
		company: "Digital Agency Pro",
		position: "Web Developer",
		period: "2019 - 2020",
		location: "New York, NY",
		description: "Created custom websites and web applications for diverse clients. Managed multiple projects simultaneously while maintaining high quality standards.",
		achievements: [
			"Delivered 25+ client projects on time and within budget",
			"Increased client satisfaction scores by 30%",
			"Established development workflow reducing project timeline by 25%"
		],
		technologies: ["WordPress", "PHP", "JavaScript", "MySQL", "Adobe Creative Suite"]
	}
];

export function ExperienceSection() {
	return (
		<section className="py-20 bg-muted/30">
			<div className="container mx-auto px-4">
				<div className="max-w-4xl mx-auto">
					{/* Section Header */}
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">Experience</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							My professional journey building products and leading teams at innovative companies.
						</p>
					</div>

					{/* Experience Timeline */}
					<div className="space-y-8">
						{experiences.map((experience, index) => (
							<Card key={index} className="group hover:shadow-lg transition-all duration-300">
								<CardHeader>
									<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
										<div className="space-y-2">
											<CardTitle className="text-xl group-hover:text-primary transition-colors">
												{experience.position}
											</CardTitle>
											<div className="flex items-center gap-2 text-muted-foreground">
												<Building className="h-4 w-4" />
												<span className="font-medium">{experience.company}</span>
												<span>•</span>
												<span>{experience.location}</span>
											</div>
										</div>
										<div className="flex items-center gap-2 text-sm text-muted-foreground">
											<Calendar className="h-4 w-4" />
											<span>{experience.period}</span>
										</div>
									</div>
									<CardDescription className="text-base leading-relaxed">
										{experience.description}
									</CardDescription>
								</CardHeader>

								<CardContent className="space-y-6">
									{/* Achievements */}
									<div className="space-y-3">
										<h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
											Key Achievements
										</h4>
										<ul className="space-y-2">
											{experience.achievements.map((achievement, achievementIndex) => (
												<li key={achievementIndex} className="flex items-start gap-3">
													<div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
													<span className="text-sm leading-relaxed">{achievement}</span>
												</li>
											))}
										</ul>
									</div>

									<Separator />

									{/* Technologies */}
									<div className="space-y-3">
										<h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
											Technologies Used
										</h4>
										<div className="flex flex-wrap gap-2">
											{experience.technologies.map((tech) => (
												<Badge key={tech} variant="secondary" className="text-xs">
													{tech}
												</Badge>
											))}
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}