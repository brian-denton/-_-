"use client";

import { useDynamicContent } from "@/hooks/use-dynamic-content";
import { useState } from "react";

export function BrutalistContent() {
	const { content, isLoading } = useDynamicContent();
	const [activeSection, setActiveSection] = useState(0);

	const sections = [
		{
			title: "ABOUT",
			color: "bg-red-500",
			textColor: "text-white",
			borderColor: "border-yellow-400"
		},
		{
			title: "SKILLS",
			color: "bg-blue-500",
			textColor: "text-white",
			borderColor: "border-red-500"
		},
		{
			title: "PROJECTS",
			color: "bg-yellow-400",
			textColor: "text-black",
			borderColor: "border-blue-500"
		},
		{
			title: "CONTACT",
			color: "bg-green-500",
			textColor: "text-black",
			borderColor: "border-white"
		}
	];

	if (isLoading) {
		return (
			<section className="py-20 bg-white text-black">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{sections.map((section, index) => (
							<div key={index} className={`${section.color} p-8 border-8 ${section.borderColor} transform rotate-2 hover:rotate-0 transition-transform`}>
								<h2 className={`text-4xl font-black uppercase font-mono mb-4 ${section.textColor}`}>
									{section.title}
								</h2>
								<div className="space-y-2">
									{Array.from({ length: 3 }).map((_, i) => (
										<div key={i} className={`h-4 ${section.textColor === 'text-white' ? 'bg-white/30' : 'bg-black/30'} animate-pulse`} />
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="py-20 bg-white text-black relative overflow-hidden">
			{/* Brutal background pattern */}
			<div className="absolute inset-0 opacity-5">
				<div className="grid grid-cols-8 h-full">
					{Array.from({ length: 64 }).map((_, i) => (
						<div key={i} className="border border-black" />
					))}
				</div>
			</div>

			<div className="container mx-auto px-4 relative z-10">
				{/* Brutal section selector */}
				<div className="flex flex-wrap justify-center gap-4 mb-16">
					{sections.map((section, index) => (
						<button
							key={index}
							onClick={() => setActiveSection(index)}
							className={`px-8 py-4 text-2xl font-black uppercase font-mono border-4 transform transition-all duration-200 ${
								activeSection === index
									? `${section.color} ${section.textColor} ${section.borderColor} scale-110 rotate-2`
									: "bg-black text-white border-white hover:scale-105"
							} shadow-[4px_4px_0px_0px_#000000]`}
						>
							{section.title}
						</button>
					))}
				</div>

				{/* Content sections */}
				<div className="max-w-6xl mx-auto">
					{activeSection === 0 && (
						<div className="bg-red-500 text-white p-12 border-8 border-yellow-400 transform -rotate-1">
							<h2 className="text-6xl font-black uppercase font-mono mb-8">ABOUT</h2>
							<div className="text-2xl font-bold font-mono leading-relaxed">
								{content?.aboutDescription || "AI-GENERATED CHAOS ENTITY. BRUTALIST DESIGN ENTHUSIAST. RANDOM CONTENT GENERATOR."}
							</div>
						</div>
					)}

					{activeSection === 1 && (
						<div className="bg-blue-500 text-white p-12 border-8 border-red-500 transform rotate-1">
							<h2 className="text-6xl font-black uppercase font-mono mb-8">SKILLS</h2>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
								{(content?.skillsFocus || ["CHAOS", "BRUTALISM", "AI", "RANDOMNESS", "BOLD DESIGN", "TYPOGRAPHY"]).map((skill, index) => (
									<div key={index} className="bg-white text-black p-4 border-4 border-yellow-400 font-black uppercase font-mono text-center transform hover:scale-110 transition-transform">
										{skill}
									</div>
								))}
							</div>
						</div>
					)}

					{activeSection === 2 && (
						<div className="bg-yellow-400 text-black p-12 border-8 border-blue-500 transform -rotate-1">
							<h2 className="text-6xl font-black uppercase font-mono mb-8">PROJECTS</h2>
							<div className="space-y-6">
								{(content?.projectIdeas || ["RANDOM CONTENT GENERATOR", "BRUTALIST DESIGN SYSTEM", "AI CHAOS ENGINE"]).map((project, index) => (
									<div key={index} className="bg-black text-white p-6 border-4 border-red-500 transform hover:rotate-1 transition-transform">
										<h3 className="text-2xl font-black uppercase font-mono">{project}</h3>
									</div>
								))}
							</div>
						</div>
					)}

					{activeSection === 3 && (
						<div className="bg-green-500 text-black p-12 border-8 border-white transform rotate-1">
							<h2 className="text-6xl font-black uppercase font-mono mb-8">CONTACT</h2>
							<div className="space-y-6">
								<div className="bg-black text-white p-6 border-4 border-red-500 font-mono text-xl">
									EMAIL: CHAOS@BRUTAL.AI
								</div>
								<div className="bg-white text-black p-6 border-4 border-blue-500 font-mono text-xl">
									PHONE: 1-800-BRUTAL
								</div>
								<div className="bg-red-500 text-white p-6 border-4 border-yellow-400 font-mono text-xl">
									LOCATION: THE VOID
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Floating brutal elements */}
			<div className="absolute top-10 left-10 w-20 h-20 bg-red-500 transform rotate-45 opacity-60" />
			<div className="absolute top-32 right-20 w-16 h-16 bg-blue-500 opacity-70" />
			<div className="absolute bottom-20 left-1/3 w-24 h-12 bg-yellow-400 transform -rotate-12 opacity-50" />
		</section>
	);
}