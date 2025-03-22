
import { Button as ShadcnButton } from "@/components/ui/button";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
  text: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
}

/**
 * Componente de botón personalizado que permite su edición visual
 * Se puede configurar para ser un enlace o un botón normal
 */
export const Button = ({
  text,
  icon,
  href,
  onClick,
  variant = "default",
  size = "default",
  className = "",
  disabled = false
}: ButtonProps) => {
  const buttonContent = (
    <>
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </>
  );
  
  // Si tiene href, renderizamos como Link
  if (href) {
    // Si el href comienza con http, es un enlace externo
    if (href.startsWith('http')) {
      return (
        <ShadcnButton
          variant={variant}
          size={size}
          className={className}
          onClick={() => window.open(href, '_blank')}
          disabled={disabled}
        >
          {buttonContent}
        </ShadcnButton>
      );
    }
    
    // Es un enlace interno
    return (
      <Link to={href}>
        <ShadcnButton
          variant={variant}
          size={size}
          className={className}
          disabled={disabled}
        >
          {buttonContent}
        </ShadcnButton>
      </Link>
    );
  }
  
  // Si no tiene href, es un botón normal
  return (
    <ShadcnButton
      variant={variant}
      size={size}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {buttonContent}
    </ShadcnButton>
  );
};
