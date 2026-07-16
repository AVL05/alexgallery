"use client";

import { Container } from "@/components/ui/layout";
import type { Locale, NavDictionary } from "@/types/dictionary";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const openMenuLabel = currentLocale === "es" ? "Abrir menú" : "Open menu";
  const closeMenuLabel = currentLocale === "es" ? "Cerrar menú" : "Close menu";
  const navigationLabel =
    currentLocale === "es" ? "Navegación principal" : "Primary navigation";

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    window.requestAnimationFrame(() => mobileToggleRef.current?.focus());
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 32);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.menuOpen = String(isMobileMenuOpen);
    return () => {
      delete document.documentElement.dataset.menuOpen;
    };
  }, [isMobileMenuOpen]);

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
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        inert={isMobileMenuOpen}
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
                  className={`inline-flex min-h-11 items-center text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                    active
                      ? "text-accent"
                      : "text-[var(--color-text-secondary)] hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            <a
              href="https://aleviclop.dev/"
              target="_blank"
              rel="noreferrer"
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
                href={alternatePath || `/${alternateLocale}`}
                hrefLang={alternateLocale}
                lang={alternateLocale}
                className="inline-flex size-11 items-center justify-center font-mono text-[10px] text-[var(--color-text-muted)] transition-colors hover:text-foreground"
                aria-label={
                  currentLocale === "es" ? "View in English" : "Ver en español"
                }
              >
                {alternateLocale.toUpperCase()}
              </Link>
            </div>
          </nav>

          <button
            ref={mobileToggleRef}
            type="button"
            className="inline-flex size-11 items-center justify-center text-foreground lg:hidden"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label={isMobileMenuOpen ? closeMenuLabel : openMenuLabel}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </Container>
      </header>

      {isMobileMenuOpen && (
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
            <button
              autoFocus
              type="button"
              className="inline-flex size-11 items-center justify-center text-foreground"
              onClick={closeMobileMenu}
              aria-label={closeMenuLabel}
            >
              <X aria-hidden="true" />
            </button>
          </div>

          <nav className="mt-8 flex flex-col" aria-label={navigationLabel}>
            {items.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
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
                href={alternatePath || `/${alternateLocale}`}
                hrefLang={alternateLocale}
                lang={alternateLocale}
                onClick={() => setIsMobileMenuOpen(false)}
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
