import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HighlightedPackages = () => {
  const navigate = useNavigate();

  const highlightedPackages = [
    {
      id: "8",
      title: "Para quienes celebran ocasiones especiales",
      description: "Celebrar en medio de la montaña tiene otro significado. Una cena especial bajo las estrellas...",
      price: 150000,
      originalPrice: 190000,
      maxGuests: 2,
      size: "40m²",
      image: "/lovable-uploads/ad46dae8-5b0a-4e4a-bf84-e0752b40f588.png",
      badge: "Destacado",
      discount: 21
    },
    {
      id: "3",
      title: "Para los aventureros de montaña", 
      description: "Después de una jornada recorriendo la montaña, el domo se convierte en tu refugio de descanso...",
      price: 125000,
      originalPrice: 160000,
      maxGuests: 3,
      size: "36m²",
      image: "/lovable-uploads/5bf3bb3b-da31-4f12-a031-1d7274b2b1cc.png",
      badge: "Destacado",
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
      badge: "Destacado", 
      discount: 19
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
    <section className="py-16 bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span className="text-2xl">✨</span>
            Destacados del Mes
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Las experiencias más solicitadas
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Estas son las experiencias favoritas de nuestros huéspedes este mes
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {highlightedPackages.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer relative">
              {/* Featured Badge */}
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-yellow-500 text-yellow-900 font-semibold">
                  {pkg.badge}
                </Badge>
              </div>
              
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
                    <span>Hasta {pkg.maxGuests} personas</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
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
                    onClick={() => navigate(`/unit/${pkg.id}`)}
                  >
                    Reservar →
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom Message */}
        <div className="text-center mt-12 bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Por qué son los más solicitados?
          </h3>
          <p className="text-gray-600 mb-6">
            Estos paquetes combinan perfectly la aventura, el confort y experiencias auténticas 
            que nuestros huéspedes valoran más. Reserva ahora y descubre por qué son tan especiales.
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white"
            onClick={() => navigate('/paquetes')}
          >
            Explorar Todos los Paquetes
          </Button>
        </div>
      </div>
    </section>
  );
};