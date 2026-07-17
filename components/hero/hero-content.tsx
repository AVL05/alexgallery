import type { HeroArchiveFacts } from "@/lib/hero/config";
import type { HeroDictionary } from "@/types/dictionary";
import { ArrowDownRight } from "lucide-react";
import { SectionMarker } from "@/components/home/section-marker";
import { Magnetic } from "@/components/interactions/magnetic";
import { getCursorTargetAttributes } from "@/lib/interactions/cursor-target";

export function HeroContent({
  dictionary,
  facts,
  chapterLabel,
}: {
  dictionary: HeroDictionary;
  facts: HeroArchiveFacts;
  chapterLabel: string;
}) {
  return (
    <div data-hero-content className="relative z-10 flex h-full flex-col justify-end pb-[max(2rem,env(safe-area-inset-bottom))] pt-[calc(var(--layout-nav-height)+3.5rem)] sm:justify-center sm:pb-12 sm:pt-[calc(var(--layout-nav-height)+2rem)] lg:pb-14">
      <div className="max-w-[72rem]">
        <div data-hero-secondary className="mb-5 sm:mb-7">
          <SectionMarker current={1} label={chapterLabel} />
        </div>
        <p data-hero-secondary className="rv-kicker flex items-center gap-3 text-[var(--color-text-secondary)]">
          <span aria-hidden="true" className="h-px w-8 bg-accent" />
          {dictionary.eyebrow}
        </p>

        <h1 className="mt-5 max-w-[13ch] font-serif text-[clamp(3rem,8.6vw,8.75rem)] font-normal leading-[0.91] tracking-[-0.047em] text-foreground sm:mt-7">
          <span className="block overflow-hidden pb-[0.08em]">
            <span data-hero-title-line className="block">{dictionary.titleLineOne}</span>
          </span>
          {" "}
          <span className="block overflow-hidden pb-[0.08em]">
            <span data-hero-title-line className="block">{dictionary.titleLineTwo}</span>
          </span>
        </h1>

        <div data-hero-secondary className="mt-6 flex max-w-3xl flex-col gap-6 sm:mt-8 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <p className="max-w-[32rem] text-[clamp(1rem,1.5vw,1.25rem)] leading-relaxed text-[var(--color-text-secondary)]">
            {dictionary.description}
          </p>
          <Magnetic>
            <a
              href="#gallery"
              className="rv-editorial-link group w-fit shrink-0"
              data-press-feedback
              {...getCursorTargetAttributes({ type: "explore", contrast: "light" })}
            >
              <span data-magnetic-content className="inline-flex items-center gap-[0.65rem]">
                <span>{dictionary.cta}</span>
                <ArrowDownRight aria-hidden="true" className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </span>
            </a>
          </Magnetic>
        </div>
      </div>

      <div data-hero-secondary className="mt-8 grid grid-cols-2 items-end gap-4 border-t border-[var(--color-border)] pt-3 sm:absolute sm:inset-x-0 sm:bottom-[max(2rem,env(safe-area-inset-bottom))] sm:mt-0 sm:grid-cols-[1fr_auto_auto] sm:gap-8 sm:pt-4">
        <a href="#about" data-press-feedback {...getCursorTargetAttributes({ type: "explore", contrast: "light" })} className="group col-span-2 inline-flex min-h-11 w-fit items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-secondary)] transition-colors hover:text-foreground focus-visible:text-foreground sm:col-span-1">
          <span aria-hidden="true" className="relative h-8 w-px overflow-hidden bg-[var(--color-border-strong)]">
            <span className="absolute inset-x-0 top-0 h-1/2 bg-accent transition-transform duration-300 group-hover:translate-y-full" />
          </span>
          {dictionary.scroll}
        </a>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
          {String(facts.count).padStart(2, "0")} {dictionary.photographs}
        </p>
        <div className="text-right font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
          <p>{facts.dateRange}</p>
          <p className="mt-1 hidden sm:block">{dictionary.location}</p>
        </div>
      </div>
    </div>
  );
}
