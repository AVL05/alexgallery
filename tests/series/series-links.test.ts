import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (file: string) => readFileSync(file, "utf8");

test("series reels never request a full (true) prefetch, which static export cannot serve", () => {
  const reel = read("components/series/series-reel.tsx");
  assert.match(reel, /prefetch=\{prefetch \? undefined : false\}/);
  assert.doesNotMatch(reel, /prefetch=\{prefetch\}/);
  for (const file of [
    "components/home/home-series.tsx",
    "components/series/series-index-page.tsx",
    "components/series/series-essay.tsx",
  ]) assert.doesNotMatch(read(file), /prefetch=\{true\}/);
});

test("home realigns a #hash target once the selection layout is resolved", () => {
  const selected = read("components/home/selected-work.tsx");
  assert.match(selected, /setResolved\(true\)/);
  assert.match(selected, /hashAligned/);
  assert.match(selected, /readPhotoReturn\(locale\)/);
});
