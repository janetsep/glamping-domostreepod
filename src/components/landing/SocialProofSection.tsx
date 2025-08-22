import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, Instagram, Camera, Heart } from "lucide-react";
import { testimonialsContent } from "@/data/content/testimonials";

// Convertir testimonios reales a formato de la sección con imágenes
const testimonials = testimonialsContent.testimonials.slice(0, 3).map((testimonial, index) => {
  const images = [
    "/lovable-uploads/71928294-5635-46f7-a3ec-5fb33ef836ea.png",
    "/lovable-uploads/1e29d754-6882-4de5-b2ca-3d9680160dda.png", 
    "/lovable-uploads/365c130e-5ba5-49fa-84ed-dfb1c95cd08d.png"
  ];
  
  const experiences = [
    "Paquete Romántico",
    "Paquete Familiar", 
    "Experiencia Individual"
  ];
  
  return {
    id: index + 1,
    name: testimonial.name,
    rating: testimonial.rating,
    text: testimonial.quote,
    image: images[index],
    location: testimonial.location,
    experience: experiences[index]
  };
});

const stats = [
  { number: "500+", label: "Huéspedes Felices", icon: Heart },
  { number: "4.9/5", label: "Calificación Promedio", icon: Star },
  { number: "95%", label: "Recomendarían TreePod", icon: Quote },
  { number: "1200+", label: "Fotos Compartidas", icon: Camera }
];

const instagramPosts = [
  "/lovable-uploads/8c7ac924-839e-490f-925a-eb74a04c1e40.png",
  "/lovable-uploads/5bf3bb3b-da31-4f12-a031-1d7274b2b1cc.png", 
  "/lovable-uploads/72e3600d-5b7a-4218-82ac-b305c49e4aeb.png",
  "/lovable-uploads/8365f2da-fa25-4ee2-b11c-f4651affb6ab.png"
];

export const SocialProofSection = () => {
  return (
    <section id="social-proof" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-green-100 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 mr-2 text-green-600" />
            <span className="text-green-700 font-semibold">Experiencias Reales</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
            Lo que Dicen Nuestros Huéspedes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Más de 500 viajeros han encontrado su experiencia perfecta en TreePod
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <IconComponent className="w-8 h-8 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <div className="flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              
              <Quote className="w-8 h-8 text-primary/20 mb-2" />
              <p className="text-gray-600 mb-4 leading-relaxed">
                "{testimonial.text}"
              </p>
              
              <div className="flex justify-between items-center">
                <Badge variant="secondary" className="text-xs">
                  {testimonial.experience}
                </Badge>
                <span className="text-xs text-gray-500">{testimonial.location}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Instagram Feed */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            #TreePodExperience en Instagram
          </h3>
          <p className="text-gray-600 mb-8">
            Descubre cómo nuestros huéspedes viven la experiencia TreePod
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {instagramPosts.map((image, index) => (
            <div 
              key={index}
              className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer"
            >
              <img 
                src={image}
                alt={`Instagram post ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <Instagram className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a 
            href="https://instagram.com/treepod" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors font-semibold"
          >
            <Instagram className="w-5 h-5 mr-2" />
            Síguenos en Instagram @treepod
          </a>
        </div>
      </div>
    </section>
  );
};