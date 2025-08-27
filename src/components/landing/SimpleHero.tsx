import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, Users } from "lucide-react";
import { useGlampingStats } from '@/hooks/useGlampingData';

export const SimpleHero = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading } = useGlampingStats();

  const scrollToPackages = () => {
    const element = document.getElementById('packages');
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.offsetTop - headerOffset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-white to-secondary/10">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: "url('/lovable-uploads/dafd81f1-18a1-4796-9a46-b39914b747a9.jpg')"
        }}
      />
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {!isLoading && stats ? 
              `${stats.averageRating}/5 • ${stats.totalGuests}+ huéspedes felices` :
              "Cargando..."
            }
          </span>
        </div>

        {/* Main headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-gray-900 mb-6 leading-tight">
          Desconecta del Ruido
          <br />
          <span className="text-primary">Conecta con la Naturaleza</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Experiencias únicas en domos geodésicos en Valle Las Trancas, 
          rodeado de bosque nativo y la cordillera de los Andes
        </p>

        {/* Key benefits */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-gray-700">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <span>Valle Las Trancas, Ñuble</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span>Hasta 4 personas por domo</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            <span>Experiencia premium</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={scrollToPackages}
          >
            Ver Paquetes Disponibles
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300"
            onClick={() => navigate('/unit/1')}
          >
            Reservar Ahora
          </Button>
        </div>

        {/* Social proof indicator */}
        <p className="text-sm text-gray-500 mt-6">
          {!isLoading && stats ? 
            `Únete a más de ${stats.totalGuests} huéspedes que han vivido experiencias inolvidables` :
            "Únete a nuestros huéspedes que han vivido experiencias inolvidables"
          }
        </p>
      </div>
    </section>
  );
};