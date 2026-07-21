"use client";

import { useMotion } from "@/components/motion/motion-provider";
import { usePhotoMotionRuntime } from "@/hooks/use-photo-motion-runtime";
import {
  getPhotoViewTransitionName,
  preparePhotoTransition,
  shouldEnhancePhotoNavigation,
} from "@/lib/motion/photo-motion";
import Link from "next/link";
import { useRef } from "react";

type PhotoTransitionLinkProps = Omit<React.ComponentProps<typeof Link>, "href" | "onNavigate"> & {
  href: string;
  photoId: number;
  onBeforeNavigate?: () => void;
};

export function PhotoTransitionLink({
  photoId,
  href,
  onBeforeNavigate,
  children,
  ...props
}: PhotoTransitionLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const { prefersReducedMotion } = useMotion();
  const runtime = usePhotoMotionRuntime();

  return (
    <Link
      ref={linkRef}
      href={href}
      data-photo-transition={photoId}
      onClick={(event) => {
        const apiAvailable = typeof document.startViewTransition === "function";
        const normalNavigation = shouldEnhancePhotoNavigation({
          reducedMotion: false,
          enabled: true,
          apiAvailable: true,
          ctrlKey: event.ctrlKey,
          metaKey: event.metaKey,
          shiftKey: event.shiftKey,
          altKey: event.altKey,
          button: event.button,
          target: linkRef.current?.target,
        });
        if (normalNavigation) onBeforeNavigate?.();
        const shouldEnhance = shouldEnhancePhotoNavigation({
          reducedMotion: prefersReducedMotion,
          enabled: runtime.enabled && runtime.viewTransitions,
          apiAvailable,
          ctrlKey: event.ctrlKey,
          metaKey: event.metaKey,
          shiftKey: event.shiftKey,
          altKey: event.altKey,
          button: event.button,
          target: linkRef.current?.target,
        });
        if (!shouldEnhance) return;

        event.preventDefault();
        const activeLink = linkRef.current;
        document.querySelectorAll<HTMLElement>("[data-photo-transition]").forEach((item) => {
          item.style.viewTransitionName = "none";
        });
        if (activeLink) activeLink.style.viewTransitionName = getPhotoViewTransitionName(photoId);
        preparePhotoTransition(photoId);
        window.location.assign(href);
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
