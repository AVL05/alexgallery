import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const WEB_WIDTHS = [400, 800, 1200] as const;
const MAX_PUBLIC_WIDTH = 2000;
const supportedInput = /\.(avif|jpe?g|png|tiff?|webp)$/i;

function readFlag(name: string) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  const input = readFlag("input");
  const id = readFlag("id");
  const stage = readFlag("stage");
  const force = process.argv.includes("--force");
  if (!input || !id || !/^\d+$/.test(id) || !stage || !["original", "corrected"].includes(stage)) {
    throw new Error("Usage: pnpm prepare-photo-process -- --id <photo-id> --stage <original|corrected> --input <authorized-web-export> [--force]");
  }
  const inputPath = path.resolve(input);
  if (!fs.existsSync(inputPath)) throw new Error(`Input does not exist: ${inputPath}`);
  if (!supportedInput.test(inputPath)) throw new Error("Export a camera original or faithful RAW representation to JPEG, TIFF, PNG, WebP or AVIF before preparing public variants.");

  const outputDirectory = path.resolve(process.cwd(), "public", "photos", "process", id, stage);
  const targets = [...WEB_WIDTHS.map(String), "full"].flatMap((name) => [path.join(outputDirectory, `${name}.webp`), path.join(outputDirectory, `${name}.avif`)]);
  if (!force && targets.some((target) => fs.existsSync(target))) throw new Error(`Public variants already exist for photo ${id}/${stage}. Re-run with --force only after verifying the target.`);

  const metadata = await sharp(inputPath).metadata();
  if (!metadata.width || !metadata.height) throw new Error("The source dimensions could not be read.");
  fs.mkdirSync(outputDirectory, { recursive: true });

  for (const width of WEB_WIDTHS) {
    await sharp(inputPath).rotate().resize(width, undefined, { withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(outputDirectory, `${width}.webp`));
    await sharp(inputPath).rotate().resize(width, undefined, { withoutEnlargement: true }).avif({ quality: 65 }).toFile(path.join(outputDirectory, `${width}.avif`));
  }
  await sharp(inputPath).rotate().resize(MAX_PUBLIC_WIDTH, undefined, { withoutEnlargement: true }).webp({ quality: 86 }).toFile(path.join(outputDirectory, "full.webp"));
  await sharp(inputPath).rotate().resize(MAX_PUBLIC_WIDTH, undefined, { withoutEnlargement: true }).avif({ quality: 70 }).toFile(path.join(outputDirectory, "full.avif"));
  const publicMetadata = await sharp(path.join(outputDirectory, "full.webp")).metadata();
  console.log(`Prepared ${id}/${stage}: ${publicMetadata.width}x${publicMetadata.height}, WebP + AVIF, metadata stripped.`);
  console.log(`Configure src: /photos/process/${id}/${stage}/full.webp`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
