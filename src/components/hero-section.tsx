"use client";

import { ArrowRight, Download, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
	return (
		<section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
			{/* Background Pattern */}
			<div className="absolute inset-0 bg-grid-pattern opacity-5" />
			
			{/* Content */}
			<div className="container mx-auto px-4 py-20 text-center relative z-10">
				<div className="max-w-4xl mx-auto space-y-8">
					{/* Status Badge */}
					<div className="flex justify-center">
						<Badge variant="secondary" className="px-4 py-2 text-sm">
							<span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
							Available for new opportunities
						</Badge>
					</div>

					{/* Main Heading */}
					<div className="space-y-4">
						<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
							Hi, I'm{" "}
							<span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
								Alex Johnson
							</span>
						</h1>
						<h2 className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-medium">
							Full-Stack Developer & UI/UX Designer
						</h2>
					</div>

					{/* Description */}
					<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
						I craft exceptional digital experiences through clean code and thoughtful design. 
						Passionate about building products that make a difference.
					</p>

					{/* CTA Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
						<Button size="lg" className="group">
							View My Work
							<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
						</Button>
						<Button variant="outline" size="lg" className="group">
							<Download className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
							Download Resume
						</Button>
					</div>

					{/* Social Links */}
					<div className="flex justify-center space-x-6 pt-8">
						<Button variant="ghost" size="icon" className="hover:scale-110 transition-transform">
							<Github className="h-5 w-5" />
							<span className="sr-only">GitHub</span>
						</Button>
						<Button variant="ghost" size="icon" className="hover:scale-110 transition-transform">
							<Linkedin className="h-5 w-5" />
							<span className="sr-only">LinkedIn</span>
						</Button>
						<Button variant="ghost" size="icon" className="hover:scale-110 transition-transform">
							<Mail className="h-5 w-5" />
							<span className="sr-only">Email</span>
						</Button>
					</div>
				</div>
			</div>

			{/* Scroll Indicator */}
			<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
				<div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
					<div className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2 animate-bounce" />
				</div>
			</div>
		</section>
	);
}