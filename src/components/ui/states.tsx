import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BaseStateProps {
  className?: string;
  children?: React.ReactNode;
}

// Loading State
export const LoadingState = ({ className, children }: BaseStateProps) => (
  <div className={cn("flex items-center justify-center gap-2 text-primary", className)}>
    <Loader2 className="h-5 w-5 animate-spin" />
    {children && <span className="text-sm">{children}</span>}
  </div>
);

// Success State
export const SuccessState = ({ className, children }: BaseStateProps) => (
  <div className={cn("flex items-center gap-2 text-green-600", className)}>
    <CheckCircle className="h-5 w-5" />
    {children && <span className="text-sm font-medium">{children}</span>}
  </div>
);

// Error State
export const ErrorState = ({ className, children }: BaseStateProps) => (
  <div className={cn("flex items-center gap-2 text-red-600", className)}>
    <AlertCircle className="h-5 w-5" />
    {children && <span className="text-sm font-medium">{children}</span>}
  </div>
);

// Loading Button State
interface LoadingButtonProps extends BaseStateProps {
  isLoading?: boolean;
  loadingText?: string;
}

export const LoadingButton = ({ 
  className, 
  children, 
  isLoading = false, 
  loadingText = "Cargando..." 
}: LoadingButtonProps) => (
  <div className={cn("flex items-center justify-center gap-2", className)}>
    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
    <span>{isLoading ? loadingText : children}</span>
  </div>
);

// Full Page Loading
export const PageLoading = ({ children }: BaseStateProps) => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="text-center">
      <LoadingState className="text-2xl mb-4" />
      {children && <p className="text-gray-600">{children}</p>}
    </div>
  </div>
);

// Card Loading Skeleton
export const CardLoadingSkeleton = ({ className }: BaseStateProps) => (
  <div className={cn("animate-pulse", className)}>
    <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
    <div className="space-y-2">
      <div className="bg-gray-200 h-4 rounded w-3/4"></div>
      <div className="bg-gray-200 h-4 rounded w-1/2"></div>
      <div className="bg-gray-200 h-8 rounded w-1/3 mt-4"></div>
    </div>
  </div>
);

// Status Banner
interface StatusBannerProps extends BaseStateProps {
  type: 'success' | 'error' | 'loading';
  title?: string;
}

export const StatusBanner = ({ 
  type, 
  title, 
  children, 
  className 
}: StatusBannerProps) => {
  const baseStyles = "p-4 rounded-lg border flex items-start gap-3";
  const typeStyles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800", 
    loading: "bg-blue-50 border-blue-200 text-blue-800"
  };

  const icons = {
    success: <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />,
    error: <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />,
    loading: <Loader2 className="h-5 w-5 mt-0.5 flex-shrink-0 animate-spin" />
  };

  return (
    <div className={cn(baseStyles, typeStyles[type], className)}>
      {icons[type]}
      <div>
        {title && <h4 className="font-medium mb-1">{title}</h4>}
        {children}
      </div>
    </div>
  );
};