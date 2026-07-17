let activeGraphicsContexts = 0;
const pendingContextLoss = new WeakMap<HTMLCanvasElement, ReturnType<typeof setTimeout>>();

export function registerGraphicsContext() {
  activeGraphicsContexts += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    activeGraphicsContexts = Math.max(0, activeGraphicsContexts - 1);
  };
}

export function getActiveGraphicsContextCount() {
  return activeGraphicsContexts;
}

export function cancelScheduledContextLoss(canvas: HTMLCanvasElement) {
  const timer = pendingContextLoss.get(canvas);
  if (timer === undefined) return false;
  clearTimeout(timer);
  pendingContextLoss.delete(canvas);
  return true;
}

export function scheduleContextLoss(
  canvas: HTMLCanvasElement,
  renderer: { forceContextLoss: () => void },
) {
  cancelScheduledContextLoss(canvas);
  const timer = setTimeout(() => {
    pendingContextLoss.delete(canvas);
    renderer.forceContextLoss();
  }, 0);
  pendingContextLoss.set(canvas, timer);
}
