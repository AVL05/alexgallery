"use client";

import { useMotion } from "@/components/motion/motion-provider";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { Magnetic } from "@/components/interactions/magnetic";
import { getCursorTargetAttributes } from "@/lib/interactions/cursor-target";
import { resetContextualCursor } from "@/lib/interactions/development";
import { photoMotionTokens } from "@/lib/motion/photo-motion";

export function PhotoFullscreenDialog({
  open,
  onClose,
  triggerRef,
  closeLabel,
  lockSource,
  children,
}: {
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  closeLabel: string;
  lockSource: string;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closingRef = useRef(false);
  const { lockScroll, prefersReducedMotion } = useMotion();

  const closeAndRestoreFocus = useCallback(async () => {
    if (closingRef.current) return;
    closingRef.current = true;
    const dialog = dialogRef.current;
    const duration = prefersReducedMotion ? 1 : photoMotionTokens.fullscreen.duration * 1000;
    if (dialog?.open && duration > 1) {
      const surface = dialog.querySelector<HTMLElement>("[data-fullscreen-surface]");
      const animations = [
        dialog.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration,
          easing: "cubic-bezier(0.7, 0, 0.84, 0)",
          fill: "forwards",
        }),
        surface?.animate([{ transform: "scale(1)" }, { transform: `scale(${photoMotionTokens.fullscreen.scale})` }], {
          duration,
          easing: "cubic-bezier(0.7, 0, 0.84, 0)",
          fill: "forwards",
        }),
      ].filter(Boolean) as Animation[];
      await Promise.allSettled(animations.map((animation) => animation.finished));
    }
    onClose();
    closingRef.current = false;
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, [onClose, prefersReducedMotion, triggerRef]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (!open) return;
    resetContextualCursor();
    return lockScroll(lockSource);
  }, [lockScroll, lockSource, open]);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      void closeAndRestoreFocus();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeAndRestoreFocus, open]);

  return (
    <dialog
      ref={dialogRef}
      className="photo-detail-dialog m-0 h-dvh max-h-none w-screen max-w-none bg-black p-0 text-white backdrop:bg-black"
      onCancel={(event) => { event.preventDefault(); closeAndRestoreFocus(); }}
      onClose={onClose}
    >
      <div data-fullscreen-surface className="relative grid h-dvh w-screen place-items-center p-[max(1rem,env(safe-area-inset-top))]">
        {open ? children : null}
        <Magnetic>
          <button autoFocus type="button" onClick={() => void closeAndRestoreFocus()} className="absolute right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-20 inline-flex min-h-11 items-center gap-2 bg-black/80 px-4 text-xs uppercase tracking-[0.12em]" data-press-feedback {...getCursorTargetAttributes({ type: "close", contrast: "dark", priority: 10 })}>
            <span data-magnetic-content className="inline-flex items-center gap-2"><X aria-hidden="true" className="size-5" /> {closeLabel}</span>
          </button>
        </Magnetic>
      </div>
    </dialog>
  );
}
