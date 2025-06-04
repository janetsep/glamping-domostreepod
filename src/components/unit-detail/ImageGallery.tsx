
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { GlampingUnit, getUnitImages } from "@/lib/supabase";

interface ImageGalleryProps {
  unit: GlampingUnit;
}

export const ImageGallery = ({ unit }: ImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Usar la función helper para obtener las imágenes
  const images = getUnitImages(unit);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!unit) {
    return <div>Cargando...</div>;
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video">
        <img
          src={images[currentImageIndex]}
          alt={`${unit.name} - Imagen ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Si falla la carga de una imagen, usar la imagen por defecto
            const target = e.target as HTMLImageElement;
            target.src = "/lovable-uploads/dafd81f1-18a1-4796-9a46-b39914b747a9.jpg";
          }}
        />
        
        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-2 right-2 bg-white/80 hover:bg-white"
            >
              <Expand className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <img
              src={images[currentImageIndex]}
              alt={`${unit.name} - Imagen ${currentImageIndex + 1}`}
              className="w-full h-auto"
            />
          </DialogContent>
        </Dialog>

        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
