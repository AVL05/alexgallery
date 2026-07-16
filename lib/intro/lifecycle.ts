export type TimerApi = Pick<typeof globalThis, "setTimeout" | "clearTimeout">;

export function createIntroSafetyTimer(
  callback: () => void,
  delayMs: number,
  timerApi: TimerApi = globalThis,
) {
  const timer = timerApi.setTimeout(callback, delayMs);
  return () => timerApi.clearTimeout(timer);
}
