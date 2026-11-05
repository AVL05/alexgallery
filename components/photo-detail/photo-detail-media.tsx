"use client";

import { usePhotoDetailContext } from "@/components/photo-detail/photo-detail-context";
import { PhotoFullscreenDialog } from "@/components/photo-detail/photo-fullscreen-dialog";
import type { PhotoDetailDictionary } from "@/types/dictionary";
import { Expand } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { getCursorTargetAttributes } from "@/lib/interactions/cursor-target";
import { photoSizes } from "@/lib/images/sizes";
import { getPhotoViewTransitionName } from "@/lib/motion/photo-motion";

// Screening room: the photograph alone in the dark, sized to the viewport and
// never cropped. Controls and technical data stay outside the image.
export function PhotoDetailMedia({ dictionary }: { dictionary: PhotoDetailDictionary }) {
  const { current } = usePhotoDetailContext();
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Frame never exceeds the viewport height nor ~1.25x its source width; the
  // label row may be wider than a narrow portrait so controls stay on screen.
  const frameMax = `min(${current.width * 1.25}px, calc(max(16rem, 100svh - 19rem) * ${current.width / current.height}))`;

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <figure className="photo-detail-media mx-auto w-full" style={{ maxWidth: `max(min(36rem, 100%), ${frameMax})` }}>
        <div data-photo-detail-id={current.id} data-photo-reveal="soft-scale" className="relative mx-auto grid w-full place-items-center overflow-hidden bg-[var(--color-projection)]" style={{ maxWidth: frameMax, aspectRatio: `${current.width}/${current.height}`, viewTransitionName: getPhotoViewTransitionName(current.id) }}>
          {!failed ? <Image data-photo-motion-media src={current.src} alt={current.alt || current.description} fill priority sizes={photoSizes.detailMain} placeholder={current.blurDataURL ? "blur" : undefined} blurDataURL={current.blurDataURL} className="object-contain" onError={() => setFailed(true)} /> : <p className="rv-meta p-8">{dictionary.imageError}</p>}
        </div>
        <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <span className="rv-slate">
            <span className="normal-case tracking-normal text-foreground [font-family:var(--font-reading)] text-sm">{current.title}</span>
            <span aria-hidden="true" className="rv-slate__rule" />
            <span>{current.year}</span>
            <span aria-hidden="true" className="rv-slate__rule max-sm:hidden" />
            <span className="tabular-nums max-sm:hidden">{current.width} × {current.height}</span>
            <span className="sr-only">{dictionary.creator}</span>
          </span>
          <button ref={triggerRef} type="button" onClick={() => setOpen(true)} className="rv-editorial-link" aria-haspopup="dialog" data-press-feedback {...getCursorTargetAttributes({ type: "fullscreen", contrast: "dark" })}>
            <Expand aria-hidden="true" className="size-4" /> {dictionary.fullscreen}
          </button>
        </figcaption>
      </figure>

      <PhotoFullscreenDialog open={open} onClose={close} triggerRef={triggerRef} closeLabel={dictionary.closeFullscreen} label={`${dictionary.fullscreen} — ${current.title}`} lockSource="photo-detail-fullscreen">
        <Image src={current.src} alt={current.alt || current.description} fill loading="eager" sizes="100vw" className="object-contain p-4 sm:p-8" />
      </PhotoFullscreenDialog>
    </>
  );
}
