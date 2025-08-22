import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { packageData } from "@/components/packages/data";
import { useNavigate } from "react-router-dom";
import { Star, Users, Calendar, ArrowRight, Sparkles } from "lucide-react";

const packageCategories = [
  {
    id: "individual",
    label: "Individual",
    emoji: "🧘",
    description: "Para momentos de soledad y reflexión",
    packages: packageData.filter(pkg => 
      pkg.title.toLowerCase().includes("solitario") || 
      pkg.title.toLowerCase().includes("simplicidad")
    )
  },
  {
    id: "parejas", 
    label: "Parejas",
    emoji: "💕",
    description: "Experiencias románticas e íntimas",
    packages: packageData.filter(pkg => 
      pkg.title.toLowerCase().includes("pareja") || 
      pkg.title.toLowerCase().includes("ocasiones especiales")
    )
  },
  {
    id: "aventura",
    label: "Aventura", 
    emoji: "🏔️",
    description: "Para los amantes de la adrenalina",
    packages: packageData.filter(pkg => 
      pkg.title.toLowerCase().includes("aventureros") || 
      pkg.title.toLowerCase().includes("trekking") ||
      pkg.title.toLowerCase().includes("fotógrafo")
    )
  },
  {
    id: "todos",
    label: "Ver Todos",
    emoji: "🌟", 
    description: "Todos nuestros paquetes disponibles",
    packages: packageData
  }
];

export const PackagesByType = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("individual");
  const [featuredPackages, setFeaturedPackages] = useState(packageData.slice(0, 3));

  useEffect(() => {
    // Rotate featured packages every 10 seconds
    const interval = setInterval(() => {
      setFeaturedPackages(prev => {
        const remaining = packageData.filter(pkg => !prev.includes(pkg));
        if (remaining.length >= 3) {
          return remaining.slice(0, 3);
        }
        return packageData.slice(0, 3);
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handlePackageClick = (packageId: string) => {
    // Navigate to unit detail with the package ID mapped to an existing unit
    navigate(`/unit/1`);
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
    <section id="packages-by-type" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-primary/10 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 mr-2 text-primary" />
            <span className="text-primary font-semibold">Paquetes Exclusivos</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
            Encuentra tu Experiencia Perfecta
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cada paquete está diseñado cuidadosamente para diferentes tipos de experiencias
          </p>
        </div>

        {/* Featured Packages */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">
            ✨ Destacados del Mes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPackages.map((pkg, index) => (
              <Card 
                key={`featured-${pkg.id}`}
                className="overflow-hidden hover:shadow-xl transition-all duration-500 cursor-pointer group border-2 border-primary/20 hover:border-primary/40"
                onClick={() => handlePackageClick(pkg.id)}
              >
                <div className="relative">
                  <img 
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                      ⭐ Destacado
                    </Badge>
                  </div>
                  {pkg.originalPrice && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="destructive">
                        -{calculateDiscount(pkg.originalPrice, pkg.price)}%
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h4 className="font-bold text-lg mb-2 text-gray-900">
                    {pkg.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {pkg.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-1" />
                      <span>Hasta {pkg.maxGuests} personas</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{pkg.size}</span>
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
                    <Button variant="highlight" size="sm">
                      Reservar
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Package Categories */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-gray-100 rounded-xl p-1">
            {packageCategories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex flex-col items-center p-4 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all"
              >
                <span className="text-2xl mb-1">{category.emoji}</span>
                <span className="font-semibold text-sm">{category.label}</span>
                <span className="text-xs text-gray-500 mt-1 hidden sm:block">
                  {category.description}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {packageCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {category.label === "Ver Todos" ? "Todos Nuestros Paquetes" : `Paquetes ${category.label}`}
                </h3>
                <p className="text-gray-600">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.packages.map((pkg) => (
                  <Card 
                    key={pkg.id}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    onClick={() => handlePackageClick(pkg.id)}
                  >
                    <div className="relative">
                      <img 
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
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
                      <h4 className="font-bold text-lg mb-2 text-gray-900 line-clamp-1">
                        {pkg.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {pkg.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="w-4 h-4 mr-1" />
                          <span>Hasta {pkg.maxGuests}</span>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xl font-bold text-primary">
                            {formatPrice(pkg.price)}
                          </div>
                          {pkg.originalPrice && (
                            <div className="text-sm text-gray-400 line-through">
                              {formatPrice(pkg.originalPrice)}
                            </div>
                          )}
                        </div>
                        <Button variant="outline" size="sm">
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {category.packages.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No hay paquetes disponibles en esta categoría.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 max-w-4xl mx-auto border border-primary/20">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
              ¿Necesitas una experiencia personalizada?
            </h3>
            <p className="text-lg mb-6 text-gray-600">
              Creamos paquetes únicos adaptados a tus necesidades específicas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="highlight" onClick={() => navigate("/unit/1")}>
                Reservar Experiencia
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/paquetes")}>
                Ver Todos los Paquetes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};