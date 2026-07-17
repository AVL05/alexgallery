"use client";

import { PhotoProcessComparison } from "@/components/photo-process/photo-process-comparison";
import type { Locale, PhotoProcessDictionary } from "@/types/dictionary";
import type { PhotoProcessAsset, ResolvedPhotoProcess } from "@/types/photo-process";
import { useEffect, useMemo, useState } from "react";

type Scenario = "two" | "three" | "vertical" | "square" | "missing-original" | "missing-final" | "incompatible" | "slow";

const dimensions: Record<number, [number, number]> = {
  4: [649, 649], 7: [1000, 1500], 11: [564, 564], 13: [1000, 1500],
  19: [1024, 683], 21: [1024, 683], 31: [1024, 683],
};

function fixtureAsset(id: number, kind: PhotoProcessAsset["kind"], missing = false): PhotoProcessAsset {
  const [width, height] = dimensions[id] || [1024, 683];
  const name = missing ? `missing-${id}` : String(id);
  return {
    src: `/photos/optimized/original/${name}.webp`,
    variants: {
      "400": `/photos/optimized/400/${name}.webp`,
      "800": `/photos/optimized/800/${name}.webp`,
      "1200": `/photos/optimized/1200/${name}.webp`,
    },
    width,
    height,
    kind,
    alt: { es: "Recurso de prueba interna, no representa un proceso real.", en: "Internal test asset; it does not represent a real editing process." },
  };
}

function fixtureProcess(scenario: Scenario): ResolvedPhotoProcess {
  if (scenario === "vertical") return { photoId: 13, original: fixtureAsset(7, "camera-original"), final: fixtureAsset(13, "final") };
  if (scenario === "square") return { photoId: 11, original: fixtureAsset(4, "camera-original"), final: fixtureAsset(11, "final") };
  if (scenario === "incompatible") return { photoId: 21, original: fixtureAsset(13, "camera-original"), final: fixtureAsset(21, "final") };
  if (scenario === "missing-original") return { photoId: 21, original: fixtureAsset(19, "camera-original", true), final: fixtureAsset(21, "final") };
  if (scenario === "missing-final") return { photoId: 21, original: fixtureAsset(19, "camera-original"), final: fixtureAsset(21, "final", true) };
  if (scenario === "three") return { photoId: 21, original: fixtureAsset(19, "camera-original"), corrected: fixtureAsset(31, "technical-correction"), final: fixtureAsset(21, "final") };
  return { photoId: 21, original: fixtureAsset(19, "camera-original"), final: fixtureAsset(21, "final"), initialPosition: 50 };
}

export function PhotoProcessDebugPanel({ locale, dictionary }: { locale: Locale; dictionary: PhotoProcessDictionary }) {
  const [visible, setVisible] = useState(false);
  const [scenario, setScenario] = useState<Scenario>("two");
  useEffect(() => setVisible(new URLSearchParams(window.location.search).get("process-debug") === "1"), []);
  const fixture = useMemo(() => fixtureProcess(scenario), [scenario]);
  if (!visible || process.env.NODE_ENV !== "development") return null;
  return <aside className="fixed inset-3 z-[80] overflow-y-auto border border-border bg-[var(--color-background)] p-4 sm:inset-6 sm:p-6" aria-label="Creative process development reference">
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
      <div><p className="rv-kicker">Development only</p><h2 className="rv-card-title mt-2">Creative process interaction fixture</h2><p className="rv-meta mt-2">Not production content · no editing provenance is claimed</p></div>
      <label className="rv-label">Scenario<select value={scenario} onChange={(event) => setScenario(event.target.value as Scenario)} className="ml-3 min-h-11 border border-border bg-[var(--color-surface)] px-3 text-foreground">
        <option value="two">Original + final</option><option value="three">Three stages</option><option value="vertical">Vertical</option><option value="square">Square</option><option value="missing-original">Original error</option><option value="missing-final">Final error</option><option value="incompatible">Incompatible ratios</option><option value="slow">Slow readiness</option>
      </select></label>
    </header>
    <div className="mx-auto max-w-6xl"><PhotoProcessComparison key={scenario} process={fixture} locale={locale} dictionary={dictionary} debugDelayMs={scenario === "slow" ? 1600 : 0} /></div>
  </aside>;
}
