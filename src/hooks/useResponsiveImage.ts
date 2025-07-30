import { useMemo } from 'react';

interface ImageSizeConfig {
  width: number;
  breakpoint?: number;
}

interface ResponsiveImageConfig {
  src: string;
  sizes: ImageSizeConfig[];
  quality?: number;
  format?: 'webp' | 'jpg' | 'png';
}

export const useResponsiveImage = ({
  src,
  sizes,
  quality = 80,
  format = 'webp'
}: ResponsiveImageConfig) => {
  
  const { srcSet, sizesString } = useMemo(() => {
    // Generate srcSet for different sizes
    const srcSetArray = sizes.map(({ width }) => {
      const optimizedSrc = generateOptimizedUrl(src, width, quality, format);
      return `${optimizedSrc} ${width}w`;
    });

    // Generate sizes string for responsive behavior
    const sizesArray = sizes.map(({ width, breakpoint }, index) => {
      if (index === sizes.length - 1) {
        return `${width}px`; // Last size is default
      }
      return breakpoint 
        ? `(max-width: ${breakpoint}px) ${width}px`
        : `${width}px`;
    });

    return {
      srcSet: srcSetArray.join(', '),
      sizesString: sizesArray.join(', ')
    };
  }, [src, sizes, quality, format]);

  const defaultSrc = useMemo(() => {
    // Use the largest size as default
    const largestSize = Math.max(...sizes.map(s => s.width));
    return generateOptimizedUrl(src, largestSize, quality, format);
  }, [src, sizes, quality, format]);

  return {
    src: defaultSrc,
    srcSet,
    sizes: sizesString
  };
};

// Helper function to generate optimized image URLs
function generateOptimizedUrl(
  originalSrc: string, 
  width: number, 
  quality: number, 
  format: string
): string {
  // For local images in lovable-uploads, we'll return the original for now
  // In production, this would integrate with a CDN like Cloudinary or ImageKit
  if (originalSrc.includes('/lovable-uploads/')) {
    return originalSrc;
  }

  // For external images, we could use a service like ImageKit
  // Example: https://ik.imagekit.io/demo/tr:w-${width},q-${quality},f-${format}/${originalSrc}
  return originalSrc;
}

// Predefined responsive configurations
export const RESPONSIVE_CONFIGS = {
  hero: {
    sizes: [
      { width: 375, breakpoint: 480 },   // Mobile
      { width: 768, breakpoint: 768 },   // Tablet
      { width: 1200, breakpoint: 1200 }, // Desktop
      { width: 1920 }                    // Large desktop
    ]
  },
  gallery: {
    sizes: [
      { width: 300, breakpoint: 480 },   // Mobile
      { width: 400, breakpoint: 768 },   // Tablet
      { width: 600 }                     // Desktop
    ]
  },
  thumbnail: {
    sizes: [
      { width: 150, breakpoint: 480 },   // Mobile
      { width: 200, breakpoint: 768 },   // Tablet
      { width: 300 }                     // Desktop
    ]
  },
  card: {
    sizes: [
      { width: 280, breakpoint: 480 },   // Mobile
      { width: 350, breakpoint: 768 },   // Tablet
      { width: 400 }                     // Desktop
    ]
  }
};