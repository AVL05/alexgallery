import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  buildLocaleHref,
  getRootLocaleRedirect,
  parseLocaleCookie,
  resolveAcceptLanguage,
  resolveVisitorLocale,
} from "@/lib/i18n/locale-routing";
import worker from "@/worker/index";

const spanishHeaders = ["es", "es-ES", "es-MX", "es-AR"];
const englishFallbackHeaders = ["en-US", "fr-FR", "de-DE", "ca-ES", "zz-ZZ"];

test("Accept-Language resolves only Spanish primary codes to es", () => {
  for (const value of spanishHeaders) assert.equal(resolveAcceptLanguage(value), "es");
  for (const value of englishFallbackHeaders) assert.equal(resolveAcceptLanguage(value), "en");
  assert.equal(resolveAcceptLanguage(null), "en");
});

test("a valid manual cookie has priority and invalid values use the browser", () => {
  assert.equal(parseLocaleCookie("raw-vives-locale=es"), "es");
  assert.equal(parseLocaleCookie("raw-vives-locale=en"), "en");
  assert.equal(parseLocaleCookie("raw-vives-locale=fr"), null);
  assert.equal(resolveVisitorLocale(new Headers({ cookie: "raw-vives-locale=es", "accept-language": "en-US" })), "es");
  assert.equal(resolveVisitorLocale(new Headers({ cookie: "raw-vives-locale=en", "accept-language": "es-ES" })), "en");
  assert.equal(resolveVisitorLocale(new Headers({ cookie: "raw-vives-locale=invalid", "accept-language": "es-MX" })), "es");
});

test("root redirect is temporary, preserves query and never loops localized routes", async () => {
  const root = new Request("https://gallery.aleviclop.dev/?ref=portfolio", { headers: { "accept-language": "es-MX" } });
  assert.equal(getRootLocaleRedirect(root)?.toString(), "https://gallery.aleviclop.dev/es?ref=portfolio");
  assert.equal(getRootLocaleRedirect(new Request("https://gallery.aleviclop.dev/es")), null);
  assert.equal(getRootLocaleRedirect(new Request("https://gallery.aleviclop.dev/en")), null);

  const response = await worker.fetch(root, { ASSETS: { fetch: () => Promise.resolve(new Response("asset")) } });
  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), "https://gallery.aleviclop.dev/es?ref=portfolio");
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  assert.match(response.headers.get("vary") ?? "", /Accept-Language/);
  assert.match(response.headers.get("vary") ?? "", /Cookie/);
});

test("non-root paths are delegated unchanged to static assets", async () => {
  let delegated = "";
  const response = await worker.fetch(new Request("https://gallery.aleviclop.dev/en?ref=x"), {
    ASSETS: {
      fetch(request) {
        delegated = request.url;
        return Promise.resolve(new Response("asset", { status: 200 }));
      },
    },
  });
  assert.equal(response.status, 200);
  assert.equal(delegated, "https://gallery.aleviclop.dev/en?ref=x");
});

test("manual locale links preserve route, query, hash and series context", () => {
  assert.equal(buildLocaleHref("/es/photo/46", "?series=oporto-del-rio-a-la-noche", "#detail", "en"), "/en/photo/46?series=oporto-del-rio-a-la-noche#detail");
  assert.equal(buildLocaleHref("/en", "?category=wildlife", "#gallery", "es"), "/es?category=wildlife#gallery");
  assert.equal(buildLocaleHref("/es/series/piedra-atlantica", "", "", "en"), "/en/series/piedra-atlantica");
});

test("manual selector persists the constrained functional cookie", () => {
  const cookie = readFileSync("lib/i18n/locale-cookie.client.ts", "utf8");
  const navigation = readFileSync("components/navigation.tsx", "utf8");
  const footer = readFileSync("components/footer.tsx", "utf8");
  assert.match(cookie, /document\.cookie/);
  assert.match(cookie, /Path=\//);
  assert.match(cookie, /Max-Age=\$\{LOCALE_COOKIE_MAX_AGE\}/);
  assert.match(cookie, /SameSite=Lax/);
  assert.match(cookie, /Secure/);
  assert.match(navigation, /saveLocalePreference\(alternateLocale\)/);
  assert.match(footer, /saveLocalePreference\("es"\)/);
  assert.match(footer, /saveLocalePreference\("en"\)/);
});

test("the obsolete language-choice screen is absent", () => {
  const rootPage = readFileSync("app/page.tsx", "utf8");
  assert.doesNotMatch(rootPage, /Entrar en español|View in English/);
  assert.match(rootPage, /rootLocaleFallbackScript/);
  assert.match(rootPage, /index: false/);
});
