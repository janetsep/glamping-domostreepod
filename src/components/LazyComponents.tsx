import { lazy } from 'react';

// Lazy load components that are not immediately visible
export const LazyGallery = lazy(() => import('./Gallery'));
export const LazyTestimonials = lazy(() => import('./Testimonials'));
export const LazyCelebrations = lazy(() => import('./Celebrations'));
export const LazyLocation = lazy(() => import('./Location'));
export const LazySimplifiedContact = lazy(() => import('./SimplifiedContact'));
export const LazyBenefits = lazy(() => import('./Benefits'));

// Lazy load heavy pages
export const LazyUnitDetail = lazy(() => import('../pages/UnitDetail'));
export const LazyAboutUs = lazy(() => import('../pages/AboutUs'));
export const LazyCelebrationDetail = lazy(() => import('../pages/CelebrationDetail'));
export const LazyTravelerType = lazy(() => import('../pages/TravelerType'));

// Lazy load WebPay components (only needed during payment)
export const LazyWebPayReturn = lazy(() => import('../pages/WebPayReturn'));
export const LazyTransactionStatus = lazy(() => import('./webpay/TransactionStatus'));
export const LazyPaymentProcessing = lazy(() => import('./webpay/PaymentProcessing'));

// Loading fallback component
export const ComponentLoader: React.FC<{ height?: string }> = ({ height = 'h-64' }) => (
  <div className={`${height} w-full flex items-center justify-center bg-gray-50 animate-pulse`}>
    <div className="text-center">
      <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
      <p className="text-gray-600 text-sm">Cargando...</p>
    </div>
  </div>
);