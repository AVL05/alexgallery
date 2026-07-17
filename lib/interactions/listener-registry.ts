export const CURSOR_GLOBAL_POINTER_LISTENERS = 1;

type EventTargetLike = Pick<EventTarget, "addEventListener" | "removeEventListener">;

export class InteractionListenerRegistry {
  private cleanups: Array<() => void> = [];

  add(
    target: EventTargetLike,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions | boolean,
  ) {
    target.addEventListener(type, listener, options);
    this.cleanups.push(() => target.removeEventListener(type, listener, options));
  }

  clear() {
    for (const cleanup of this.cleanups.splice(0)) cleanup();
  }

  get count() {
    return this.cleanups.length;
  }
}

