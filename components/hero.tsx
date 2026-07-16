"use client";

import type { HeroDictionary } from "@/types/dictionary";
import { Container } from "@/components/ui/layout";
import { ArrowDown } from "lucide-react";
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
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-background pb-14 pt-32 sm:items-center sm:pb-0"
    >
      {/* Background Image - Clean & Subtle */}
      <div ref={imageRef} className="absolute inset-0 z-0 opacity-75">
        <Image
          src="/photos/optimized/original/14.webp"
          alt=""
          fill
          className="object-cover"
          priority
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/45 to-background" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-[76rem] space-y-6 text-left sm:space-y-8">
          <p className="hero-text-reveal rv-kicker flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-accent" />
            {dictionary.eyebrow}
          </p>
          <h1 className="hero-text-reveal rv-display-xl max-w-6xl">
            {dictionary.title}
          </h1>
          <p className="hero-text-reveal rv-intro">
            {dictionary.description}
          </p>

          <div className="hero-text-reveal pt-2 sm:pt-4">
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
              className="rv-editorial-link group border-0 bg-transparent p-0"
            >
              <span>{dictionary.cta}</span>
              <ArrowDown
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
              />
            </button>
          </div>
        </div>
      </Container>

      {/* Modern Framing */}
      <div className="absolute inset-x-[var(--layout-gutter)] bottom-10 hidden h-px bg-[var(--color-border)] lg:block" />
    </section>
  );
}
