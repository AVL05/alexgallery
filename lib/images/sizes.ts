// Responsive `sizes` presets aligned with the custom image loader
// (400 / 800 / 1200 / original variants). Values mirror current usage so
// fullscreen, editorial, grid and thumbnail views request no more than needed.
export const photoSizes = {
  fullBleed: "100vw",
  editorialFeature: "(max-width: 767px) 100vw, 58vw",
  seriesEditorial: "(max-width: 767px) 100vw, (max-width: 1439px) 84vw, 76rem",
  archiveFeature: "(max-width: 767px) 100vw, (max-width: 1023px) 92vw, 62vw",
  archiveStandard: "(max-width: 479px) 100vw, (max-width: 1023px) 50vw, 31vw",
  detailMain: "(max-width: 1023px) 100vw, 68vw",
  detailRelated: "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw",
  detailNavigation: "(max-width: 767px) 100vw, 45vw",
  processComparison: "(max-width: 767px) 100vw, (max-width: 1279px) 82vw, 68vw",
  workNarrow: "(max-width: 767px) 92vw, 448px",
  archivePreview: "(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw",
} as const;

export type PhotoSizesPreset = keyof typeof photoSizes;
