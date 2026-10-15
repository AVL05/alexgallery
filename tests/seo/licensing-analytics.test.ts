import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { isValidElement, type ReactElement } from "react";
import sitemap from "../../app/sitemap";
import { Analytics } from "../../components/analytics";
import en from "../../dictionaries/en.json";
import es from "../../dictionaries/es.json";
import type { ArchivePhoto } from "../../lib/archive/types";
import { buildPhotoStructuredData } from "../../lib/photo-detail/seo";

const read = (path: string) => readFileSync(path, "utf8");

const fixturePhoto = {
  id: 21,
  src: "/photos/optimized/original/21.webp",
  width: 1200,
  height: 800,
  title: "Última parada: la noche",
  description: "Un tranvía cruza Oporto al caer la noche.",
  category: "Urbano",
  year: "2024",
  curatedIndex: 0,
} as ArchivePhoto;

test("photo structured data exposes license and acquisition URLs", () => {
  const data = buildPhotoStructuredData(fixturePhoto, "es");
  assert.equal(data.license, "https://rawvives.aleviclop.dev/es/politica-uso");
  assert.equal(
    data.acquireLicensePage,
    "https://rawvives.aleviclop.dev/es/licencias",
  );
  const english = buildPhotoStructuredData(fixturePhoto, "en");
  assert.equal(english.license, "https://rawvives.aleviclop.dev/en/politica-uso");
  assert.equal(
    english.acquireLicensePage,
    "https://rawvives.aleviclop.dev/en/licencias",
  );
});

test("website schema advertises archive search actions for both locales", () => {
  const layout = read("app/layout.tsx");
  assert.match(layout, /"@type": "SearchAction"/);
  assert.match(
    layout,
    /\/\$\{locale\}\/archive\?q=\{search_term_string\}/,
  );
  assert.match(layout, /required name=search_term_string/);
});

test("analytics ships zero tracking scripts unless configured", () => {
  delete process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  delete process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;
  assert.equal(Analytics(), null);
  assert.match(read("app/layout.tsx"), /<Analytics \/>/);
});

test("analytics renders Plausible script when only its domain is set", () => {
  process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN = "rawvives.aleviclop.dev";
  try {
    const element = Analytics() as ReactElement | null;
    assert.ok(isValidElement(element));
    const props = element.props as Record<string, unknown>;
    assert.equal(props["data-domain"], "rawvives.aleviclop.dev");
    assert.equal(props.src, "https://plausible.io/js/script.js");
  } finally {
    delete process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  }
});

test("analytics prefers the Cloudflare beacon when both providers are set", () => {
  process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN = "rawvives.aleviclop.dev";
  process.env.NEXT_PUBLIC_CF_BEACON_TOKEN = "test-token";
  try {
    const element = Analytics() as ReactElement | null;
    assert.ok(isValidElement(element));
    const props = element.props as Record<string, unknown>;
    assert.equal(
      props.src,
      "https://static.cloudflareinsights.com/beacon.min.js",
    );
  } finally {
    delete process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
    delete process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;
  }
});

test("licensing page is indexed, localized and linked from discovery surfaces", () => {
  const route = read("app/[locale]/licencias/page.tsx");
  assert.match(route, /\/\$\{locale\}\/licencias/);
  assert.match(route, /\/en\/licencias/);
  assert.doesNotMatch(route, /index: false/);
  const entries = sitemap().filter((entry) => entry.url.endsWith("/licencias"));
  assert.equal(entries.length, 2);
  assert.ok(
    entries.every((entry) =>
      entry.alternates?.languages?.["x-default"]?.endsWith("/en/licencias"),
    ),
  );
  assert.equal(es.nav.licensing, "Licencias");
  assert.equal(en.nav.licensing, "Licensing");
  assert.match(read("components/footer.tsx"), /\/licencias/);
  const client = read("app/[locale]/licencias/licencias-client.tsx");
  assert.match(client, /\?form=license#contact/);
  assert.match(client, /politica-uso/);
  assert.match(
    read("components/contact.tsx"),
    /get\("form"\) === "license"/,
  );
});

test("contact prepares email drafts without a network submission", () => {
  const contact = read("components/contact.tsx");
  assert.match(contact, /buildContactMailto\(data, dictionary\)/);
  assert.doesNotMatch(contact, /fetch\(|web3FormsAccessKey|access_key/);
});
