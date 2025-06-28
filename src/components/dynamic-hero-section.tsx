/**
 * Dynamic Hero Section with AI-generated content
 * Changes on every visit using Ollama + Qwen2:0.5b
 */

"use client";

import { ArrowRight, Download, Github, Linkedin, Mail, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useDynamicContent } from "@/hooks/use-dynamic-content";
import { Skeleton } from "@/components/ui/skeleton";

const availabilityConfig = {
	available: {
		color: "bg-green-500",
		text: "Available for new opportunities",
		variant: "secondary" as const
	},
	busy: {
		color: "bg-yellow-500",
		text: "Currently busy with projects",
		variant: "secondary" as const
	},
	selective: {
		color: "bg-blue-500",
		text: "Selectively taking on projects",
		variant: "outline" as const
	}
};

const themeStyles = {
	professional: "from-background via-background to-muted/20",
	creative: "from-purple-50 via-background to-pink-50 dark:from-purple-950/20 dark:via-background dark:to-pink-950/20",
	technical: "from-blue-50 via-background to-slate-50 dark:from-blue-950/20 dark:via-background dark:to-slate-950/20",
	innovative: "from-green-50 via-background to-emerald-50 dark:from-green-950/20 dark:via-background dark:to-emerald-950/20"
};

export function DynamicHeroSection() {
	const { content, isLoading, error, regenerate, metadata } = useDynamicContent();

	if (error && !content) {
		return (
			<section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
				<div className="container mx-auto px-4 py-20 text-center">
					<Card className="max-w-md mx-auto">
						<CardContent className="p-6">
							<h2 className="text-xl font-semibold mb-2">Content Generation Error</h2>
							<p className="text-muted-foreground mb-4">{error}</p>
							<Button onClick={regenerate} className="w-full">
								<RefreshCw className="mr-2 h-4 w-4" />
								Try Again
							</Button>
						</CardContent>
					</Card>
				</div>
			</section>
		);
	}

	const availability = content?.availability || "available";
	const theme = content?.theme || "professional";
	const availabilityStyle = availabilityConfig[availability];

	return (
		<section className={`relative min-h-screen flex items-center justify-center bg-gradient-to-br ${themeStyles[theme]}`}>
			{/* Background Pattern */}
			<div className="absolute inset-0 bg-grid-pattern opacity-5" />
			
			{/* AI Generation Indicator */}
			{metadata && (
				<div className="absolute top-20 right-4 z-20">
					<Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
						<Sparkles className="mr-1 h-3 w-3" />
						AI Generated
					</Badge>
				</div>
			)}

			{/* Content */}
			<div className="container mx-auto px-4 py-20 text-center relative z-10">
				<div className="max-w-4xl mx-auto space-y-8">
					{/* Status Badge */}
					<div className="flex justify-center">
						{isLoading ? (
							<Skeleton className="h-8 w-64" />
						) : (
							<Badge variant={availabilityStyle.variant} className="px-4 py-2 text-sm">
								<span className={`w-2 h-2 ${availabilityStyle.color} rounded-full mr-2 animate-pulse`} />
								{availabilityStyle.text}
							</Badge>
						)}
					</div>

					{/* Main Heading */}
					<div className="space-y-4">
						{isLoading ? (
							<>
								<Skeleton className="h-16 w-3/4 mx-auto" />
								<Skeleton className="h-8 w-2/3 mx-auto" />
							</>
						) : (
							<>
								<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
									{content?.heroTitle || "Full-Stack Developer"}
								</h1>
								<h2 className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-medium">
									{content?.heroSubtitle || "Building exceptional web applications"}
								</h2>
							</>
						)}
					</div>

					{/* Description */}
					{isLoading ? (
						<div className="space-y-2">
							<Skeleton className="h-4 w-full max-w-2xl mx-auto" />
							<Skeleton className="h-4 w-3/4 max-w-2xl mx-auto" />
						</div>
					) : (
						<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
							{content?.heroDescription || "Passionate about creating digital solutions that make a difference."}
						</p>
					)}

					{/* Current Status */}
					{!isLoading && content && (
						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-muted-foreground">
							<div className="flex items-center gap-2">
								<span>Currently:</span>
								<span className="font-medium text-foreground">{content.currentMood}</span>
							</div>
							<div className="hidden sm:block">•</div>
							<div className="flex items-center gap-2">
								<span>Working on:</span>
								<span className="font-medium text-foreground">{content.workingOn}</span>
							</div>
						</div>
					)}

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
						{!isLoading && (
							<Button variant="ghost" size="lg" onClick={regenerate} className="group">
								<RefreshCw className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" />
								Regenerate
							</Button>
						)}
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

					{/* Generation Info */}
					{metadata && !isLoading && (
						<div className="pt-8 text-xs text-muted-foreground">
							<p>
								Generated with Qwen2:0.5b • {metadata.generationTime}ms • {new Date(metadata.generatedAt).toLocaleTimeString()}
							</p>
						</div>
					)}
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