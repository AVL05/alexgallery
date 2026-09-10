import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import sitemap from "../../app/sitemap";
import es from "../../dictionaries/es.json";
import en from "../../dictionaries/en.json";
import { getPrimaryNavItems, isNavItemActive } from "../../lib/navigation";

const read = (path: string) => readFileSync(path, "utf8");

test("sitemap covers public routes without duplicates or placeholders", () => {
  const entries = sitemap();
  const urls = entries.map((entry) => entry.url);
  assert.equal(new Set(urls).size, urls.length);
  for (const locale of ["es", "en"]) {
    for (const path of ["", "/work", "/archive", "/series"]) {
      assert.ok(urls.includes(`https://rawvives.aleviclop.dev/${locale}${path}`));
    }
  }
  assert.ok(!urls.some((url) => url.includes("?")));
  assert.ok(!urls.some((url) => /\/films|\/about|\/contact/.test(url)));
  assert.ok(entries.every((entry) => entry.alternates?.languages?.["x-default"]?.includes("/en")));
  assert.ok(entries.every((entry) => entry.url.startsWith("https://rawvives.aleviclop.dev/")));
});

test("photo canonicals stay numeric while slugs resolve", () => {
  const page = read("app/[locale]/photo/[id]/page.tsx");
  assert.match(page, /getCleanPhotoPath\(locale, photo\.id\)/);
  assert.match(page, /resolvePhotoParam\(id\)/);
  assert.match(page, /getPhotoSlug\(photo\)/);
  assert.doesNotMatch(page, /getCleanPhotoPath\(locale, id\)/);
});

test("primary destinations point at routes, anchors stay compatible", () => {
  const esItems = getPrimaryNavItems("es", es.nav, true);
  assert.deepEqual(esItems.map((item) => item.href), ["/es/work", "/es/archive", "/es/series", "#about"]);
  const enItems = getPrimaryNavItems("en", en.nav, false);
  assert.deepEqual(enItems.map((item) => item.href), ["/en/work", "/en/archive", "/en/series", "/en#about"]);
  const archive = esItems.find((item) => item.key === "archive")!;
  assert.equal(isNavItemActive(archive, "/es/archive"), true);
  assert.equal(isNavItemActive(archive, "/es/archive?category=urbano"), false);
  const series = esItems.find((item) => item.key === "series")!;
  assert.equal(isNavItemActive(series, "/es/series/porto-river-night"), true);
});

test("detail pages keep a single main landmark and archive owns its h1", () => {
  for (const route of ["app/[locale]/photo/[id]/page.tsx", "app/[locale]/series/page.tsx", "app/[locale]/series/[slug]/page.tsx"]) {
    assert.match(read(route), /<PageShell as="div">/);
  }
  assert.match(read("components/archive/archive-page.tsx"), /as=\{titleAs\}/);
  assert.match(read("app/[locale]/archive/page.tsx"), /titleAs="h1"/);
});
