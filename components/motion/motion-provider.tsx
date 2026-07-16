"use client";

import { useDeviceCapabilities } from "@/hooks/use-device-capabilities";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { lenisOptions } from "@/lib/motion/config";
import { gsap, registerMotionPlugins, ScrollTrigger } from "@/lib/motion/gsap";
import { ScrollLockManager } from "@/lib/motion/scroll-lock";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type MotionContextValue = {
  prefersReducedMotion: boolean;
  isTouchDevice: boolean;
  hasFinePointer: boolean;
  hasHover: boolean;
  isSmoothScrollEnabled: boolean;
  isScrollLocked: boolean;
  lockScroll: (source: string) => () => void;
  pauseScroll: (source?: string) => void;
  resumeScroll: (source?: string) => void;
  refreshScrollTriggers: () => void;
  scrollTo: (target: HTMLElement | string | number) => void;
  getActiveTriggerCount: () => number;
};

const MotionContext = createContext<MotionContextValue | null>(null);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const { isTouchDevice, hasFinePointer, hasHover } = useDeviceCapabilities();
  const [isSmoothScrollEnabled, setIsSmoothScrollEnabled] = useState(false);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const refreshFrameRef = useRef<number | null>(null);
  const lockManagerRef = useRef(new ScrollLockManager());

  const syncScrollLockAttribute = useCallback(() => {
    const locked = lockManagerRef.current.isLocked;
    setIsScrollLocked(locked);
    if (typeof document === "undefined") return;

    if (locked) document.documentElement.dataset.scrollLocked = "true";
    else delete document.documentElement.dataset.scrollLocked;
  }, []);

  const lockScroll = useCallback(
    (source: string) => {
      const release = lockManagerRef.current.lock(source);
      syncScrollLockAttribute();
      return () => {
        release();
        syncScrollLockAttribute();
      };
    },
    [syncScrollLockAttribute],
  );

  const pauseScroll = useCallback(
    (source = "manual") => {
      lockManagerRef.current.lock(source);
      syncScrollLockAttribute();
    },
    [syncScrollLockAttribute],
  );

  const resumeScroll = useCallback(
    (source = "manual") => {
      lockManagerRef.current.unlock(source);
      syncScrollLockAttribute();
    },
    [syncScrollLockAttribute],
  );

  const refreshScrollTriggers = useCallback(() => {
    if (typeof window === "undefined") return;
    if (refreshFrameRef.current !== null) {
      window.cancelAnimationFrame(refreshFrameRef.current);
    }
    refreshFrameRef.current = window.requestAnimationFrame(() => {
      lenisRef.current?.resize();
      ScrollTrigger.refresh();
      refreshFrameRef.current = null;
    });
  }, []);

  const scrollTo = useCallback(
    (target: HTMLElement | string | number) => {
      if (prefersReducedMotion || !lenisRef.current) {
        if (typeof target === "number") {
          window.scrollTo({ top: target, behavior: "auto" });
        } else {
          const element =
            typeof target === "string" ? document.querySelector(target) : target;
          element?.scrollIntoView({ behavior: "auto" });
        }
        return;
      }

      lenisRef.current.scrollTo(target, { offset: -80 });
    },
    [prefersReducedMotion],
  );

  useEffect(() => {
    registerMotionPlugins();
  }, []);

  useEffect(() => {
    const shouldEnable =
      !prefersReducedMotion && !isTouchDevice && hasFinePointer && hasHover;

    if (!shouldEnable) {
      setIsSmoothScrollEnabled(false);
      lockManagerRef.current.setController(null);
      return;
    }

    const lenis = new Lenis(lenisOptions);
    lenisRef.current = lenis;
    lockManagerRef.current.setController({
      pause: () => lenis.stop(),
      resume: () => lenis.start(),
    });
    const unsubscribe = lenis.on("scroll", ScrollTrigger.update);
    const updateLenis = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(updateLenis);
    setIsSmoothScrollEnabled(true);

    return () => {
      unsubscribe();
      gsap.ticker.remove(updateLenis);
      lockManagerRef.current.setController(null);
      lenis.destroy();
      lenisRef.current = null;
      setIsSmoothScrollEnabled(false);
    };
  }, [hasFinePointer, hasHover, isTouchDevice, prefersReducedMotion]);

  useEffect(() => {
    refreshScrollTriggers();
  }, [pathname, prefersReducedMotion, refreshScrollTriggers]);

  useEffect(() => {
    const handleLayoutChange = () => refreshScrollTriggers();
    window.addEventListener("orientationchange", handleLayoutChange);
    document.fonts?.ready.then(handleLayoutChange).catch(() => undefined);

    return () => {
      window.removeEventListener("orientationchange", handleLayoutChange);
      if (refreshFrameRef.current !== null) {
        window.cancelAnimationFrame(refreshFrameRef.current);
      }
    };
  }, [refreshScrollTriggers]);

  useEffect(
    () => () => {
      lockManagerRef.current.clear();
      delete document.documentElement.dataset.scrollLocked;
    },
    [],
  );

  const value = useMemo<MotionContextValue>(
    () => ({
      prefersReducedMotion,
      isTouchDevice,
      hasFinePointer,
      hasHover,
      isSmoothScrollEnabled,
      isScrollLocked,
      lockScroll,
      pauseScroll,
      resumeScroll,
      refreshScrollTriggers,
      scrollTo,
      getActiveTriggerCount: () => ScrollTrigger.getAll().length,
    }),
    [
      hasFinePointer,
      hasHover,
      isScrollLocked,
      isSmoothScrollEnabled,
      isTouchDevice,
      lockScroll,
      pauseScroll,
      prefersReducedMotion,
      refreshScrollTriggers,
      resumeScroll,
      scrollTo,
    ],
  );

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useMotion() {
  const context = useContext(MotionContext);
  if (!context) throw new Error("useMotion must be used inside MotionProvider");
  return context;
}
