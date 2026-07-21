"use client";

import { photoSeries } from "@/lib/series/config";
import type { Locale } from "@/types/dictionary";
import Link from "next/link";
import { useEffect, useState } from "react";

const fixtureLabels = [
  "3 photos",
  "8-slot layout",
  "horizontal",
  "vertical",
  "square",
  "diptych",
  "no description",
  "location",
  "progress",
  "next series",
];

export function SeriesDebugPanel() {
  const [visible, setVisible] = useState(false);
  const [locale, setLocale] = useState<Locale>("es");

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const params = new URLSearchParams(window.location.search);
    setVisible(params.get("series-debug") === "1");
    setLocale(window.location.pathname.startsWith("/en/") ? "en" : "es");
  }, []);

  if (!visible || process.env.NODE_ENV !== "development") return null;
  const first = photoSeries[0];
  const middleId = first.photoIds[Math.floor(first.photoIds.length / 2)];
  const lastId = first.photoIds.at(-1)!;

  return (
    <aside className="fixed bottom-4 right-4 z-[var(--z-modal)] max-h-[80vh] w-[min(24rem,calc(100vw-2rem))] overflow-auto border border-accent bg-background p-5 text-xs shadow-2xl" aria-label="Series development checks">
      <p className="rv-kicker text-accent">Series debug / development only</p>
      <div className="mt-4 flex flex-wrap gap-2" data-series-debug-fixtures>
        {fixtureLabels.map((label) => <span key={label} className="border border-border px-2 py-1">{label}</span>)}
      </div>
      <nav className="mt-5 grid gap-2" aria-label="Series test routes">
        {photoSeries.map((series) => <Link key={series.id} className="rv-editorial-link" href={`/${locale}/series/${series.slug}?series-debug=1`}>{series.slug} ({series.photoIds.length})</Link>)}
        <Link className="rv-editorial-link" href={`/${locale}/photo/${first.photoIds[0]}?series=${first.slug}`}>first photo context</Link>
        <Link className="rv-editorial-link" href={`/${locale}/photo/${middleId}?series=${first.slug}`}>middle photo context</Link>
        <Link className="rv-editorial-link" href={`/${locale}/photo/${lastId}?series=${first.slug}`}>last photo context</Link>
        <Link className="rv-editorial-link" href={`/${locale}/photo/${middleId}`}>direct photo fallback</Link>
        <Link className="rv-editorial-link" href={`/${locale}/series/invalid-series`}>invalid slug / 404</Link>
        <Link className="rv-editorial-link" href={`/${locale === "es" ? "en" : "es"}/series/${first.slug}?series-debug=1`}>switch locale</Link>
      </nav>
      <p className="mt-5 text-[var(--color-text-muted)]">Use responsive mode and prefers-reduced-motion in DevTools for mobile and static reveal checks.</p>
    </aside>
  );
}
