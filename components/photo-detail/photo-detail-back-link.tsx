"use client";

import { usePhotoDetailContext } from "@/components/photo-detail/photo-detail-context";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export function PhotoDetailBackLink({ label, className = "" }: { label: string; className?: string }) {
  const { returnHref } = usePhotoDetailContext();
  return <Link href={returnHref} className={`rv-editorial-link group ${className}`}><ChevronLeft aria-hidden="true" className="size-4 transition-transform group-hover:-translate-x-0.5" />{label}</Link>;
}
