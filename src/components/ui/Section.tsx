
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { EditableText } from "./EditableText";

interface SectionProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  contentClassName?: string;
  titleTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  id?: string;
  centered?: boolean;
}

/**
 * Componente de sección con título y subtítulo editables
 */
export const Section = ({
  title,
  subtitle,
  children,
  className = "",
  titleClassName = "",
  subtitleClassName = "",
  contentClassName = "",
  titleTag = "h2",
  id,
  centered = false
}: SectionProps) => {
  const headerClasses = cn(
    centered && "text-center",
    "mb-8"
  );
  
  const defaultTitleClasses = "text-2xl md:text-3xl font-display font-semibold text-primary mb-2";
  const titleClasses = cn(defaultTitleClasses, titleClassName);
  
  const defaultSubtitleClasses = "text-gray-600 max-w-2xl mx-auto";
  const subtitleClasses = cn(defaultSubtitleClasses, subtitleClassName);
  
  return (
    <section id={id} className={cn("py-12", className)}>
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className={headerClasses}>
            {title && (
              <EditableText text={title} tag={titleTag} className={titleClasses} />
            )}
            
            {subtitle && (
              <EditableText text={subtitle} className={subtitleClasses} />
            )}
          </div>
        )}
        
        <div className={contentClassName}>
          {children}
        </div>
      </div>
    </section>
  );
};
