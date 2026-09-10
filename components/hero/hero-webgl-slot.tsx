"use client";

import { HeroFramesScene } from "@/components/graphics/hero-frames-scene";

// Reserved layer for 3D between photography and scrims. Hosts the cinematic
// hero-frames composition; removing it leaves the photographic hero intact.
export function HeroWebglSlot({ entryReady }: { entryReady: boolean }) {
  return (
    <div data-hero-webgl aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]">
      <HeroFramesScene entryReady={entryReady} />
    </div>
  );
}
