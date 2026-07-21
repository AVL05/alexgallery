"use client";

import { usePhotoDetailContext } from "@/components/photo-detail/photo-detail-context";
import { PhotoFullscreenDialog } from "@/components/photo-detail/photo-fullscreen-dialog";
import type { PhotoDetailDictionary } from "@/types/dictionary";
import { Expand } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { Magnetic } from "@/components/interactions/magnetic";
import { getCursorTargetAttributes } from "@/lib/interactions/cursor-target";
import { getPhotoViewTransitionName } from "@/lib/motion/photo-motion";

export function PhotoDetailMedia({ dictionary }: { dictionary: PhotoDetailDictionary }) {
  const { current } = usePhotoDetailContext();
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <figure className="photo-detail-media">
        <div data-photo-detail-id={current.id} data-photo-reveal="soft-scale" className="relative grid place-items-center overflow-hidden border border-border bg-[var(--color-surface)]" style={{ aspectRatio: `${current.width}/${current.height}`, viewTransitionName: getPhotoViewTransitionName(current.id) }}>
          {!failed ? <Image data-photo-motion-media src={current.src} alt={current.alt || current.description} fill priority sizes="(max-width: 1023px) 100vw, 68vw" placeholder={current.blurDataURL ? "blur" : undefined} blurDataURL={current.blurDataURL} className="object-contain" onError={() => setFailed(true)} /> : <p className="rv-meta p-8">{dictionary.imageError}</p>}
          <Magnetic>
            <button ref={triggerRef} type="button" onClick={() => setOpen(true)} className="absolute bottom-4 right-4 inline-flex min-h-11 items-center gap-2 border border-white/30 bg-black/75 px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-black focus-visible:bg-black" aria-haspopup="dialog" data-press-feedback {...getCursorTargetAttributes({ type: "fullscreen", contrast: "dark" })}>
              <span data-magnetic-content className="inline-flex items-center gap-2"><Expand aria-hidden="true" className="size-4" /> {dictionary.fullscreen}</span>
            </button>
          </Magnetic>
        </div>
        <figcaption className="mt-3 flex justify-between gap-4 rv-meta"><span>{current.width} × {current.height}</span><span>{dictionary.creator}</span></figcaption>
      </figure>

      <PhotoFullscreenDialog open={open} onClose={close} triggerRef={triggerRef} closeLabel={dictionary.closeFullscreen} lockSource="photo-detail-fullscreen">
        <Image src={current.src} alt={current.alt || current.description} fill loading="eager" sizes="100vw" className="object-contain p-4 sm:p-8" />
      </PhotoFullscreenDialog>
    </>
  );
}
