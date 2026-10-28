import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

export function secureStaticHtml(html: string): string {
  if (!html.includes("<head>")) throw new Error("Static HTML is missing its head");
  // Only parse trusted Next build output, never visitor-supplied HTML.
  const hashes = new Set(Array.from(html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi), ([, body]) =>
    body ? `'sha256-${createHash("sha256").update(body).digest("base64")}'` : "",
  ).filter(Boolean));
  const policy = `script-src 'self' ${[...hashes].join(" ")}; script-src-attr 'none'`;
  const meta = `<meta http-equiv="Content-Security-Policy" content="${policy}">`;
  return html.replace(/<meta http-equiv="Content-Security-Policy" content="[^"]*">/g, "")
    .replace(/<head>(<meta\s+charset=[^>]+>)?/i, head => `${head}${meta}`);
}

export function secureStaticExport(root: string): number {
  let count = 0;
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "_next") count += secureStaticExport(path);
    } else if (entry.name.endsWith(".html")) {
      const html = readFileSync(path, "utf8");
      // Google's ownership token has an .html name but contains only plain text.
      if (/^google[0-9a-f]+\.html$/.test(entry.name) && html.trim() === `google-site-verification: ${entry.name}`) continue;
      writeFileSync(path, secureStaticHtml(html));
      count++;
    }
  }
  return count;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve("scripts/secure-static-export.ts")) {
  console.log(`Secured ${secureStaticExport("out")} static HTML files with script hashes.`);
}
