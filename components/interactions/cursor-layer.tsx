"use client";

import { isFinePointerType, isKeyboardNavigationKey } from "@/lib/interactions/capabilities";
import { cursorConfig, getCursorSize } from "@/lib/interactions/config";
import {
  CURSOR_OVERRIDE_EVENT,
  INTERACTION_CONTROL_EVENT,
  INTERACTION_RESET_EVENT,
  publishInteractionState,
  type InteractionControlDetail,
  type CursorOverrideDetail,
} from "@/lib/interactions/development";
import { clampCursorPosition } from "@/lib/interactions/geometry";
import {
  resolveCursorTarget,
  shouldUseNativeCursor,
} from "@/lib/interactions/cursor-target";
import {
  CURSOR_GLOBAL_POINTER_LISTENERS,
  InteractionListenerRegistry,
} from "@/lib/interactions/listener-registry";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { publishPointerSample } from "@/lib/graphics/signals";
import type { CursorDictionary } from "@/types/dictionary";
import type {
  CursorContrast,
  CursorDebugSnapshot,
  CursorState,
  InputModality,
} from "@/types/cursor";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type CursorPresentation = {
  state: CursorState;
  label: string;
  contrast: CursorContrast;
};

type DebugOverrides = {
  disabled: boolean;
  simulateTouch: boolean;
  simulateReducedMotion: boolean;
  state?: CursorState;
  contrast?: CursorContrast;
};

const initialPresentation: CursorPresentation = {
  state: "default",
  label: "",
  contrast: "default",
};

export function CursorLayer({
  dictionary,
  eligible,
  overlayOpen,
  debug,
}: {
  dictionary: CursorDictionary;
  eligible: boolean;
  overlayOpen: boolean;
  debug: boolean;
}) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const surfaceRef = useRef<HTMLSpanElement>(null);
  const presentationRef = useRef(initialPresentation);
  const visibleRef = useRef(false);
  const modalityRef = useRef<InputModality>("unknown");
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const lastDebugPublishRef = useRef(0);
  const scrollFrameRef = useRef<number | null>(null);
  const debugRef = useRef<DebugOverrides>({
    disabled: !eligible,
    simulateTouch: false,
    simulateReducedMotion: false,
  });
  const overrideRef = useRef<CursorOverrideDetail>({ active: false });
  const [presentation, setPresentation] = useState(initialPresentation);

  const labels: Record<CursorState, string> = {
    default: "",
    view: dictionary.view,
    open: dictionary.open,
    drag: dictionary.drag,
    next: dictionary.next,
    previous: dictionary.previous,
    close: dictionary.close,
    fullscreen: dictionary.fullscreen,
    compare: dictionary.compare,
    explore: dictionary.explore,
  };

  useEffect(() => {
    debugRef.current.disabled = !eligible;
  }, [eligible]);

  useGSAP(() => {
    const root = rootRef.current;
    const dot = dotRef.current;
    const surface = surfaceRef.current;
    if (!root || !dot || !surface) return;

    const registry = new InteractionListenerRegistry();
    let initialized = false;
    let surfaceX: ReturnType<typeof gsap.quickTo> | null = null;
    let surfaceY: ReturnType<typeof gsap.quickTo> | null = null;
    let dotX: ReturnType<typeof gsap.quickSetter> | null = null;
    let dotY: ReturnType<typeof gsap.quickSetter> | null = null;

    const setVisible = (visible: boolean) => {
      if (visibleRef.current === visible) return;
      visibleRef.current = visible;
      gsap.set(root, { autoAlpha: visible ? 1 : 0 });
    };

    const setModality = (modality: InputModality) => {
      if (modalityRef.current === modality) return;
      modalityRef.current = modality;
      document.documentElement.dataset.inputModality = modality;
    };

    const restoreNativeCursor = () => {
      delete document.documentElement.dataset.customCursor;
      setVisible(false);
    };

    const updatePresentation = (next: CursorPresentation) => {
      const current = presentationRef.current;
      if (
        current.state === next.state
        && current.label === next.label
        && current.contrast === next.contrast
      ) return;
      presentationRef.current = next;
      setPresentation(next);
    };

    const resetPresentation = () => updatePresentation(initialPresentation);

    const getEffectivePresentation = (element: Element | null) => {
      const runtimeOverride = overrideRef.current;
      if (runtimeOverride.active && runtimeOverride.state) {
        return {
          state: runtimeOverride.state,
          label: runtimeOverride.hideLabel
            ? ""
            : runtimeOverride.label || labels[runtimeOverride.state],
          contrast: runtimeOverride.contrast || "default",
        } satisfies CursorPresentation;
      }
      const override = debugRef.current;
      if (override.state) {
        return {
          state: override.state,
          label: labels[override.state],
          contrast: override.contrast || "default",
        } satisfies CursorPresentation;
      }
      const target = resolveCursorTarget(element);
      if (!target) return initialPresentation;
      return {
        state: target.type,
        label: target.label || labels[target.type],
        contrast: target.contrast,
      } satisfies CursorPresentation;
    };

    const debugSnapshot = (): CursorDebugSnapshot => ({
      mounted: true,
      eligible,
      enabled: !debugRef.current.disabled,
      visible: visibleRef.current,
      modality: modalityRef.current,
      state: presentationRef.current.state,
      label: presentationRef.current.label,
      contrast: presentationRef.current.contrast,
      preview: null,
      globalPointerListeners: CURSOR_GLOBAL_POINTER_LISTENERS,
      magneticEnabled: cursorConfig.magnetic.enabled
        && !debugRef.current.simulateTouch
        && !debugRef.current.simulateReducedMotion,
      simulatedTouch: debugRef.current.simulateTouch,
      simulatedReducedMotion: debugRef.current.simulateReducedMotion,
      position: lastPositionRef.current,
      overlayOpen,
      route: pathname,
    });

    try {
      gsap.set([dot, surface], { xPercent: -50, yPercent: -50, force3D: true });
      gsap.set(root, { autoAlpha: 0 });
      dotX = gsap.quickSetter(dot, "x", "px");
      dotY = gsap.quickSetter(dot, "y", "px");
      surfaceX = gsap.quickTo(surface, "x", {
        duration: cursorConfig.followDuration,
        ease: cursorConfig.followEase,
      });
      surfaceY = gsap.quickTo(surface, "y", {
        duration: cursorConfig.followDuration,
        ease: cursorConfig.followEase,
      });
      initialized = true;
    } catch {
      restoreNativeCursor();
      return;
    }

    const handlePointerMove = (rawEvent: Event) => {
      const event = rawEvent as PointerEvent;
      lastPositionRef.current = { x: event.clientX, y: event.clientY };
      publishPointerSample({ x: event.clientX, y: event.clientY, pointerType: event.pointerType });
      if (
        !initialized
        || debugRef.current.disabled
        || debugRef.current.simulateTouch
        || debugRef.current.simulateReducedMotion
        || !isFinePointerType(event.pointerType)
      ) {
        setModality(event.pointerType === "touch" ? "touch" : "unknown");
        restoreNativeCursor();
        return;
      }

      setModality("pointer");
      document.documentElement.dataset.customCursor = "ready";
      const element = event.target instanceof Element ? event.target : null;
      const useNative = shouldUseNativeCursor(element);
      updatePresentation(getEffectivePresentation(element));

      const size = getCursorSize(presentationRef.current.state);
      const clamped = clampCursorPosition(
        event.clientX,
        event.clientY,
        window.innerWidth,
        window.innerHeight,
        size,
      );
      dotX?.(event.clientX);
      dotY?.(event.clientY);
      surfaceX?.(clamped.x);
      surfaceY?.(clamped.y);
      setVisible(!useNative);

      if (debug && performance.now() - lastDebugPublishRef.current > 180) {
        lastDebugPublishRef.current = performance.now();
        publishInteractionState(debugSnapshot());
      }
    };

    const handleKeyboard = (rawEvent: Event) => {
      const event = rawEvent as KeyboardEvent;
      if (!isKeyboardNavigationKey(event.key)) return;
      setModality("keyboard");
      restoreNativeCursor();
      resetPresentation();
    };

    const handleScroll = () => {
      if (!visibleRef.current || scrollFrameRef.current !== null) return;
      scrollFrameRef.current = window.requestAnimationFrame(() => {
        scrollFrameRef.current = null;
        const { x, y } = lastPositionRef.current;
        const element = document.elementFromPoint(x, y);
        if (!element || shouldUseNativeCursor(element)) {
          setVisible(false);
          return;
        }
        updatePresentation(getEffectivePresentation(element));
      });
    };

    const handleVisibility = () => {
      if (document.hidden) restoreNativeCursor();
    };

    const handleReset = () => {
      overrideRef.current = { active: false };
      debugRef.current.state = undefined;
      debugRef.current.contrast = undefined;
      resetPresentation();
      setVisible(false);
      if (debug) publishInteractionState(debugSnapshot());
    };

    const handleCursorOverride = (rawEvent: Event) => {
      overrideRef.current = (rawEvent as CustomEvent<CursorOverrideDetail>).detail;
      if (!overrideRef.current.active) {
        updatePresentation(getEffectivePresentation(document.elementFromPoint(
          lastPositionRef.current.x,
          lastPositionRef.current.y,
        )));
        return;
      }
      updatePresentation(getEffectivePresentation(null));
    };

    const handleControl = (rawEvent: Event) => {
      if (!debug) return;
      const detail = (rawEvent as CustomEvent<InteractionControlDetail>).detail;
      if (typeof detail.disabled === "boolean") debugRef.current.disabled = detail.disabled;
      if (typeof detail.simulateTouch === "boolean") debugRef.current.simulateTouch = detail.simulateTouch;
      if (typeof detail.simulateReducedMotion === "boolean") {
        debugRef.current.simulateReducedMotion = detail.simulateReducedMotion;
      }
      debugRef.current.state = detail.state;
      debugRef.current.contrast = detail.contrast;

      if (detail.edge) {
        const size = getCursorSize(detail.state || presentationRef.current.state);
        const edgePosition = detail.edge === "top-left"
          ? clampCursorPosition(0, 0, window.innerWidth, window.innerHeight, size)
          : clampCursorPosition(window.innerWidth, window.innerHeight, window.innerWidth, window.innerHeight, size);
        dotX?.(edgePosition.x);
        dotY?.(edgePosition.y);
        surfaceX?.(edgePosition.x);
        surfaceY?.(edgePosition.y);
        lastPositionRef.current = edgePosition;
      }

      if (debugRef.current.disabled || debugRef.current.simulateTouch || debugRef.current.simulateReducedMotion) {
        restoreNativeCursor();
      } else {
        document.documentElement.dataset.customCursor = "ready";
        updatePresentation({
          state: detail.state || presentationRef.current.state,
          label: labels[detail.state || presentationRef.current.state],
          contrast: detail.contrast || presentationRef.current.contrast,
        });
        setVisible(true);
      }
      publishInteractionState(debugSnapshot());
    };

    registry.add(window, "pointermove", handlePointerMove as EventListener, { passive: true });
    registry.add(window, "scroll", handleScroll, { passive: true, capture: true });
    registry.add(window, "keydown", handleKeyboard);
    registry.add(window, "blur", restoreNativeCursor);
    registry.add(document, "visibilitychange", handleVisibility);
    registry.add(window, INTERACTION_RESET_EVENT, handleReset);
    registry.add(window, CURSOR_OVERRIDE_EVENT, handleCursorOverride);
    registry.add(window, INTERACTION_CONTROL_EVENT, handleControl);

    if (debug) publishInteractionState(debugSnapshot());

    return () => {
      registry.clear();
      if (scrollFrameRef.current !== null) window.cancelAnimationFrame(scrollFrameRef.current);
      restoreNativeCursor();
      delete document.documentElement.dataset.inputModality;
    };
  }, {
    dependencies: [debug, dictionary, eligible, overlayOpen, pathname],
    scope: rootRef,
    revertOnUpdate: true,
  });

  useEffect(() => {
    resetContextOnRoute();
  }, [overlayOpen, pathname]);

  return (
    <div
      ref={rootRef}
      data-custom-cursor
      data-state={presentation.state}
      data-contrast={presentation.contrast}
      aria-hidden="true"
      className="rv-cursor"
    >
      <span ref={surfaceRef} className="rv-cursor__surface">
        <span className="rv-cursor__label">{presentation.label}</span>
      </span>
      <span ref={dotRef} className="rv-cursor__dot" />
    </div>
  );
}

function resetContextOnRoute() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(INTERACTION_RESET_EVENT));
}
