import { useState, useEffect } from 'react';

export function useImagePreloader(urls: string[]) {
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);

  useEffect(() => {
    if (urls.length === 0) {
      setAllLoaded(true);
      return;
    }

    let loadedCount = 0;
    const totalCount = urls.length;

    const onImageLoad = () => {
      loadedCount++;
      setImagesLoaded(loadedCount);
      if (loadedCount >= totalCount) {
        setAllLoaded(true);
      }
    };

    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
      if (img.complete) {
        onImageLoad();
      } else {
        img.onload = onImageLoad;
        img.onerror = onImageLoad; // Count error as "loaded" to avoid hanging
      }
    });
  }, [urls]);

  return { 
    progress: urls.length > 0 ? (imagesLoaded / urls.length) * 100 : 100, 
    allLoaded 
  };
}
