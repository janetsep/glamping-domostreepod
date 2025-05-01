
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { getCelebrationById, celebrationsContent } from "@/data/content/celebrations";
import { CalendarCheck, ArrowLeft, PartyPopper } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Skeleton } from "@/components/ui/skeleton";

const CelebrationDetail = () => {
  const { celebrationId } = useParams();
  const navigate = useNavigate();
  const celebration = getCelebrationById(celebrationId || "");

  // Añadimos efecto para desplazarse al inicio cuando la página carga
  useEffect(() => {
    // Desplazamiento al inicio de la página
    window.scrollTo(0, 0);
  }, [celebrationId]);

  if (!celebration) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl md:text-3xl font-display font-semibold mb-4">Celebración no encontrada</h1>
        <p className="text-gray-600 mb-8">La celebración que estás buscando no existe o no está disponible.</p>
        <Button onClick={() => navigate('/#celebrations')} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Volver a celebraciones
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${celebration.name} | Domos TreePod`}</title>
        <meta name="description" content={celebration.description} />
      </Helmet>
      
      <div className="pt-24 bg-white min-h-screen">
        {/* Hero Section - Optimizado para carga */}
        <div className="relative h-96 mb-8">
          <LazyLoadImage
            src={celebration.image}
            alt={celebration.name}
            effect="blur"
            threshold={300}
            className="w-full h-full object-cover"
            placeholder={<Skeleton className="w-full h-full" />}
            wrapperClassName="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="container mx-auto px-4 pb-8">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
                {celebration.name}
              </h1>
            </div>
          </div>
        </div>
        
        <Section>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-display font-semibold mb-6 text-primary">
                Celebra momentos inolvidables
              </h2>
              
              <div className="prose max-w-none text-gray-700">
                <p className="text-lg mb-4">{celebration.description}</p>
                <p className="text-lg mb-4">
                  En TreePod, entendemos la importancia de los momentos especiales. Por eso, ofrecemos un entorno único, rodeado de naturaleza y con todas las comodidades, para hacer de tu {celebration.name.toLowerCase()} una experiencia verdaderamente memorable.
                </p>
                <p className="mb-6">
                  Nuestros domos geodésicos ofrecen el equilibrio perfecto entre comodidad y conexión con la naturaleza, creando el ambiente ideal para celebrar.
                </p>
                
                <h3 className="text-xl font-semibold mb-4">¿Qué incluye?</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Alojamiento en domos para hasta 4 personas</li>
                  <li>Espacio privado rodeado de naturaleza</li>
                  <li>Posibilidad de personalizar la experiencia según tus necesidades</li>
                  <li>Tinajas termales disponibles (previa reserva y pago adicional)</li>
                  <li>Asesoramiento para planificar tu celebración</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm h-fit">
              <div className="text-center mb-6">
                <PartyPopper className="mx-auto h-12 w-12 text-cyan-600 mb-2" />
                <h3 className="text-xl font-semibold">Reserva tu {celebration.name.toLowerCase()}</h3>
                <p className="text-gray-600 mt-2">Completa el formulario y nos pondremos en contacto contigo</p>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                  <input type="text" id="name" className="w-full p-2 border rounded-md" placeholder="Tu nombre" />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" id="email" className="w-full p-2 border rounded-md" placeholder="tu@email.com" />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input type="tel" id="phone" className="w-full p-2 border rounded-md" placeholder="+56 9 1234 5678" />
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Fecha aproximada</label>
                  <input type="date" id="date" className="w-full p-2 border rounded-md" />
                </div>
                
                <div>
                  <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">Número de personas</label>
                  <input type="number" id="guests" min="1" className="w-full p-2 border rounded-md" placeholder="4" />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                  <textarea id="message" rows={4} className="w-full p-2 border rounded-md" placeholder="Cuéntanos sobre tu celebración..."></textarea>
                </div>
                
                <Button 
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white flex items-center justify-center gap-2"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("¡Gracias por tu interés! Te contactaremos pronto para confirmar tu reserva.");
                  }}
                >
                  <CalendarCheck className="h-5 w-5" />
                  Solicitar reserva
                </Button>
              </form>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                Te contactaremos en un plazo de 24 horas para confirmar disponibilidad y detalles.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/#celebrations')}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Volver a celebraciones
            </Button>
          </div>
        </Section>
      </div>
    </>
  );
};

export default CelebrationDetail;
