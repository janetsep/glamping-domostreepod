
import { useEffect } from "react";

const Testimonials = () => {
  // This effect will ensure the Elfsight script loads properly
  useEffect(() => {
    // Check if the script is already added to prevent duplicates
    if (!document.querySelector('script[src="https://static.elfsight.com/platform/platform.js"]')) {
      const script = document.createElement('script');
      script.src = "https://static.elfsight.com/platform/platform.js";
      script.async = true;
      document.body.appendChild(script);
    }
    
    // Manually trigger Elfsight to load widgets if their platform JS is already loaded
    if (window.elfsight) {
      window.elfsight.initialize();
    }
    
    return () => {
      // No cleanup needed as we don't want to remove the script when component unmounts
    };
  }, []);

  return (
    <section id="testimonials" className="py-20 bg-secondary/10">
      {/* Franja de título sin texto */}
      <div className="w-full bg-primary/5 border-b border-primary/10 py-3 mb-16">
        <div className="container mx-auto px-4">
          {/* Título removido de la franja */}
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4 text-center">
          Lo que dicen nuestros huéspedes
        </h2>
        <p className="text-xl text-center text-gray-600 mb-6 max-w-3xl mx-auto">
          Recomendado por más de 500 viajeros satisfechos
        </p>
        
        {/* Elfsight All-in-One Reviews Widget */}
        <div className="elfsight-app-58776635-7259-470b-9077-f838d052ebab" data-elfsight-app-lazy></div>
      </div>
    </section>
  );
};

export default Testimonials;
