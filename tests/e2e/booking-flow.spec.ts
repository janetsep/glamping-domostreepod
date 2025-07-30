import { test, expect } from '@playwright/test';

test.describe('Flujo Completo de Reservas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Flujo completo de reserva - Hasta formulario de pago', async ({ page }) => {
    // Paso 1: Hacer clic en "Reservar" 
    const reservarButton = page.locator('#packages').getByRole('button', { name: /reservar/i });
    await expect(reservarButton).toBeVisible();
    await reservarButton.click();
    
    // Esperar a que cargue la página de unidad
    await page.waitForLoadState('networkidle');

    // Paso 2: Seleccionar unidad (si hay selector de unidades)
    const unitSelector = page.locator('[data-testid="unit-selector"], .unit-selection');
    if (await unitSelector.isVisible()) {
      const firstUnit = unitSelector.locator('.unit-option, .unit-card').first();
      await firstUnit.click();
    }

    // Paso 3: Seleccionar fechas
    const checkInDate = page.locator('[data-testid="checkin-date"], input[name*="checkin"], input[name*="inicio"]');
    const checkOutDate = page.locator('[data-testid="checkout-date"], input[name*="checkout"], input[name*="fin"]');

    if (await checkInDate.isVisible()) {
      await checkInDate.click();
      
      // Seleccionar una fecha disponible (hoy + 7 días)
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      
      const dayToSelect = page.locator(`[data-day="${futureDate.getDate()}"]`).first();
      if (await dayToSelect.isVisible()) {
        await dayToSelect.click();
      }
    }

    if (await checkOutDate.isVisible()) {
      await checkOutDate.click();
      
      // Seleccionar checkout (hoy + 9 días)
      const checkoutFutureDate = new Date();
      checkoutFutureDate.setDate(checkoutFutureDate.getDate() + 9);
      
      const checkoutDay = page.locator(`[data-day="${checkoutFutureDate.getDate()}"]`).first();
      if (await checkoutDay.isVisible()) {
        await checkoutDay.click();
      }
    }

    // Paso 4: Seleccionar número de huéspedes
    const guestsSelector = page.locator('[data-testid="guests-selector"], select[name*="guest"], input[name*="guest"]');
    if (await guestsSelector.isVisible()) {
      await guestsSelector.click();
      if (await guestsSelector.locator('option').isVisible()) {
        await guestsSelector.selectOption('2');
      } else {
        await guestsSelector.fill('2');
      }
    }

    // Paso 5: Continuar al formulario de información personal
    const continueButton = page.getByRole('button', { name: /continuar|siguiente|reservar/i });
    if (await continueButton.isVisible()) {
      await continueButton.click();
    }

    // Paso 6: Llenar información personal
    const nameField = page.locator('input[name="name"], input[name="nombre"]');
    const emailField = page.locator('input[name="email"], input[name="correo"]');
    const phoneField = page.locator('input[name="phone"], input[name="telefono"]');

    if (await nameField.isVisible()) {
      await nameField.fill('Juan Pérez Test');
    }

    if (await emailField.isVisible()) {
      await emailField.fill('test@example.com');
    }

    if (await phoneField.isVisible()) {
      await phoneField.fill('+56912345678');
    }

    // Paso 7: Verificar resumen de reserva
    await expect(page.locator('[data-testid="booking-summary"], .reservation-summary')).toBeVisible({ timeout: 10000 });

    // Paso 8: Continuar al pago
    const paymentButton = page.getByRole('button', { name: /pagar|confirmar pago|proceder al pago/i });
    if (await paymentButton.isVisible()) {
      await paymentButton.click();
      
      // Verificar que se carga la interfaz de pago o redirección
      await page.waitForLoadState('networkidle');
      
      // Verificar elementos de pago (sin procesar el pago real)
      await expect(page.locator('[data-testid="payment-form"], .payment-section, iframe')).toBeVisible({ timeout: 15000 });
    }
  });

  test('Validación de formulario de reserva', async ({ page }) => {
    // Ir directamente al formulario de reserva
    const reservarButton = page.locator('#packages').getByRole('button', { name: /reservar/i });
    await reservarButton.click();
    await page.waitForLoadState('networkidle');

    // Intentar enviar sin llenar campos obligatorios
    const submitButton = page.getByRole('button', { name: /confirmar|reservar|continuar/i });
    if (await submitButton.isVisible()) {
      await submitButton.click();
      
      // Verificar que aparecen mensajes de validación
      const errorMessages = page.locator('.error, .invalid, [aria-invalid="true"], .text-red-500');
      await expect(errorMessages).toHaveCount({ min: 1 });
    }
  });

  test('Verificar cálculo de precios', async ({ page }) => {
    const reservarButton = page.locator('#packages').getByRole('button', { name: /reservar/i });
    await reservarButton.click();
    await page.waitForLoadState('networkidle');

    // Seleccionar fechas y verificar que se calcula el precio
    const checkInDate = page.locator('[data-testid="checkin-date"], input[name*="checkin"]');
    const checkOutDate = page.locator('[data-testid="checkout-date"], input[name*="checkout"]');

    if (await checkInDate.isVisible() && await checkOutDate.isVisible()) {
      await checkInDate.click();
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      await page.locator(`[data-day="${tomorrow.getDate()}"]`).first().click();

      await checkOutDate.click();
      
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 3);
      await page.locator(`[data-day="${dayAfter.getDate()}"]`).first().click();

      // Verificar que aparece el precio calculado
      const priceDisplay = page.locator('[data-testid="total-price"], .total-amount, .price-calculation');
      await expect(priceDisplay).toBeVisible({ timeout: 5000 });
      
      const priceText = await priceDisplay.textContent();
      expect(priceText).toMatch(/\$|CLP|\d+/);
    }
  });

  test('Verificar disponibilidad de fechas', async ({ page }) => {
    const reservarButton = page.locator('#packages').getByRole('button', { name: /reservar/i });
    await reservarButton.click();
    await page.waitForLoadState('networkidle');

    // Abrir calendario
    const dateInput = page.locator('[data-testid="checkin-date"], input[name*="checkin"]');
    if (await dateInput.isVisible()) {
      await dateInput.click();

      // Verificar que hay fechas disponibles y no disponibles
      const availableDates = page.locator('.rdp-day:not(.rdp-day_disabled), .available-date');
      const disabledDates = page.locator('.rdp-day_disabled, .disabled-date');

      await expect(availableDates.first()).toBeVisible();
      
      // Si hay fechas deshabilitadas, verificar que no se pueden seleccionar
      if (await disabledDates.count() > 0) {
        const firstDisabled = disabledDates.first();
        await firstDisabled.click();
        // La fecha no debería seleccionarse
        await expect(firstDisabled).not.toHaveClass(/selected/);
      }
    }
  });
});