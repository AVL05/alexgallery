"use client";

import { useMotion } from "@/components/motion/motion-provider";
import type { OptimizedImageData } from "@/types/photo";
import Image from "next/image";
import { useEffect, useLayoutEffect, useState } from "react";

export type HeroImageState = "loading" | "loaded" | "fallback" | "failed";

// Keep the complete photograph visible inside its frame, including the signature.
export function HeroMedia({
  primary,
  fallback,
  alt,
  errorLabel,
  slowImage,
  failImage,
  onStateChange,
}: {
  primary: OptimizedImageData;
  fallback: OptimizedImageData;
  alt: string;
  errorLabel: string;
  slowImage: boolean;
  failImage: boolean;
  onStateChange: (state: HeroImageState) => void;
}) {
  const { refreshScrollTriggers } = useMotion();
  const [activeImage, setActiveImage] = useState(primary);
  const [imageState, setImageState] = useState<HeroImageState>("loading");
  const [simulationReady, setSimulationReady] = useState(!slowImage);

  useLayoutEffect(() => {
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

  useLayoutEffect(() => {
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
    <div data-hero-entry-media className="absolute inset-0 bg-background">
      {imageState === "failed" ? <p role="status" className="rv-meta absolute inset-0 grid place-items-center px-6 text-center">{errorLabel}</p> : (
        <Image
          key={activeImage.id}
          src={activeImage.src}
          alt={alt}
          fill
          sizes="(max-width: 767px) 100vw, 92vw"
          priority
          loading="eager"
          fetchPriority="high"
          placeholder={activeImage.blurDataURL ? "blur" : "empty"}
          blurDataURL={activeImage.blurDataURL}
          className={`object-contain transition-opacity duration-300 ${simulationReady ? "opacity-100" : "opacity-0"}`}
          onLoad={() => {
            setImageState((state) => state === "fallback" ? "fallback" : "loaded");
            refreshScrollTriggers();
          }}
          onError={handleError}
        />
      )}
    </div>
  );
}
