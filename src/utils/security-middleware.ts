import { SECURITY_HEADERS } from '@/lib/constants';

// Apply security headers to requests
export const applySecurityHeaders = (headers: HeadersInit = {}): HeadersInit => {
  return {
    ...headers,
    ...SECURITY_HEADERS
  };
};

// Secure fetch wrapper
export const secureFetch = async (
  url: string, 
  options: RequestInit = {}
): Promise<Response> => {
  const secureOptions: RequestInit = {
    ...options,
    headers: applySecurityHeaders(options.headers)
  };

  // Add request timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const response = await fetch(url, {
      ...secureOptions,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// Validate CORS origin
export const validateOrigin = (origin: string): boolean => {
  const allowedOrigins = [
    'http://localhost:8080',
    'https://localhost:8080',
    'https://gtxjfmvnzrsuaxryffnt.supabase.co',
    process.env.NODE_ENV === 'production' ? 'https://your-production-domain.com' : null
  ].filter(Boolean);

  return allowedOrigins.includes(origin);
};

// Rate limiting for client-side requests
const requestMap = new Map<string, { count: number; resetTime: number }>();

export const clientRateLimit = (
  key: string, 
  maxRequests = 10, 
  windowMs = 60000
): boolean => {
  const now = Date.now();
  const record = requestMap.get(key);

  if (!record || now > record.resetTime) {
    requestMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
};

// Content Security Policy generator
export const generateCSP = (): string => {
  const policies = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co https://*.transbank.cl",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://*.transbank.cl wss://*.supabase.co",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://*.transbank.cl"
  ];

  return policies.join('; ');
};