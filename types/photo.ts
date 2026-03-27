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
  variants?: {
    [key: number]: string;
  };
}

export interface PhotoData {
  images: Photo[];
}
