export interface ExifData {
  make?: string;
  model?: string;
  lensModel?: string;
  fNumber?: string | number;
  iso?: number;
  exposureTime?: string;
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
  category: string;
  blurDataURL?: string;
  color?: string;
  alt?: string;
  exif?: ExifData;
  variants?: {
    [key: number]: string;
  };
}

export interface PhotoData {
  images: Photo[];
}
