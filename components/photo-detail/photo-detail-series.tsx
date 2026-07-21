"use client";

import { usePhotoDetailContext } from "@/components/photo-detail/photo-detail-context";
import { getSeriesHref, getSeriesPosition } from "@/lib/series/selectors";
import type { Locale, SeriesDictionary } from "@/types/dictionary";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function PhotoDetailSeries({ locale, dictionary }: { locale: Locale; dictionary: SeriesDictionary }) {
  const { current, seriesMembership } = usePhotoDetailContext();
  if (!seriesMembership) return null;
  const position = getSeriesPosition(seriesMembership, current.id);
  if (!position) return null;
  return (
    <aside className="mt-12 grid gap-6 border-y border-border py-8 md:grid-cols-12 md:items-center" aria-labelledby="photo-series-title">
      <div className="md:col-span-3"><p className="rv-kicker text-accent">{dictionary.partOfSeries}</p><p className="rv-index mt-3">{String(position.current).padStart(2, "0")} / {String(position.total).padStart(2, "0")}</p></div>
      <div className="md:col-span-6"><h2 id="photo-series-title" className="font-serif text-2xl leading-tight tracking-[-0.02em] sm:text-3xl">{seriesMembership.title}</h2></div>
      <Link href={getSeriesHref(locale, seriesMembership.slug)} className="rv-editorial-link md:col-span-3 md:justify-self-end">{dictionary.viewComplete}<ArrowRight aria-hidden="true" className="size-4" /></Link>
    </aside>
  );
}
