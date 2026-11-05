import { getCursorTargetAttributes } from "@/lib/interactions/cursor-target";
import { getSeriesHref } from "@/lib/series/selectors";
import type { LocalizedPhotoSeries } from "@/lib/series/types";
import type { Locale } from "@/types/dictionary";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ElementType } from "react";

export type ReelFrame = {
  id: number;
  src: string;
  width: number;
  height: number;
  blurDataURL?: string;
};

export const seriesNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

// A series presented as a reel: title card plus every frame in editorial
// order as a justified strip. Frames are never cropped and never upscaled far
// beyond their source; the strip is decorative inside a single labelled link.
export function SeriesReel({
  series,
  frames,
  index,
  locale,
  photographsLabel,
  openLabel,
  prefetch = false,
  headingAs: Heading = "h3",
  headingId,
  priority = false,
}: {
  series: LocalizedPhotoSeries;
  frames: readonly ReelFrame[];
  index: number;
  locale: Locale;
  photographsLabel: string;
  openLabel: string;
  prefetch?: boolean;
  headingAs?: ElementType;
  headingId?: string;
  priority?: boolean;
}) {
  const count = String(series.photoIds.length).padStart(2, "0");

  return (
    <Link
      href={getSeriesHref(locale, series.slug)}
      prefetch={prefetch}
      className="rv-reel group"
      data-press-feedback
      {...getCursorTargetAttributes({ type: "explore", contrast: "dark" })}
      aria-label={`${series.title}, ${series.photoIds.length} ${photographsLabel}`}
    >
      <div className="rv-reel__card">
        <span aria-hidden="true" className="rv-reel__numeral">{seriesNumerals[index] ?? index + 1}</span>
        <div className="min-w-0">
          <Heading id={headingId} className="rv-reel__title">{series.title}</Heading>
          <p className="rv-slate mt-3">
            {series.location ? <><span>{series.location}</span><span aria-hidden="true" className="rv-slate__rule" /></> : null}
            {series.period ? <><span>{series.period}</span><span aria-hidden="true" className="rv-slate__rule" /></> : null}
            <span>{count} {photographsLabel}</span>
          </p>
        </div>
        <p className="rv-reel__description">{series.description}</p>
        <span aria-hidden="true" className="rv-reel__cue">{openLabel}<ArrowRight className="size-4" /></span>
      </div>

      <div className="rv-strip rv-strip--reel" aria-hidden="true">
        {frames.map((frame, frameIndex) => (
          <div key={frame.id} className="rv-strip__item" style={{ "--r": frame.width / frame.height, "--w": `${frame.width}px` } as CSSProperties}>
            <div className="relative overflow-hidden bg-[var(--color-surface)]" style={{ aspectRatio: `${frame.width}/${frame.height}` }}>
              <Image
                src={frame.src}
                alt=""
                fill
                priority={priority && frameIndex < 2}
                loading={priority && frameIndex < 2 ? "eager" : "lazy"}
                sizes="(max-width: 767px) 60vw, 34vw"
                placeholder={frame.blurDataURL ? "blur" : "empty"}
                blurDataURL={frame.blurDataURL}
                className="object-cover transition-[transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02] group-hover:brightness-[1.04] group-focus-visible:scale-[1.02]"
              />
            </div>
          </div>
        ))}
      </div>
    </Link>
  );
}
