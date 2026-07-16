"use client";

import type { HeroDictionary } from "@/types/dictionary";
import { Archive, ArrowDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero({ dictionary }: { dictionary: HeroDictionary }) {
  const containerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(media.matches);

    updatePreference();
    media.addEventListener("change", updatePreference);

    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        gsap.set(".hero-text-reveal", { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        ".hero-text-reveal",
        { autoAlpha: 0, y: 42 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
        },
      );

      gsap.to(imageRef.current, {
        yPercent: 8,
        scale: 1.04,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    },
    { dependencies: [prefersReducedMotion], scope: containerRef },
  );

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-[92vh] flex items-center justify-center bg-black overflow-hidden"
    >
      {/* Background Image - Clean & Subtle */}
      <div ref={imageRef} className="absolute inset-0 z-0 opacity-70">
        <Image
          src="/photos/optimized/original/14.webp"
          alt=""
          fill
          className="object-cover"
          priority
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/45 to-black" />
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-24">
        <div className="max-w-6xl space-y-6 text-left">
          <p className="hero-text-reveal inline-flex items-center gap-3 border border-white/15 bg-black/35 px-3 py-2 text-accent text-[10px] sm:text-xs font-bold tracking-[0.24em] uppercase leading-relaxed backdrop-blur-md">
            <Archive className="h-3.5 w-3.5" />
            {dictionary.eyebrow}
          </p>
          <h1 className="hero-text-reveal font-serif text-6xl sm:text-7xl md:text-[8rem] lg:text-[9.5rem] font-medium tracking-tight leading-[0.95] text-white max-w-6xl">
            {dictionary.title}
          </h1>
          <p className="hero-text-reveal text-white/65 text-sm md:text-lg max-w-2xl font-medium leading-relaxed">
            {dictionary.description}
          </p>

          <div className="hero-text-reveal pt-6">
            <button
              type="button"
              aria-label={dictionary.cta}
              onClick={() =>
                document
                  .getElementById("gallery")
                  ?.scrollIntoView({
                    behavior: prefersReducedMotion ? "auto" : "smooth",
                  })
              }
              className="group flex min-h-11 items-center gap-4 text-white/55 hover:text-white transition-colors"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.4em]">
                {dictionary.cta}
              </span>
              <ArrowDown
                className={`h-4 w-4 ${prefersReducedMotion ? "" : "animate-bounce"}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Modern Framing */}
      <div className="absolute inset-x-12 bottom-12 h-px bg-white/10 pointer-events-none hidden lg:block" />
    </section>
  );
}
