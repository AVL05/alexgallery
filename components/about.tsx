"use client";

import type { AboutDictionary } from "@/types/dictionary";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export function About({ dictionary }: { dictionary: AboutDictionary }) {
  const shouldReduceMotion = useReducedMotion();

  const reveal = (delay: number) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: 30 },
    whileInView: shouldReduceMotion ? undefined : { opacity: 1, y: 0 },
    transition: {
      duration: shouldReduceMotion ? 0 : 0.7,
      delay: shouldReduceMotion ? 0 : delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
    viewport: { once: true, margin: "-80px" },
  });

  return (
    <section
      id="about"
      className="bg-black py-24 md:py-32 relative overflow-hidden"
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16 items-center">
          {/* Retrato */}
          <motion.div
            {...reveal(0)}
            className="md:col-span-5 lg:col-span-4"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden border border-white/10 bg-white/5">
              <Image
                src="/photos/optimized/800/46.webp"
                alt={dictionary.title}
                fill
                className="object-cover brightness-95"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </motion.div>

          {/* Texto */}
          <motion.div
            {...reveal(0.1)}
            className="md:col-span-7 lg:col-span-8 space-y-6"
          >
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-accent">
              {dictionary.label}
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-[0.98] text-white">
              {dictionary.title}
            </h2>
            <p className="text-white/65 text-base md:text-lg leading-relaxed font-light max-w-2xl">
              {dictionary.body}
            </p>
            <p className="text-white/45 text-sm md:text-base leading-relaxed font-light max-w-2xl">
              {dictionary.body2}
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-2 pt-4 border-t border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/40">
              <span>{dictionary.role}</span>
              <span>{dictionary.location}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
