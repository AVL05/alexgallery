import { copyFileSync, existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

// shortcut: Next 16.3 Windows exports use nested segment paths; remove when
// Next emits the same flat filenames as its client router on every platform.
export function normalizeStaticExport(root: string): number {
  let copied = 0;
  function walk(directory: string, routeRoot?: string) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const source = join(directory, entry.name);
      if (entry.isDirectory()) {
        if (!routeRoot && entry.name === "_next") continue;
        walk(source, routeRoot ?? (entry.name.startsWith("__next.") ? directory : undefined));
      } else if (routeRoot && entry.name.endsWith(".txt")) {
        const destination = join(routeRoot, relative(routeRoot, source).split(sep).join("."));
        if (existsSync(destination)) {
          if (!readFileSync(source).equals(readFileSync(destination))) {
            throw new Error(`Conflicting static segment: ${destination}`);
          }
        } else {
          copyFileSync(source, destination);
          copied++;
        }
      }
    }
  }
  walk(resolve(root));
  // Static hosts infer MIME from the extension; keep Next's endpoint as well.
  const socialImage = join(root, "opengraph-image");
  if (existsSync(socialImage)) copyFileSync(socialImage, `${socialImage}.png`);
  return copied;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve("scripts/normalize-static-export.ts")) {
  console.log(`Normalized ${normalizeStaticExport("out")} static segment files.`);
}
