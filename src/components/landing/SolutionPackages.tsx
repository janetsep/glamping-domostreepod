import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Calendar, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const SolutionPackages = () => {
  const navigate = useNavigate();

  const adventurePackages = [
    {
      id: "3",
      title: "Aventura de Montaña",
      description: "Refugio perfecto después de explorar senderos y cascadas en la cordillera andina",
      price: 125000,
      originalPrice: 160000,
      image: "/lovable-uploads/5bf3bb3b-da31-4f12-a031-1d7274b2b1cc.png",
      discount: "22% OFF",
      code: "MOUNTAIN22",
      validTill: "Mar 31, 2025"
    },
    {
      id: "7",
      title: "Trekking Paradise", 
      description: "Acceso directo a rutas de trekking hacia miradores naturales y bosques nativos",
      price: 125000,
      originalPrice: 155000,
      image: "/lovable-uploads/e097d405-d6e7-4410-af4a-b2cb8d55c03b.png",
      discount: "19% OFF",
      code: "TRAIL19",
      validTill: "Apr 15, 2025"
    },
    {
      id: "6",
      title: "Nature Photography",
      description: "Posición privilegiada para capturar amaneceres épicos y vida silvestre única",
      price: 130000,
      originalPrice: 165000,
      image: "/lovable-uploads/365c130e-5ba5-49fa-84ed-dfb1c95cd08d.png",
      discount: "21% OFF",
      code: "PHOTO21",
      validTill: "May 30, 2025"
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <section id="packages" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            Paquetes Aventura
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Para los amantes de la adrenalina
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experiencias diseñadas para quienes buscan aventura sin renunciar al confort
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {adventurePackages.map((pkg) => (
            <div key={pkg.id} className="relative overflow-hidden rounded-xl group cursor-pointer transition-all duration-300 hover:shadow-xl" 
                 onClick={() => navigate(`/unit/${pkg.id}`)}>
              {/* Background Image */}
              <div className="relative h-80 w-full">
                <img 
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                
                {/* Discount Badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-primary text-white px-3 py-1 rounded-lg font-bold text-lg shadow-lg">
                    {pkg.discount}
                  </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  {/* Title with strong background */}
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 mb-3">
                    <h3 className="text-2xl font-bold text-white">
                      {pkg.title}
                    </h3>
                  </div>
                  
                  {/* Description with background */}
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-3 mb-4">
                    <p className="text-white text-sm leading-relaxed">
                      {pkg.description}
                    </p>
                  </div>

                  {/* Code and Valid Till */}
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center">
                      <span className="text-white/70">Código:</span>
                      <span className="ml-2 font-mono font-bold">{pkg.code}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-white/70">Valid till:</span>
                      <span className="ml-2 font-medium">{pkg.validTill}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/unit/${pkg.id}`);
                    }}
                  >
                    Reservar Ahora
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white px-8 py-4"
            onClick={() => navigate('/paquetes')}
          >
            Ver Todos los Paquetes
          </Button>
        </div>
      </div>
    </section>
  );
};