
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("¡Suscripción exitosa!", {
      description: "Pronto recibirás nuestras novedades y ofertas especiales."
    });
    setEmail("");
  };

  return (
    <div>
      <h4 className="font-display font-bold text-lg mb-4">Novedades y Ofertas</h4>
      <p className="text-gray-600 text-sm mb-4">
        Suscríbete a nuestro newsletter para recibir ofertas exclusivas y novedades.
      </p>
      <form onSubmit={handleNewsletterSubmit} className="space-y-3">
        <Input
          type="email"
          placeholder="Tu correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-white"
        />
        <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white">
          Suscribirme
        </Button>
      </form>
    </div>
  );
};

export default Newsletter;
