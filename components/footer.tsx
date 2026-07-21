"use client";

import { Container } from "@/components/ui/layout";
import { AnimatedDivider } from "@/components/motion/animated-divider";
import { Reveal } from "@/components/motion/reveal";
import type { Locale, NavDictionary } from "@/types/dictionary";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useLocationSnapshot } from "@/hooks/use-location-snapshot";

export function Footer({
  currentLocale,
  dictionary,
}: {
  currentLocale: Locale;
  dictionary: NavDictionary;
}) {
  const year = new Date().getFullYear();
  const copyright =
    currentLocale === "es"
      ? "Todas las fotografías están protegidas por derechos de autor."
      : "All photographs are protected by copyright.";
  const navigationLabel =
    currentLocale === "es" ? "Navegación secundaria" : "Secondary navigation";
  const locationSnapshot = useLocationSnapshot();
  const localizedPath = locationSnapshot.pathname || `/${currentLocale}`;
  const localeHref = (locale: Locale) => `${localizedPath.replace(/^\/(es|en)(?=\/|$)/, `/${locale}`)}${locationSnapshot.search}${locationSnapshot.hash}`;

  return (
    <footer className="bg-[var(--color-background-secondary)] pt-16 sm:pt-20">
      <Container>
        <Reveal className="grid gap-12 pb-12 md:grid-cols-12 md:gap-8 md:pb-16">
          <div className="md:col-span-6">
            <Link href={`/${currentLocale}`} className="inline-flex flex-col" data-press-feedback>
              <span className="font-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-none tracking-[-0.04em] text-foreground">
                raw.vives
              </span>
              <span className="mt-4 text-sm text-[var(--color-text-secondary)]">
                Visual Archive by Alex Vicente
              </span>
            </Link>
          </div>

          <nav
            aria-label={navigationLabel}
            className="grid grid-cols-2 gap-x-6 gap-y-2 md:col-span-3"
          >
            <Link className="rv-editorial-link" href={`/${currentLocale}#gallery`} data-press-feedback>
              {dictionary.gallery}
            </Link>
            <Link className="rv-editorial-link" href={`/${currentLocale}#about`} data-press-feedback>
              {dictionary.about}
            </Link>
            <Link className="rv-editorial-link" href={`/${currentLocale}/series`} data-press-feedback>
              {dictionary.series}
            </Link>
            <Link className="rv-editorial-link" href={`/${currentLocale}#contact`} data-press-feedback>
              {dictionary.contact}
            </Link>
            <Link
              className="rv-editorial-link"
              href={`/${currentLocale}/politica-uso`}
              data-press-feedback
            >
              {dictionary.policies}
            </Link>
            <Link
              className="rv-editorial-link"
              href={`/${currentLocale}/privacidad`}
              data-press-feedback
            >
              {dictionary.privacy}
            </Link>
          </nav>

          <div className="flex flex-col items-start md:col-span-3 md:items-end">
            <a
              className="rv-editorial-link"
              href="https://instagram.com/aleexx_005/"
              target="_blank"
              rel="noreferrer"
              data-press-feedback
            >
              Instagram <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </a>
            <a
              className="rv-editorial-link"
              href="https://aleviclop.dev/"
              target="_blank"
              rel="noreferrer"
              data-press-feedback
            >
              aleviclop.dev <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </a>
            <a className="rv-editorial-link" href="mailto:alexviclop@gmail.com" data-press-feedback>
              Email
            </a>
          </div>
        </Reveal>

        <AnimatedDivider />
        <div className="flex flex-col gap-4 py-6 text-[10px] uppercase tracking-[0.12em] text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Alex Vicente</p>
          <p>{copyright}</p>
          <div className="flex items-center font-mono">
            <Link
              href={localeHref("es")}
              hrefLang="es"
              lang="es"
              aria-current={currentLocale === "es" ? "page" : undefined}
              className={`inline-flex size-11 items-center justify-center ${currentLocale === "es" ? "text-accent" : "hover:text-foreground"}`}
              data-press-feedback
            >
              ES
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href={localeHref("en")}
              hrefLang="en"
              lang="en"
              aria-current={currentLocale === "en" ? "page" : undefined}
              className={`inline-flex size-11 items-center justify-center ${currentLocale === "en" ? "text-accent" : "hover:text-foreground"}`}
              data-press-feedback
            >
              EN
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
