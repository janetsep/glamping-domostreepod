import { IS_DEVELOPMENT } from '@/lib/constants';

// Safe logger that only logs in development and sanitizes sensitive data
export const logger = {
  log: (...args: any[]) => {
    if (IS_DEVELOPMENT) {
      const sanitizedArgs = args.map(arg => sanitizeLogData(arg));
      console.log(...sanitizedArgs);
    }
  },
  error: (...args: any[]) => {
    if (IS_DEVELOPMENT) {
      const sanitizedArgs = args.map(arg => sanitizeLogData(arg));
      console.error(...sanitizedArgs);
    }
  },
  warn: (...args: any[]) => {
    if (IS_DEVELOPMENT) {
      const sanitizedArgs = args.map(arg => sanitizeLogData(arg));
      console.warn(...sanitizedArgs);
    }
  },
  info: (...args: any[]) => {
    if (IS_DEVELOPMENT) {
      const sanitizedArgs = args.map(arg => sanitizeLogData(arg));
      console.info(...sanitizedArgs);
    }
  },
};

// Sanitize sensitive data from logs
function sanitizeLogData(data: any): any {
  if (typeof data === 'string') {
    // Remove potential API keys, tokens, passwords
    return data
      .replace(/apikey['":\s]*['"]\w+['"]/gi, 'apikey: "[REDACTED]"')
      .replace(/api_key['":\s]*['"]\w+['"]/gi, 'api_key: "[REDACTED]"')
      .replace(/token['":\s]*['"]\w+['"]/gi, 'token: "[REDACTED]"')
      .replace(/password['":\s]*['"]\w+['"]/gi, 'password: "[REDACTED]"')
      .replace(/secret['":\s]*['"]\w+['"]/gi, 'secret: "[REDACTED]"')
      .replace(/authorization['":\s]*['"]\w+['"]/gi, 'authorization: "[REDACTED]"');
  }
  
  if (typeof data === 'object' && data !== null) {
    const sensitiveKeys = ['apikey', 'api_key', 'token', 'password', 'secret', 'authorization', 'client_email', 'client_phone'];
    const sanitized: any = Array.isArray(data) ? [] : {};
    
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const lowerKey = key.toLowerCase();
        if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = sanitizeLogData(data[key]);
        }
      }
    }
    
    return sanitized;
  }
  
  return data;
}

// Export console replacement for migration
export const safeConsole = {
  log: logger.log,
  error: logger.error,
  warn: logger.warn,
  info: logger.info
};