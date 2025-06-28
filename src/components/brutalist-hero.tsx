"use client";

import { useEffect, useState } from "react";
import { useDynamicContent } from "@/hooks/use-dynamic-content";

export function BrutalistHero() {
	const { content, isLoading, regenerate } = useDynamicContent();
	const [glitchText, setGlitchText] = useState("");

	useEffect(() => {
		// Create glitch effect for loading
		if (isLoading) {
			const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
			const interval = setInterval(() => {
				setGlitchText(
					Array.from({ length: 20 }, () => 
						glitchChars[Math.floor(Math.random() * glitchChars.length)]
					).join("")
				);
			}, 100);
			return () => clearInterval(interval);
		}
	}, [isLoading]);

	return (
		<section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
			{/* Brutal grid background */}
			<div className="absolute inset-0 opacity-10">
				<div className="grid grid-cols-12 h-full">
					{Array.from({ length: 144 }).map((_, i) => (
						<div key={i} className="border border-white/20" />
					))}
				</div>
			</div>

			{/* Floating brutal shapes */}
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute top-20 left-10 w-32 h-32 bg-red-500 transform rotate-45 opacity-80" />
				<div className="absolute top-40 right-20 w-24 h-24 bg-yellow-400 opacity-70" />
				<div className="absolute bottom-32 left-1/4 w-40 h-20 bg-blue-500 transform -rotate-12 opacity-60" />
				<div className="absolute bottom-20 right-10 w-28 h-28 bg-green-500 rounded-full opacity-50" />
			</div>

			<div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
				{/* Main brutal heading */}
				<div className="mb-8">
					{isLoading ? (
						<div className="space-y-4">
							<h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-white font-mono">
								{glitchText}
							</h1>
							<div className="text-2xl md:text-4xl font-bold text-red-500 font-mono animate-pulse">
								GENERATING...
							</div>
						</div>
					) : (
						<>
							<h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-white font-mono leading-none mb-4 transform hover:scale-105 transition-transform duration-300">
								{content?.heroTitle?.toUpperCase() || "BRUTAL AI"}
							</h1>
							<div className="text-2xl md:text-4xl font-bold text-red-500 font-mono mb-6 transform hover:skew-x-3 transition-transform">
								{content?.heroSubtitle?.toUpperCase() || "MACHINE GENERATED CHAOS"}
							</div>
						</>
					)}
				</div>

				{/* Brutal description box */}
				{!isLoading && content && (
					<div className="bg-white text-black p-8 border-8 border-black transform rotate-1 hover:rotate-0 transition-transform duration-300 mb-8 max-w-4xl mx-auto">
						<p className="text-xl md:text-2xl font-bold font-mono leading-tight">
							{content.heroDescription}
						</p>
					</div>
				)}

				{/* Brutal action buttons */}
				<div className="flex flex-col md:flex-row gap-6 justify-center items-center">
					<button
						onClick={regenerate}
						className="bg-red-500 text-white px-12 py-6 text-2xl font-black uppercase border-4 border-white transform hover:scale-110 hover:rotate-2 transition-all duration-200 font-mono shadow-[8px_8px_0px_0px_#000000] hover:shadow-[12px_12px_0px_0px_#000000]"
					>
						REGENERATE
					</button>
					
					<button className="bg-yellow-400 text-black px-12 py-6 text-2xl font-black uppercase border-4 border-black transform hover:scale-110 hover:-rotate-2 transition-all duration-200 font-mono shadow-[8px_8px_0px_0px_#ff0000] hover:shadow-[12px_12px_0px_0px_#ff0000]">
						CHAOS MODE
					</button>
				</div>

				{/* AI info badge */}
				{content?.aiGenerated && (
					<div className="mt-12 inline-block bg-green-500 text-black px-6 py-3 font-black uppercase font-mono border-4 border-white transform -rotate-2">
						AI CONFIDENCE: {Math.round((content.confidence || 0) * 100)}%
					</div>
				)}
			</div>

			{/* Brutal corner elements */}
			<div className="absolute top-0 left-0 w-0 h-0 border-l-[100px] border-l-transparent border-b-[100px] border-b-red-500" />
			<div className="absolute top-0 right-0 w-0 h-0 border-r-[100px] border-r-transparent border-b-[100px] border-b-blue-500" />
			<div className="absolute bottom-0 left-0 w-0 h-0 border-l-[100px] border-l-transparent border-t-[100px] border-t-yellow-400" />
			<div className="absolute bottom-0 right-0 w-0 h-0 border-r-[100px] border-r-transparent border-t-[100px] border-t-green-500" />
		</section>
	);
}