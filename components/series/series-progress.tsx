"use client";

import { useEffect, useRef } from "react";

export function SeriesProgress({ total, label }: { total: number; label: string }) {
  const valueRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-series-photo]"));
    if (!items.length || !valueRef.current) return;
    const visible = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visible.set(entry.target, entry.intersectionRatio));
        const active = [...visible.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] as HTMLElement | undefined;
        if (!active || !valueRef.current) return;
        const index = Number(active.dataset.seriesIndex || 1);
        valueRef.current.textContent = `${String(index).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
      },
      { rootMargin: "-28% 0px -54%", threshold: [0, 0.2, 0.5, 0.8] },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [total]);

  return (
    <aside className="pointer-events-none sticky top-[calc(var(--layout-nav-height)+1rem)] z-20 ml-auto hidden w-fit border border-border bg-background/90 px-3 py-2 backdrop-blur-sm sm:block">
      <span className="sr-only">{label}</span>
      <span ref={valueRef} className="rv-index" aria-hidden="true">01 / {String(total).padStart(2, "0")}</span>
    </aside>
  );
}
