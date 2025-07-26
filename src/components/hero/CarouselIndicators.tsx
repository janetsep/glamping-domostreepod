import React from "react";
import { CarouselImage } from "./useImageCarousel";

interface CarouselIndicatorsProps {
  images: CarouselImage[];
  currentImageIndex: number;
  onImageSelect: (index: number) => void;
}

export const CarouselIndicators: React.FC<CarouselIndicatorsProps> = ({
  images,
  currentImageIndex,
  onImageSelect
}) => {
  return (
    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
      {images.map((_, index) => (
        <button
          key={index}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            currentImageIndex === index 
              ? "bg-cyan-400 w-6" 
              : "bg-white/50 hover:bg-white/80"
          }`}
          onClick={() => onImageSelect(index)}
          aria-label={`Ver imagen ${index + 1}`}
        />
      ))}
    </div>
  );
};
