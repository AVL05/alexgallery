"use client";

import { useMotion } from "@/components/motion/motion-provider";
import { shouldEnableCursor } from "@/lib/interactions/capabilities";
import { cursorConfig } from "@/lib/interactions/config";
import type { CursorDictionary } from "@/types/dictionary";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CursorLayer = dynamic(
  () => import("@/components/interactions/cursor-layer").then((module) => module.CursorLayer),
  { ssr: false, loading: () => null },
);

export function InteractionBootstrap({ dictionary }: { dictionary: CursorDictionary }) {
  const { hasFinePointer, hasHover, prefersReducedMotion, forcedColors, isScrollLocked } = useMotion();
  const [clientDecision, setClientDecision] = useState<{
    checked: boolean;
    debug: boolean;
    userPrefersNative: boolean;
  }>({ checked: false, debug: false, userPrefersNative: false });

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    setClientDecision({
      checked: true,
      debug: process.env.NODE_ENV === "development" && search.get(cursorConfig.debugQuery) === "1",
      userPrefersNative: search.get(cursorConfig.disableQuery) === "1",
    });
  }, []);

  const eligible = shouldEnableCursor({
    enabled: cursorConfig.enabled,
    hasFinePointer,
    hasHover,
    prefersReducedMotion,
    userPrefersNative: clientDecision.userPrefersNative,
    forcedColors,
  });

  if (!clientDecision.checked || (!eligible && !clientDecision.debug)) return null;

  return (
    <CursorLayer
      dictionary={dictionary}
      eligible={eligible}
      overlayOpen={isScrollLocked}
      debug={clientDecision.debug}
    />
  );
}
