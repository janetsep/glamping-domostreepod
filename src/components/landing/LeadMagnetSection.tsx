import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, CheckCircle, Star, MapPin, Camera, Backpack } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import leadMagnetBg from "@/assets/lead-magnet-bg.jpg";
import guideMockup from "@/assets/guide-mockup.jpg";

export const LeadMagnetSection = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !name) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    // Aquí se integraría con el CRM/Email marketing
    // Por ahora simulamos el envío
    console.log("Lead captured:", { email, name });
    
    setIsSubmitted(true);
    toast({
      title: "¡Éxito!",
      description: "Revisa tu email para descargar la guía",
    });

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail("");
      setName("");
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-4">
                ¡Tu guía está en camino!
              </h3>
              <p className="text-muted-foreground mb-6">
                Revisa tu email en los próximos minutos para descargar tu 
                "Guía del Escape Perfecto en la Naturaleza"
              </p>
              <div className="text-sm text-muted-foreground">
                Si no ves el email, revisa tu carpeta de spam
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="relative py-24 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${leadMagnetBg})` }}
    >
      {/* Stronger overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/70"></div>
      
      <div className="relative container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* Left side - Visual Lead Magnet */}
            <div className="relative text-center">
              {/* Main heading with better contrast */}
              <div className="mb-12">
                <h2 className="text-5xl md:text-6xl font-display font-bold mb-6 text-white drop-shadow-lg">
                  Descarga tu Guía
                  <span className="block text-primary bg-black/30 rounded-lg px-4 py-2 mt-4 backdrop-blur-sm"> GRATUITA</span>
                </h2>
                <p className="text-2xl text-white font-medium bg-black/40 rounded-lg px-6 py-3 backdrop-blur-sm inline-block">
                  Los secretos que solo conocen los expertos
                </p>
              </div>

              {/* Guide mockup */}
              <div className="relative max-w-xs mx-auto mb-12">
                <img 
                  src={guideMockup} 
                  alt="Guía del Escape Perfecto en la Naturaleza"
                  className="w-full drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
                
                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full font-bold text-xs transform rotate-12 shadow-xl">
                  GRATIS
                </div>
              </div>

              {/* Simplified visual benefits */}
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <div className="bg-black/40 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-white font-semibold bg-black/30 rounded-lg px-3 py-1 text-sm backdrop-blur-sm">
                    Senderos Secretos
                  </p>
                </div>
                <div>
                  <div className="bg-black/40 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Camera className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-white font-semibold bg-black/30 rounded-lg px-3 py-1 text-sm backdrop-blur-sm">
                    Fotos Perfectas
                  </p>
                </div>
                <div>
                  <div className="bg-black/40 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Backpack className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-white font-semibold bg-black/30 rounded-lg px-3 py-1 text-sm backdrop-blur-sm">
                    Qué Empacar
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl p-10">
              <div className="text-center mb-6">
                <Download className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  El Escape Perfecto en la Naturaleza
                </h3>
                <p className="text-muted-foreground">
                  Acceso inmediato a tu guía completa
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>10 actividades únicas que pocos conocen</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>Lista de empaque por temporada</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>Consejos de fotografía profesional</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>Mapa exclusivo de senderos</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 text-lg border-2 border-primary/20 focus:border-primary"
                  required
                />
                
                <Input
                  type="email"
                  placeholder="Tu mejor email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-lg border-2 border-primary/20 focus:border-primary"
                  required
                />
                
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-xl"
                >
                  <Download className="w-5 h-5 mr-2" />
                  DESCARGAR AHORA
                </Button>
                
                <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-center text-muted-foreground">
                    "Esta guía transformó nuestra experiencia" - María
                  </p>
                </div>
                
                <p className="text-xs text-center text-muted-foreground">
                  Sin spam. Solo contenido valioso. Cancela cuando quieras.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};