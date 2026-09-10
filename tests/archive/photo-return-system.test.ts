import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  readPhotoReturn,
  resolvePhotoReturnHref,
  savePhotoReturn,
} from "../../lib/archive/context";

const read = (path: string) => readFileSync(path, "utf8");

test("return priority is series, then stored origin, then archive fallback", () => {
  assert.equal(
    resolvePhotoReturnHref({ seriesHref: "/es/series/x#series-photo-1", storedHref: "/es#gallery", fallbackHref: "/es/archive" }),
    "/es/series/x#series-photo-1",
  );
  assert.equal(
    resolvePhotoReturnHref({ seriesHref: null, storedHref: "/en/archive?category=urbano#archive", fallbackHref: "/en/archive" }),
    "/en/archive?category=urbano#archive",
  );
  assert.equal(
    resolvePhotoReturnHref({ seriesHref: null, storedHref: null, fallbackHref: "/es/archive" }),
    "/es/archive",
  );
});

test("photo return storage is a safe no-op without a browser", () => {
  assert.doesNotThrow(() =>
    savePhotoReturn({ locale: "es", photoId: 1, returnHref: "/es#gallery", scrollY: 0, savedAt: Date.now() }),
  );
  assert.equal(readPhotoReturn("es", 1), null);
});

test("photo entries capture their origin section for the return link", () => {
  const work = read("components/work/work-entry.tsx");
  assert.match(work, /savePhotoReturn\(\{/);
  assert.match(work, /returnHref\?: string;/);
  assert.match(work, /returnHref \?\? `\/\$\{locale\}#selected-work`/);
  const workPage = read("components/work/work-page.tsx");
  assert.match(workPage, /returnHref=\{originHref\}/);
  assert.match(workPage, /workHref\(locale\)/);
  const preview = read("components/archive/archive-preview.tsx");
  assert.match(preview, /savePhotoReturn\(\{/);
  assert.match(preview, /returnHref: `\/\$\{locale\}#gallery`/);
  const item = read("components/archive/archive-item.tsx");
  assert.match(item, /savePhotoReturn\(\{/);
  assert.match(item, /sectionHash/);
  const context = read("components/photo-detail/photo-detail-context.tsx");
  assert.match(context, /readPhotoReturn\(locale, currentId\)/);
  assert.match(context, /resolvePhotoReturnHref\(/);
  assert.match(context, /archivePageHref\(locale\)/);
});
