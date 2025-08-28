import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Users, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useThemedPackages, useGlampingStats } from "@/hooks/useGlampingData";
export const QuickBookingSection = () => {
  const navigate = useNavigate();
  const {
    data: packages,
    isLoading: packagesLoading
  } = useThemedPackages();
  const {
    data: stats,
    isLoading: statsLoading
  } = useGlampingStats();

  // Seleccionar los 3 primeros paquetes o usar fallback
  const quickPackages = packages?.slice(0, 3) || [];
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };
  return <section className="py-16 bg-gradient-to-br from-primary/5 to-white">
      <div className="container mx-auto px-4">
        
        {/* Urgent Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-bold mb-4 animate-pulse">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            {statsLoading ? "Cargando disponibilidad..." : stats?.totalReservations > 10 ? "Solo quedan pocas fechas disponibles" : "Disponibilidad limitada"}
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Reserva Ahora - <span className="text-primary">Disponibilidad Limitada</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            {packagesLoading ? "Cargando experiencias..." : "Elige tu experiencia perfecta y asegura tu escape a la naturaleza"}
          </p>
        </div>

        {/* Quick Selection Grid */}
        {packagesLoading ? <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {[1, 2, 3].map(i => <Card key={i} className="p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg"></div>
              </Card>)}
          </div> : <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {quickPackages.map((pkg, index) => <Card key={pkg.id} className={`relative p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${index === 0 ? 'border-2 border-primary bg-primary/5' : 'border border-gray-200'}`} onClick={() => navigate('/paquetes')}>
                {index === 0 && <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary text-white px-4 py-1 rounded-full text-xs font-bold">
                      MÁS POPULAR
                    </div>
                  </div>}

                <div className="text-center mb-4">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-8 h-8 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-2">{pkg.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{pkg.description}</p>
                  
                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl font-bold text-primary">$180.000 noche</span>
                    </div>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold" onClick={e => {
              e.stopPropagation();
              // Navegar a la página de paquetes en lugar de booking que no existe
              navigate('/paquetes');
            }}>
                    Reservar Ahora
                  </Button>
                </div>
              </Card>)}
          </div>}

        {/* Quick Contact Options */}
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-foreground mb-2">
              ¿Necesitas ayuda para decidir?
            </h3>
            <p className="text-sm text-muted-foreground">
              Habla directamente con nuestros expertos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="flex items-center gap-2 h-12" onClick={() => window.open('https://wa.me/56912345678', '_blank')}>
              <Phone className="w-4 h-4" />
              WhatsApp Directo
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2 h-12" onClick={() => navigate('/paquetes')}>
              <Calendar className="w-4 h-4" />
              Ver Disponibilidad
            </Button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Valle Las Trancas, Ñuble</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Cancelación flexible</span>
            </div>
          </div>
        </div>
      </div>
    </section>;
};