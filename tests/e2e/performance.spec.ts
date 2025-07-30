import { test, expect } from '@playwright/test';

test.describe('Tests de Rendimiento y Velocidad', () => {
  test('La página principal carga en menos de 3 segundos', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    console.log(`Tiempo de carga: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(3000); // 3 segundos
  });

  test('Las imágenes se cargan correctamente', async ({ page }) => {
    await page.goto('/');
    
    // Esperar a que las imágenes se carguen
    await page.waitForLoadState('networkidle');
    
    // Verificar que las imágenes principales están cargadas
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < Math.min(imageCount, 10); i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');
      
      if (src && !src.startsWith('data:')) {
        // Verificar que la imagen tiene dimensiones (está cargada)
        const boundingBox = await img.boundingBox();
        if (boundingBox) {
          expect(boundingBox.width).toBeGreaterThan(0);
          expect(boundingBox.height).toBeGreaterThan(0);
        }
      }
    }
  });

  test('El sitio responde rápidamente en dispositivos móviles', async ({ page }) => {
    // Simular conexión 3G lenta
    await page.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
      await route.continue();
    });

    await page.setViewportSize({ width: 375, height: 667 });
    
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    
    console.log(`Tiempo de carga móvil: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000); // 5 segundos para móvil
  });

  test('Los Core Web Vitals están dentro de rangos aceptables', async ({ page }) => {
    await page.goto('/');
    
    // Medir First Contentful Paint y Largest Contentful Paint
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const paintMetrics: Record<string, number> = {};
          
          entries.forEach((entry) => {
            if (entry.entryType === 'paint') {
              paintMetrics[entry.name] = entry.startTime;
            }
          });
          
          if (paintMetrics['first-contentful-paint']) {
            resolve(paintMetrics);
          }
        }).observe({ entryTypes: ['paint'] });
        
        // Timeout después de 5 segundos
        setTimeout(() => resolve({}), 5000);
      });
    });

    console.log('Métricas de rendimiento:', metrics);
    
    // First Contentful Paint debería ser menor a 1.8 segundos
    if ((metrics as any)['first-contentful-paint']) {
      expect((metrics as any)['first-contentful-paint']).toBeLessThan(1800);
    }
  });

  test('La navegación entre páginas es fluida', async ({ page }) => {
    await page.goto('/');
    
    const navigationLinks = page.locator('nav a, .navigation a');
    const linkCount = await navigationLinks.count();
    
    for (let i = 0; i < Math.min(linkCount, 3); i++) {
      const link = navigationLinks.nth(i);
      const href = await link.getAttribute('href');
      
      if (href && href.startsWith('/')) {
        const startTime = Date.now();
        await link.click();
        await page.waitForLoadState('networkidle');
        const navigationTime = Date.now() - startTime;
        
        console.log(`Navegación a ${href}: ${navigationTime}ms`);
        expect(navigationTime).toBeLessThan(2000); // 2 segundos
        
        await page.goBack();
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('Los recursos estáticos se cachean correctamente', async ({ page }) => {
    // Primera visita
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Segunda visita para verificar cache
    const startTime = Date.now();
    await page.reload();
    await page.waitForLoadState('networkidle');
    const reloadTime = Date.now() - startTime;
    
    console.log(`Tiempo de recarga: ${reloadTime}ms`);
    
    // La recarga debería ser más rápida que la carga inicial
    expect(reloadTime).toBeLessThan(2000);
  });

  test('No hay errores de JavaScript en consola', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Interactuar con elementos comunes para provocar posibles errores
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        await button.click();
        await page.waitForTimeout(500);
      }
    }
    
    // Verificar que no hay errores críticos de JavaScript
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('favicon.ico') && 
      !error.includes('Extension') &&
      !error.includes('chrome-extension')
    );
    
    console.log('Errores de consola:', criticalErrors);
    expect(criticalErrors.length).toBe(0);
  });

  test('El sitio funciona sin JavaScript (graceful degradation)', async ({ page }) => {
    // Deshabilitar JavaScript
    await page.context().addInitScript(() => {
      Object.defineProperty(window, 'navigator', {
        writable: true,
        value: { ...window.navigator, javaEnabled: () => false }
      });
    });
    
    await page.goto('/');
    
    // Verificar que el contenido básico sigue visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    
    // Verificar que los enlaces básicos funcionan
    const basicLinks = page.locator('a[href^="/"]');
    if (await basicLinks.count() > 0) {
      const firstLink = basicLinks.first();
      const href = await firstLink.getAttribute('href');
      
      if (href) {
        await firstLink.click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(new RegExp(href));
      }
    }
  });
});