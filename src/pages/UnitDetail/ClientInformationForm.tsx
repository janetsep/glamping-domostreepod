
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ClientInformationFormProps {
  onSubmit: (clientInfo: { name: string; email: string; phone: string }) => void;
  isSubmitting: boolean;
  initialValues?: { name: string; email: string; phone: string };
}

export const ClientInformationForm = ({ 
  onSubmit, 
  isSubmitting, 
  initialValues 
}: ClientInformationFormProps) => {
  const [name, setName] = useState(initialValues?.name || "");
  const [email, setEmail] = useState(initialValues?.email || "");
  const [phone, setPhone] = useState(initialValues?.phone || "");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});

  // Update form when initialValues change
  useEffect(() => {
    if (initialValues) {
      if (initialValues.name) setName(initialValues.name);
      if (initialValues.email) setEmail(initialValues.email);
      if (initialValues.phone) setPhone(initialValues.phone);
    }
  }, [initialValues]);

  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      phone?: string;
    } = {};
    
    if (!name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    }
    
    if (!email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "El correo electrónico no es válido";
    }
    
    if (!phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio";
    } else if (!/^[+0-9]{8,15}$/.test(phone.replace(/\s/g, ""))) {
      newErrors.phone = "El teléfono no es válido (mínimo 8 dígitos)";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({ name, email, phone });
    }
  };

  return (
    <Card className="p-6 bg-white">
      <h3 className="text-xl font-semibold mb-4">Información de contacto</h3>
      <p className="text-sm text-gray-600 mb-4">
        Para completar tu reserva, por favor ingresa tus datos de contacto:
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre completo</Label>
          <Input
            id="name"
            placeholder="Ej: Juan Pérez"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="Ej: correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            placeholder="Ej: +56 9 1234 5678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone}</p>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Guardando..." : "Guardar información"}
        </Button>
      </form>
    </Card>
  );
};
