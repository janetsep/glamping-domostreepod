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
      title: "Para los aventureros de montaña",
      description: "Después de una jornada recorriendo la montaña, el domo se convierte en tu refugio de descanso...",
      price: 125000,
      originalPrice: 160000,
      maxGuests: 3,
      size: "36m²",
      image: "/lovable-uploads/5bf3bb3b-da31-4f12-a031-1d7274b2b1cc.png",
      discount: 22
    },
    {
      id: "7",
      title: "Para los amantes del trekking", 
      description: "El sendero comienza a pocos metros del domo, llevando a cascadas escondidas y miradores naturales...",
      price: 125000,
      originalPrice: 155000,
      maxGuests: 4,
      size: "34m²",
      image: "/lovable-uploads/e097d405-d6e7-4410-af4a-b2cb8d55c03b.png",
      discount: 19
    },
    {
      id: "6",
      title: "Para el fotógrafo de naturaleza",
      description: "Cada amanecer trae un espectáculo de luces y sombras en la montaña...",
      price: 130000,
      originalPrice: 165000,
      maxGuests: 2,
      size: "34m²", 
      image: "/lovable-uploads/365c130e-5ba5-49fa-84ed-dfb1c95cd08d.png",
      discount: 21
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
            <Card key={pkg.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer">
              <div className="relative">
                <img 
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="destructive" className="bg-red-500">
                    -{pkg.discount}%
                  </Badge>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-bold text-xl mb-3 text-gray-900">
                  {pkg.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {pkg.description}
                </p>
                
                <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>Hasta {pkg.maxGuests}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{pkg.size}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {formatPrice(pkg.price)}
                    </div>
                    <div className="text-sm text-gray-400 line-through">
                      {formatPrice(pkg.originalPrice)}
                    </div>
                  </div>
                  <Button 
                    variant="highlight" 
                    className="group/btn"
                    onClick={() => navigate(`/unit/${pkg.id}`)}
                  >
                    Ver Detalles
                    <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </Card>
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