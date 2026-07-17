"use client";

import { Container } from "@/components/ui/layout";
import { useMotion } from "@/components/motion/motion-provider";
import { motionDistance, motionDuration, motionEase } from "@/lib/motion/config";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import type { Locale, NavDictionary } from "@/types/dictionary";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocationSnapshot } from "@/hooks/use-location-snapshot";
import { Magnetic } from "@/components/interactions/magnetic";
import { getCursorTargetAttributes } from "@/lib/interactions/cursor-target";

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
  const sectionHref = (hash: string) =>
    isHome ? hash : `/${currentLocale}${hash}`;
  const items = [
    { name: dictionary.about, href: sectionHref("#about") },
    { name: dictionary.gallery, href: sectionHref("#gallery") },
    { name: dictionary.contact, href: sectionHref("#contact") },
    { name: dictionary.policies, href: `/${currentLocale}/politica-uso` },
  ];
  const alternateLocale: Locale = currentLocale === "es" ? "en" : "es";
  const alternatePath = pathname.replace(/^\/(es|en)(?=\/|$)/, `/${alternateLocale}`);
  const locationSnapshot = useLocationSnapshot();
  const liveAlternatePath = locationSnapshot.pathname
    ? locationSnapshot.pathname.replace(/^\/(es|en)(?=\/|$)/, `/${alternateLocale}`)
    : alternatePath;
  const alternateHref = `${liveAlternatePath || `/${alternateLocale}`}${locationSnapshot.search}${locationSnapshot.hash}`;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMenuMounted, setIsMobileMenuMounted] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const scrolledRef = useRef(false);
  const { prefersReducedMotion, lockScroll } = useMotion();
  const openMenuLabel = currentLocale === "es" ? "Abrir menú" : "Open menu";
  const closeMenuLabel = currentLocale === "es" ? "Cerrar menú" : "Close menu";
  const navigationLabel =
    currentLocale === "es" ? "Navegación principal" : "Primary navigation";

  const finishClosingMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    setIsMobileMenuMounted(false);
    window.requestAnimationFrame(() => mobileToggleRef.current?.focus());
  }, []);

  const closeMobileMenu = useCallback(() => {
    if (!mobileMenuRef.current || prefersReducedMotion) {
      finishClosingMenu();
      return;
    }

    gsap.to(mobileMenuRef.current, {
      opacity: 0,
      y: -motionDistance.compact,
      duration: motionDuration.fast,
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
      if (!headerRef.current || prefersReducedMotion) return;
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -motionDistance.compact },
        {
          opacity: 1,
          y: 0,
          duration: motionDuration.normal,
          ease: motionEase.enter,
          clearProps: "opacity,transform",
        },
      );
    },
    { dependencies: [prefersReducedMotion], scope: headerRef, revertOnUpdate: true },
  );

  useGSAP(
    () => {
      if (!isMobileMenuOpen || !mobileMenuRef.current || prefersReducedMotion) return;
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0, y: -motionDistance.compact },
        {
          opacity: 1,
          y: 0,
          duration: motionDuration.normal,
          ease: motionEase.enter,
        },
      );
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
        <Container className="flex h-[var(--layout-nav-height)] items-center justify-between">
          <Link
            href={`/${currentLocale}`}
            className="group inline-flex min-h-11 flex-col justify-center"
            aria-label="raw.vives — Visual Archive"
          >
            <span className="font-serif text-xl leading-none tracking-[-0.025em] text-foreground transition-colors group-hover:text-accent sm:text-2xl">
              raw.vives
            </span>
            <span className="mt-1 hidden text-[8px] font-semibold uppercase tracking-[0.22em] text-[var(--color-text-muted)] sm:block">
              Visual Archive
            </span>
          </Link>

          <nav aria-label={navigationLabel} className="hidden items-center gap-7 lg:flex">
            {items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  data-press-feedback
                  className={`relative inline-flex min-h-11 items-center text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                    active
                      ? "text-accent"
                      : "text-[var(--color-text-secondary)] hover:text-foreground"
                  }`}
                >
                  {item.name}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-1 h-px origin-left bg-accent"
                    />
                  )}
                </Link>
              );
            })}
            <a
              href="https://aleviclop.dev/"
              target="_blank"
              rel="noreferrer"
              data-press-feedback
              className="inline-flex min-h-11 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-secondary)] transition-colors hover:text-foreground"
            >
              aleviclop.dev
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
              <span className="sr-only">
                {currentLocale === "es" ? "(abre en una pestaña nueva)" : "(opens in a new tab)"}
              </span>
            </a>
            <div className="flex items-center border-l border-border pl-4">
              <span
                aria-current="page"
                className="inline-flex size-11 items-center justify-center font-mono text-[10px] text-accent"
              >
                {currentLocale.toUpperCase()}
              </span>
              <Link
                href={alternateHref}
                hrefLang={alternateLocale}
                lang={alternateLocale}
                data-press-feedback
                className="inline-flex size-11 items-center justify-center font-mono text-[10px] text-[var(--color-text-muted)] transition-colors hover:text-foreground"
                aria-label={
                  currentLocale === "es" ? "View in English" : "Ver en español"
                }
              >
                {alternateLocale.toUpperCase()}
              </Link>
            </div>
          </nav>

          <Magnetic>
            <button
              ref={mobileToggleRef}
              type="button"
              className="inline-flex size-11 items-center justify-center text-foreground lg:hidden"
              onClick={isMobileMenuOpen ? closeMobileMenu : openMobileMenu}
              aria-label={isMobileMenuOpen ? closeMenuLabel : openMenuLabel}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              data-press-feedback
              {...getCursorTargetAttributes({ type: isMobileMenuOpen ? "close" : "open" })}
            >
              <span data-magnetic-content className="grid place-items-center">
                {isMobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
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
                className="inline-flex size-11 items-center justify-center text-foreground"
                onClick={closeMobileMenu}
                aria-label={closeMenuLabel}
                data-press-feedback
                {...getCursorTargetAttributes({ type: "close", contrast: "dark" })}
              >
                <span data-magnetic-content className="grid place-items-center"><X aria-hidden="true" /></span>
              </button>
            </Magnetic>
          </div>

          <nav className="mt-8 flex flex-col" aria-label={navigationLabel}>
            {items.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                data-press-feedback
                className="group flex min-h-16 items-center justify-between border-b border-border py-4"
              >
                <span className="font-serif text-[clamp(1.8rem,9vw,3.25rem)] leading-none text-foreground transition-colors group-hover:text-accent">
                  {item.name}
                </span>
                <span className="rv-index">{String(index + 1).padStart(2, "0")}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto flex flex-wrap items-end justify-between gap-6 border-t border-border pt-6">
            <div>
              <p className="rv-kicker">raw.vives</p>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                Visual Archive by Alex Vicente
              </p>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-flex size-11 items-center justify-center font-mono text-xs text-accent">
                {currentLocale.toUpperCase()}
              </span>
              <Link
                href={alternateHref}
                hrefLang={alternateLocale}
                lang={alternateLocale}
                onClick={closeMobileMenu}
                data-press-feedback
                className="inline-flex size-11 items-center justify-center border border-border font-mono text-xs text-foreground"
              >
                {alternateLocale.toUpperCase()}
              </Link>
            </div>
          </div>
        </Container>
      </div>
      )}
    </>
  );
}
