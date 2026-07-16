import { INTRO_STORAGE_KEY } from "@/lib/intro/constants";

export type SessionStorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export type IntroSessionState = {
  available: boolean;
  seen: boolean;
};

export function readIntroSession(
  storage: SessionStorageLike | null | undefined,
): IntroSessionState {
  if (!storage) return { available: false, seen: false };

  try {
    return {
      available: true,
      seen: storage.getItem(INTRO_STORAGE_KEY) === "1",
    };
  } catch {
    return { available: false, seen: false };
  }
}

export function markIntroSeen(storage: SessionStorageLike | null | undefined) {
  if (!storage) return false;

  try {
    storage.setItem(INTRO_STORAGE_KEY, "1");
    return true;
  } catch {
    return false;
  }
}

export function resetIntroSession(storage: SessionStorageLike | null | undefined) {
  if (!storage) return false;

  try {
    storage.removeItem(INTRO_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function shouldShowIntro({
  isHome,
  prefersReducedMotion,
  session,
  isAutomated,
  timedOut = false,
  force = false,
}: {
  isHome: boolean;
  prefersReducedMotion: boolean;
  session: IntroSessionState;
  isAutomated: boolean;
  timedOut?: boolean;
  force?: boolean;
}) {
  if (force) return isHome;

  return (
    isHome &&
    !prefersReducedMotion &&
    !timedOut &&
    session.available &&
    !session.seen &&
    !isAutomated
  );
}

export function getBrowserSessionStorage(): Storage | null {
  if (typeof window === "undefined") return null;

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}
