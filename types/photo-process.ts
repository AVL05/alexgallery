export type LocalizedText = {
  es: string;
  en: string;
};

export type PhotoProcessStageKind =
  | "camera-original"
  | "raw-preview"
  | "unedited-export"
  | "technical-correction"
  | "final";

export type PhotoProcessStageId = "original" | "corrected" | "final";

export type PhotoProcessAsset = {
  src: string;
  variants: Record<"400" | "800" | "1200", string>;
  width: number;
  height: number;
  kind: PhotoProcessStageKind;
  alt: LocalizedText;
  blurDataURL?: string;
};

export type PhotoProcessStep = {
  id: string;
  stage: PhotoProcessStageId;
  title: LocalizedText;
  description: LocalizedText;
  tool?: LocalizedText;
  order: number;
};

export type PhotoProcessConfig = {
  photoId: number;
  original: PhotoProcessAsset;
  corrected?: PhotoProcessAsset;
  notes?: LocalizedText;
  steps?: PhotoProcessStep[];
  initialPosition?: number;
};

export type ResolvedPhotoProcess = PhotoProcessConfig & {
  final: PhotoProcessAsset;
};

export type PhotoProcessPair = {
  before: PhotoProcessAsset;
  after: PhotoProcessAsset;
  id: "original-final" | "original-corrected" | "corrected-final";
};
