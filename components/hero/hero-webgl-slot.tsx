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
    const conditions = [
      window.matchMedia("(min-width: 768px)"),
      window.matchMedia("(prefers-reduced-motion: reduce)"),
      window.matchMedia("(forced-colors: active)"),
    ];
    const update = () => setSceneAllowed(conditions[0].matches && !conditions[1].matches && !conditions[2].matches && resolveHeroQuality(readQualitySignals()).tier !== "off");
    update();
    conditions.forEach((condition) => condition.addEventListener("change", update));
    return () => conditions.forEach((condition) => condition.removeEventListener("change", update));
  }, []);

  return (
    <div data-hero-webgl aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] opacity-30">
      {sceneAllowed && entryReady ? <HeroFramesScene entryReady={entryReady} /> : null}
    </div>
  );
}
