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
    <section className="py-20 bg-gradient-to-br from-primary/5 via-white to-accent/5">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Download className="w-4 h-4" />
              Recurso Gratuito
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Descarga tu <span className="text-primary">Guía Gratuita</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Los secretos que solo conocen los expertos en escapadas a la naturaleza
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left side - Guide Visual */}
            <div className="relative">
              {/* Guide mockup with modern design */}
              <div className="relative max-w-md mx-auto">
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 border border-gray-100">
                  <img 
                    src={guideMockup} 
                    alt="Guía del Escape Perfecto en la Naturaleza"
                    className="w-full rounded-xl mb-6"
                  />
                  
                  {/* Guide title */}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Guía del Escape Perfecto
                    </h3>
                    <p className="text-primary font-medium mb-4">
                      en la Naturaleza
                    </p>
                    
                    {/* Benefits icons */}
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="text-center">
                        <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                          <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-xs text-muted-foreground">Senderos</span>
                      </div>
                      <div className="text-center">
                        <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                          <Camera className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-xs text-muted-foreground">Fotografía</span>
                      </div>
                      <div className="text-center">
                        <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                          <Backpack className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-xs text-muted-foreground">Equipaje</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-xl z-10">
                  GRATIS
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 border border-gray-100">
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