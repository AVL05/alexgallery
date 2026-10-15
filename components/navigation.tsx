"use client";

import { Container } from "@/components/ui/layout";
import { useMotion } from "@/components/motion/motion-provider";
import { motionDistance, motionDuration, motionEase, motionStagger } from "@/lib/motion/config";
import { accessibleDistance, accessibleDuration, accessibleStagger } from "@/lib/motion/accessible";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import type { Locale, NavDictionary } from "@/types/dictionary";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocationSnapshot } from "@/hooks/use-location-snapshot";
import { Magnetic } from "@/components/interactions/magnetic";
import { getCursorTargetAttributes } from "@/lib/interactions/cursor-target";
import { buildLocaleHref } from "@/lib/i18n/locale-routing";
import { saveLocalePreference } from "@/lib/i18n/locale-cookie.client";
import { getPrimaryNavItems, isNavItemActive } from "@/lib/navigation";
import { instagramUrl } from "@/lib/site-config";

function LocaleSwitch({
  currentLocale,
  alternateLocale,
  alternateHref,
  alternateLocaleLabel,
  variant,
  onNavigate,
}: {
  currentLocale: Locale;
  alternateLocale: Locale;
  alternateHref: string;
  alternateLocaleLabel: string;
  variant: "header" | "menu";
  onNavigate?: () => void;
}) {
  if (variant === "menu") {
    return (
      <div className="flex items-center gap-1">
        <span
          aria-current="page"
          className="inline-flex size-11 items-center justify-center font-mono text-xs text-accent"
        >
          {currentLocale.toUpperCase()}
        </span>
        <Link
          href={alternateHref}
          onClick={() => {
            saveLocalePreference(alternateLocale);
            onNavigate?.();
          }}
          hrefLang={alternateLocale}
          lang={alternateLocale}
          data-press-feedback
          aria-label={alternateLocaleLabel}
          className="inline-flex size-11 items-center justify-center border border-border font-mono text-xs text-foreground"
        >
          {alternateLocale.toUpperCase()}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center border-l border-border pl-4">
      <span
        aria-current="page"
        className="inline-flex size-11 items-center justify-center font-mono text-[10px] text-accent"
      >
        {currentLocale.toUpperCase()}
      </span>
      <Link
        href={alternateHref}
        onClick={() => saveLocalePreference(alternateLocale)}
        hrefLang={alternateLocale}
        lang={alternateLocale}
        data-press-feedback
        className="inline-flex size-11 items-center justify-center font-mono text-[10px] text-[var(--color-text-muted)] transition-colors hover:text-foreground"
        aria-label={alternateLocaleLabel}
      >
        {alternateLocale.toUpperCase()}
      </Link>
    </div>
  );
}

export function Navigation({
  dictionary,
  currentLocale,
  isHome = true,
  currentPath,
}: {
  dictionary: NavDictionary;
  currentLocale: Locale;
  isHome?: boolean;
  currentPath?: string;
}) {
  const pathname = currentPath || `/${currentLocale}`;
  const items = getPrimaryNavItems(currentLocale, dictionary, isHome);
  const alternateLocale: Locale = currentLocale === "es" ? "en" : "es";
  const locationSnapshot = useLocationSnapshot();
  const alternateHref = buildLocaleHref(
    locationSnapshot.pathname,
    locationSnapshot.search,
    locationSnapshot.hash,
    alternateLocale,
    pathname,
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMenuMounted, setIsMobileMenuMounted] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const scrolledRef = useRef(false);
  const { prefersReducedMotion, lockScroll } = useMotion();
  const openMenuLabel = dictionary.menu;
  const closeMenuLabel = dictionary.close;
  const archiveName = currentLocale === "es" ? "Archivo visual" : "Visual Archive";
  const archiveByline = currentLocale === "es" ? "Archivo visual de Alex Vicente" : "Visual Archive by Alex Vicente";
  const alternateLocaleLabel = currentLocale === "es" ? "Ver en inglés" : "View in Spanish";
  const externalNote =
    currentLocale === "es" ? "(abre en una pestaña nueva)" : "(opens in a new tab)";
  const navigationLabel =
    currentLocale === "es" ? "Navegación principal" : "Primary navigation";

  const finishClosingMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    setIsMobileMenuMounted(false);
    window.requestAnimationFrame(() => mobileToggleRef.current?.focus());
  }, []);

  const closeMobileMenu = useCallback(() => {
    if (!mobileMenuRef.current) {
      finishClosingMenu();
      return;
    }

    gsap.to(mobileMenuRef.current, {
      opacity: 0,
      y: -accessibleDistance(prefersReducedMotion, motionDistance.compact),
      duration: accessibleDuration(prefersReducedMotion, motionDuration.fast),
      ease: motionEase.exit,
      onComplete: finishClosingMenu,
    });
  }, [finishClosingMenu, prefersReducedMotion]);

  const openMobileMenu = () => {
    setIsMobileMenuMounted(true);
    setIsMobileMenuOpen(true);
  };

  useGSAP(
    () => {
      if (!headerRef.current) return;
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -accessibleDistance(prefersReducedMotion, motionDistance.compact) },
        {
          opacity: 1,
          y: 0,
          duration: accessibleDuration(prefersReducedMotion, motionDuration.normal),
          ease: motionEase.enter,
          clearProps: "opacity,transform",
        },
      );
    },
    { dependencies: [prefersReducedMotion], scope: headerRef, revertOnUpdate: true },
  );

  useGSAP(
    () => {
      if (!isMobileMenuOpen || !mobileMenuRef.current) return;
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0, y: -accessibleDistance(prefersReducedMotion, motionDistance.compact) },
        {
          opacity: 1,
          y: 0,
          duration: accessibleDuration(prefersReducedMotion, motionDuration.normal),
          ease: motionEase.enter,
        },
      );
      const links = mobileMenuRef.current.querySelectorAll("[data-mobile-nav-link]");
      if (links.length > 0) {
        gsap.fromTo(
          links,
          { opacity: 0, y: accessibleDistance(prefersReducedMotion, motionDistance.label) },
          {
            opacity: 1,
            y: 0,
            duration: accessibleDuration(prefersReducedMotion, motionDuration.fast),
            ease: motionEase.enter,
            stagger: accessibleStagger(prefersReducedMotion, motionStagger.tight),
          },
        );
      }
    },
    { dependencies: [isMobileMenuOpen, prefersReducedMotion], scope: mobileMenuRef, revertOnUpdate: true },
  );

  useEffect(() => {
    const updateScrollState = () => {
      scrollFrameRef.current = null;
      const next = window.scrollY > 32;
      if (next === scrolledRef.current) return;
      scrolledRef.current = next;
      setIsScrolled(next);
    };
    const handleScroll = () => {
      if (scrollFrameRef.current === null) {
        scrollFrameRef.current = window.requestAnimationFrame(updateScrollState);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollFrameRef.current !== null) window.cancelAnimationFrame(scrollFrameRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isMobileMenuMounted) return;
    return lockScroll("mobile-navigation");
  }, [isMobileMenuMounted, lockScroll]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const menu = mobileMenuRef.current;
    if (!menu) return;

    const focusable = Array.from(
      menu.querySelectorAll<HTMLElement>(
        'a[href], button, [tabindex]:not([tabindex="-1"])',
      ),
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const focusFrame = window.requestAnimationFrame(() => first?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileMenu();
        return;
      }
      if (event.key !== "Tab" || focusable.length === 0) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMobileMenu, isMobileMenuOpen]);

  return (
    <>
      <a
        href="#main-content"
        onClick={() => document.getElementById("main-content")?.focus()}
        className="fixed left-4 top-4 z-[var(--z-modal)] -translate-y-24 bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground transition-transform focus:translate-y-0"
      >
        {dictionary.skipToContent}
      </a>
      <header
        ref={headerRef}
        inert={isMobileMenuMounted}
        className={`fixed inset-x-0 top-0 z-[var(--z-nav)] border-b transition-[background-color,border-color] duration-300 ${
          isScrolled || !isHome
            ? "border-border bg-background/92 backdrop-blur-md"
            : "border-transparent bg-gradient-to-b from-black/55 to-transparent"
        }`}
      >
        <Container className="flex h-[var(--layout-nav-height)] items-center justify-between gap-8">
          <Link
            href={`/${currentLocale}`}
            className="inline-flex min-h-11 shrink-0 items-center"
            aria-label={`raw.vives — ${archiveName}`}
          >
            <span className="font-serif text-xl leading-none tracking-[-0.025em] text-foreground transition-colors hover:text-accent sm:text-2xl">
              raw.vives
            </span>
          </Link>

          <nav aria-label={navigationLabel} className="hidden items-center gap-8 lg:flex">
            {items.map((item) => {
              const active = isNavItemActive(item, pathname);
              const isRoute = !item.href.startsWith("#");
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={active && isRoute ? "page" : undefined}
                  data-press-feedback
                  className={`inline-flex min-h-11 items-center text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                    active
                      ? "text-foreground"
                      : "text-[var(--color-text-secondary)] hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              data-press-feedback
              className="inline-flex min-h-11 items-center text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)] transition-colors hover:text-foreground"
            >
              Instagram
              <span className="sr-only"> {externalNote}</span>
            </a>
            <LocaleSwitch
              currentLocale={currentLocale}
              alternateLocale={alternateLocale}
              alternateHref={alternateHref}
              alternateLocaleLabel={alternateLocaleLabel}
              variant="header"
            />
          </nav>

          <Magnetic>
            <button
              ref={mobileToggleRef}
              type="button"
              className="inline-flex min-h-11 items-center text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground lg:hidden"
              onClick={isMobileMenuOpen ? closeMobileMenu : openMobileMenu}
              aria-label={isMobileMenuOpen ? closeMenuLabel : openMenuLabel}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              data-press-feedback
              {...getCursorTargetAttributes({ type: isMobileMenuOpen ? "close" : "open" })}
            >
              <span data-magnetic-content>
                {isMobileMenuOpen ? closeMenuLabel : openMenuLabel}
              </span>
            </button>
          </Magnetic>
        </Container>
      </header>

      {isMobileMenuMounted && (
      <div
        ref={mobileMenuRef}
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label={navigationLabel}
        className="fixed inset-0 z-[110] bg-background lg:hidden"
      >
        <Container className="flex min-h-[100svh] flex-col pb-8 pt-4">
          <div className="flex h-16 items-center justify-between">
            <span className="font-serif text-xl tracking-[-0.025em] text-foreground">
              raw.vives
            </span>
            <Magnetic>
              <button
                autoFocus
                type="button"
                className="inline-flex min-h-11 items-center text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground"
                onClick={closeMobileMenu}
                aria-label={closeMenuLabel}
                data-press-feedback
                {...getCursorTargetAttributes({ type: "close", contrast: "dark" })}
              >
                <span data-magnetic-content>{closeMenuLabel}</span>
              </button>
            </Magnetic>
          </div>

          <nav className="mt-8 flex flex-col" aria-label={navigationLabel}>
            {items.map((item, index) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={closeMobileMenu}
                data-press-feedback
                data-mobile-nav-link
                className="group flex min-h-16 items-center justify-between border-b border-border py-4"
              >
                <span className="font-serif text-[clamp(1.8rem,9vw,3.25rem)] leading-none text-foreground transition-colors group-hover:text-accent">
                  {item.label}
                </span>
                <span className="rv-index">{String(index + 1).padStart(2, "0")}</span>
              </Link>
            ))}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              data-press-feedback
              data-mobile-nav-link
              className="group flex min-h-16 items-center justify-between border-b border-border py-4"
            >
              <span className="font-serif text-[clamp(1.8rem,9vw,3.25rem)] leading-none text-[var(--color-text-secondary)] transition-colors group-hover:text-accent">
                Instagram
              </span>
              <span className="sr-only"> {externalNote}</span>
              <span className="rv-index" aria-hidden="true">↗</span>
            </a>
          </nav>

          <div className="mt-auto flex flex-wrap items-end justify-between gap-6 border-t border-border pt-6">
            <div>
              <p className="rv-kicker">raw.vives</p>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                {archiveByline}
              </p>
            </div>
            <LocaleSwitch
              currentLocale={currentLocale}
              alternateLocale={alternateLocale}
              alternateHref={alternateHref}
              alternateLocaleLabel={alternateLocaleLabel}
              variant="menu"
              onNavigate={closeMobileMenu}
            />
          </div>
        </Container>
      </div>
      )}
    </>
  );
}
