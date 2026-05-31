export interface ExifData {
  make?: string;
  model?: string;
  lensModel?: string;
  fNumber?: string | number;
  iso?: number;
  exposureTime?: string;
}

export type PhotoCategory =
  | "Fauna"
  | "Arquitectura"
  | "Paisaje"
  | "Retrato"
  | "Meteorología"
  | "Virtual";

export type GalleryFilter = "Todo" | PhotoCategory;

export interface BasePhoto {
  id: number;
  title: string;
  category: PhotoCategory;
  year: string;
  image: string;
  color: string;
  description: string;
  featured?: boolean;
}

export interface Photo {
  id: number | string;
  src: string;
  image?: string; // Original data uses image
  width: number;
  height: number;
  title: string;
  description: string;
  year?: string;
  category: PhotoCategory;
  featured?: boolean;
  blurDataURL?: string;
  color?: string;
  alt?: string;
  exif?: ExifData;
  histogram?: number[];
  srcAvif?: string;
  variants?: {
    [key: string]: string;
  };
}

export interface PhotoData {
  images: Photo[];
}

export interface OptimizedImageData {
  id: string;
  src: string;
  srcAvif?: string;
  width: number;
  height: number;
  blurDataURL?: string;
  alt?: string;
  exif?: ExifData;
  histogram?: number[];
  variants?: Record<string, string>;
}

export interface ImagesData {
  images: OptimizedImageData[];
}
