import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import manifest from "../../app/manifest";
import { siteUrl } from "../../lib/site-config";

const read = (path: string) => readFileSync(path, "utf8");

test("production release configuration is explicit and privacy-safe", () => {
  const packageJson = JSON.parse(read("package.json"));
  const envExample = read(".env.example");
  const headers = read("public/_headers");
  const contact = read("components/contact.tsx");
  const ci = read(".github/workflows/ci.yml");
  const deploy = read(".github/workflows/deploy.yml");
  const webManifest = manifest();

  assert.equal(siteUrl, "https://gallery.aleviclop.dev");
  assert.equal(packageJson.packageManager, "pnpm@10.34.1");
  assert.equal(read(".nvmrc").trim(), "22.22.2");
  assert.match(envExample, /NEXT_PUBLIC_BASE_URL=/);
  assert.match(envExample, /NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=/);
  assert.doesNotMatch(envExample, /d72eeacd/);
  assert.doesNotMatch(contact, /d72eeacd/);
  assert.match(headers, /Permissions-Policy:/);
  assert.match(headers, /Cross-Origin-Opener-Policy: same-origin/);
  assert.match(headers, /photos\/optimized\/\*[\s\S]*stale-while-revalidate/);
  assert.doesNotMatch(headers, /photos\/optimized\/\*[\s\S]{0,100}immutable/);
  assert.equal(webManifest.name, "raw.vives — Visual Archive");
  assert.equal(webManifest.icons?.length, 3);
  assert.match(ci, /pnpm install --frozen-lockfile/);
  assert.match(deploy, /workflow_dispatch/);
  assert.doesNotMatch(deploy, /push:/);
});
