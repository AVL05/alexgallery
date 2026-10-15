import { buttonVariants } from "@/components/ui/button";
import type { HeroArchiveFacts } from "@/lib/hero/config";
import type { HeroDictionary, Locale } from "@/types/dictionary";
import { getCursorTargetAttributes } from "@/lib/interactions/cursor-target";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Hero composition: brand over the photograph, author identification,
// one quiet metadata row and a discreet scroll cue. data-hero-* hooks feed
// the existing entry/scroll choreography in use-hero-motion.
export function HeroContent({
  dictionary,
  facts,
  locale,
}: {
  dictionary: HeroDictionary;
  facts: HeroArchiveFacts;
  locale: Locale;
}) {
  return (
    <div data-hero-content className="relative z-10 flex h-full flex-col justify-end pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-[calc(var(--layout-nav-height)+2rem)]">
      <div className="rv-container w-full">
        <p data-hero-secondary className="rv-kicker">
          {dictionary.eyebrow}
        </p>

        <h1 className="mt-4 font-serif leading-[0.88] tracking-[-0.045em] text-foreground sm:mt-6">
          <span className="block overflow-hidden pb-[0.1em]">
            <span data-hero-title-line className="block text-[clamp(3.35rem,11vw,10.5rem)]">
              {dictionary.title}
            </span>
          </span>
        </h1>

        <p className="mt-4 max-w-[26ch] font-serif text-[clamp(1.3rem,2.6vw,2.1rem)] leading-[1.15] tracking-[-0.01em] text-[var(--color-text-secondary)] sm:mt-5 sm:max-w-none">
          <span className="block overflow-hidden pb-[0.12em]">
            <span data-hero-title-line className="block">{dictionary.titleLineOne}</span>
          </span>
          <span className="block overflow-hidden pb-[0.12em]">
            <span data-hero-title-line className="block">{dictionary.titleLineTwo}</span>
          </span>
        </p>

        <div data-hero-secondary className="mt-8 sm:mt-10">
          <Link
            href={`/${locale}/archive`}
            data-press-feedback
            {...getCursorTargetAttributes({ type: "explore", contrast: "light" })}
            className={cn(buttonVariants({ variant: "default", size: "lg" }))}
          >
            {dictionary.cta}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <div data-hero-secondary className="mt-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-5 border-t border-[var(--color-border)] pt-4 sm:mt-10">
          <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-[var(--color-text-secondary)]">
            {dictionary.location}
            <span aria-hidden="true">{" / "}</span>
            {String(facts.count).padStart(2, "0")} {dictionary.photographs}
            <span aria-hidden="true">{" / "}</span>
            {facts.dateRange}
          </p>
          <a
            href="#featured-story"
            data-press-feedback
            {...getCursorTargetAttributes({ type: "explore", contrast: "light" })}
            className="group inline-flex min-h-11 items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-secondary)] transition-colors hover:text-foreground focus-visible:text-foreground"
          >
            <span aria-hidden="true" className="rv-scroll-cue">
              <span className="rv-scroll-cue__dot" />
            </span>
            {dictionary.scroll}
          </a>
        </div>
      </div>
    </div>
  );
}
