import { useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const GalleryTestimonials = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const galleryImages = [
    {
      url: "/lovable-uploads/5bf3bb3b-da31-4f12-a031-1d7274b2b1cc.png",
      caption: "Domo geodésico en perfecta armonía con la naturaleza"
    },
    {
      url: "/lovable-uploads/e097d405-d6e7-4410-af4a-b2cb8d55c03b.png", 
      caption: "Experiencia de trekking con vistas espectaculares"
    },
    {
      url: "/lovable-uploads/365c130e-5ba5-49fa-84ed-dfb1c95cd08d.png",
      caption: "Atardeceres únicos desde tu domo privado"
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Carolina Méndez",
      location: "Santiago, Chile", 
      rating: 5,
      comment: "Una experiencia mágica. Los domos son hermosos, cómodos y la atención del equipo es excepcional. Las tinajas de agua mineralizada son imperdibles.",
      verified: true,
      avatar: "C"
    },
    {
      id: 2,
      name: "Martín Soto",
      location: "Buenos Aires, Argentina",
      rating: 5, 
      comment: "Vinimos buscando desconexión y encontramos mucho más. La ubicación es perfecta, entre el bosque pero con todas las comodidades.",
      verified: true,
      avatar: "M"
    },
    {
      id: 3,
      name: "Ana García", 
      location: "Concepción, Chile",
      rating: 5,
      comment: "El lugar ideal para escapar de la rutina. Los detalles en cada domo son increíbles y las vistas al bosque inigualables.",
      verified: true,
      avatar: "A"
    }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        
        {/* Gallery Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Play className="w-4 h-4" />
              Galería Visual
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Vive la experiencia TreePod
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubre la magia de nuestros domos en el Valle Las Trancas
            </p>
          </div>

          {/* Main Gallery */}
          <div className="relative max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img 
                src={galleryImages[currentImageIndex].url}
                alt={galleryImages[currentImageIndex].caption}
                className="w-full h-[500px] object-cover transition-transform duration-500"
              />
              
              {/* Navigation arrows */}
              <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                onClick={prevImage}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              
              <Button
                variant="outline"
                size="icon" 
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                onClick={nextImage}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>

              {/* Caption overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <p className="text-white text-lg font-medium">
                  {galleryImages[currentImageIndex].caption}
                </p>
              </div>
            </div>

            {/* Thumbnail navigation */}
            <div className="flex justify-center gap-4 mt-6">
              {galleryImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <img 
                    src={image.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Quote className="w-4 h-4" />
              Experiencias Reales
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Lo que dicen nuestros huéspedes
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Testimonios verificados de quienes han vivido la magia de TreePod
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                {/* Header with avatar and info */}
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <span className="text-primary font-bold text-lg">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-foreground mb-1">
                      {testimonial.name}
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    {testimonial.verified && (
                      <div className="text-xs text-primary font-medium">
                        Huésped Verificado
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Quote */}
                <Quote className="w-6 h-6 text-primary/30 mb-3" />
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {testimonial.comment}
                </p>
                
                {/* Location */}
                <div className="text-xs text-muted-foreground">
                  {testimonial.location}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};