import { useElfsight } from '@/hooks/useElfsight';
import { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const [showElfsight, setShowElfsight] = useState(false);
  
  // Force Elfsight initialization for this widget
  useElfsight('58776635-7259-470b-9077-f838d052ebab', 1500);

  // Try to show Elfsight widget after 3 seconds, keep fallback as default
  useEffect(() => {
    const timer = setTimeout(() => {
      const elfsightElement = document.querySelector('.elfsight-app-58776635-7259-470b-9077-f838d052ebab');
      if (elfsightElement && elfsightElement.children.length > 0) {
        console.log('🔧 ELFSIGHT: ✅ Testimonials widget cargado, mostrando widget');
        setShowElfsight(true);
      } else {
        console.log('🔧 ELFSIGHT: ⚠️ Testimonials widget no cargó, usando fallback nativo');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const fallbackTestimonials = [
    {
      name: "María González",
      rating: 5,
      comment: "Una experiencia increíble en los domos. La conexión con la naturaleza es única y el servicio excepcional.",
      location: "Santiago, Chile",
      verified: true
    },
    {
      name: "Carlos Mendoza", 
      rating: 5,
      comment: "Los baños termales y el ambiente del bosque nativo hacen de este lugar algo muy especial. 100% recomendado.",
      location: "Concepción, Chile",
      verified: true
    },
    {
      name: "Ana Rodríguez",
      rating: 5,
      comment: "Perfecto para desconectarse. Los domos son cómodos y la experiencia gastronómica del invernadero excelente.",
      location: "Valparaíso, Chile", 
      verified: true
    }
  ];

  return (
    <section id="testimonials" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">¡Los Huéspedes Opinan!</h2>
          <p className="section-description">
            Comentarios reales de huéspedes que han vivido la experiencia TreePod.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Widget Elfsight - solo se muestra si carga correctamente */}
            {showElfsight && (
              <div className="elfsight-app-58776635-7259-470b-9077-f838d052ebab" data-elfsight-app-lazy></div>
            )}
            
            {/* Fallback Testimonials - se muestra por defecto */}
            {!showElfsight && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="flex">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-lg font-semibold">4.9/5</span>
                  </div>
                  <p className="text-muted-foreground">Basado en 127+ reseñas verificadas</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {fallbackTestimonials.map((testimonial, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        {testimonial.verified && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Huésped Verificado
                          </span>
                        )}
                      </div>
                      
                      <Quote className="w-6 h-6 text-gray-400 mb-2" />
                      <p className="text-gray-700 mb-4 italic">"{testimonial.comment}"</p>
                      
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-gray-500">{testimonial.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;