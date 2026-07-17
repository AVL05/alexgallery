import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import imagesDataJson from "@/lib/images-data.json";
import { getClientImagesData } from "@/lib/images/client-data";
import {
  validateContactForm,
  validateLicenseForm,
} from "@/lib/contact/validation";
import type { ImagesData } from "@/types/photo";

const messages = {
  name: "name",
  email: "email",
  message: "message",
  photo_id: "photo",
  usage_type: "usage",
  usage_description: "description",
};

test("contact validation preserves both form contracts without runtime libraries", () => {
  assert.deepEqual(
    validateContactForm({ name: "A", email: "invalid", message: "short" }, messages),
    { name: "name", email: "email", message: "message" },
  );
  assert.deepEqual(
    validateContactForm(
      { name: "Alex", email: "alex@example.com", message: "A useful message" },
      messages,
    ),
    {},
  );
  assert.deepEqual(
    validateLicenseForm(
      {
        name: "Alex",
        email: "alex@example.com",
        photoId: "",
        usageType: "",
        description: "short",
      },
      messages,
    ),
    { photoId: "photo", usageType: "usage", description: "description" },
  );
});

test("client image payload excludes pipeline-only metadata", () => {
  const source = imagesDataJson as ImagesData;
  const client = getClientImagesData(source);
  assert.equal(client.images.length, source.images.length);
  for (const image of client.images) {
    assert.equal(image.histogram, undefined);
    assert.equal(image.srcAvif, undefined);
    assert.ok(image.src.startsWith("/photos/optimized/"));
    assert.ok(image.width > 0 && image.height > 0);
  }
  assert.ok(JSON.stringify(client).length < JSON.stringify(source).length);
});

test("motion reveals remain in the accessibility tree", () => {
  const files = [
    "components/motion/reveal.tsx",
    "components/motion/motion-image.tsx",
    "components/motion/motion-text.tsx",
    "hooks/use-batch-reveal.ts",
  ];
  for (const file of files) {
    const source = readFileSync(file, "utf8");
    assert.doesNotMatch(source, /autoAlpha/);
    assert.doesNotMatch(source, /clearProps:\s*["'][^"']*visibility/);
  }
});

test("forced colors keeps native interaction fallbacks", () => {
  const css = readFileSync("app/globals.css", "utf8");
  const bootstrap = readFileSync("components/interactions/interaction-bootstrap.tsx", "utf8");
  const graphics = readFileSync("components/graphics/hero-graphics-bootstrap.tsx", "utf8");
  assert.match(css, /forced-colors:\s*active/);
  assert.match(css, /cursor:\s*auto\s*!important/);
  assert.match(bootstrap, /forcedColors/);
  assert.match(graphics, /forcedColors/);
});

test("localized routes publish x-default alternates", () => {
  const files = [
    "app/layout.tsx",
    "app/[locale]/page.tsx",
    "app/[locale]/photo/[id]/page.tsx",
    "app/[locale]/politica-uso/page.tsx",
    "app/sitemap.ts",
  ];
  for (const file of files) {
    assert.match(readFileSync(file, "utf8"), /x-default/);
  }
});

test("language bootstrap is valid inline JavaScript without hydration", () => {
  const source = readFileSync("components/document-language-bootstrap.tsx", "utf8");
  const inline = source.match(/`([^`]+)`/)?.[1];
  assert.ok(inline);
  assert.doesNotThrow(() => new Function(inline));
  assert.match(inline, /location\.pathname/);
});
