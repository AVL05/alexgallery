import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { getPlaiceholder } from 'plaiceholder';
import exifr from 'exifr';

const INPUT_DIR = './public/photos/raw';
const OUTPUT_DIR = './public/photos/optimized';
const DATA_FILE = './lib/images-data.json';

const SIZES = [400, 800, 1200];

async function optimizeImages() {
  console.log('--- Starting Image Optimization ---');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = fs.readdirSync(INPUT_DIR).filter(file =>
    /\.(jpe?g|png|webp|avif)$/i.test(file)
  );

  const imagesData = [];

  for (const file of files) {
    const inputPath = path.join(INPUT_DIR, file);
    const fileName = path.parse(file).name;
    const fileExt = '.webp';

    console.log(`📸 Processing ${file}...`);

    try {
      const inputBuffer = fs.readFileSync(inputPath);
      const image = sharp(inputBuffer);
      const metadata = await image.metadata();

      if (!metadata.width || !metadata.height) {
        console.warn(`Skipping ${file}: Could not read metadata`);
        continue;
      }

      // 1. Generate sized versions
      for (const size of SIZES) {
        const sizeDir = path.join(OUTPUT_DIR, size.toString());
        if (!fs.existsSync(sizeDir)) {
          fs.mkdirSync(sizeDir, { recursive: true });
        }

        await sharp(inputBuffer)
          .resize(size, null, { withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(path.join(sizeDir, `${fileName}.webp`));

        await sharp(inputBuffer)
          .resize(size, null, { withoutEnlargement: true })
          .avif({ quality: 65 })
          .toFile(path.join(sizeDir, `${fileName}.avif`));
      }

      // 2. Generate original version (but optimized)
      const originalDir = path.join(OUTPUT_DIR, 'original');
      if (!fs.existsSync(originalDir)) {
        fs.mkdirSync(originalDir, { recursive: true });
      }
      await sharp(inputBuffer)
        .webp({ quality: 85 })
        .toFile(path.join(originalDir, `${fileName}.webp`));

      await sharp(inputBuffer)
        .avif({ quality: 70 })
        .toFile(path.join(originalDir, `${fileName}.avif`));

      // 3. Generate Blur Data URL
      const { base64 } = await getPlaiceholder(inputBuffer, { size: 10 });

      // 4. Extract EXIF
      let exif = {};
      try {
        const rawExif = await exifr.parse(inputPath, {
          tiff: true,
          exif: true,
          reviveValues: true,
        }) || await exifr.parse(inputBuffer, {
          tiff: true,
          exif: true,
          reviveValues: true,
        });

        if (rawExif) {
          exif = {
            make: rawExif.Make,
            model: rawExif.Model,
            lensModel: rawExif.LensModel,
            fNumber: rawExif.FNumber,
            iso: rawExif.ISO,
            exposureTime: rawExif.ExposureTime ? (rawExif.ExposureTime < 1 ? `1/${Math.round(1/rawExif.ExposureTime)}` : `${rawExif.ExposureTime}`) : undefined,
          };
        }
      } catch (e) {
        console.warn(`Could not extract EXIF for ${file}:`, e);
      }

      // 5. Generate Histogram Data (Manual calculation from fresh instance)
      const { data: rawData } = await sharp(inputBuffer)
        .resize(100, 100, { fit: 'cover' })
        .greyscale()
        .raw()
        .toBuffer({ resolveWithObject: true });

      const binsCount = 20;
      const binSize = 256 / binsCount;
      const freq = Array(binsCount).fill(0);

      for (let i = 0; i < rawData.length; i++) {
        const value = rawData[i];
        const binIdx = Math.floor(value / binSize);
        freq[binIdx]++;
      }

      const histMax = Math.max(...freq);
      const normalizedHistogram = freq.map(v =>
        histMax > 0 ? Math.round((v / histMax) * 100) : 0
      );

      imagesData.push({
        id: fileName,
        src: `/photos/optimized/original/${fileName}.webp`,
        srcAvif: `/photos/optimized/original/${fileName}.avif`,
        width: metadata.width,
        height: metadata.height,
        blurDataURL: base64,
        alt: `Photography by Alex Gallery - ${fileName}`,
        exif,
        histogram: normalizedHistogram,
        variants: SIZES.reduce((acc, size) => ({
          ...acc,
          [size]: `/photos/optimized/${size}/${fileName}.webp`,
          [`${size}avif`]: `/photos/optimized/${size}/${fileName}.avif`
        }), {})
      });

      console.log(`✅ Finished ${file}`);
    } catch (err) {
      console.error(`❌ Failed to process ${file}:`, err);
    }
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify({ images: imagesData }, null, 2));
  console.log('--- Optimization Complete ---');
  console.log(`Total images processed: ${imagesData.length}`);
}

optimizeImages().catch(console.error);
