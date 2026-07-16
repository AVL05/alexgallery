"use client";

import type { AboutDictionary } from "@/types/dictionary";
import { Container, Section } from "@/components/ui/layout";
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
    <Section
      id="about"
      className="overflow-hidden bg-background"
    >
      <Container className="relative z-10">
        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-16 lg:gap-24">
          {/* Retrato */}
          <motion.div
            {...reveal(0)}
            className="md:col-span-5 lg:col-span-4"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden border border-border bg-[var(--color-surface)]">
              <Image
                src="/photos/optimized/800/46.webp"
                alt={dictionary.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
            </div>
          </motion.div>

          {/* Texto */}
          <motion.div
            {...reveal(0.1)}
            className="space-y-6 md:col-span-7 lg:col-span-8 lg:space-y-8"
          >
            <span className="rv-kicker">
              {dictionary.label}
            </span>
            <h2 className="rv-section-title max-w-3xl">
              {dictionary.title}
            </h2>
            <p className="rv-intro">
              {dictionary.body}
            </p>
            <p className="rv-body text-[var(--color-text-muted)]">
              {dictionary.body2}
            </p>
            <div className="rv-meta flex flex-wrap gap-x-8 gap-y-2 border-t border-border pt-5">
              <span>{dictionary.role}</span>
              <span>{dictionary.location}</span>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
