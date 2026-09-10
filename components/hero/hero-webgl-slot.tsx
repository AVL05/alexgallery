"use client";

import { HeroGraphicsBootstrap } from "@/components/graphics/hero-graphics-bootstrap";
import type { OptimizedImageData } from "@/types/photo";

// Reserved layer for the future 3D scene, between photography and scrims.
// Renders the current WebGL effect while capable and nothing otherwise, so
// the hero never depends on it. Removing or replacing this slot leaves the
// composition intact.
export function HeroWebglSlot({
  image,
  imageReady,
  entryReady,
}: {
  image: OptimizedImageData;
  imageReady: boolean;
  entryReady: boolean;
}) {
  return (
    <div data-hero-webgl aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]">
      <HeroGraphicsBootstrap image={image} imageReady={imageReady} entryReady={entryReady} />
    </div>
  );
}
