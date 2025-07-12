
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { GlampingUnit, getUnitImages } from "@/lib/supabase";

// Importar imágenes reales mejoradas
import treepodExterior from "@/assets/treepod-exterior-real.jpg";
import treepodInterior from "@/assets/treepod-interior-real.jpg";
import treepodCozyInterior from "@/assets/treepod-cozy-interior.jpg";
import forestCanopy from "@/assets/forest-canopy-real.jpg";

interface ImageGalleryProps {
  unit: GlampingUnit;
}

export const ImageGallery = ({ unit }: ImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Usar las imágenes reales auténticas de TreePod
  const realImages = [
    "/lovable-uploads/26544819-643d-4e3f-8599-74f7f3611221.png", // Exterior en bosque
    "/lovable-uploads/0aba3582-f7e0-478e-b316-3893d4cebacc.png", // Interior con chimenea
    "/lovable-uploads/8c94b429-4fba-49f4-a9e1-9d5970782bba.png", // Interior panorámico
    "/lovable-uploads/daf4f24d-4485-4324-9991-3f7d52a79e0f.png", // Cocina
    "/lovable-uploads/a12a8e24-f99f-48c6-9bc2-eea9e8df4ef5.png", // Exterior atardecer
    "/lovable-uploads/7202eec3-bd82-4939-90a9-0a6509fa2af0.png"  // Invierno con nieve
  ];
  
  // Usar las imágenes reales si no hay imágenes específicas del unit
  const images = getUnitImages(unit).length > 1 ? getUnitImages(unit) : realImages;

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
