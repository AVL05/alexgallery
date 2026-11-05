"use client";

import { NarrativeImage } from "@/components/home/narrative-image";
import { useMotion } from "@/components/motion/motion-provider";
import { PhotoTransitionLink } from "@/components/motion/photo-transition-link";
import { Container } from "@/components/ui/layout";
import { readPhotoReturn, savePhotoReturn } from "@/lib/archive/context";
import { homeExperienceConfig } from "@/lib/home/experience";
import type { NarrativePhoto } from "@/lib/home/selectors";
import { getCursorTargetAttributes } from "@/lib/interactions/cursor-target";
import { getPhotoHref } from "@/lib/photos";
import { getLocalizedSeries, getSeriesForPhoto } from "@/lib/series/selectors";
import type { GalleryDictionary, HomeDictionary, Locale } from "@/types/dictionary";
import { ArrowUpRight } from "lucide-react";
import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";

type SequenceMode = "stacked" | "projected";

const pad = (value: number) => String(value).padStart(2, "0");

// The selection is screened, not listed: on wide screens with motion allowed a
// sticky projection stage cross-dissolves from frame to frame as the visitor
// scrolls natively (no scroll-jacking). Server HTML, touch-narrow screens and
// reduced motion keep the same DOM as a stacked sequence of complete prints.
export function SelectedWork({ photos, dictionary, galleryDictionary, locale, failImages, slowImages }: {
  photos: NarrativePhoto[];
  dictionary: HomeDictionary;
  galleryDictionary: GalleryDictionary;
  locale: Locale;
  failImages?: boolean;
  slowImages?: boolean;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const sequenceRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion } = useMotion();
  const [mode, setMode] = useState<SequenceMode>("stacked");
  const [active, setActive] = useState(0);
  const total = photos.length;

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const update = () => setMode(wide.matches && !prefersReducedMotion ? "projected" : "stacked");
    update();
    wide.addEventListener("change", update);
    return () => wide.removeEventListener("change", update);
  }, [prefersReducedMotion]);

  // Native scroll drives the active frame and the reel progress.
  useEffect(() => {
    const sequence = sequenceRef.current;
    if (mode !== "projected" || !sequence || total === 0) {
      sequence?.style.removeProperty("--sequence-progress");
      return;
    }
    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = sequence.getBoundingClientRect();
      const stage = sequence.querySelector<HTMLElement>("[data-sequence-stage]");
      const travel = Math.max(1, rect.height - (stage?.offsetHeight ?? window.innerHeight));
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      sequence.style.setProperty("--sequence-progress", progress.toFixed(4));
      setActive(Math.min(total - 1, Math.floor(progress * total)));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [mode, total]);

  // Keyboard focus on a frame brings its segment of the sequence on screen.
  const revealFrame = useCallback((index: number) => {
    const sequence = sequenceRef.current;
    if (mode !== "projected" || !sequence) return;
    const stage = sequence.querySelector<HTMLElement>("[data-sequence-stage]");
    const top = sequence.getBoundingClientRect().top + window.scrollY;
    const travel = Math.max(1, sequence.offsetHeight - (stage?.offsetHeight ?? window.innerHeight));
    const navOffset = stage ? parseFloat(getComputedStyle(stage).top) || 0 : 0;
    window.scrollTo({ top: top - navOffset + travel * ((index + 0.5) / total), behavior: "instant" });
    setActive(index);
  }, [mode, total]);

  useEffect(() => {
    const saved = readPhotoReturn(locale);
    if (window.location.hash !== "#selected-work" || saved?.returnHref !== `/${locale}#selected-work`) return;
    const link = rootRef.current?.querySelector<HTMLAnchorElement>(`[data-exhibition-photo="${saved.photoId}"] a`);
    if (!link) return;
    // Wait for the route's hash scroll before restoring the photograph.
    const frame = window.requestAnimationFrame(() => {
      link.scrollIntoView({ block: "center", behavior: "instant" });
      link.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [locale, mode]);

  return (
    <section id="selected-work" ref={rootRef} aria-labelledby="selection-title" className="rv-section rv-sequence-section">
      <Container>
        <div className="rv-sequence-intro">
          <p className="rv-slate">{pad(total)} <span aria-hidden="true" className="rv-slate__rule" /> {dictionary.selected.frameLabel}</p>
          <h2 id="selection-title" className="rv-home-heading">{dictionary.selected.title}</h2>
          <p className="rv-body-sm max-w-[38ch]">{dictionary.selected.description}</p>
        </div>
      </Container>

      {total === 0 ? <Container><p className="rv-body py-12">{dictionary.selected.empty}</p></Container> : (
        <div
          ref={sequenceRef}
          className="rv-sequence"
          data-mode={mode}
          style={{ "--sequence-count": total } as CSSProperties}
        >
          <div className="rv-sequence__stage" data-sequence-stage>
            <div className="rv-container rv-sequence__slides">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  data-exhibition-photo={photo.id}
                  data-active={mode === "stacked" || index === active ? "true" : "false"}
                  className="rv-sequence__slide"
                >
                  <SequenceFrame
                    photo={photo}
                    index={index}
                    total={total}
                    locale={locale}
                    dictionary={dictionary}
                    galleryDictionary={galleryDictionary}
                    failImages={failImages}
                    slowImages={slowImages}
                    onFocus={() => revealFrame(index)}
                  />
                </div>
              ))}
            </div>

            {mode === "projected" ? (
              <div aria-hidden="true" className="rv-container rv-sequence__reel">
                <span className="rv-slate">{pad(active + 1)} / {pad(total)}</span>
                <span className="rv-sequence__track"><span className="rv-sequence__track-fill" /></span>
                <span className="rv-sequence__ticks">
                  {photos.map((photo, index) => <span key={photo.id} data-active={index === active ? "true" : undefined} />)}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}

function SequenceFrame({ photo, index, total, locale, dictionary, galleryDictionary, failImages, slowImages, onFocus }: {
  photo: NarrativePhoto;
  index: number;
  total: number;
  locale: Locale;
  dictionary: HomeDictionary;
  galleryDictionary: GalleryDictionary;
  failImages?: boolean;
  slowImages?: boolean;
  onFocus: () => void;
}) {
  const rawSeries = getSeriesForPhoto(photo.id);
  const series = rawSeries ? getLocalizedSeries(rawSeries, locale) : null;
  const ratio = photo.width / photo.height;

  return (
    <article className="h-full">
      <PhotoTransitionLink
        photoId={photo.id}
        href={getPhotoHref(locale, photo.id)}
        prefetch={homeExperienceConfig.prefetch.selectedWork}
        onBeforeNavigate={() => savePhotoReturn({
          locale,
          photoId: photo.id,
          returnHref: `/${locale}#selected-work`,
          scrollY: window.scrollY,
          savedAt: Date.now(),
        })}
        onFocus={onFocus}
        className="rv-sequence__link group"
        data-press-feedback
        {...getCursorTargetAttributes({ type: "view", contrast: "dark" })}
        aria-label={`${photo.title}, ${galleryDictionary.categories[photo.category]}, ${photo.year}`}
      >
        <div className="rv-sequence__label">
          <p className="rv-slate">{dictionary.selected.frameLabel} {pad(index + 1)} / {pad(total)}</p>
          <h3 className="rv-sequence__title">{photo.title}</h3>
          <p className="rv-sequence__meta">
            <span>{galleryDictionary.categories[photo.category]}</span>
            <span aria-hidden="true">/</span>
            <span>{photo.year}</span>
            {series ? <><span aria-hidden="true">/</span><span>{galleryDictionary.seriesLabel}: {series.title}</span></> : null}
          </p>
          <p className="rv-sequence__note">{photo.description}</p>
          <span aria-hidden="true" className="rv-sequence__cue">{dictionary.selected.cta}<ArrowUpRight className="size-4" /></span>
        </div>
        <div className="rv-sequence__screen">
          <div
            className="rv-sequence__print"
            style={{ "--print-ratio": ratio, "--print-width": `${photo.width}px` } as CSSProperties}
          >
            <NarrativeImage
              photo={photo}
              sizes="(max-width: 767px) 100vw, 64vw"
              failPrimary={failImages}
              slow={slowImages}
              imageClassName="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025] group-focus-visible:scale-[1.025]"
            />
          </div>
        </div>
      </PhotoTransitionLink>
    </article>
  );
}
