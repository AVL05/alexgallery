import { existsSync, rmSync } from "node:fs";
import { resolve, sep } from "node:path";

const outputRoot = resolve(process.cwd(), "out");
const rawOutput = resolve(outputRoot, "photos", "raw");

if (!rawOutput.startsWith(`${outputRoot}${sep}`)) {
  throw new Error(`Refusing to prune outside the static output: ${rawOutput}`);
}

if (existsSync(rawOutput)) {
  rmSync(rawOutput, { recursive: true, force: true });
  console.log(`Removed pipeline-only sources from ${rawOutput}`);
} else {
  console.log("No pipeline-only photo sources found in the static output.");
}
