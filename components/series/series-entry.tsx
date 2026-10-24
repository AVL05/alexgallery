import { NarrativeImage } from "@/components/home/narrative-image";
import { photoSizes } from "@/lib/images/sizes";
import { getCursorTargetAttributes } from "@/lib/interactions/cursor-target";
import { getPhotoRevealVariant } from "@/lib/motion/photo-motion";
import type { NarrativePhoto } from "@/lib/home/selectors";
import { getSeriesHref } from "@/lib/series/selectors";
import type { LocalizedPhotoSeries } from "@/lib/series/types";
import type { Locale } from "@/types/dictionary";
import Link from "next/link";

// Editorial entry for a photo series: dominant cover with lateral metadata.
// Reusable in Home, /series and future photo-essay previews. Layout variants
// adapt to the cover ratio without forcing artificial variety.
export type SeriesEntryVariant = "offset-right" | "offset-left" | "centered";

export function resolveSeriesEntryVariant(
  index: number,
  total: number,
): SeriesEntryVariant {
  if (total > 2 && index === total - 1) return "centered";
  return index % 2 === 0 ? "offset-right" : "offset-left";
}

const entrySizes: Record<SeriesEntryVariant, string> = {
  "offset-right": photoSizes.archiveFeature,
  "offset-left": photoSizes.archiveFeature,
  centered: photoSizes.editorialFeature,
};

const entryFigureClass: Record<SeriesEntryVariant, string> = {
  "offset-right": "md:col-start-5 md:col-span-8",
  "offset-left": "md:col-start-1 md:col-span-8",
  centered: "mx-auto w-full max-w-5xl",
};

const entryMetaClass: Record<SeriesEntryVariant, string> = {
  "offset-right": "md:col-start-1 md:col-span-4 md:row-start-1 md:self-end",
  "offset-left": "md:col-start-9 md:col-span-4 md:row-start-1 md:self-end",
  centered: "mx-auto w-full max-w-5xl",
};

export function SeriesEntry({
  series,
  cover,
  locale,
  index,
  total,
  variant,
  prefetch,
  photographsLabel,
  failImages,
  slowImages,
}: {
  series: LocalizedPhotoSeries;
  cover: NarrativePhoto;
  locale: Locale;
  index: number;
  total: number;
  variant: SeriesEntryVariant;
  prefetch?: boolean;
  photographsLabel: string;
  failImages?: boolean;
  slowImages?: boolean;
}) {
  const split = variant === "offset-right" || variant === "offset-left";

  return (
    <article>
      <Link
        href={getSeriesHref(locale, series.slug)}
        prefetch={prefetch}
        className="group block"
        data-press-feedback
        {...getCursorTargetAttributes({ type: "explore", contrast: "dark" })}
        aria-label={`${series.title}, ${series.photoIds.length} ${photographsLabel}`}
      >
        <div className={split ? "grid gap-8 md:grid-cols-12 md:items-end" : undefined}>
          <div className={entryFigureClass[variant]}>
            <NarrativeImage
              photo={cover}
              sizes={entrySizes[variant]}
              failPrimary={failImages}
              slow={slowImages}
              motionVariant={getPhotoRevealVariant({ ...cover, role: "index" })}
              imageClassName="transition-[transform,filter] duration-500 group-hover:scale-[1.015] group-hover:brightness-[0.92] group-focus-visible:scale-[1.015] group-focus-visible:brightness-[0.92]"
            />
          </div>
          <div className={entryMetaClass[variant]}>
            <div className={`mt-6 flex items-start justify-between gap-4 border-t border-border pt-4 ${split ? "md:mt-0" : ""}`}>
              <div>
                <p className="rv-meta">{String(series.photoIds.length).padStart(2, "0")} {photographsLabel}</p>
                <h3 className={`mt-3 font-serif leading-tight tracking-[-0.025em] text-foreground transition-colors group-hover:text-accent ${split ? "text-[clamp(1.6rem,2.4vw,2.4rem)]" : "text-[clamp(1.5rem,2.2vw,2rem)]"}`}>
                  {series.title}
                </h3>
                <p className="rv-body-sm mt-3">{series.description}</p>
              </div>
              <span className="rv-index shrink-0">{String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
