
const Blog = () => {
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
        
        <div className="bg-primary/5 p-12 rounded-lg text-center">
          <h3 className="text-2xl font-medium text-primary mb-4">Próximamente</h3>
          <p className="text-gray-600">
            Estamos trabajando en contenido interesante para ti. 
            ¡Vuelve pronto para descubrir nuestros artículos!
          </p>
        </div>
      </div>
    </section>
  );
};

export default Blog;
