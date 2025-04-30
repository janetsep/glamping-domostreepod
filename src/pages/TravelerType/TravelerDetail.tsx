
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Users, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/Section";
import { getTravelerTypeById } from "@/data/content/travelerTypes";
import { useNavigation } from "@/components/navigation/useNavigation";

// Componente de página de detalle para tipo de viajero específico
const TravelerDetail = () => {
  const { typeId } = useParams<{ typeId: string }>();
  const navigate = useNavigate();
  const [travelerType, setTravelerType] = useState<any>(null);
  const { handleReserveClick } = useNavigation();

  useEffect(() => {
    // Obtener los datos del tipo de viajero basado en el ID de la URL
    if (typeId) {
      const travelerData = getTravelerTypeById(typeId);
      if (travelerData) {
        setTravelerType(travelerData);
      } else {
        // Si no existe, redirigir a la página principal
        navigate("/");
      }
    }
    
    // Scroll al inicio al cargar la página
    window.scrollTo(0, 0);
  }, [typeId, navigate]);

  // Si no hay datos todavía, mostrar un indicador de carga
  if (!travelerType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-2xl text-primary">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen">
      {/* Sección Hero con imagen principal */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img 
          src={travelerType.image} 
          alt={travelerType.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <h1 className="text-4xl md:text-5xl text-white font-display font-bold mb-4">
              {travelerType.title}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              {travelerType.description}
            </p>
          </div>
        </div>
      </div>

      {/* Botón de volver atrás */}
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2" />
          Volver al inicio
        </Button>
      </div>

      {/* Sección de descripción detallada */}
      <Section className="bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary">Tu experiencia TreePod</h2>
            <div className="text-gray-700 space-y-4">
              {travelerType.detailedDescription.split('\n\n').map((paragraph: string, idx: number) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8">
              <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700" onClick={handleReserveClick}>
                <Sparkles className="mr-2 h-4 w-4" />
                Reservar esta experiencia
              </Button>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-md">
            <img 
              src={travelerType.secondaryImage || travelerType.image} 
              alt={`${travelerType.name} experiencia`}
              className="w-full h-[400px] object-cover" 
            />
          </div>
        </div>
      </Section>

      {/* Sección de características/beneficios */}
      <Section className="bg-gray-50">
        <div className="grid grid-cols-1 gap-6">
          <h2 className="text-2xl font-semibold text-primary">Lo que incluye tu experiencia</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {travelerType.features.map((feature: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="mt-1 text-green-600">
                  <Check size={18} />
                </span>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700" onClick={handleReserveClick}>
              <Users className="mr-2 h-4 w-4" />
              Reserva ahora
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default TravelerDetail;
