"use client";

import { useEffect, useState, useRef } from "react";
import { useImagePreloader } from "@/hooks/use-image-preloader";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP)
}

interface LoadingScreenProps {
  onComplete: () => void;
}

const HERO_IMAGES = [
  "/photos/optimized/original/14.webp",
  "/photos/optimized/original/39.webp",
  "/photos/optimized/original/1.webp",
  "/photos/optimized/original/2.webp",
];

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const { progress, allLoaded } = useImagePreloader(HERO_IMAGES);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const logoForegroundRef = useRef<SVGTextElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (allLoaded) {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsVisible(false);
          onComplete();
        }
      });

      tl.to(containerRef.current, {
        yPercent: -100,
        duration: 1.2,
        ease: "expo.inOut",
        delay: 0.5
      });
    }
  }, { dependencies: [allLoaded], scope: containerRef });

  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${progress}%`,
        duration: 0.4,
        ease: "power2.out"
      });
    }
    
    if (logoForegroundRef.current) {
      gsap.to(logoForegroundRef.current, {
        attr: { 'clip-path': `inset(0 ${100 - progress}% 0 0)` },
        duration: 0.4,
        ease: "power2.out"
      });
    }
  }, [progress]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center overflow-hidden"
    >
      {/* High-end ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl aspect-square bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative flex flex-col items-center w-full max-w-sm px-8">
        {/* Typographic Logo Section */}
        <div className="relative mb-12 flex flex-col items-center">
          <div className="relative h-24 sm:h-32 mb-4 overflow-visible">
            <svg
              width="240"
              height="120"
              viewBox="0 0 240 120"
              className="overflow-visible"
            >
              <defs>
                <linearGradient
                  id="logo-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="var(--accent)" />
                </linearGradient>
                <clipPath id="logo-clip">
                  <rect x="0" y="0" width={240 * (progress / 100)} height="120" />
                </clipPath>
              </defs>

              {/* Background Stroke Lettering */}
              <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                className="text-6xl sm:text-7xl font-bold fill-none stroke-white/10"
                strokeWidth="0.5"
                style={{
                  letterSpacing: "0.15em",
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                }}
              >
                AVL
              </text>

              {/* Foreground Animated Filling Lettering */}
              <text
                ref={logoForegroundRef}
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                className="text-6xl sm:text-7xl font-bold"
                fill="url(#logo-gradient)"
                style={{
                  letterSpacing: "0.15em",
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  clipPath: "url(#logo-clip)"
                }}
              >
                AVL
              </text>
            </svg>
          </div>

          {/* Name and Roles */}
          <div className="text-center space-y-3 opacity-0 entrance-up">
            <h2 className="text-xs sm:text-sm uppercase tracking-[0.5em] text-white/40 font-light">
              Alex Vicente López
            </h2>
            <div className="flex items-center justify-center gap-3 text-[9px] sm:text-[10px] tracking-[0.3em] text-primary/60 uppercase font-medium">
              <span>Digital Developer</span>
              <span className="w-1 h-1 bg-primary/30 rounded-full" />
              <span>Visual Artist</span>
            </div>
          </div>
        </div>

        {/* Bottom Progress Area */}
        <div className="w-full flex flex-col items-center gap-6 mt-8">
          {/* Minimal Progress Line */}
          <div className="w-full h-px bg-white/5 relative overflow-hidden">
            <div
              ref={progressBarRef}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent"
              style={{ width: '0%' }}
            />
          </div>

          {/* Elegant Counter */}
          <div className="flex justify-between w-full px-1 items-baseline">
            <span className="text-[10px] tracking-widest text-white/20 uppercase font-mono">
              System Initializing
            </span>
            <span
              ref={counterRef}
              className="text-2xl font-mono text-white/30 tabular-nums"
            >
              {Math.floor(progress).toString().padStart(3, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* Decorative Corner Framing */}
      <div className="absolute inset-8 sm:inset-12 pointer-events-none opacity-30">
        <div className="absolute top-0 left-0 w-12 h-px bg-primary/50 origin-left scale-x-0 entrance-corner" />
        <div className="absolute top-0 left-0 w-px h-12 bg-primary/50 origin-top scale-y-0 entrance-corner" />
        <div className="absolute bottom-0 right-0 w-12 h-px bg-primary/50 origin-right scale-x-0 entrance-corner" />
        <div className="absolute bottom-0 right-0 w-px h-12 bg-primary/50 origin-bottom scale-y-0 entrance-corner" />
      </div>
    </div>
  );
}
