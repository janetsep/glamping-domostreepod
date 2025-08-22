import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { packageData } from "@/components/packages/data";
import { travelerTypesContent } from "@/data/content/travelerTypes";
import { ArrowLeft, Star, Users, Calendar } from "lucide-react";
import { Helmet } from "react-helmet-async";

const Packages = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const persona = searchParams.get("persona");

  // Filter packages based on persona if provided
  const getFilteredPackages = () => {
    if (!persona) return packageData;
    
    switch (persona) {
      case "parejas-jovenes":
        return packageData.filter(pkg => 
          pkg.title.toLowerCase().includes("pareja") || 
          pkg.title.toLowerCase().includes("ocasiones especiales")
        );
      case "familias":
        return packageData.filter(pkg => pkg.maxGuests >= 3);
      case "grupos-amigos":
        return packageData.filter(pkg => 
          pkg.title.toLowerCase().includes("aventureros") || 
          pkg.title.toLowerCase().includes("trekking") ||
          pkg.maxGuests >= 3
        );
      case "exclusividad-total":
        return packageData.filter(pkg => 
          pkg.originalPrice && pkg.originalPrice > 150000
        );
      default:
        return packageData;
    }
  };

  const filteredPackages = getFilteredPackages();
  const personaData = persona ? travelerTypesContent.travelerTypes.find(t => t.id === persona) : null;

  const handlePackageClick = (packageId: string) => {
    navigate(`/unit/${packageId}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const calculateDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <>
      <Helmet>
        <title>{personaData ? `Paquetes para ${personaData.name}` : "Todos los Paquetes"} - TreePod Glamping</title>
        <meta name="description" content={personaData ? personaData.description : "Descubre todos nuestros paquetes de glamping en Valle Las Trancas"} />
      </Helmet>

      <div className="min-h-screen bg-white py-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <Button
              variant="outline"
              className="mb-6"
              onClick={() => navigate("/#buyer-personas")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Experiencias
            </Button>

            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              {personaData ? `Paquetes para ${personaData.name}` : "Todos Nuestros Paquetes"}
            </h1>
            
            {personaData && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {personaData.description}
              </p>
            )}
          </div>

          {/* Packages Grid */}
          {filteredPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {filteredPackages.map((pkg) => (
                <Card 
                  key={pkg.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => handlePackageClick(pkg.id)}
                >
                  <div className="relative">
                    <img 
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {pkg.originalPrice && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="destructive">
                          -{calculateDiscount(pkg.originalPrice, pkg.price)}%
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-3 text-gray-900">
                      {pkg.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {pkg.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>Hasta {pkg.maxGuests} personas</span>
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
                        {pkg.originalPrice && (
                          <div className="text-sm text-gray-400 line-through">
                            {formatPrice(pkg.originalPrice)}
                          </div>
                        )}
                      </div>
                      <Button variant="highlight" onClick={() => navigate("/unit/1")}>
                        Reservar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-6">
                No hay paquetes disponibles para esta categoría en este momento.
              </p>
              <Button onClick={() => navigate("/")}>
                Ver Todos los Paquetes
              </Button>
            </div>
          )}

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 max-w-4xl mx-auto border border-primary/20">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                ¿No encontraste lo que buscas?
              </h3>
              <p className="text-lg mb-6 text-gray-600">
                Podemos crear una experiencia personalizada especialmente para ti
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="highlight">
                  Contactar Especialista
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/")}>
                  Ver Todas las Experiencias
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Packages;