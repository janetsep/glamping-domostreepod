/**
 * Utilidad de logging optimizada para producción
 * En producción solo muestra errores críticos
 */

const isProduction = process.env.NODE_ENV === 'production';

export const logger = {
  log: (...args: any[]) => {
    if (!isProduction) {
      console.log(...args);
    }
  },
  
  info: (...args: any[]) => {
    if (!isProduction) {
      console.info(...args);
    }
  },
  
  warn: (...args: any[]) => {
    console.warn(...args);
  },
  
  error: (...args: any[]) => {
    console.error(...args);
  },
  
  debug: (...args: any[]) => {
    if (!isProduction) {
      console.debug(...args);
    }
  }
};

export default logger;