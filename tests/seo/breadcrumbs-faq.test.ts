import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import en from "../../dictionaries/en.json";
import es from "../../dictionaries/es.json";
import { buildBreadcrumbList } from "../../lib/seo/breadcrumbs";

const read = (path: string) => readFileSync(path, "utf8");

test("breadcrumb helper emits ordered BreadcrumbList items", () => {
  const list = buildBreadcrumbList([
    { name: "Archivo", url: "https://example.test/es/archive" },
    { name: "Serie", url: "https://example.test/es/series/serie" },
    { name: "Foto" },
  ]);
  assert.equal(list["@type"], "BreadcrumbList");
  assert.equal(list.itemListElement.length, 3);
  assert.deepEqual(list.itemListElement[0], {
    "@type": "ListItem",
    position: 1,
    name: "Archivo",
    item: "https://example.test/es/archive",
  });
  assert.deepEqual(list.itemListElement[2], {
    "@type": "ListItem",
    position: 3,
    name: "Foto",
  });
});

test("photo detail keeps visual crumbs and BreadcrumbList schema in sync", () => {
  const detail = read("components/photo-detail/photo-detail-page.tsx");
  assert.match(detail, /<Breadcrumbs items=\{breadcrumbItems\}/);
  assert.match(detail, /archivePageHref\(locale\)/);
  assert.match(detail, /getSeriesHref\(locale, localizedSeries\.slug\)/);
  const route = read("app/[locale]/photo/[id]/page.tsx");
  assert.match(route, /buildBreadcrumbList\(\[/);
  assert.match(route, /"@graph": \[/);
  assert.match(route, /buildPhotoStructuredData\(photo, locale\)/);
});

test("series detail renders matching visual and structured breadcrumbs", () => {
  const seriesPage = read("components/series/series-page.tsx");
  assert.match(seriesPage, /<Breadcrumbs/);
  assert.match(seriesPage, /breadcrumbLabel/);
  const route = read("app/[locale]/series/[slug]/page.tsx");
  assert.match(route, /breadcrumbLabel=\{dictionary\.nav\.breadcrumb\}/);
  assert.match(route, /"@type": "BreadcrumbList"/);
});

test("hero exposes the archive call to action above the fold", () => {
  const hero = read("components/hero/hero-content.tsx");
  assert.match(hero, /\{dictionary\.cta\}/);
  assert.match(hero, /href=\{`\/\$\{locale\}\/archive`\}/);
  const section = read("components/hero/hero-section.tsx");
  assert.match(section, /locale=\{locale\}/);
});

test("contact FAQ stays bilingual with matching questions and answers", () => {
  for (const dictionary of [es, en]) {
    assert.ok(dictionary.faq.items.length >= 4);
    for (const item of dictionary.faq.items) {
      assert.ok(item.q.trim().length > 10);
      assert.ok(item.a.trim().length > 20);
    }
  }
  assert.equal(es.faq.items.length, en.faq.items.length);
  const faq = read("components/faq/faq-section.tsx");
  assert.match(faq, /"@type": "FAQPage"/);
  assert.match(faq, /<details/);
  assert.match(faq, /<summary/);
});
