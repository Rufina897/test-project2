import { useState, useEffect } from 'react';

interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
  isLoaded: boolean;
}

export const useImageDimensions = (imageUrl: string | undefined): ImageDimensions => {
  const [dimensions, setDimensions] = useState<ImageDimensions>({
    width: 0,
    height: 0,
    aspectRatio: 0,
    isLoaded: false,
  });

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.src = imageUrl;


    img.onload = () => {


      setDimensions({
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height,
        isLoaded: true,
      });
    };
  }, [imageUrl]);

  return dimensions;
}; 