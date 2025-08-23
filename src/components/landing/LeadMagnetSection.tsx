import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, CheckCircle, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/10">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Lead Magnet Preview */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="text-center">
                  <Download className="w-12 h-12 text-primary mx-auto mb-4" />
                  <div className="bg-primary/10 rounded-lg p-6 mb-4">
                    <h4 className="text-xl font-bold text-foreground mb-2">
                      GUÍA GRATUITA
                    </h4>
                    <h3 className="text-2xl font-bold text-primary">
                      El Escape Perfecto en la Naturaleza
                    </h3>
                  </div>
                  
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span className="text-sm">10 actividades únicas que pocos conocen</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span className="text-sm">Qué empacar según la temporada</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span className="text-sm">Consejos de fotografía para Instagram</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span className="text-sm">Mapa exclusivo de senderos secretos</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      "Esta guía transformó nuestra experiencia"
                    </p>
                    <p className="text-xs text-gray-500">- María, huésped verificada</p>
                  </div>
                </div>
              </div>
              
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm transform rotate-12">
                100% GRATIS
              </div>
            </div>

            {/* Right side - Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                  Descarga tu Guía GRATUITA
                </h2>
                <p className="text-xl text-muted-foreground mb-6">
                  Descubre los secretos para el escape perfecto en la naturaleza que solo conocen los expertos
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">Encuentra actividades que pocos conocen</h4>
                      <p className="text-sm text-muted-foreground">Lugares secretos y experiencias únicas fuera de las rutas turísticas</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">Empaca como un experto</h4>
                      <p className="text-sm text-muted-foreground">Lista completa para cada temporada y tipo de aventura</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">Captura fotos dignas de Instagram</h4>
                      <p className="text-sm text-muted-foreground">Técnicas y ubicaciones para los mejores shots</p>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 text-lg"
                    required
                  />
                </div>
                
                <div>
                  <Input
                    type="email"
                    placeholder="Tu mejor email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 text-lg"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Descargar Guía GRATIS
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  No spam. Solo contenido valioso sobre experiencias en la naturaleza.
                  <br />
                  Puedes darte de baja cuando quieras.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};