"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { readQualitySignals, resolveHeroQuality } from "@/lib/graphics/quality";

const HeroFramesScene = dynamic(
  () => import("@/components/graphics/hero-frames-scene").then((module) => module.HeroFramesScene),
  { ssr: false },
);

// Reserved layer for 3D between photography and scrims. The scene chunk
// (three.js) only downloads after hydration for non-off tiers and mounts once
// the hero entry settles; removing it leaves the photographic hero intact.
export function HeroWebglSlot({ entryReady }: { entryReady: boolean }) {
  const [sceneAllowed, setSceneAllowed] = useState(false);

  useEffect(() => {
    // Sync quality gate runs before any 3D code loads: off-tier devices
    // never download three.js or the GLB.
    setSceneAllowed(resolveHeroQuality(readQualitySignals()).tier !== "off");
  }, []);

  return (
    <div data-hero-webgl aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]">
      {sceneAllowed && entryReady ? <HeroFramesScene entryReady={entryReady} /> : null}
    </div>
  );
}
