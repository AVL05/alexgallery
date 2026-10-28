"use client";

import { usePhotoDetailContext } from "@/components/photo-detail/photo-detail-context";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Magnetic } from "@/components/interactions/magnetic";
import { getCursorTargetAttributes } from "@/lib/interactions/cursor-target";
import { readArchiveContext } from "@/lib/archive/context";

export function PhotoDetailBackLink({ label, seriesLabel, selectionLabel, className = "" }: { label: string; seriesLabel?: string; selectionLabel: string; className?: string }) {
  const { returnHref, contextType, locale } = usePhotoDetailContext();
  const fromSelection = returnHref === `/${locale}/work` || returnHref === `/${locale}#selected-work`;
  const resolvedLabel = contextType === "series" && seriesLabel ? seriesLabel : fromSelection ? selectionLabel : label;
  // The archive restores its saved position; Next's later hash scroll would override it.
  const restoresArchivePosition = readArchiveContext(locale)?.archiveHref === returnHref;
  return <Magnetic><Link href={returnHref} scroll={!restoresArchivePosition} className={`rv-editorial-link group ${className}`} data-press-feedback {...getCursorTargetAttributes({ type: "previous" })}><span data-magnetic-content className="inline-flex items-center gap-[0.65rem]"><ChevronLeft aria-hidden="true" className="size-4 transition-transform group-hover:-translate-x-0.5 group-focus-visible:-translate-x-0.5" />{resolvedLabel}</span></Link></Magnetic>;
}
