import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

// Zero-dependency static server for the Next.js export in out/ so Playwright
// can smoke-test production HTML. Maps clean URLs to .html files; anything
// unknown falls back to 404.html. Test/dev infrastructure only.
const root = path.resolve("out");
const port = Number(process.env.E2E_PORT ?? 8789);

const contentTypes: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".webmanifest": "application/manifest+json",
  ".ico": "image/x-icon",
};

async function isFile(candidate: string) {
  if (!candidate.startsWith(root)) return false;
  try {
    return (await stat(candidate)).isFile();
  } catch {
    return false;
  }
}

async function resolveFile(urlPath: string): Promise<{ file: string; status: number }> {
  const pathname = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  // Strip trailing slashes so /es/ resolves like the clean /es canonical URL.
  const safe = path.normalize(pathname).replace(/^[/\\]+/, "").replace(/\/+$/, "");
  if (safe === "") return { file: path.join(root, "index.html"), status: 200 };
  for (const candidate of [
    path.join(root, `${safe}.html`),
    path.join(root, safe, "index.html"),
    path.join(root, safe),
  ]) {
    if (await isFile(candidate)) return { file: candidate, status: 200 };
  }
  return { file: path.join(root, "404.html"), status: 404 };
}

const server = createServer(async (request, response) => {
  try {
    const { file, status } = await resolveFile(request.url ?? "/");
    if (!(await isFile(file))) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }
    const body = await readFile(file);
    response.writeHead(status, {
      "content-type": contentTypes[path.extname(file)] ?? "application/octet-stream",
    });
    response.end(body);
  } catch {
    response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    response.end("Server error");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Serving out/ at http://127.0.0.1:${port}`);
});
