
import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
  unitName: string;
}

export const ImageGallery = ({ images, unitName }: ImageGalleryProps) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <>
      {/* Imagen principal con navegación */}
      <div className="relative rounded-lg overflow-hidden">
        <img 
          src={images[activeImageIndex]} 
          alt={`${unitName} - Vista ${activeImageIndex + 1}`} 
          className="w-full h-96 object-cover rounded-lg" 
        />
        
        {/* Navegación de imágenes */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {images.map((_, index) => (
            <button 
              key={index} 
              onClick={() => setActiveImageIndex(index)} 
              className={`w-2 h-2 rounded-full ${activeImageIndex === index ? 'bg-white' : 'bg-white/50'}`} 
              aria-label={`Ver imagen ${index + 1}`} 
            />
          ))}
        </div>
      </div>
      
      {/* Miniaturas de imágenes */}
      <div className="grid grid-cols-5 gap-2 mt-2">
        {images.map((img, index) => (
          <div 
            key={index} 
            className={`h-24 rounded-md overflow-hidden cursor-pointer ${activeImageIndex === index ? 'ring-2 ring-primary' : ''}`} 
            onClick={() => setActiveImageIndex(index)}
          >
            <img 
              src={img} 
              alt={`${unitName} - Miniatura ${index + 1}`} 
              className="w-full h-full object-cover" 
            />
          </div>
        ))}
      </div>
    </>
  );
};
