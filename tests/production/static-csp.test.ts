import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { secureStaticExport, secureStaticHtml } from "../../scripts/secure-static-export";
import { onRequest as rootRedirect } from "../../functions/index";
import { onRequest as legacyRedirect } from "../../functions/_middleware";

test("static CSP precedes all scripts and authorizes their exact UTF-8 contents", () => {
  const script = 'window.caption = "Fotografía";\n';
  const html = `<html><head><script>${script}</script><script src="/app.js" async></script></head><body><script>self.__next_f=[]</script></body></html>`;
  const secured = secureStaticHtml(html);
  const hash = createHash("sha256").update(script).digest("base64");
  assert.ok(secured.startsWith('<html><head><meta http-equiv="Content-Security-Policy"'));
  assert.ok(secured.includes(`'sha256-${hash}'`));
  assert.ok(secured.includes("script-src 'self'"));
  assert.ok(secured.includes("script-src-attr 'none'"));
  assert.ok(secured.includes(`<script>${script}</script>`));
  assert.ok(!secured.includes("unsafe-inline"));
  assert.equal(secureStaticHtml(secured), secured);
  const withCharset = secureStaticHtml(html.replace("<head>", '<head><meta charSet="utf-8"/>'));
  assert.ok(withCharset.startsWith('<html><head><meta charSet="utf-8"/><meta http-equiv="Content-Security-Policy"'));
  assert.throws(() => secureStaticHtml("<body>Missing head</body>"), /missing its head/);
});

test("CSP covers nested routes and 404 without modifying JavaScript assets", () => {
  const root = mkdtempSync(join(tmpdir(), "raw-vives-csp-"));
  try {
    mkdirSync(join(root, "es"));
    mkdirSync(join(root, "_next"));
    const html = "<html><head></head><body></body></html>";
    writeFileSync(join(root, "404.html"), html);
    writeFileSync(join(root, "es", "archive.html"), html);
    writeFileSync(join(root, "_next", "app.js"), "window.app=true");
    writeFileSync(join(root, "google123abc.html"), "google-site-verification: google123abc.html");
    assert.equal(secureStaticExport(root), 2);
    assert.match(readFileSync(join(root, "es", "archive.html"), "utf8"), /Content-Security-Policy/);
    assert.equal(readFileSync(join(root, "_next", "app.js"), "utf8"), "window.app=true");
    assert.equal(readFileSync(join(root, "google123abc.html"), "utf8"), "google-site-verification: google123abc.html");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("locale and legacy redirects include security headers and preserve their destinations", async () => {
  for (const [handler, url, status, destination] of [
    [rootRedirect, "https://rawvives.aleviclop.dev/?ref=test", 307, "https://rawvives.aleviclop.dev/en?ref=test"],
    [legacyRedirect, "https://gallery.aleviclop.dev/es/photo/1?ref=test", 308, "https://rawvives.aleviclop.dev/es/photo/1?ref=test"],
  ] as const) {
    const response = await handler({ request: new Request(url), next: async () => new Response("asset") });
    assert.equal(response.status, status);
    assert.equal(response.headers.get("location"), destination);
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal(response.headers.get("x-frame-options"), "DENY");
    assert.match(response.headers.get("strict-transport-security")!, /max-age=31536000/);
    assert.match(response.headers.get("content-security-policy")!, /default-src 'none'/);
  }
});
