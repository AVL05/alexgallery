"use client";

import { usePhotoDetailContext } from "@/components/photo-detail/photo-detail-context";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Magnetic } from "@/components/interactions/magnetic";
import { getCursorTargetAttributes } from "@/lib/interactions/cursor-target";

export function PhotoDetailBackLink({ label, className = "" }: { label: string; className?: string }) {
  const { returnHref } = usePhotoDetailContext();
  return <Magnetic><Link href={returnHref} className={`rv-editorial-link group ${className}`} data-press-feedback {...getCursorTargetAttributes({ type: "previous" })}><span data-magnetic-content className="inline-flex items-center gap-[0.65rem]"><ChevronLeft aria-hidden="true" className="size-4 transition-transform group-hover:-translate-x-0.5 group-focus-visible:-translate-x-0.5" />{label}</span></Link></Magnetic>;
}
