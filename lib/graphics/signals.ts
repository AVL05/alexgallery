export type PointerSample = { x: number; y: number; pointerType: string };
type Listener<T> = (value: T) => void;

let pointerSample: PointerSample = { x: 0, y: 0, pointerType: "unknown" };
let heroScrollProgress = 0;
const pointerListeners = new Set<Listener<PointerSample>>();
const scrollListeners = new Set<Listener<number>>();

export function publishPointerSample(sample: PointerSample) {
  pointerSample = sample;
  pointerListeners.forEach((listener) => listener(sample));
}

export function subscribePointerSample(listener: Listener<PointerSample>) {
  pointerListeners.add(listener);
  listener(pointerSample);
  return () => pointerListeners.delete(listener);
}

export function publishHeroScrollProgress(progress: number) {
  heroScrollProgress = Math.min(1, Math.max(0, progress));
  scrollListeners.forEach((listener) => listener(heroScrollProgress));
}

export function subscribeHeroScrollProgress(listener: Listener<number>) {
  scrollListeners.add(listener);
  listener(heroScrollProgress);
  return () => scrollListeners.delete(listener);
}

export function getGraphicsSignalSubscriberCounts() {
  return { pointer: pointerListeners.size, scroll: scrollListeners.size };
}

