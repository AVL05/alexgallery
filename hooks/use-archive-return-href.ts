"use client";

import { readArchiveContext } from "@/lib/archive/context";
import type { Locale } from "@/types/dictionary";
import { useEffect, useState } from "react";

export function useArchiveReturnHref(
  locale: Locale,
  photoId: number,
  fallbackHref: string,
) {
  const [href, setHref] = useState(fallbackHref);

  useEffect(() => {
    const context = readArchiveContext(locale, photoId);
    if (context) setHref(context.archiveHref);
  }, [fallbackHref, locale, photoId]);

  return href;
}
