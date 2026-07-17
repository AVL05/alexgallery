import type { ImagesData } from "@/types/photo";

/**
 * Removes pipeline-only metadata before data crosses a Server/Client boundary.
 * Runtime image rendering does not consume AVIF source aliases or histograms.
 */
export function getClientImagesData(imagesData: ImagesData): ImagesData {
  return {
    images: imagesData.images.map((image) => ({
      id: image.id,
      src: image.src,
      width: image.width,
      height: image.height,
      blurDataURL: image.blurDataURL,
      alt: image.alt,
      ...(image.exif && Object.keys(image.exif).length > 0 ? { exif: image.exif } : {}),
      variants: image.variants,
    })),
  };
}
