"use client";

import { useEffect, useState } from "react";
import { useDynamicContent } from "@/hooks/use-dynamic-content";

export function BrutalistHero() {
  const { content, isLoading, regenerate } = useDynamicContent();
  const [glitchText, setGlitchText] = useState("");
  const [chaosMode, setChaosMode] = useState(false);
  const [chaosElements, setChaosElements] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      color: string;
      size: number;
      rotation: number;
    }>
  >([]);

  useEffect(() => {
    // Create glitch effect for loading
    if (isLoading) {
      const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
      const interval = setInterval(() => {
        setGlitchText(
          Array.from(
            { length: 20 },
            () => glitchChars[Math.floor(Math.random() * glitchChars.length)]
          ).join("")
        );
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  useEffect(() => {
    // Chaos mode effects
    if (chaosMode) {
      const interval = setInterval(() => {
        // Generate random chaos elements
        const newElements = Array.from({ length: 20 }, (_, i) => ({
          id: Date.now() + i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          color: [
            "#ef4444",
            "#eab308",
            "#3b82f6",
            "#22c55e",
            "#a855f7",
            "#f97316",
          ][Math.floor(Math.random() * 6)],
          size: Math.random() * 100 + 20,
          rotation: Math.random() * 360,
        }));
        setChaosElements(newElements);
      }, 200);

      // Auto-disable chaos mode after 10 seconds
      const timeout = setTimeout(() => {
        setChaosMode(false);
      }, 10000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    } else {
      setChaosElements([]);
    }
  }, [chaosMode]);

  const toggleChaosMode = () => {
    setChaosMode(!chaosMode);

    // Add screen shake effect
    if (!chaosMode) {
      document.body.style.animation = "shake 0.5s infinite";
      setTimeout(() => {
        document.body.style.animation = "";
      }, 2000);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
      {/* Brutal grid background */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          chaosMode ? "opacity-30" : "opacity-10"
        }`}
      >
        <div className="grid grid-cols-12 h-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <div
              key={i}
              className={`border transition-all duration-200 ${
                chaosMode ? `border-red-500 animate-pulse` : "border-white/20"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Floating brutal shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute top-20 left-10 w-32 h-32 bg-red-500 transform rotate-45 opacity-80 transition-all duration-300 ${
            chaosMode ? "animate-spin scale-150" : ""
          }`}
        />
        <div
          className={`absolute top-40 right-20 w-24 h-24 bg-yellow-400 opacity-70 transition-all duration-300 ${
            chaosMode ? "animate-bounce scale-125" : ""
          }`}
        />
        <div
          className={`absolute bottom-32 left-1/4 w-40 h-20 bg-blue-500 transform -rotate-12 opacity-60 transition-all duration-300 ${
            chaosMode ? "animate-pulse scale-110" : ""
          }`}
        />
        <div
          className={`absolute bottom-20 right-10 w-28 h-28 bg-green-500 rounded-full opacity-50 transition-all duration-300 ${
            chaosMode ? "animate-ping scale-200" : ""
          }`}
        />
      </div>

      {/* Chaos mode elements */}
      {chaosMode && (
        <div className="absolute inset-0 pointer-events-none">
          {chaosElements.map((element) => (
            <div
              key={element.id}
              className="absolute animate-pulse"
              style={{
                left: `${element.x}%`,
                top: `${element.y}%`,
                width: `${element.size}px`,
                height: `${element.size}px`,
                backgroundColor: element.color,
                transform: `rotate(${element.rotation}deg)`,
                opacity: 0.7,
                borderRadius: Math.random() > 0.5 ? "50%" : "0%",
              }}
            />
          ))}
        </div>
      )}

      <div
        className={`relative z-10 text-center px-4 max-w-6xl mx-auto transition-all duration-300 ${
          chaosMode ? "animate-pulse" : ""
        }`}
      >
        {/* Main brutal heading */}
        <div className="mb-8">
          {isLoading ? (
            <div className="space-y-4">
              <h1 className="text-2xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-white font-mono">
                {glitchText}
              </h1>
              <div className="text-2xl md:text-4xl font-bold text-red-500 font-mono animate-pulse">
                GENERATING...
              </div>
            </div>
          ) : (
            <>
              <h1
                className={`text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-white font-mono leading-none mb-4 transform hover:scale-105 transition-transform duration-300 ${
                  chaosMode ? "animate-bounce text-red-500" : ""
                }`}
              >
                {content?.heroTitle?.toUpperCase() || "BRUTAL AI"}
              </h1>
              <div
                className={`text-2xl md:text-4xl font-bold text-red-500 font-mono mb-6 transform hover:skew-x-3 transition-transform ${
                  chaosMode ? "animate-pulse text-yellow-400" : ""
                }`}
              >
                {content?.heroSubtitle?.toUpperCase() ||
                  "MACHINE GENERATED CHAOS"}
              </div>
            </>
          )}
        </div>

        {/* Brutal description box */}
        {!isLoading && content && (
          <div
            className={`bg-white text-black p-8 border-8 border-black transform rotate-1 hover:rotate-0 transition-transform duration-300 mb-8 max-w-4xl mx-auto ${
              chaosMode
                ? "animate-pulse bg-red-500 text-white border-yellow-400 rotate-12"
                : ""
            }`}
          >
            <p className="text-xl md:text-2xl font-bold font-mono leading-tight">
              {chaosMode
                ? "CHAOS MODE ACTIVATED! REALITY IS BREAKING DOWN! EMBRACE THE MADNESS!"
                : content.heroDescription}
            </p>
          </div>
        )}

        {/* Brutal action buttons */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <button
            onClick={regenerate}
            className={`bg-red-500 text-white px-12 py-6 text-2xl font-black uppercase border-4 border-white transform hover:scale-110 hover:rotate-2 transition-all duration-200 font-mono shadow-[8px_8px_0px_0px_#000000] hover:shadow-[12px_12px_0px_0px_#000000] ${
              chaosMode ? "animate-bounce bg-yellow-400 text-black" : ""
            }`}
          >
            REGENERATE
          </button>

          <button
            onClick={toggleChaosMode}
            className={`px-12 py-6 text-2xl font-black uppercase border-4 transform hover:scale-110 transition-all duration-200 font-mono ${
              chaosMode
                ? "bg-red-500 text-white border-yellow-400 animate-pulse shadow-[8px_8px_0px_0px_#ffff00] hover:shadow-[12px_12px_0px_0px_#ffff00] hover:-rotate-2"
                : "bg-yellow-400 text-black border-black shadow-[8px_8px_0px_0px_#ff0000] hover:shadow-[12px_12px_0px_0px_#ff0000] hover:-rotate-2"
            }`}
          >
            {chaosMode ? "STOP CHAOS" : "CHAOS MODE"}
          </button>
        </div>

        {/* Chaos mode indicator */}
        {chaosMode && (
          <div className="mt-8 inline-block bg-red-500 text-white px-8 py-4 font-black uppercase font-mono border-4 border-yellow-400 transform rotate-3 animate-pulse">
            ⚡ CHAOS ACTIVATED ⚡
          </div>
        )}

        {/* AI info badge */}
        {content?.aiGenerated && (
          <div
            className={`mt-12 inline-block bg-green-500 text-black px-6 py-3 font-black uppercase font-mono border-4 border-white transform -rotate-2 ${
              chaosMode ? "animate-spin bg-purple-500 text-white" : ""
            }`}
          >
            AI CONFIDENCE: {Math.round((content.confidence || 0) * 100)}%
          </div>
        )}
      </div>

      {/* Brutal corner elements */}
      <div
        className={`absolute top-0 left-0 w-0 h-0 border-l-[100px] border-l-transparent border-b-[100px] border-b-red-500 transition-all duration-300 ${
          chaosMode ? "animate-spin" : ""
        }`}
      />
      <div
        className={`absolute top-0 right-0 w-0 h-0 border-r-[100px] border-r-transparent border-b-[100px] border-b-blue-500 transition-all duration-300 ${
          chaosMode ? "animate-bounce" : ""
        }`}
      />
      <div
        className={`absolute bottom-0 left-0 w-0 h-0 border-l-[100px] border-l-transparent border-t-[100px] border-t-yellow-400 transition-all duration-300 ${
          chaosMode ? "animate-pulse" : ""
        }`}
      />
      <div
        className={`absolute bottom-0 right-0 w-0 h-0 border-r-[100px] border-r-transparent border-t-[100px] border-t-green-500 transition-all duration-300 ${
          chaosMode ? "animate-ping" : ""
        }`}
      />
    </section>
  );
}
