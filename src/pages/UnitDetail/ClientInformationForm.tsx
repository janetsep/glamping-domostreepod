import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ClientInformationFormProps {
  clientInformation: {
    name: string;
    email: string;
    phone: string;
  };
  setClientInformation: (value: {
    name: string;
    email: string;
    phone: string;
  }) => void;
  onSubmit: () => void;
}

export const ClientInformationForm = ({
  clientInformation,
  setClientInformation,
  onSubmit
}: ClientInformationFormProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClientInformation(prevInfo => ({
      ...prevInfo,
      [name]: value
    }));
  };

  return (
    <div className="border rounded-md p-4 mt-4">
      <h3 className="text-lg font-semibold mb-4">Información de contacto</h3>
      <div className="grid gap-4">
        <div>
          <Label htmlFor="name">Nombre completo</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={clientInformation.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={clientInformation.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="phone">Número de teléfono</Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            value={clientInformation.phone}
            onChange={handleChange}
          />
        </div>
        <Button onClick={onSubmit}>Confirmar y pagar</Button>
      </div>
    </div>
  );
};
