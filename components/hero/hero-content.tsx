import type { HeroArchiveFacts } from "@/lib/hero/config";
import type { HeroDictionary, Locale } from "@/types/dictionary";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

// Cinemascope projection: the photograph is the screen, edge to edge and never
// cropped above 768 px (narrow screens may show a curated, labelled detail).
// Opening credits sit in the upper letterbox band; the museum label
// and the way into the archive sit in the lower one, outside the image.
export function HeroContent({ dictionary, facts, locale, photoId, photoTitle, photoYear, photoRatio, frameNumber, mobileDetail, children }: {
  dictionary: HeroDictionary;
  facts: HeroArchiveFacts;
  locale: Locale;
  photoId: number;
  photoTitle: string;
  photoYear: string;
  photoRatio: number;
  frameNumber: number;
  mobileDetail: boolean;
  children: ReactNode;
}) {
  const pad = (value: number) => String(value).padStart(2, "0");

  return (
    <div className="rv-projection" data-mobile-detail={mobileDetail || undefined} style={{ "--projection-ratio": photoRatio } as React.CSSProperties}>
      <div className="rv-container rv-projection__band rv-projection__band--top">
        <div data-hero-content className="min-w-0">
          <h1 className="rv-projection__title overflow-hidden pb-[0.12em]">
            <span data-hero-title-line className="block">{dictionary.byline}</span>
          </h1>
          <p data-hero-secondary className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">{dictionary.eyebrow}</p>
        </div>
        <p data-hero-secondary className="rv-slate">
          <span>{dictionary.descriptor}</span>
          <span aria-hidden="true" className="rv-slate__rule" />
          <span>{dictionary.frame} {pad(frameNumber)} {dictionary.of} {facts.count}</span>
          <span aria-hidden="true" className="rv-slate__rule max-sm:hidden" />
          <span className="max-sm:hidden">{photoRatio.toFixed(2)}:1</span>
        </p>
      </div>

      <figure className="rv-projection__figure">
        <div className="rv-projection__stage">
          <div className="rv-projection__screen" data-hero-screen>
            <Link
              href={`/${locale}/photo/${photoId}`}
              className="rv-projection__frame group relative block w-full overflow-hidden"
              aria-label={`${dictionary.openPhoto}: ${photoTitle}`}
            >
              {children}
            </Link>
          </div>
        </div>

        <figcaption data-hero-secondary className="rv-container rv-projection__band rv-projection__band--bottom">
          <div className="rv-projection__caption">
            <span className="rv-index">{pad(frameNumber)}</span>
            <span className="text-sm leading-snug text-foreground md:text-base">{photoTitle}</span>
            <span className="text-xs tabular-nums text-[var(--color-text-secondary)]">{photoYear}</span>
            {mobileDetail ? <span className="rv-slate rv-projection__detail-flag">{dictionary.detail}<span aria-hidden="true" className="rv-slate__rule" />{photoRatio.toFixed(2)}:1</span> : null}
          </div>
          <div className="rv-projection__actions">
            <p className="text-xs tabular-nums text-[var(--color-text-secondary)]">{facts.count} {dictionary.photographs}<span aria-hidden="true"> · </span>{facts.dateRange}</p>
            <Link href={`/${locale}/archive`} className="rv-editorial-link">{dictionary.cta}<ArrowUpRight aria-hidden="true" className="size-4" /></Link>
            <Link href="#selected-work" className="rv-editorial-link max-md:hidden">{dictionary.scroll}<ArrowDown aria-hidden="true" className="size-4" /></Link>
          </div>
        </figcaption>
      </figure>
    </div>
  );
}
