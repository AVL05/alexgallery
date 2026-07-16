"use client";

import type { Locale, NavDictionary } from "@/types/dictionary";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";

export function Navigation({
  dictionary,
  currentLocale,
}: {
  dictionary: NavDictionary;
  currentLocale: Locale;
}) {
  const items = [
    { name: dictionary.about, href: "#about" },
    { name: dictionary.gallery, href: "#gallery" },
    { name: dictionary.contact, href: "#contact" },
    {
      name: dictionary.policies || "Políticas",
      href: `/${currentLocale}/politica-uso`,
    },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const openMenuLabel = currentLocale === "es" ? "Abrir menú" : "Open menu";
  const closeMenuLabel = currentLocale === "es" ? "Cerrar menú" : "Close menu";
  const navigationLabel =
    currentLocale === "es" ? "Menú de navegación" : "Navigation menu";
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

    first?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        mobileToggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
          isScrolled
            ? "bg-black/80 backdrop-blur-md border-b border-white/10 py-4"
            : "bg-transparent py-8"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <a
            href="#hero"
            className="inline-flex min-h-11 items-center text-2xl font-black uppercase tracking-tighter text-white"
          >
            ALEX <span className="text-accent italic">ARCHIVE</span>
          </a>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-10">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex min-h-11 items-center text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors"
              >
                {item.name}
              </a>
            ))}

            <div className="flex items-center border-l border-white/10 pl-6 text-[10px] font-bold">
              <a
                href="/es"
                className={`inline-flex min-h-11 min-w-11 items-center justify-center ${
                  currentLocale === "es" ? "text-accent" : "text-white/30"
                }`}
              >
                ES
              </a>
              <a
                href="/en"
                className={`inline-flex min-h-11 min-w-11 items-center justify-center ${
                  currentLocale === "en" ? "text-accent" : "text-white/30"
                }`}
              >
                EN
              </a>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            ref={mobileToggleRef}
            className="-m-2.5 inline-flex min-h-11 min-w-11 items-center justify-center text-white lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? closeMenuLabel : openMenuLabel}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label={navigationLabel}
        aria-hidden={!isMobileMenuOpen}
        inert={!isMobileMenuOpen}
        className={`fixed inset-0 bg-black z-[90] transition-transform duration-500 lg:hidden ${isMobileMenuOpen ? "translate-y-0" : "pointer-events-none -translate-y-full"}`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="inline-flex min-h-11 items-center text-3xl font-black uppercase tracking-tighter transition-colors text-white"
            >
              {item.name}
            </a>
          ))}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              mobileToggleRef.current?.focus();
            }}
            className="mt-4 inline-flex min-h-11 items-center px-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 hover:text-white transition-colors"
            aria-label={closeMenuLabel}
          >
            {currentLocale === "es" ? "Cerrar" : "Close"}
          </button>
        </div>
      </div>
    </>
  );
}
