import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import { CarouselImage } from "./useImageCarousel";

interface ImageCarouselProps {
  images: CarouselImage[];
  currentImageIndex: number;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  currentImageIndex
}) => {
  return (
    <div className="w-full h-full relative">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            currentImageIndex === index ? "opacity-100" : "opacity-0"
          }`}
          style={{
            visibility: Math.abs(currentImageIndex - index) <= 1 || 
                       currentImageIndex === 0 && index === images.length - 1 || 
                       currentImageIndex === images.length - 1 && index === 0 
                       ? 'visible' : 'hidden'
          }}
        >
          <LazyLoadImage
            src={image.src}
            alt={`Bosque y naturaleza ${index + 1}`}
            effect="blur"
            placeholderSrc={image.placeholder}
            wrapperClassName="w-full h-full"
            className="w-full h-full object-cover object-center transition-transform duration-10000 ease-in-out"
            visibleByDefault={index === currentImageIndex}
            threshold={500}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/60 backdrop-blur-[1px]"></div>
    </div>
  );
};
