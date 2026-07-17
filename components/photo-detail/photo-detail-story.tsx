"use client";

import { usePhotoDetailContext } from "@/components/photo-detail/photo-detail-context";

export function PhotoDetailStory() {
  const { current } = usePhotoDetailContext();
  return <p className="max-w-[48rem] font-serif text-[clamp(1.7rem,3.5vw,3.7rem)] leading-[1.18] tracking-[-0.025em] text-balance">{current.description}</p>;
}
