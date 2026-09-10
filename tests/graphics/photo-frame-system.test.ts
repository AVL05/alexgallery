import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  coverTextureTransform,
  PHOTO_FRAME_MODEL_URL,
  photoFrameMeasurements,
} from "../../lib/graphics/photo-frame";

const read = (path: string) => readFileSync(path, "utf8");

test("backing measurements fit inside the audited frame", () => {
  const { outer, backing } = photoFrameMeasurements;
  assert.ok(backing.width < outer.width && backing.height < outer.height);
  assert.ok(Math.abs(backing.depth) < outer.depth);
  assert.ok(Math.abs(backing.width / backing.height - 1.74) < 0.01);
  assert.equal(PHOTO_FRAME_MODEL_URL, "/models/raw-vives/photo-frame-v2.glb");
  const header = readFileSync("public/models/raw-vives/photo-frame-v2.glb").subarray(0, 4).toString();
  assert.equal(header, "glTF");
});

test("cover-fit keeps photo aspect without deformation", () => {
  const surface = 16 / 9;
  const wide = coverTextureTransform(21 / 9, surface);
  assert.ok(wide.repeat.x < 1 && wide.repeat.x > 0);
  assert.equal(wide.repeat.y, 1);
  assert.ok(Math.abs(wide.offset.x * 2 + wide.repeat.x - 1) < 1e-9);
  const tall = coverTextureTransform(3 / 4, surface);
  assert.equal(tall.repeat.x, 1);
  assert.ok(tall.repeat.y < 1 && tall.repeat.y > 0);
  assert.ok(Math.abs(tall.offset.y * 2 + tall.repeat.y - 1) < 1e-9);
  // Aspect is preserved: visible UV window matches the surface ratio.
  const visibleWide = (1 / wide.repeat.x) * surface;
  assert.ok(Math.abs(visibleWide - 21 / 9) < 1e-9);
  const visibleTall = surface / (1 / tall.repeat.y);
  assert.ok(Math.abs(visibleTall - 3 / 4) < 1e-9);
  const invalid = coverTextureTransform(0, surface);
  assert.deepEqual(invalid, { repeat: { x: 1, y: 1 }, offset: { x: 0, y: 0 } });
});

test("frame asset loads once and photo textures stay sRGB", () => {
  const factory = read("lib/graphics/photo-frame.ts");
  assert.match(factory, /THREE\.Cache\.enabled = true/);
  assert.match(factory, /getObjectByName\(name\)/);
  assert.match(factory, /findMesh\(root, "frame"\)/);
  assert.match(factory, /findMesh\(root, "backing"\)/);
  assert.match(factory, /new THREE\.Mesh\(asset\.frame\.geometry, asset\.frame\.material\)/);
  assert.match(factory, /new THREE\.Mesh\(asset\.backing\.geometry, photoMaterial\)/);
  assert.match(factory, /side: THREE\.FrontSide/);
  assert.match(factory, /texture\.colorSpace = THREE\.SRGBColorSpace/);
  assert.doesNotMatch(factory, /PlaneGeometry/);
  assert.doesNotMatch(factory, /InstancedMesh/);
  assert.doesNotMatch(factory, /photo-frame\.glb"/);
  const component = read("components/graphics/photo-frame-3d.tsx");
  assert.match(component, /loadPhotoFrameAsset/);
  assert.match(component, /createPhotoFrameInstance/);
  assert.match(component, /setVisible\(visible\)/);
  assert.match(component, /role="img"/);
});

test("frame preview stays dev-only behind a query flag", () => {
  const preview = read("components/graphics/photo-frame-preview.tsx");
  assert.match(preview, /process\.env\.NODE_ENV === "development"/);
  assert.match(preview, /get\("photo-frame"\) === "1"/);
  assert.match(preview, /OrbitControls/);
  assert.doesNotMatch(preview, /app\/\[locale\]/);
  const tools = read("components/graphics/photo-frame-development-tools.tsx");
  assert.match(tools, /ssr: false/);
  assert.doesNotMatch(read("app/layout.tsx"), /PhotoFramePreview/);
});
