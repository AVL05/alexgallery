"use client";

import type { Locale, NavDictionary } from "@/types/dictionary";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
            className="text-2xl font-black uppercase tracking-tighter text-white"
          >
            ALEX <span className="text-accent italic">ARCHIVE</span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-12">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors"
              >
                {item.name}
              </a>
            ))}

            <div className="flex items-center gap-4 border-l border-white/10 pl-12 text-[10px] font-bold">
              <a
                href="/es"
                className={
                  currentLocale === "es" ? "text-accent" : "text-white/30"
                }
              >
                ES
              </a>
              <a
                href="/en"
                className={
                  currentLocale === "en" ? "text-accent" : "text-white/30"
                }
              >
                EN
              </a>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            ref={mobileToggleRef}
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
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
        aria-label="Menú de navegación"
        className={`fixed inset-0 bg-black z-[90] md:hidden transition-transform duration-500 ${isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-3xl font-black uppercase tracking-tighter transition-colors text-white"
            >
              {item.name}
            </a>
          ))}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              mobileToggleRef.current?.focus();
            }}
            className="mt-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 hover:text-white transition-colors"
            aria-label="Cerrar menú"
          >
            Cerrar
          </button>
        </div>
      </div>
    </>
  );
}
