import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Star, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { heroContent } from "@/data/content/hero";

const heroImages = [
  "/lovable-uploads/71928294-5635-46f7-a3ec-5fb33ef836ea.png",
  "/lovable-uploads/8c7ac924-839e-490f-925a-eb74a04c1e40.png",
  "/lovable-uploads/1e29d754-6882-4de5-b2ca-3d9680160dda.png",
  "/lovable-uploads/8365f2da-fa25-4ee2-b11c-f4651affb6ab.png"
];

const buyerPersonaOptions = [
  { 
    id: "parejas-jovenes", 
    label: "Parejas Aventureras", 
    emoji: "💕",
    description: "Experiencias románticas con adrenalina"
  },
  { 
    id: "familias", 
    label: "Familias", 
    emoji: "👨‍👩‍👧‍👦",
    description: "Diversión para toda la familia"
  },
  { 
    id: "grupos-amigos", 
    label: "Grupos de Amigos", 
    emoji: "👥",
    description: "Aventuras compartidas"
  },
  { 
    id: "exclusividad-total", 
    label: "Experiencia Exclusiva", 
    emoji: "👑",
    description: "Privacidad y lujo total"
  }
];

export const HeroPersonalized = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const scrollToPersonaSection = (personaId?: string) => {
    if (personaId) {
      const element = document.getElementById(`persona-${personaId}`);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      const element = document.getElementById('buyer-personas');
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`TreePod Experience ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
        {/* Location Badge */}
        <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">Valle Las Trancas, Chile</span>
          <div className="flex ml-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight">
          {heroContent.title}
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
          {heroContent.subtitle}
        </p>

        {/* Buyer Persona Quick Selection */}
        <div className="mb-8">
          <p className="text-lg mb-4 font-medium">¿Qué tipo de experiencia buscas?</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {buyerPersonaOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setSelectedPersona(option.id);
                  scrollToPersonaSection(option.id);
                }}
                className={`bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg p-4 transition-all duration-300 border border-white/20 hover:border-white/40 ${
                  selectedPersona === option.id ? 'bg-white/25 border-white/60' : ''
                }`}
              >
                <div className="text-2xl mb-1">{option.emoji}</div>
                <div className="text-sm font-semibold">{option.label}</div>
                <div className="text-xs opacity-80 mt-1">{option.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            variant="highlight"
            className="text-lg px-8 py-3"
            onClick={() => navigate("/unit/1")}
          >
            Reservar Ahora
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-gray-900"
            onClick={() => scrollToPersonaSection()}
          >
            Explorar Experiencias
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/80" />
        </div>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-4 right-4 flex space-x-2 z-20">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentImageIndex ? 'bg-white' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};