import type { HeroArchiveFacts } from "@/lib/hero/config";
import type { HeroDictionary, Locale } from "@/types/dictionary";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function HeroContent({ dictionary, facts, locale, photoId, photoTitle, photoYear, photoRatio, children }: {
  dictionary: HeroDictionary;
  facts: HeroArchiveFacts;
  locale: Locale;
  photoId: number;
  photoTitle: string;
  photoYear: string;
  photoRatio: number;
  children: ReactNode;
}) {
  return (
    <div className="rv-container">
      <div className="mx-auto" style={{ maxWidth: `calc(max(12rem, 100svh - 18rem) * ${photoRatio})` }}>
      <div data-hero-secondary className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 pb-5">
        <div data-hero-content>
          <h1 className="overflow-hidden text-base leading-relaxed text-foreground md:text-lg">
            <span data-hero-title-line className="block">{dictionary.byline}</span>
          </h1>
          <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-secondary)]">{dictionary.eyebrow}</p>
        </div>
        <Link href={`/${locale}/archive`} className="rv-editorial-link">
          {dictionary.cta}<ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
      </div>

      <figure>
        <Link href={`/${locale}/photo/${photoId}`} className="group relative block w-full overflow-hidden" style={{ aspectRatio: photoRatio }} aria-label={`${dictionary.openPhoto}: ${photoTitle}`}>
          {children}
        </Link>
        <figcaption data-hero-secondary className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-b border-border py-4 md:py-5">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <p className="text-sm leading-relaxed text-foreground md:text-base">{photoTitle}</p>
            <p className="text-xs tabular-nums text-[var(--color-text-secondary)]">{photoYear}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <p className="text-xs tabular-nums text-[var(--color-text-secondary)]">{facts.count} {dictionary.photographs} <span aria-hidden="true"> · </span> {facts.dateRange}</p>
            <Link href="#selected-work" className="rv-editorial-link">{dictionary.scroll}<ArrowDown aria-hidden="true" className="size-4" /></Link>
          </div>
        </figcaption>
      </figure>
      </div>
    </div>
  );
}
