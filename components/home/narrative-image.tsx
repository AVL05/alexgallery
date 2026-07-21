"use client";

import { useMotion } from "@/components/motion/motion-provider";
import { homeImageFallbackSrc } from "@/lib/home/curation";
import type { NarrativePhoto } from "@/lib/home/selectors";
import type { PhotoRevealVariant } from "@/lib/motion/photo-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function NarrativeImage({
  photo,
  className,
  imageClassName,
  sizes,
  failPrimary = false,
  slow = false,
  motionVariant,
}: {
  photo: NarrativePhoto;
  className?: string;
  imageClassName?: string;
  sizes: string;
  failPrimary?: boolean;
  slow?: boolean;
  motionVariant?: PhotoRevealVariant;
}) {
  const [src, setSrc] = useState(failPrimary ? "/__home-image-failure__.webp" : photo.src);
  const [loaded, setLoaded] = useState(false);
  const slowTimerRef = useRef<number | null>(null);
  const { refreshScrollTriggers } = useMotion();

  useEffect(() => {
    if (slowTimerRef.current !== null) window.clearTimeout(slowTimerRef.current);
    setSrc(failPrimary ? "/__home-image-failure__.webp" : photo.src);
    setLoaded(false);
  }, [failPrimary, photo.src]);

  useEffect(() => () => {
    if (slowTimerRef.current !== null) window.clearTimeout(slowTimerRef.current);
  }, []);

  return (
    <div
      className={cn("relative overflow-hidden bg-[var(--color-surface)]", className)}
      style={{ aspectRatio: `${photo.width}/${photo.height}` }}
      data-image-state={loaded ? "loaded" : "loading"}
      data-photo-reveal={motionVariant}
    >
      <Image
        src={src}
        alt={photo.alt}
        fill
        sizes={sizes}
        placeholder={photo.blurDataURL && !failPrimary ? "blur" : undefined}
        blurDataURL={photo.blurDataURL}
        className={cn(
          "object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-70",
          imageClassName,
        )}
        data-photo-motion-media={motionVariant ? "true" : undefined}
        onError={() => {
          if (src !== homeImageFallbackSrc) setSrc(homeImageFallbackSrc);
        }}
        onLoad={() => {
          const settle = () => {
            setLoaded(true);
            refreshScrollTriggers();
          };
          if (slow && process.env.NODE_ENV === "development") {
            slowTimerRef.current = window.setTimeout(settle, 900);
          } else {
            settle();
          }
        }}
      />
    </div>
  );
}
