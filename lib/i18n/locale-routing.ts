import type { Locale } from "@/types/dictionary";

export const LOCALE_COOKIE_NAME = "raw-vives-locale";
export const LOCALE_COOKIE_MAX_AGE = 31_536_000;

export function parseLocaleCookie(cookieHeader: string | null): Locale | null {
  if (!cookieHeader) return null;

  for (const part of cookieHeader.split(";")) {
    const [name, ...valueParts] = part.trim().split("=");
    if (name !== LOCALE_COOKIE_NAME) continue;
    const value = valueParts.join("=").trim();
    return value === "es" || value === "en" ? value : null;
  }

  return null;
}

export function resolveAcceptLanguage(header: string | null): Locale {
  if (!header) return "en";

  const preferred = header
    .split(",")
    .map((part, index) => {
      const [rawLanguage, ...parameters] = part.trim().split(";");
      const qualityParameter = parameters.find((value) =>
        value.trim().toLowerCase().startsWith("q="),
      );
      const quality = qualityParameter
        ? Number.parseFloat(qualityParameter.split("=")[1] ?? "0")
        : 1;
      return {
        index,
        language: rawLanguage.trim().toLowerCase(),
        quality: Number.isFinite(quality) ? quality : 0,
      };
    })
    .filter(({ language, quality }) => language.length > 0 && quality > 0)
    .sort((left, right) => right.quality - left.quality || left.index - right.index)[0]
    ?.language;

  return preferred === "es" || preferred?.startsWith("es-") ? "es" : "en";
}

export function resolveVisitorLocale(headers: Headers): Locale {
  return (
    parseLocaleCookie(headers.get("cookie")) ??
    resolveAcceptLanguage(headers.get("accept-language"))
  );
}

export function getRootLocaleRedirect(request: Request): URL | null {
  const url = new URL(request.url);
  if (url.pathname !== "/") return null;
  url.pathname = `/${resolveVisitorLocale(request.headers)}`;
  return url;
}

export function replacePathLocale(pathname: string, locale: Locale): string {
  if (/^\/(es|en)(?=\/|$)/.test(pathname)) {
    return pathname.replace(/^\/(es|en)(?=\/|$)/, `/${locale}`);
  }
  return `/${locale}`;
}

export function buildLocaleHref(
  pathname: string,
  search: string,
  hash: string,
  locale: Locale,
  fallbackPath = `/${locale}`,
): string {
  const localizedPath = pathname
    ? replacePathLocale(pathname, locale)
    : replacePathLocale(fallbackPath, locale);
  return `${localizedPath}${search}${hash}`;
}

export const rootLocaleFallbackScript = `(()=>{const name='${LOCALE_COOKIE_NAME}=';const saved=document.cookie.split(';').map(v=>v.trim()).find(v=>v.startsWith(name))?.slice(name.length);const manual=saved==='es'||saved==='en'?saved:null;const browser=(navigator.languages?.[0]||navigator.language||'').toLowerCase();const locale=manual||(browser==='es'||browser.startsWith('es-')?'es':'en');const target=new URL(location.href);target.pathname='/'+locale;location.replace(target.pathname+target.search+target.hash)})()`;
