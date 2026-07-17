export type CoverTransform = { scaleX: number; scaleY: number; offsetX: number; offsetY: number };

export function getCoverTransform(
  viewportWidth: number,
  viewportHeight: number,
  imageWidth: number,
  imageHeight: number,
): CoverTransform {
  if ([viewportWidth, viewportHeight, imageWidth, imageHeight].some((value) => !Number.isFinite(value) || value <= 0)) {
    return { scaleX: 1, scaleY: 1, offsetX: 0, offsetY: 0 };
  }
  const viewportRatio = viewportWidth / viewportHeight;
  const imageRatio = imageWidth / imageHeight;
  const scaleX = imageRatio > viewportRatio ? viewportRatio / imageRatio : 1;
  const scaleY = imageRatio > viewportRatio ? 1 : imageRatio / viewportRatio;
  return {
    scaleX,
    scaleY,
    offsetX: (1 - scaleX) / 2,
    offsetY: (1 - scaleY) / 2,
  };
}

