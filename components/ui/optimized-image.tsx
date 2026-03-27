'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  width: number;
  height: number;
  alt: string;
  blurDataURL?: string;
  priority?: boolean;
  className?: string;
  onClick?: () => void;
}

export function OptimizedImage({
  src,
  width,
  height,
  alt,
  blurDataURL,
  priority = false,
  className = '',
  onClick,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div 
      className={`relative overflow-hidden bg-muted/20 ${className}`}
      onClick={onClick}
    >
      <Image
        src={src}
        width={width}
        height={height}
        alt={alt}
        priority={priority}
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        onLoad={() => setIsLoaded(true)}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={`
          duration-700 ease-in-out
          ${isLoaded ? 'scale-100 blur-0 grayscale-0' : 'scale-105 blur-lg grayscale'}
        `}
      />
    </div>
  );
}
