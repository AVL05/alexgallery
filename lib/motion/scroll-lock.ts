export type ScrollController = {
  pause: () => void;
  resume: () => void;
};

export class ScrollLockManager {
  private locks = new Set<string>();
  private controller: ScrollController | null = null;

  setController(controller: ScrollController | null) {
    this.controller = controller;
    if (this.isLocked) this.controller?.pause();
  }

  lock(source: string) {
    const wasLocked = this.isLocked;
    this.locks.add(source);
    if (!wasLocked) this.controller?.pause();

    return () => this.unlock(source);
  }

  unlock(source: string) {
    const wasLocked = this.isLocked;
    this.locks.delete(source);
    if (wasLocked && !this.isLocked) this.controller?.resume();
  }

  clear() {
    const wasLocked = this.isLocked;
    this.locks.clear();
    if (wasLocked) this.controller?.resume();
  }

  get isLocked() {
    return this.locks.size > 0;
  }

  get count() {
    return this.locks.size;
  }
}
