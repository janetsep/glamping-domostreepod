
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EditableTextProps {
  text: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  className?: string;
  children?: ReactNode;
}

/**
 * Componente para texto editable visualmente
 * Permite renderizar texto con diferentes etiquetas HTML
 */
export const EditableText = ({
  text,
  tag = "p",
  className = "",
  children
}: EditableTextProps) => {
  const combinedClassName = cn(className);
  const content = <>{text}{children}</>;
  
  switch (tag) {
    case "h1":
      return <h1 className={combinedClassName}>{content}</h1>;
    case "h2":
      return <h2 className={combinedClassName}>{content}</h2>;
    case "h3":
      return <h3 className={combinedClassName}>{content}</h3>;
    case "h4":
      return <h4 className={combinedClassName}>{content}</h4>;
    case "h5":
      return <h5 className={combinedClassName}>{content}</h5>;
    case "h6":
      return <h6 className={combinedClassName}>{content}</h6>;
    case "span":
      return <span className={combinedClassName}>{content}</span>;
    case "div":
      return <div className={combinedClassName}>{content}</div>;
    default:
      return <p className={combinedClassName}>{content}</p>;
  }
};
