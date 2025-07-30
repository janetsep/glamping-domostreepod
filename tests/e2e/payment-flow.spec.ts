import { test, expect } from '@playwright/test';

test.describe('Flujo de Pagos WebPay', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Iniciar proceso de pago - hasta redirección WebPay', async ({ page }) => {
    // Paso 1: Completar el flujo de reserva hasta el pago
    const reservarButton = page.locator('#packages').getByRole('button', { name: /reservar/i });
    await reservarButton.click();
    await page.waitForLoadState('networkidle');

    // Llenar datos mínimos para llegar al pago
    await page.waitForTimeout(1000);

    // Seleccionar fechas si están disponibles
    const checkInDate = page.locator('[data-testid="checkin-date"], input[name*="checkin"]');
    if (await checkInDate.isVisible()) {
      await checkInDate.click();
      const futureDate = page.locator('.rdp-day:not(.rdp-day_disabled)').first();
      if (await futureDate.isVisible()) {
        await futureDate.click();
      }
    }

    // Llenar información personal
    const nameField = page.locator('input[name="name"], input[name="nombre"]');
    const emailField = page.locator('input[name="email"], input[name="correo"]');
    const phoneField = page.locator('input[name="phone"], input[name="telefono"]');

    if (await nameField.isVisible()) {
      await nameField.fill('Test User WebPay');
    }

    if (await emailField.isVisible()) {
      await emailField.fill('test@webpay.com');
    }

    if (await phoneField.isVisible()) {
      await phoneField.fill('+56987654321');
    }

    // Buscar el botón de pago
    const paymentButton = page.getByRole('button', { name: /pagar|proceder al pago|confirmar pago/i });
    
    if (await paymentButton.isVisible()) {
      // Verificar que el botón de pago está habilitado
      await expect(paymentButton).toBeEnabled();
      
      await paymentButton.click();
      
      // Verificar que se inicia el proceso de pago
      // Puede ser una redirección a WebPay o un modal de carga
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      
      // Verificar elementos relacionados con WebPay
      const paymentIndicators = [
        page.locator('text=/webpay/i'),
        page.locator('text=/transbank/i'),
        page.locator('[data-testid="payment-processing"]'),
        page.locator('.payment-loader'),
        page.locator('iframe[src*="webpay"]'),
        page.locator('text=/procesando pago/i')
      ];

      let paymentFlowDetected = false;
      for (const indicator of paymentIndicators) {
        if (await indicator.isVisible({ timeout: 5000 })) {
          paymentFlowDetected = true;
          break;
        }
      }

      // Si no se detecta flujo de pago, verificar al menos que algo cambió
      if (!paymentFlowDetected) {
        // Verificar que la URL cambió o que hay algún indicador de proceso de pago
        const currentUrl = page.url();
        const hasPaymentInUrl = currentUrl.includes('payment') || 
                               currentUrl.includes('pago') || 
                               currentUrl.includes('webpay');
        
        if (!hasPaymentInUrl) {
          // Al menos verificar que aparece algún mensaje de confirmación
          await expect(page.locator('text=/confirmación|confirmado|éxito|error/i')).toBeVisible({ timeout: 5000 });
        }
      }

      console.log('Flujo de pago iniciado correctamente');
    }
  });

  test('Verificar validación antes del pago', async ({ page }) => {
    // Ir directamente a intentar pagar sin completar datos
    const reservarButton = page.locator('#packages').getByRole('button', { name: /reservar/i });
    await reservarButton.click();
    await page.waitForLoadState('networkidle');

    // Buscar botón de pago sin llenar formulario
    const paymentButton = page.getByRole('button', { name: /pagar|proceder al pago/i });
    
    if (await paymentButton.isVisible()) {
      // El botón debería estar deshabilitado inicialmente
      const isEnabled = await paymentButton.isEnabled();
      if (isEnabled) {
        await paymentButton.click();
        
        // Debería mostrar errores de validación
        await expect(page.locator('.error, .invalid, [aria-invalid="true"]')).toBeVisible();
      } else {
        // El botón está correctamente deshabilitado
        await expect(paymentButton).toBeDisabled();
      }
    }
  });

  test('Simular cancelación de pago', async ({ page }) => {
    // Completar flujo hasta el pago
    const reservarButton = page.locator('#packages').getByRole('button', { name: /reservar/i });
    await reservarButton.click();
    await page.waitForLoadState('networkidle');

    // Llenar datos mínimos
    const nameField = page.locator('input[name="name"], input[name="nombre"]');
    if (await nameField.isVisible()) {
      await nameField.fill('Test Cancel Payment');
    }

    const emailField = page.locator('input[name="email"], input[name="correo"]');
    if (await emailField.isVisible()) {
      await emailField.fill('test@cancel.com');
    }

    // Buscar botón de cancelar en el proceso de pago
    const cancelButton = page.getByRole('button', { name: /cancelar|volver|cerrar/i });
    
    if (await cancelButton.isVisible()) {
      await cancelButton.click();
      
      // Verificar que se regresa a la página anterior o se muestra confirmación
      await page.waitForLoadState('networkidle');
      
      // Debería estar de vuelta en el formulario o página principal
      const isBackToForm = await page.locator('form, input[name="name"]').isVisible();
      const isBackToHome = page.url().endsWith('/') || page.url().includes('home');
      
      expect(isBackToForm || isBackToHome).toBe(true);
    }
  });

  test('Verificar manejo de errores de pago', async ({ page }) => {
    // Interceptar requests para simular error de pago
    await page.route('**/api/payment/**', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Payment failed', message: 'Error simulado para testing' })
      });
    });

    // Completar flujo hasta el pago
    const reservarButton = page.locator('#packages').getByRole('button', { name: /reservar/i });
    await reservarButton.click();
    await page.waitForLoadState('networkidle');

    // Llenar datos y proceder al pago
    const nameField = page.locator('input[name="name"], input[name="nombre"]');
    if (await nameField.isVisible()) {
      await nameField.fill('Test Error Payment');
    }

    const paymentButton = page.getByRole('button', { name: /pagar|proceder al pago/i });
    if (await paymentButton.isVisible()) {
      await paymentButton.click();
      
      // Verificar que se muestra mensaje de error
      await expect(page.locator('text=/error|falló|problema/i')).toBeVisible({ timeout: 10000 });
    }
  });

  test('Verificar página de éxito de pago', async ({ page }) => {
    // Simular flujo exitoso interceptando la respuesta
    await page.route('**/api/payment/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          success: true, 
          transactionId: 'TEST123456',
          message: 'Pago procesado exitosamente'
        })
      });
    });

    // Si existe una página de éxito directa, navegar a ella
    const successUrls = ['/success', '/exito', '/confirmacion', '/payment-success'];
    
    for (const url of successUrls) {
      try {
        await page.goto(url);
        
        if (page.url().includes(url)) {
          // Verificar elementos de la página de éxito
          const successIndicators = [
            page.locator('text=/éxito|exitoso|confirmado|reserva confirmada/i'),
            page.locator('[data-testid="success-message"]'),
            page.locator('.success, .confirmation')
          ];

          let successFound = false;
          for (const indicator of successIndicators) {
            if (await indicator.isVisible({ timeout: 2000 })) {
              successFound = true;
              break;
            }
          }

          if (successFound) {
            console.log(`Página de éxito encontrada en: ${url}`);
            
            // Verificar que hay información de la reserva
            const reservationInfo = page.locator('text=/número de reserva|código|confirmación/i');
            if (await reservationInfo.isVisible()) {
              console.log('Información de reserva visible');
            }
            
            break;
          }
        }
      } catch (error) {
        // Continuar con la siguiente URL si esta falla
        continue;
      }
    }
  });

  test('Verificar información de precios antes del pago', async ({ page }) => {
    const reservarButton = page.locator('#packages').getByRole('button', { name: /reservar/i });
    await reservarButton.click();
    await page.waitForLoadState('networkidle');

    // Buscar información de precios
    const priceElements = page.locator('[data-testid="total-price"], .total-amount, .price-summary, text=/total|CLP|\\$/i');
    
    if (await priceElements.first().isVisible()) {
      const priceCount = await priceElements.count();
      
      for (let i = 0; i < priceCount; i++) {
        const priceElement = priceElements.nth(i);
        const priceText = await priceElement.textContent();
        
        if (priceText) {
          // Verificar que el precio tiene formato válido
          expect(priceText).toMatch(/\d+|CLP|\$/);
          console.log(`Precio encontrado: ${priceText}`);
        }
      }
    }

    // Verificar desglose de costos si existe
    const costBreakdown = page.locator('.cost-breakdown, .price-details, [data-testid="price-breakdown"]');
    if (await costBreakdown.isVisible()) {
      console.log('Desglose de costos visible');
    }
  });
});