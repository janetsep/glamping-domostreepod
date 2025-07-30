import React from 'react';
import LazyImage from './LazyImage';
import { useResponsiveImage, RESPONSIVE_CONFIGS } from '@/hooks/useResponsiveImage';

interface OptimizedImageProps {
  src: string;
  alt: string;
  variant?: 'hero' | 'gallery' | 'thumbnail' | 'card';
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  variant = 'gallery',
  className = '',
  priority = false,
  width,
  height,
  onLoad,
  onError
}) => {
  const config = RESPONSIVE_CONFIGS[variant];
  const { src: optimizedSrc, srcSet, sizes } = useResponsiveImage({
    src,
    sizes: config.sizes,
    quality: variant === 'hero' ? 90 : 80, // Higher quality for hero images
    format: 'webp'
  });

  return (
    <LazyImage
      src={optimizedSrc}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      className={className}
      priority={priority}
      width={width}
      height={height}
      enableWebP={true}
      onLoad={onLoad}
      onError={onError}
    />
  );
};

export default OptimizedImage;