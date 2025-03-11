
interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
}

const FAQSection = ({ faqs }: FAQSectionProps) => {
  return (
    <div>
      <h3 className="text-2xl font-display font-semibold mb-6">Preguntas frecuentes</h3>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold mb-2">{faq.question}</h4>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
      
      {/* Notas adicionales */}
      <div className="mt-8 bg-green-50 p-6 rounded-lg border border-green-100">
        <h4 className="font-semibold text-green-800 mb-2">Nota importante</h4>
        <p className="text-sm text-green-700">
          Para garantizar la mejor experiencia posible, te recomendamos reservar con al menos 2 semanas de anticipación, 
          especialmente para fines de semana y temporada alta.
        </p>
      </div>
    </div>
  );
};

export default FAQSection;
