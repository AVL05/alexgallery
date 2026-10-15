import { archivePageHref, workHref } from "@/lib/routes";
import type { Locale, NavDictionary } from "@/types/dictionary";

// Primary navigation destinations. Home anchors stay temporary targets until
// their standalone V2 routes exist; swapping one href here (work -> /work,
// about -> /about) needs no header changes. Archive already points at /archive.
export type NavItemKey = "work" | "archive" | "series" | "about";

export type NavItem = {
  key: NavItemKey;
  label: string;
  href: string;
};

export function getPrimaryNavItems(
  locale: Locale,
  dictionary: NavDictionary,
  isHome: boolean,
): NavItem[] {
  const home = `/${locale}`;
  const sectionHref = (hash: string) => (isHome ? hash : `${home}${hash}`);
  return [
    // Standalone archive page; #gallery stays as the home preview anchor.
    { key: "archive", label: dictionary.gallery, href: archivePageHref(locale) },
    { key: "series", label: dictionary.series, href: `${home}/series` },
    { key: "work", label: dictionary.work, href: workHref(locale) },
    // Temp: about section. Future: aboutHref(locale) -> /about.
    { key: "about", label: dictionary.about, href: sectionHref("#about") },
  ];
}

export function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (item.href.startsWith("#")) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
