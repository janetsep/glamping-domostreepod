
import { Calendar, MapPin, Users, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReservations } from "@/hooks/useReservations";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { GlampingUnit } from "@/lib/supabase";

const Index = () => {
  const navigate = useNavigate();
  const { fetchGlampingUnits, isLoading } = useReservations();
  const [units, setUnits] = useState<GlampingUnit[]>([]);

  useEffect(() => {
    const loadUnits = async () => {
      const data = await fetchGlampingUnits();
      setUnits(data);
    };
    loadUnits();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white bg-opacity-90 backdrop-blur-sm z-50 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-display font-bold text-primary">Glamping</Link>
          <div className="flex gap-6">
            <Button variant="ghost" asChild>
              <Link to="/experiences">Experiencias</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/location">Ubicación</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/contact">Contacto</Link>
            </Button>
            <Button variant="default" onClick={() => navigate('/reservations')}>
              Reservar
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fadeIn">
            <h2 className="text-5xl font-display font-bold text-primary mb-6">
              Vive la naturaleza con todo el confort
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Experimenta el lujo de la naturaleza en nuestro exclusivo glamping
            </p>
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90"
              onClick={() => navigate('/reservations')}
            >
              Reserva tu estadía
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Locations */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-display font-bold text-primary mb-12 text-center">
            Nuestros Glampings
          </h3>
          {isLoading ? (
            <div className="text-center">Cargando unidades...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {units.map((unit) => (
                <div key={unit.id} className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-[1.02] animate-fadeIn">
                  <img
                    src={unit.image_url || "/placeholder.svg"}
                    alt={unit.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h4 className="text-xl font-display font-bold mb-2">{unit.name}</h4>
                    <p className="text-gray-600 mb-4">
                      {unit.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Users size={16} />
                        <span>Hasta {unit.max_guests} personas</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>Vista al bosque</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">${unit.price_per_night.toLocaleString()}/noche</span>
                      <Button 
                        variant="outline"
                        onClick={() => navigate(`/unit/${unit.id}`)}
                      >
                        Ver detalles
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-display font-bold text-primary mb-12 text-center">
            ¿Por qué elegirnos?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Calendar className="w-8 h-8 text-accent" />,
                title: "Reserva Flexible",
                description: "Sistema de reservas fácil y flexible para tu comodidad",
              },
              {
                icon: <MapPin className="w-8 h-8 text-accent" />,
                title: "Ubicación Privilegiada",
                description: "Ubicados en medio de la naturaleza con vistas increíbles",
              },
              {
                icon: <CreditCard className="w-8 h-8 text-accent" />,
                title: "Pago Seguro",
                description: "Proceso de pago seguro a través de Webpay",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg shadow-lg text-center animate-fadeIn"
              >
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h4 className="text-xl font-display font-bold mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-display font-bold mb-6">
            ¿Listo para vivir una experiencia única?
          </h3>
          <p className="text-lg mb-8 opacity-90">
            Reserva ahora y disfruta de una estadía inolvidable
          </p>
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-white/90"
            onClick={() => navigate('/reservations')}
          >
            Hacer una reserva
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/20 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-display font-bold text-lg mb-4">Contacto</h4>
              <p className="text-gray-600">
                Email: info@glamping.com<br />
                Teléfono: +56 9 1234 5678
              </p>
            </div>
            <div>
              <h4 className="font-display font-bold text-lg mb-4">Ubicación</h4>
              <p className="text-gray-600">
                Camino a la Montaña km 5,<br />
                Región de Los Lagos, Chile
              </p>
            </div>
            <div>
              <h4 className="font-display font-bold text-lg mb-4">Síguenos</h4>
              <div className="flex gap-4">
                <Button variant="link" asChild>
                  <Link to="#" className="text-gray-600 hover:text-primary">Instagram</Link>
                </Button>
                <Button variant="link" asChild>
                  <Link to="#" className="text-gray-600 hover:text-primary">Facebook</Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-gray-500">
            <p>&copy; 2024 Glamping Experience. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
