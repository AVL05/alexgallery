"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useArchiveReturnHref } from "@/hooks/use-archive-return-href";
import type { Locale } from "@/types/dictionary";

type PhotoKeyboardNavigationProps = {
  previousHref: string;
  nextHref: string;
  galleryHref: string;
  locale: Locale;
  photoId: number;
};

export function PhotoKeyboardNavigation({
  previousHref,
  nextHref,
  galleryHref,
  locale,
  photoId,
}: PhotoKeyboardNavigationProps) {
  const router = useRouter();
  const archiveReturnHref = useArchiveReturnHref(locale, photoId, galleryHref);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        ["INPUT", "SELECT", "TEXTAREA"].includes(
          (event.target as HTMLElement | null)?.tagName || "",
        )
      ) {
        return;
      }

      if (event.key === "ArrowLeft") {
        router.push(previousHref);
      }

      if (event.key === "ArrowRight") {
        router.push(nextHref);
      }

      if (event.key === "Escape") {
        router.push(archiveReturnHref);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [archiveReturnHref, nextHref, previousHref, router]);

  return null;
}
