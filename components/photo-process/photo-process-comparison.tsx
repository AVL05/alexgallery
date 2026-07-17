"use client";

import { PhotoFullscreenDialog } from "@/components/photo-detail/photo-fullscreen-dialog";
import {
  beginProcessPointer,
  finishProcessPointer,
  getPositionFromPointer,
  getProcessPositionForKey,
  moveProcessPointer,
  type ProcessPointerState,
} from "@/lib/photo-process/interaction";
import {
  areProcessRatiosCompatible,
  getLocalizedProcessAlt,
  getProcessAssetUrl,
  getProcessInitialPosition,
  getProcessPairs,
  getProcessStageLabel,
} from "@/lib/photo-process/selectors";
import type { Locale, PhotoProcessDictionary } from "@/types/dictionary";
import type { PhotoProcessAsset, PhotoProcessPair, ResolvedPhotoProcess } from "@/types/photo-process";
import { Expand, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type LoadState = "loading" | "ready" | "error";

function ProcessImage({ asset, locale, onLoad, onError, eager = false }: {
  asset: PhotoProcessAsset;
  locale: Locale;
  onLoad: () => void;
  onError: () => void;
  eager?: boolean;
}) {
  return <Image
    loader={({ width }) => getProcessAssetUrl(asset, width)}
    src={asset.src}
    alt={getLocalizedProcessAlt(asset, locale)}
    fill
    loading={eager ? "eager" : "lazy"}
    sizes="(max-width: 767px) 100vw, (max-width: 1279px) 82vw, 68vw"
    placeholder={asset.blurDataURL ? "blur" : undefined}
    blurDataURL={asset.blurDataURL}
    className="object-contain"
    onLoad={onLoad}
    onError={onError}
  />;
}

function StaticProcessFallback({ pair, locale, dictionary, message, assets }: {
  pair: PhotoProcessPair;
  locale: Locale;
  dictionary: PhotoProcessDictionary;
  message: string;
  assets?: PhotoProcessAsset[];
}) {
  const visibleAssets = assets || [pair.before, pair.after];
  return <div className="space-y-4" role="status">
    <p className="rv-meta text-[var(--color-warning)]">{message}</p>
    <div className="grid gap-4 md:grid-cols-2">
      {visibleAssets.map((asset) => <figure key={asset.src}>
        <div className="relative overflow-hidden border border-border bg-[var(--color-surface)]" style={{ aspectRatio: `${asset.width}/${asset.height}` }}>
          <ProcessImage asset={asset} locale={locale} onLoad={() => undefined} onError={() => undefined} />
        </div>
        <figcaption className="rv-meta mt-2">{getProcessStageLabel(asset.kind, dictionary)}</figcaption>
      </figure>)}
    </div>
  </div>;
}

function ComparisonCanvas({ pair, locale, dictionary, initialPosition, eager = false, debugDelayMs = 0 }: {
  pair: PhotoProcessPair;
  locale: Locale;
  dictionary: PhotoProcessDictionary;
  initialPosition: number;
  eager?: boolean;
  debugDelayMs?: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  const pointerRef = useRef<ProcessPointerState | null>(null);
  const timersRef = useRef<number[]>([]);
  const [beforeState, setBeforeState] = useState<LoadState>("loading");
  const [afterState, setAfterState] = useState<LoadState>("loading");

  useEffect(() => () => timersRef.current.forEach(window.clearTimeout), []);

  const settle = (callback: (value: LoadState) => void, state: LoadState) => {
    if (!debugDelayMs) return callback(state);
    const timer = window.setTimeout(() => callback(state), debugDelayMs);
    timersRef.current.push(timer);
  };

  const updatePosition = useCallback((value: number) => {
    const next = Math.min(100, Math.max(0, Math.round(value)));
    rootRef.current?.style.setProperty("--process-position", `${next}%`);
    if (rangeRef.current) {
      rangeRef.current.value = String(next);
      rangeRef.current.setAttribute("aria-valuetext", dictionary.position.replace("{value}", String(next)));
    }
  }, [dictionary.position]);

  if (!areProcessRatiosCompatible(pair.before, pair.after)) {
    return <StaticProcessFallback pair={pair} locale={locale} dictionary={dictionary} message={dictionary.incompatible} />;
  }

  const hasError = beforeState === "error" || afterState === "error";
  const ready = beforeState === "ready" && afterState === "ready";
  const errorMessage = beforeState === "error" ? dictionary.originalUnavailable : dictionary.finalUnavailable;

  if (hasError) return <StaticProcessFallback pair={pair} locale={locale} dictionary={dictionary} message={errorMessage} assets={beforeState === "error" ? [pair.after] : [pair.before]} />;

  return <div
    ref={rootRef}
    className="photo-process-comparison"
    style={{
      "--process-position": `${initialPosition}%`,
      aspectRatio: `${pair.after.width}/${pair.after.height}`,
      ...(eager ? { width: `min(94vw, calc((100dvh - 8rem) * ${pair.after.width / pair.after.height}))` } : {}),
    } as React.CSSProperties}
    data-ready={ready ? "true" : "false"}
  >
    <div className="absolute inset-0">
      <ProcessImage asset={pair.before} locale={locale} eager={eager} onLoad={() => settle(setBeforeState, "ready")} onError={() => settle(setBeforeState, "error")} />
    </div>
    <div className="photo-process-after absolute inset-0">
      <ProcessImage asset={pair.after} locale={locale} eager={eager} onLoad={() => settle(setAfterState, "ready")} onError={() => settle(setAfterState, "error")} />
    </div>
    <span className="photo-process-label left-3">{getProcessStageLabel(pair.before.kind, dictionary)}</span>
    <span className="photo-process-label right-3">{getProcessStageLabel(pair.after.kind, dictionary)}</span>
    <div className="photo-process-divider" aria-hidden="true"><span /></div>
    <input
      ref={rangeRef}
      className="photo-process-range"
      type="range"
      min="0"
      max="100"
      step="1"
      defaultValue={initialPosition}
      disabled={!ready}
      aria-label={dictionary.comparisonLabel}
      aria-valuetext={dictionary.position.replace("{value}", String(initialPosition))}
      onInput={(event) => updatePosition(Number(event.currentTarget.value))}
      onKeyDown={(event) => {
        const next = getProcessPositionForKey(event.key, Number(event.currentTarget.value));
        if (next === null) return;
        event.preventDefault();
        updatePosition(next);
      }}
      onPointerDown={(event) => {
        pointerRef.current = beginProcessPointer(event.pointerId, event.clientX, event.clientY);
      }}
      onPointerMove={(event) => {
        const pointer = pointerRef.current;
        if (!pointer || pointer.id !== event.pointerId) return;
        pointerRef.current = moveProcessPointer(pointer, event.pointerId, event.clientX, event.clientY);
        const nextPointer = pointerRef.current;
        if (nextPointer?.intent !== "horizontal") return;
        event.preventDefault();
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId);
        const bounds = rootRef.current?.getBoundingClientRect();
        if (bounds) updatePosition(getPositionFromPointer(event.clientX, bounds.left, bounds.width));
      }}
      onPointerUp={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        pointerRef.current = finishProcessPointer(pointerRef.current, event.pointerId);
      }}
      onPointerCancel={(event) => { pointerRef.current = finishProcessPointer(pointerRef.current, event.pointerId); }}
    />
    {!ready && <div className="absolute inset-0 z-20 grid place-items-center bg-black/45"><span className="rv-meta">{dictionary.loading}</span></div>}
  </div>;
}

export function PhotoProcessComparison({ process, locale, dictionary, debugDelayMs = 0 }: {
  process: ResolvedPhotoProcess;
  locale: Locale;
  dictionary: PhotoProcessDictionary;
  debugDelayMs?: number;
}) {
  const pairs = getProcessPairs(process);
  const initialPosition = getProcessInitialPosition(process);
  const [pairIndex, setPairIndex] = useState(0);
  const [canvasKey, setCanvasKey] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pair = pairs[Math.min(pairIndex, pairs.length - 1)];
  const reset = () => setCanvasKey((value) => value + 1);

  return <div className="space-y-5">
    {pairs.length > 1 && <div className="flex flex-wrap border-y border-border" role="tablist" aria-label={dictionary.steps}>
      {pairs.map((candidate, index) => <button key={candidate.id} type="button" role="tab" aria-selected={pairIndex === index} onClick={() => { setPairIndex(index); setCanvasKey((value) => value + 1); }} className="min-h-11 flex-1 border-r border-border px-4 py-3 text-left text-[10px] uppercase tracking-[0.12em] last:border-r-0 aria-selected:bg-[var(--color-surface-elevated)]">
        {candidate.id === "original-corrected" ? dictionary.originalCorrected : dictionary.correctedFinal}
      </button>)}
    </div>}
    <ComparisonCanvas key={`${pair.id}-${canvasKey}`} pair={pair} locale={locale} dictionary={dictionary} initialPosition={initialPosition} debugDelayMs={debugDelayMs} />
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="rv-meta">{dictionary.dragHelp} · {dictionary.keyboardHelp}</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={reset} className="rv-editorial-link"><RotateCcw aria-hidden="true" className="size-4" />{dictionary.reset}</button>
        <button ref={triggerRef} type="button" onClick={() => setFullscreen(true)} className="rv-editorial-link" aria-haspopup="dialog"><Expand aria-hidden="true" className="size-4" />{dictionary.openFullscreen}</button>
      </div>
    </div>
    <div className="sr-only">
      <p>{getProcessStageLabel(pair.before.kind, dictionary)}: {getLocalizedProcessAlt(pair.before, locale)}</p>
      <p>{getProcessStageLabel(pair.after.kind, dictionary)}: {getLocalizedProcessAlt(pair.after, locale)}</p>
    </div>
    <noscript><div className="grid gap-4 md:grid-cols-2">
      <figure><img src={pair.before.variants["800"]} alt={getLocalizedProcessAlt(pair.before, locale)} width={pair.before.width} height={pair.before.height} /><figcaption>{getProcessStageLabel(pair.before.kind, dictionary)}</figcaption></figure>
      <figure><img src={pair.after.variants["800"]} alt={getLocalizedProcessAlt(pair.after, locale)} width={pair.after.width} height={pair.after.height} /><figcaption>{getProcessStageLabel(pair.after.kind, dictionary)}</figcaption></figure>
    </div></noscript>
    <PhotoFullscreenDialog open={fullscreen} onClose={() => setFullscreen(false)} triggerRef={triggerRef} closeLabel={dictionary.close} lockSource="photo-process-fullscreen">
      <div className="grid h-full w-full place-items-center pt-16"><ComparisonCanvas pair={pair} locale={locale} dictionary={dictionary} initialPosition={initialPosition} eager /></div>
    </PhotoFullscreenDialog>
  </div>;
}

export { ComparisonCanvas, StaticProcessFallback };
