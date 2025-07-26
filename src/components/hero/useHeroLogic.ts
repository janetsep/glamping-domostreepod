import { useImageCarousel } from "./useImageCarousel";
import { useImagePreloader } from "./useImagePreloader";
import { useParallaxEffect } from "./useParallaxEffect";
import { useElfsightLoader } from "./useElfsightLoader";
import { useLoadingAnimation } from "./useLoadingAnimation";
import { useSectionReferences } from "./useSectionReferences";
import { heroImages } from "./heroImages";

export const useHeroLogic = () => {
  const { benefitsRef, heroRef } = useSectionReferences();
  const { currentImageIndex, goToImage } = useImageCarousel(heroImages, 5000);
  const isLoaded = useLoadingAnimation(300);

  // Efectos secundarios
  useImagePreloader(heroImages, currentImageIndex);
  useParallaxEffect(heroRef);
  useElfsightLoader();

  return {
    benefitsRef,
    heroRef,
    currentImageIndex,
    goToImage,
    isLoaded,
    images: heroImages
  };
};
