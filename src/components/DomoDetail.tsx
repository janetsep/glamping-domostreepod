
import { useState } from "react";
import { Users } from "lucide-react";

interface DomoImage {
  id: string;
  url: string;
  alt: string;
}

interface DomoDetailProps {
  images: DomoImage[];
  size: string;
  maxGuests: number;
  description: string;
}

const DomoDetail = ({ images, size, maxGuests, description }: DomoDetailProps) => {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      {/* Imagen principal */}
      <div className="relative h-80 overflow-hidden">
        <img 
          src={mainImage.url} 
          alt={mainImage.alt} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Galería de miniaturas */}
      <div className="grid grid-cols-6 gap-2 p-2">
        {images.map((image) => (
          <div 
            key={image.id}
            className={`h-20 rounded-md overflow-hidden cursor-pointer border-2 ${
              mainImage.id === image.id ? 'border-cyan-500' : 'border-transparent'
            }`}
            onClick={() => setMainImage(image)}
          >
            <img 
              src={image.url} 
              alt={image.alt} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      
      {/* Información del domo */}
      <div className="p-6">
        <h2 className="text-3xl font-bold text-cyan-600">
          Domo
        </h2>
        <div className="flex items-center gap-2 text-gray-600 mt-2">
          <span>{size}</span>
          <span className="mx-2">•</span>
          <div className="flex items-center">
            <Users size={18} className="mr-1" />
            <span>Hasta {maxGuests} personas</span>
          </div>
        </div>
        
        <p className="mt-4 text-gray-700">
          {description}
        </p>
      </div>
    </div>
  );
};

export default DomoDetail;
