import assert from "node:assert/strict";
import test from "node:test";
import { buildContactMailto } from "../../lib/contact/mailto";
import es from "../../dictionaries/es.json";
import en from "../../dictionaries/en.json";

test("message mailto encodes reserved characters and multiline text without extra headers", () => {
  const href = buildContactMailto({ name: "Álex & compañía", email: "test@example.com", message: "Luz & sombra?\nUna fotografía #1 + otra" }, es.contact);
  const url = new URL(href);
  assert.equal(url.pathname, "alexviclop@gmail.com");
  assert.equal(url.searchParams.get("subject"), "Mensaje — raw.vives");
  assert.equal(url.searchParams.get("body"), "Nombre: Álex & compañía\r\nCorreo electrónico: test@example.com\r\n\r\nLuz & sombra?\nUna fotografía #1 + otra");
  assert.deepEqual([...url.searchParams.keys()], ["subject", "body"]);
});

test("license mailto includes localized fields, photo reference and optional company", () => {
  const url = new URL(buildContactMailto({ name: "Alex", email: "test@example.com", company: "Studio", photoId: "21 — Last stop: night", usageType: "editorial", description: "A magazine cover." }, en.contact));
  assert.equal(url.searchParams.get("subject"), "Licenses — raw.vives");
  const body = url.searchParams.get("body")!;
  assert.match(body, /Studio/);
  assert.match(body, /21 — Last stop: night/);
  assert.match(body, /Editorial/);
  assert.match(body, /A magazine cover\./);
});
