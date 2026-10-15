import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { normalizeStaticExport } from "../../scripts/normalize-static-export";

test("nested Windows segment output has the filename requested by the Next router", () => {
  const root = mkdtempSync(join(tmpdir(), "raw-vives-export-"));
  try {
    const route = join(root, "es", "series", "porto-river-night");
    const nested = join(route, "__next.$d$locale", "series", "$d$slug");
    mkdirSync(nested, { recursive: true });
    writeFileSync(join(nested, "__PAGE__.txt"), "segment payload");
    writeFileSync(join(route, "__next._tree.txt"), "tree");
    writeFileSync(join(root, "opengraph-image"), "image payload");
    assert.equal(normalizeStaticExport(root), 1);
    assert.equal(readFileSync(join(root, "opengraph-image.png"), "utf8"), "image payload");
    assert.equal(readFileSync(join(route, "__next.$d$locale.series.$d$slug.__PAGE__.txt"), "utf8"), "segment payload");
    assert.equal(normalizeStaticExport(root), 0);
    writeFileSync(join(route, "__next.$d$locale.series.$d$slug.__PAGE__.txt"), "different");
    assert.throws(() => normalizeStaticExport(root), /Conflicting/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
