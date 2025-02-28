
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Carolina Mendoza",
      avatar: "/lovable-uploads/f0a226af-4b5a-47f8-9a16-71ebc00d5039.png",
      text: "Mi esposo y yo pasamos un fin de semana increíble. La tinaja al atardecer viendo las montañas fue una experiencia mágica que nunca olvidaremos.",
      rating: 5,
      source: "Google"
    },
    {
      name: "Martín Figueroa",
      avatar: "/lovable-uploads/04ce7b83-26de-4148-a84b-6b62dd46101f.png",
      text: "Lo mejor de TreePod es la combinación perfecta entre naturaleza y confort. Los domos están impecables y las vistas al despertar son impresionantes.",
      rating: 5,
      source: "Instagram"
    },
    {
      name: "Valentina Rojas",
      avatar: "/lovable-uploads/9e606128-1db3-42ce-b1ca-0474a875279f.png",
      text: "Si buscas desconectarte del mundo y reconectar contigo mismo, este es el lugar perfecto. La cena bajo las estrellas fue la cereza del pastel.",
      rating: 5,
      source: "Facebook"
    }
  ];

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
        />
      ));
  };

  return (
    <section className="py-20 bg-secondary/10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4 text-center">
          Lo que dicen nuestros huéspedes
        </h2>
        <p className="text-xl text-center text-gray-600 mb-6 max-w-3xl mx-auto">
          Recomendado por más de 500 viajeros satisfechos
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <div className="flex items-center">
                    {renderStars(testimonial.rating)}
                    <span className="text-xs text-gray-500 ml-2">vía {testimonial.source}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="mt-16 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-center mb-6">Nuestras reseñas en plataformas</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50">
              <div className="text-4xl font-bold text-primary">4.9</div>
              <div className="flex mb-2">
                {renderStars(5)}
              </div>
              <div className="text-sm">Google (126 reseñas)</div>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50">
              <div className="text-4xl font-bold text-primary">4.8</div>
              <div className="flex mb-2">
                {renderStars(5)}
              </div>
              <div className="text-sm">Booking (87 reseñas)</div>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50">
              <div className="text-4xl font-bold text-primary">4.9</div>
              <div className="flex mb-2">
                {renderStars(5)}
              </div>
              <div className="text-sm">Airbnb (95 reseñas)</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
