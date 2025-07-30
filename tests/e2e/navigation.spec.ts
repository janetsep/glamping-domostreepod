import { test, expect } from '@playwright/test';

test.describe('Navegación y Funcionalidad de Botones', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('La página principal carga correctamente', async ({ page }) => {
    await expect(page).toHaveTitle(/Glamping/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('El botón de "Reservar" funciona', async ({ page }) => {
    // Usar el botón de reservar de la sección packages
    const reservarButton = page.locator('#packages').getByRole('button', { name: /reservar/i });
    await expect(reservarButton).toBeVisible();
    await reservarButton.click();
    
    // Verificar que navega a la página de unidad
    await expect(page).toHaveURL(/\/unit\//);
  });

  test('La navegación del menú principal funciona', async ({ page }) => {
    // Test para navegación a diferentes secciones
    const menuItems = [
      { name: /inicio/i, path: '/' },
      { name: /unidades/i, path: '/units' },
      { name: /contacto/i, path: '/contact' }
    ];

    for (const item of menuItems) {
      const link = page.getByRole('link', { name: item.name });
      if (await link.isVisible()) {
        await link.click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(new RegExp(item.path));
        await page.goto('/'); // Volver al inicio para el siguiente test
      }
    }
  });

  test('Los botones de la galería funcionan correctamente', async ({ page }) => {
    // Buscar botones de navegación de la galería
    const nextButton = page.locator('[data-testid="gallery-next"], .gallery-next, [aria-label*="siguiente"]');
    const prevButton = page.locator('[data-testid="gallery-prev"], .gallery-prev, [aria-label*="anterior"]');

    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(500); // Esperar animación
    }

    if (await prevButton.isVisible()) {
      await prevButton.click();
      await page.waitForTimeout(500);
    }
  });

  test('El calendario se muestra y funciona correctamente', async ({ page }) => {
    // Buscar y hacer clic en el selector de fechas
    const dateSelector = page.locator('[data-testid="date-picker"], .react-day-picker, input[type="date"]');
    
    if (await dateSelector.first().isVisible()) {
      await dateSelector.first().click();
      
      // Verificar que el calendario está visible
      await expect(page.locator('.rdp, .react-day-picker, [role="dialog"]')).toBeVisible();
      
      // Intentar seleccionar una fecha disponible
      const availableDate = page.locator('.rdp-day:not(.rdp-day_disabled), .available-date').first();
      if (await availableDate.isVisible()) {
        await availableDate.click();
      }
    }
  });

  test('Los formularios muestran validación correcta', async ({ page }) => {
    // Buscar formulario de contacto o reserva
    const form = page.locator('form').first();
    
    if (await form.isVisible()) {
      const submitButton = form.locator('button[type="submit"], .submit-button');
      
      if (await submitButton.isVisible()) {
        await submitButton.click();
        
        // Verificar que aparecen mensajes de validación
        const errorElements = page.locator('.error, .invalid, [aria-invalid="true"]');
        const errorCount = await errorElements.count();
        expect(errorCount).toBeGreaterThan(0);
      }
    }
  });

  test('Los enlaces sociales y de contacto funcionan', async ({ page }) => {
    const socialLinks = page.locator('a[href*="instagram"], a[href*="facebook"], a[href*="whatsapp"]');
    const count = await socialLinks.count();
    
    for (let i = 0; i < count; i++) {
      const link = socialLinks.nth(i);
      const href = await link.getAttribute('href');
      
      if (href) {
        // Verificar que el enlace tiene un href válido
        expect(href).toMatch(/^(https?:\/\/|mailto:|tel:)/);
      }
    }
  });

  test('El sitio es responsive en móvil', async ({ page }) => {
    // Cambiar a viewport móvil
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verificar que el menú móvil funciona
    const menuToggle = page.locator('[data-testid="mobile-menu"], .menu-toggle, .hamburger');
    
    if (await menuToggle.isVisible()) {
      await menuToggle.click();
      await expect(page.locator('[data-testid="mobile-navigation"], .mobile-nav')).toBeVisible();
    }
    
    // Verificar que los elementos principales son visibles
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
  });
});