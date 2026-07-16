"use client";

import { useMotion } from "@/components/motion/motion-provider";
import { heroImageConfig } from "@/lib/hero/config";
import type { OptimizedImageData } from "@/types/photo";
import Image from "next/image";
import { useEffect, useState } from "react";

export type HeroImageState = "loading" | "loaded" | "fallback" | "failed";

export function HeroMedia({
  primary,
  fallback,
  alt,
  slowImage,
  failImage,
  onStateChange,
}: {
  primary: OptimizedImageData;
  fallback: OptimizedImageData;
  alt: string;
  slowImage: boolean;
  failImage: boolean;
  onStateChange: (state: HeroImageState) => void;
}) {
  const { refreshScrollTriggers } = useMotion();
  const [activeImage, setActiveImage] = useState(primary);
  const [imageState, setImageState] = useState<HeroImageState>("loading");
  const [simulationReady, setSimulationReady] = useState(!slowImage);

  useEffect(() => {
    setActiveImage(primary);
    setImageState("loading");
    setSimulationReady(!slowImage);

    if (!slowImage) return;
    const timeout = window.setTimeout(() => setSimulationReady(true), 1400);
    return () => window.clearTimeout(timeout);
  }, [primary, slowImage]);

  useEffect(() => {
    onStateChange(imageState);
  }, [imageState, onStateChange]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    if (failImage) {
      setActiveImage(fallback);
      setImageState("fallback");
      return;
    }
    setActiveImage(primary);
    setImageState("loading");
  }, [failImage, fallback, primary]);

  const handleError = () => {
    if (activeImage.id !== fallback.id) {
      setActiveImage(fallback);
      setImageState("fallback");
      return;
    }
    setImageState("failed");
  };

  return (
    <div data-hero-entry-media className="absolute -inset-[2%] z-0 bg-[var(--color-image-placeholder)]">
      <div data-hero-scroll-media className="absolute inset-0">
        {imageState !== "failed" && (
          <Image
            key={activeImage.id}
            src={activeImage.src}
            alt={alt}
            fill
            sizes="100vw"
            priority
            loading="eager"
            fetchPriority="high"
            placeholder={activeImage.blurDataURL ? "blur" : "empty"}
            blurDataURL={activeImage.blurDataURL}
            className={`object-cover transition-opacity duration-300 ${simulationReady ? "opacity-100" : "opacity-0"}`}
            style={{
              objectPosition: heroImageConfig.objectPosition,
            }}
            onLoad={() => {
              setImageState((state) => state === "fallback" ? "fallback" : "loaded");
              refreshScrollTriggers();
            }}
            onError={handleError}
          />
        )}
      </div>
      <div data-hero-overlay aria-hidden="true" className="absolute inset-0 opacity-90 bg-[linear-gradient(180deg,rgba(8,8,8,0.48)_0%,rgba(8,8,8,0.16)_30%,rgba(8,8,8,0.45)_65%,rgba(8,8,8,0.92)_100%),linear-gradient(90deg,rgba(8,8,8,0.60)_0%,rgba(8,8,8,0.16)_70%)] sm:bg-[linear-gradient(180deg,rgba(8,8,8,0.45)_0%,rgba(8,8,8,0.16)_36%,rgba(8,8,8,0.72)_100%),linear-gradient(90deg,rgba(8,8,8,0.62)_0%,rgba(8,8,8,0.08)_72%)]" />
    </div>
  );
}
