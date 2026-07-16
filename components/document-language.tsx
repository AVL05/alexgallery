"use client";

import type { Locale } from "@/types/dictionary";
import { useEffect } from "react";

export function DocumentLanguage({ locale }: { locale: Locale }) {
  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = locale;
    return () => {
      document.documentElement.lang = previous;
    };
  }, [locale]);

  return null;
}
