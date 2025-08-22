import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { travelerTypesContent } from "@/data/content/travelerTypes";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Users, Heart, Mountain, Crown } from "lucide-react";

const personaIcons = {
  "parejas-jovenes": Heart,
  "familias": Users,
  "grupos-amigos": Mountain,
  "exclusividad-total": Crown
};

const personaColors = {
  "parejas-jovenes": "from-rose-500 to-pink-600",
  "familias": "from-blue-500 to-cyan-600", 
  "grupos-amigos": "from-green-500 to-emerald-600",
  "exclusividad-total": "from-purple-500 to-violet-600"
};

export const BuyerPersonaSection = () => {
  const navigate = useNavigate();

  const handlePersonaClick = (personaId: string) => {
    navigate(`/tipo-viajero/${personaId}`);
  };

  const handleReserveClick = (personaId: string) => {
    // Navigate to specific packages for this persona
    navigate(`/paquetes?persona=${personaId}`);
  };

  return (
    <section id="buyer-personas" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
            {travelerTypesContent.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {travelerTypesContent.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {travelerTypesContent.travelerTypes.map((persona, index) => {
            const IconComponent = personaIcons[persona.id as keyof typeof personaIcons];
            const gradientColor = personaColors[persona.id as keyof typeof personaColors];
            
            return (
              <Card 
                key={persona.id}
                id={`persona-${persona.id}`}
                className="overflow-hidden hover:shadow-2xl transition-all duration-500 group border-0 shadow-lg"
              >
                {/* Header with gradient and icon */}
                <div className={`bg-gradient-to-r ${gradientColor} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 opacity-10 transform rotate-12 scale-150">
                    <IconComponent size={120} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center mb-3">
                      <IconComponent className="w-8 h-8 mr-3" />
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        Experiencia Personalizada
                      </Badge>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">
                      {persona.name}
                    </h3>
                  </div>
                </div>

                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={persona.image}
                    alt={persona.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  <p className="text-gray-600 leading-relaxed">
                    {persona.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 mb-3">Incluye:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {persona.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradientColor} mr-3`} />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button 
                      variant="outline"
                      className="flex-1"
                      onClick={() => handlePersonaClick(persona.id)}
                    >
                      Ver Detalles
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button 
                      variant="highlight"
                      className="flex-1"
                      onClick={() => handleReserveClick(persona.id)}
                    >
                      Ver Paquetes
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              ¿No estás seguro qué experiencia elegir?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Nuestro equipo te ayudará a encontrar la experiencia perfecta para ti
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-primary hover:bg-gray-100"
            >
              Hablar con un Especialista
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};