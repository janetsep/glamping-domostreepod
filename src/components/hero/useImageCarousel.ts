import { useState, useEffect } from "react";

export interface CarouselImage {
  src: string;
  placeholder: string;
  alt: string;
}

export const useImageCarousel = (images: CarouselImage[], intervalMs: number = 5000) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [images.length, intervalMs]);

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return {
    currentImageIndex,
    goToImage,
    setCurrentImageIndex
  };
};
