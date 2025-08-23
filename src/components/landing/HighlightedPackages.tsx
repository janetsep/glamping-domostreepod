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
      title: "Ocasiones Especiales",
      description: "Una cena especial bajo las estrellas y el confort de un domo único en la montaña",
      price: 150000,
      originalPrice: 190000,
      image: "/lovable-uploads/ad46dae8-5b0a-4e4a-bf84-e0752b40f588.png",
      discount: "21% OFF",
      code: "SPECIAL21",
      validTill: "Dec 31, 2024"
    },
    {
      id: "3",
      title: "Aventura de Montaña", 
      description: "Después de una jornada recorriendo la montaña, el domo se convierte en tu refugio perfecto",
      price: 125000,
      originalPrice: 160000,
      image: "/lovable-uploads/5bf3bb3b-da31-4f12-a031-1d7274b2b1cc.png",
      discount: "22% OFF",
      code: "ADVENTURE22",
      validTill: "Jan 15, 2025"
    },
    {
      id: "7",
      title: "Trekking Explorer",
      description: "Senderos a cascadas escondidas y miradores naturales desde tu domo base",
      price: 125000,
      originalPrice: 155000,
      image: "/lovable-uploads/e097d405-d6e7-4410-af4a-b2cb8d55c03b.png",
      discount: "19% OFF",
      code: "TREK19",
      validTill: "Feb 28, 2025"
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
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span className="text-2xl">✨</span>
            Ofertas Especiales
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Las experiencias más solicitadas
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Aprovecha nuestras ofertas por tiempo limitado
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {highlightedPackages.map((pkg) => (
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                {/* Discount Badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-lg font-bold text-lg">
                    {pkg.discount}
                  </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">
                    {pkg.title}
                  </h3>
                  <p className="text-white/90 mb-4 text-sm leading-relaxed">
                    {pkg.description}
                  </p>

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
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/unit/${pkg.id}`);
                    }}
                  >
                    Book This Offer
                  </Button>
                </div>
              </div>
            </div>
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