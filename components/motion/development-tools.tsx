"use client";

import dynamic from "next/dynamic";

const MotionDebugPanel =
  process.env.NODE_ENV === "development"
    ? dynamic(
        () =>
          import("@/components/motion/motion-debug-panel").then(
            (module) => module.MotionDebugPanel,
          ),
        { ssr: false },
      )
    : () => null;

export function MotionDevelopmentTools() {
  if (process.env.NODE_ENV !== "development") return null;
  return <MotionDebugPanel />;
}
