
import { useEffect } from "react";

const Blog = () => {
  // Initialize Elfsight widget when component mounts
  useEffect(() => {
    // Force reinitialization of the Elfsight widget
    if (window.elfsight && typeof window.elfsight.initialize === 'function') {
      window.elfsight.initialize();
    }
  }, []);

  return (
    <section id="blog" className="py-20 bg-white">
      {/* Franja de título sin texto */}
      <div className="w-full bg-primary/5 border-b border-primary/10 py-3 mb-16">
        <div className="container mx-auto px-4">
          {/* Título removido de la franja */}
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4 text-center">
          Nuestro Blog
        </h2>
        <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Descubre historias, consejos y experiencias sobre glamping, naturaleza y turismo sustentable
        </p>
        
        <div className="rounded-lg overflow-hidden shadow-lg">
          {/* Elfsight Blog Widget */}
          <div className="elfsight-app-bf93849c-d740-491c-b64f-60a38a56932e" data-elfsight-app-lazy></div>
        </div>
      </div>
    </section>
  );
};

export default Blog;
