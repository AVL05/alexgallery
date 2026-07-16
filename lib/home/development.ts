export const HOME_PREVIEW_EVENT = "raw-vives:home-preview";
export const HOME_STATE_EVENT = "raw-vives:home-state";

export type HomePreviewOptions = {
  alternate?: boolean;
  emptyCategories?: boolean;
  failImages?: boolean;
  fewPhotos?: boolean;
  reducedMotion?: boolean;
  slowImages?: boolean;
};

export type HomeStateDetail = HomePreviewOptions & {
  selectedCount: number;
  chapterCount: number;
};

export function requestHomePreview(options: HomePreviewOptions = {}) {
  if (typeof window === "undefined" || process.env.NODE_ENV !== "development") return;
  window.dispatchEvent(new CustomEvent(HOME_PREVIEW_EVENT, { detail: options }));
}

export function reportHomeState(detail: HomeStateDetail) {
  if (typeof window === "undefined" || process.env.NODE_ENV !== "development") return;
  window.dispatchEvent(new CustomEvent(HOME_STATE_EVENT, { detail }));
}
