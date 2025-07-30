# 🏕️ Glamping Domos TreePod

Sitio web de reservas para experiencia de glamping eco-luxury en domos geodésicos con tecnología Starlink.

## 🤖 Agente de Testing Funcional

Este proyecto incluye un **agente de testing automatizado** que verifica automáticamente que el sitio funcione correctamente.

### 🚀 Comandos Principales:

```bash
# 🤖 Ejecutar el agente completo
npm run test:agent

# 📊 Ver tests en vivo
npm run test:e2e:ui

# 📈 Ver último reporte
npm run test:e2e:report

# 🐛 Debug tests
npm run test:e2e:debug
```

### ✅ Lo que Verifica el Agente:

- **✅ "Este botón funciona"** - Todos los botones de navegación
- **✅ "Se ve bien el calendario"** - Funcionalidad del calendario de reservas  
- **✅ "Es rápida la carga"** - Velocidad < 3 segundos
- **✅ "El pago funciona"** - Flujo completo de WebPay
- **✅ "Si se anula, redirige bien"** - Manejo de cancelaciones

## Project info

**URL**: https://lovable.dev/projects/2bac23f3-b5ba-4204-887b-89c4e9d83c72

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/2bac23f3-b5ba-4204-887b-89c4e9d83c72) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## 🧪 Testing

- **Tests unitarios**: `npm run test`
- **Agente E2E**: `npm run test:e2e`
- **Coverage**: `npm run test:coverage`

## What technologies are used for this project?

This project is built with modern web technologies:

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + Radix UI (shadcn-ui)
- **Base de datos**: Supabase
- **Pagos**: WebPay (Transbank)
- **Testing**: Vitest + Playwright (Agente Funcional)

## 🔒 Seguridad

- Validación completa de inputs
- Protección XSS
- Rate limiting
- Headers de seguridad
- Tests de seguridad automatizados

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/2bac23f3-b5ba-4204-887b-89c4e9d83c72) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
