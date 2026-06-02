"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

type PhotoKeyboardNavigationProps = {
  previousHref: string;
  nextHref: string;
  galleryHref: string;
};

export function PhotoKeyboardNavigation({
  previousHref,
  nextHref,
  galleryHref,
}: PhotoKeyboardNavigationProps) {
  const router = useRouter();

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
        router.push(galleryHref);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [galleryHref, nextHref, previousHref, router]);

  return null;
}
