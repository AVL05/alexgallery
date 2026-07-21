"use client";

import { NarrativeImage } from "@/components/home/narrative-image";
import { useMotion } from "@/components/motion/motion-provider";
import type { HomeChapter } from "@/lib/home/selectors";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { photoMotionTokens } from "@/lib/motion/photo-motion";
import { useEffect, useRef, useState } from "react";

export function ChapterPhotoStage({
  active,
  failImages,
  slowImages,
}: {
  active: HomeChapter;
  failImages?: boolean;
  slowImages?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [displayed, setDisplayed] = useState(active);
  const [outgoing, setOutgoing] = useState<HomeChapter | null>(null);
  const { prefersReducedMotion } = useMotion();

  useEffect(() => {
    if (active.category === displayed.category) return;
    setOutgoing(displayed);
    setDisplayed(active);
  }, [active, displayed]);

  useGSAP(
    () => {
      const root = rootRef.current;
      const incoming = root?.querySelector<HTMLElement>("[data-chapter-layer='incoming']");
      const previous = root?.querySelector<HTMLElement>("[data-chapter-layer='outgoing']");
      if (!incoming) return;
      gsap.killTweensOf([incoming, previous].filter(Boolean));

      if (!previous || prefersReducedMotion) {
        gsap.set(incoming, { clearProps: "clipPath,opacity,transform" });
        if (previous) setOutgoing(null);
        return;
      }

      gsap.set(incoming, { zIndex: 2, clipPath: "inset(0 14% 0 0)", opacity: 0.15, x: photoMotionTokens.chapter.distance });
      gsap.set(previous, { zIndex: 1, opacity: 1, x: 0 });
      const timeline = gsap.timeline({
        defaults: { duration: photoMotionTokens.chapter.duration, ease: "power3.out", overwrite: true },
        onComplete: () => setOutgoing(null),
      });
      timeline
        .to(previous, { opacity: 0, x: -photoMotionTokens.chapter.distance * 0.5 }, 0)
        .to(incoming, { clipPath: "inset(0 0% 0 0)", opacity: 1, x: 0 }, 0);
      return () => timeline.kill();
    },
    {
      dependencies: [displayed.photo.id, outgoing?.photo.id, prefersReducedMotion],
      scope: rootRef,
      revertOnUpdate: true,
    },
  );

  const layer = (chapter: HomeChapter, state: "incoming" | "outgoing") => (
    <div key={`${state}-${chapter.photo.id}`} data-chapter-layer={state} className="absolute inset-0">
      <NarrativeImage
        photo={chapter.photo}
        sizes="42vw"
        failPrimary={failImages}
        slow={slowImages}
        className="h-full border border-border"
      />
    </div>
  );

  return (
    <div
      ref={rootRef}
      data-photo-reveal="mask-side"
      className="relative overflow-hidden bg-[var(--color-surface)]"
      style={{ aspectRatio: `${displayed.photo.width}/${displayed.photo.height}` }}
    >
      {outgoing ? layer(outgoing, "outgoing") : null}
      {layer(displayed, "incoming")}
    </div>
  );
}
