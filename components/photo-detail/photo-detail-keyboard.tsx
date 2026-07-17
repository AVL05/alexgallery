"use client";

import { usePhotoDetailContext } from "@/components/photo-detail/photo-detail-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { shouldIgnorePhotoArrowKey } from "@/lib/photo-detail/interaction";

export function PhotoDetailKeyboard() {
  const { previous, next, hrefFor, preserveContext } = usePhotoDetailContext();
  const router = useRouter();
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (shouldIgnorePhotoArrowKey({ tagName: target?.tagName, isContentEditable: target?.isContentEditable, hasModifier: event.altKey || event.ctrlKey || event.metaKey || event.shiftKey, overlayOpen: Boolean(document.querySelector("dialog[open]")) })) return;
      const destination = event.key === "ArrowLeft" ? previous : event.key === "ArrowRight" ? next : null;
      if (!destination) return;
      preserveContext(destination.id);
      router.push(hrefFor(destination.id));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hrefFor, next, preserveContext, previous, router]);
  return null;
}
