# 🧪 Tests E2E - Agente de Testing Funcional para Glamping

Este directorio contiene tests automatizados que actúan como un **agente inteligente** para verificar que tu sitio web de glamping funcione correctamente.

## 🚀 Cómo Usar el Agente de Testing

### Comandos Principales:

```bash
# Ejecutar todos los tests (el agente completo)
npm run test:e2e

# Ver los tests en interfaz visual
npm run test:e2e:ui

# Ver el último reporte
npm run test:e2e:report
```

## 🤖 Lo Que El Agente Verifica

### 1. **Tests de Navegación** (`navigation.spec.ts`)
- ✅ "Este botón funciona"
- ✅ "La página carga correctamente"  
- ✅ "El menú de navegación funciona"
- ✅ "Los botones de la galería funcionan"
- ✅ "El calendario se ve bien y funciona"
- ✅ "Los formularios muestran validación"
- ✅ "Es responsive en móvil"

### 2. **Tests de Reservas** (`booking-flow.spec.ts`)
- ✅ "El flujo completo de reserva funciona"
- ✅ "Se pueden seleccionar fechas"
- ✅ "Se calculan los precios correctamente"
- ✅ "Se valida la información del usuario"
- ✅ "Se verifica disponibilidad de fechas"

### 3. **Tests de Rendimiento** (`performance.spec.ts`)
- ✅ "La carga es rápida (menos de 3 segundos)"
- ✅ "Las imágenes cargan correctamente"
- ✅ "Funciona bien en móvil"
- ✅ "Los Core Web Vitals están bien"
- ✅ "No hay errores en consola"

### 4. **Tests de Pagos** (`payment-flow.spec.ts`)
- ✅ "El pago se procesa correctamente"
- ✅ "Si se anula, redirige correctamente"
- ✅ "Maneja errores de pago"
- ✅ "Muestra página de éxito"
- ✅ "Valida información antes del pago"

## 📊 Interpretando los Resultados

### ✅ **Verde = Todo Funciona**
El agente confirma que esa funcionalidad está trabajando perfectamente.

### ❌ **Rojo = Problema Detectado**
El agente encontró un issue que necesita revisión.

### ⚠️ **Amarillo = Advertencia**
Funciona pero podría mejorarse.

## 🔧 Configuración del Agente

El agente está configurado para probar en:
- **Desktop**: Chrome, Firefox, Safari
- **Móvil**: iPhone, Android
- **Múltiples resoluciones**

### Personalizar el Agente:

Edita `playwright.config.ts` para:
- Cambiar navegadores
- Ajustar timeouts
- Modificar configuración

## 🎯 Tests Específicos por Funcionalidad

### Para probar solo navegación:
```bash
npx playwright test navigation
```

### Para probar solo reservas:
```bash
npx playwright test booking-flow
```

### Para probar solo rendimiento:
```bash
npx playwright test performance
```

### Para probar solo pagos:
```bash
npx playwright test payment-flow
```

## 📝 Cómo Leer un Reporte

1. **Ejecuta:** `npm run test:e2e`
2. **Ve el reporte:** `npm run test:e2e:report`
3. **El reporte muestra:**
   - ✅ Tests pasados
   - ❌ Tests fallidos  
   - 📸 Screenshots de errores
   - 🎥 Videos de la ejecución
   - ⏱️ Tiempos de carga

## 🔄 Ejecutar Tests Automáticamente

### En desarrollo:
```bash
npx playwright test --watch
```

### En CI/CD:
Los tests se pueden integrar en GitHub Actions, GitLab CI, etc.

## 🛠️ Solución de Problemas

### Si los tests fallan:

1. **Verificar que el servidor esté corriendo:**
   ```bash
   npm run dev
   ```

2. **Actualizar navegadores:**
   ```bash
   npx playwright install
   ```

3. **Ver en modo debug:**
   ```bash
   npx playwright test --debug
   ```

## 📈 Métricas que Rastrea el Agente

- **Tiempo de carga**: < 3 segundos
- **First Contentful Paint**: < 1.8 segundos  
- **Errores de JavaScript**: 0
- **Imágenes rotas**: 0
- **Enlaces rotos**: 0
- **Funcionalidad de formularios**: 100%
- **Responsive design**: ✅ Todas las resoluciones

## 🎯 Agregar Nuevos Tests

Para agregar nuevas verificaciones al agente:

1. Crea un nuevo archivo `.spec.ts`
2. Usa el patrón:
   ```typescript
   test('descripción de lo que verifica', async ({ page }) => {
     // Tu test aquí
   });
   ```

¡Tu agente de testing está listo para mantener tu sitio funcionando perfectamente! 🚀