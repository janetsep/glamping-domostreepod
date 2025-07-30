import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  enableWebP?: boolean;
  sizes?: string;
  srcSet?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzllYTNhZiI+Q2FyZ2FuZG8uLi48L3RleHQ+PC9zdmc+',
  width,
  height,
  priority = false,
  enableWebP = true,
  sizes,
  srcSet,
  onLoad,
  onError
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isInView, setIsInView] = useState(priority);

  useEffect(() => {
    if (priority) {
      loadImage();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  useEffect(() => {
    if (isInView && !isLoaded && !hasError) {
      loadImage();
    }
  }, [isInView, isLoaded, hasError]);

  // Check WebP support
  const supportsWebP = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  };

  const getOptimizedSrc = (originalSrc: string) => {
    if (!enableWebP || !supportsWebP()) {
      return originalSrc;
    }
    
    // Try to convert to WebP path
    const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    return webpSrc;
  };

  const loadImage = () => {
    const optimizedSrc = getOptimizedSrc(src);
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(optimizedSrc);
      setIsLoaded(true);
      onLoad?.();
    };
    
    img.onerror = () => {
      // If WebP fails, try original format
      if (optimizedSrc !== src) {
        const fallbackImg = new Image();
        fallbackImg.onload = () => {
          setImageSrc(src);
          setIsLoaded(true);
          onLoad?.();
        };
        fallbackImg.onerror = () => {
          setHasError(true);
          onError?.();
        };
        fallbackImg.src = src;
      } else {
        setHasError(true);
        onError?.();
      }
    };
    
    img.src = optimizedSrc;
  };

  // Create responsive image element
  if (srcSet || sizes) {
    return (
      <picture className={className}>
        {enableWebP && supportsWebP() && (
          <source
            srcSet={srcSet?.replace(/\.(jpg|jpeg|png)/gi, '.webp') || getOptimizedSrc(src)}
            sizes={sizes}
            type="image/webp"
          />
        )}
        <img
          ref={imgRef}
          src={imageSrc}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          className={`${
            isLoaded ? 'opacity-100' : 'opacity-75'
          } transition-opacity duration-300`}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          style={{
            filter: !isLoaded ? 'blur(2px)' : 'none',
            transition: 'filter 0.3s ease-in-out'
          }}
        />
      </picture>
    );
  }

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`${className} ${
        isLoaded ? 'opacity-100' : 'opacity-75'
      } transition-opacity duration-300`}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      style={{
        filter: !isLoaded ? 'blur(2px)' : 'none',
        transition: 'filter 0.3s ease-in-out'
      }}
    />
  );
};

export default LazyImage;