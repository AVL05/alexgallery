"use client";

import { usePhotoDetailContext } from "@/components/photo-detail/photo-detail-context";
import { useMotion } from "@/components/motion/motion-provider";
import type { PhotoDetailDictionary } from "@/types/dictionary";
import { Expand, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export function PhotoDetailMedia({ dictionary }: { dictionary: PhotoDetailDictionary }) {
  const { current } = usePhotoDetailContext();
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { lockScroll } = useMotion();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (!open) return;
    const release = lockScroll("photo-detail-fullscreen");
    return release;
  }, [lockScroll, open]);

  const close = useCallback(() => {
    setOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      close();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [close, open]);

  return (
    <>
      <figure className="photo-detail-media">
        <div className="relative grid place-items-center overflow-hidden border border-border bg-[var(--color-surface)]" style={{ aspectRatio: `${current.width}/${current.height}`, viewTransitionName: `archive-photo-${current.id}` }}>
          {!failed ? <Image src={current.src} alt={current.alt || current.description} fill priority sizes="(max-width: 1023px) 100vw, 68vw" placeholder={current.blurDataURL ? "blur" : undefined} blurDataURL={current.blurDataURL} className="object-contain" onError={() => setFailed(true)} /> : <p className="rv-meta p-8">{dictionary.imageError}</p>}
          <button ref={triggerRef} type="button" onClick={() => setOpen(true)} className="absolute bottom-4 right-4 inline-flex min-h-11 items-center gap-2 border border-white/30 bg-black/75 px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-black focus-visible:bg-black" aria-haspopup="dialog">
            <Expand aria-hidden="true" className="size-4" /> {dictionary.fullscreen}
          </button>
        </div>
        <figcaption className="mt-3 flex justify-between gap-4 rv-meta"><span>{current.width} × {current.height}</span><span>{dictionary.creator}</span></figcaption>
      </figure>

      <dialog ref={dialogRef} className="photo-detail-dialog m-0 h-dvh max-h-none w-screen max-w-none bg-black p-0 text-white backdrop:bg-black" onCancel={(event) => { event.preventDefault(); close(); }} onClose={() => setOpen(false)}>
        <div className="relative grid h-dvh w-screen place-items-center p-[max(1rem,env(safe-area-inset-top))]">
          {open ? <Image src={current.src} alt={current.alt || current.description} fill loading="eager" sizes="100vw" className="object-contain p-4 sm:p-8" /> : null}
          <button autoFocus type="button" onClick={close} className="absolute right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] inline-flex min-h-11 items-center gap-2 bg-black/80 px-4 text-xs uppercase tracking-[0.12em]">
            <X aria-hidden="true" className="size-5" /> {dictionary.closeFullscreen}
          </button>
        </div>
      </dialog>
    </>
  );
}
