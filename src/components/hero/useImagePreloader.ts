import { useEffect } from "react";
import { CarouselImage } from "./useImageCarousel";

export const useImagePreloader = (images: CarouselImage[], currentImageIndex: number) => {
  useEffect(() => {
    const preloadNextImage = () => {
      const nextIndex = (currentImageIndex + 1) % images.length;
      const preloadLink = document.createElement('link');
      preloadLink.href = images[nextIndex].src;
      preloadLink.rel = 'preload';
      preloadLink.as = 'image';
      document.head.appendChild(preloadLink);
    };

    preloadNextImage();

    return () => {
      // Limpieza de elementos de precarga
      const preloadLinks = document.querySelectorAll('link[rel="preload"][as="image"]');
      preloadLinks.forEach(link => link.remove());
    };
  }, [currentImageIndex, images]);
};
