"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Github } from "lucide-react";

const projects = [
	{
		title: "E-Commerce Platform",
		description: "A modern e-commerce solution built with Next.js, featuring real-time inventory, payment processing, and admin dashboard.",
		image: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800",
		technologies: ["Next.js", "TypeScript", "Stripe", "PostgreSQL", "Tailwind CSS"],
		github: "#",
		demo: "#",
		featured: true
	},
	{
		title: "Task Management App",
		description: "Collaborative project management tool with real-time updates, team chat, and advanced analytics.",
		image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
		technologies: ["React", "Node.js", "Socket.io", "MongoDB", "Material-UI"],
		github: "#",
		demo: "#",
		featured: true
	},
	{
		title: "Weather Dashboard",
		description: "Beautiful weather application with location-based forecasts, interactive maps, and weather alerts.",
		image: "https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800",
		technologies: ["Vue.js", "OpenWeather API", "Chart.js", "PWA"],
		github: "#",
		demo: "#",
		featured: false
	},
	{
		title: "Portfolio Website",
		description: "Responsive portfolio site with smooth animations, dark mode, and optimized performance.",
		image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800",
		technologies: ["Next.js", "Framer Motion", "Tailwind CSS", "MDX"],
		github: "#",
		demo: "#",
		featured: false
	}
];

export function ProjectsSection() {
	const featuredProjects = projects.filter(project => project.featured);
	const otherProjects = projects.filter(project => !project.featured);

	return (
		<section className="py-20">
			<div className="container mx-auto px-4">
				<div className="max-w-6xl mx-auto">
					{/* Section Header */}
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							A selection of projects that showcase my skills in full-stack development, 
							UI/UX design, and problem-solving.
						</p>
					</div>

					{/* Featured Projects */}
					<div className="space-y-12 mb-16">
						{featuredProjects.map((project, index) => (
							<Card key={index} className="overflow-hidden group hover:shadow-xl transition-all duration-500">
								<div className={`grid lg:grid-cols-2 gap-0 ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
									{/* Image */}
									<div className={`relative overflow-hidden ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
										<img 
											src={project.image} 
											alt={project.title}
											className="w-full h-64 lg:h-full object-cover group-hover:scale-105 transition-transform duration-500"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
									</div>

									{/* Content */}
									<div className="p-8 lg:p-12 flex flex-col justify-center">
										<CardHeader className="p-0 mb-6">
											<div className="flex items-center gap-2 mb-2">
												<Badge variant="secondary">Featured</Badge>
											</div>
											<CardTitle className="text-2xl lg:text-3xl mb-3">{project.title}</CardTitle>
											<CardDescription className="text-base leading-relaxed">
												{project.description}
											</CardDescription>
										</CardHeader>

										<CardContent className="p-0 mb-6">
											<div className="flex flex-wrap gap-2">
												{project.technologies.map((tech) => (
													<Badge key={tech} variant="outline" className="text-xs">
														{tech}
													</Badge>
												))}
											</div>
										</CardContent>

										<CardFooter className="p-0">
											<div className="flex gap-4">
												<Button variant="default" size="sm" className="group">
													<ExternalLink className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
													Live Demo
												</Button>
												<Button variant="outline" size="sm" className="group">
													<Github className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
													Code
												</Button>
											</div>
										</CardFooter>
									</div>
								</div>
							</Card>
						))}
					</div>

					{/* Other Projects Grid */}
					<div className="space-y-8">
						<h3 className="text-2xl font-semibold text-center">More Projects</h3>
						<div className="grid md:grid-cols-2 gap-6">
							{otherProjects.map((project, index) => (
								<Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
									<div className="relative overflow-hidden">
										<img 
											src={project.image} 
											alt={project.title}
											className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
										/>
									</div>
									<CardHeader>
										<CardTitle className="text-xl">{project.title}</CardTitle>
										<CardDescription>{project.description}</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="flex flex-wrap gap-2">
											{project.technologies.map((tech) => (
												<Badge key={tech} variant="outline" className="text-xs">
													{tech}
												</Badge>
											))}
										</div>
									</CardContent>
									<CardFooter>
										<div className="flex gap-3 w-full">
											<Button variant="default" size="sm" className="flex-1 group">
												<ExternalLink className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
												Demo
											</Button>
											<Button variant="outline" size="sm" className="flex-1 group">
												<Github className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
												Code
											</Button>
										</div>
									</CardFooter>
								</Card>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}