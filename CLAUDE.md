# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚀 Essential Commands

```bash
# Development
npm run dev              # Start dev server (port 8080)
npm run build            # Build for production
npm run build:dev        # Build for development
npm run preview          # Preview production build

# Testing
npm run test             # Run unit tests (Vitest)
npm run test:ui          # Run unit tests with UI
npm run test:coverage    # Run tests with coverage

# E2E Testing (Automated Agent)
npm run test:e2e         # Run all E2E tests
npm run test:e2e:ui      # E2E tests with UI
npm run test:e2e:report  # View last test report
npm run test:e2e:headed  # Run tests in headed mode
npm run test:e2e:debug   # Debug E2E tests
npm run test:agent       # Alias for test:e2e

# Specific E2E tests
npx playwright test navigation.spec.ts
npx playwright test booking-flow.spec.ts
npx playwright test performance.spec.ts
npx playwright test payment-flow.spec.ts

# Code Quality
npm run lint             # Run ESLint
```

## 🏗️ Architecture Overview

### Core Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Radix UI (shadcn/ui components)
- **Routing**: React Router v6 with hash navigation support
- **State Management**: React Query (TanStack Query) for server state
- **Database**: Supabase (PostgreSQL)
- **Payments**: WebPay (Transbank) integration
- **Testing**: Vitest (unit) + Playwright (E2E)

### Key Architectural Patterns

1. **Component Structure**:
   - Lazy loading for route components via `LazyComponents.tsx`
   - UI components in `src/components/ui/` (shadcn/ui pattern)
   - Feature components organized by domain
   - Shared hooks in `src/hooks/`

2. **Data Flow**:
   - Supabase client configured in `src/lib/supabase.ts`
   - React Query for caching and synchronization
   - Custom hooks for business logic (e.g., `useReservations`, `useGlampingUnits`)

3. **Reservation System**:
   - Multi-step flow: Unit Selection → Date Selection → Client Info → Payment
   - Availability checking via `useUnifiedAvailabilityChecker`
   - Price calculation with dynamic pricing rules
   - WebPay integration for payments

4. **Security**:
   - Input validation on all forms
   - XSS protection via security middleware
   - Rate limiting configured
   - Environment variables for sensitive data

### Critical Files & Patterns

- **Router**: `src/Router.tsx` - Handles routing and hash navigation
- **Supabase Types**: `src/integrations/supabase/types.ts` - Generated DB types
- **Constants**: `src/lib/constants.ts` - App-wide configuration
- **WebPay Flow**: `src/hooks/webpay/` - Payment processing logic
- **Reservation Logic**: `src/hooks/reservations/` - Core booking functionality

## 🗄️ Database Schema (Supabase)

Key tables:
- `glamping_units`: Unit definitions and capacity
- `reservations`: Booking records with status tracking
- `availability_blocks`: Blocked dates management
- `pricing_rules`: Dynamic pricing configuration
- `packages`: Available packages and pricing

## 🔧 Development Guidelines

1. **Port Configuration**: Dev server runs on `http://localhost:8080`
2. **Environment Variables**: Copy `.env.example` to `.env` and configure
3. **Image Optimization**: Use `OptimizedImage` component for performance
4. **Error Handling**: Comprehensive logging via `src/utils/logger.ts`
5. **Testing**: Always run E2E tests before deployment

## 📦 Deployment

- Optimized for Vercel/Netlify deployment
- PWA-ready with manifest and service worker
- Automatic image optimization
- Security headers configured

## 🐛 Common Issues

1. **E2E Tests Failing**:
   - Ensure dev server is running
   - Run `npx playwright install` to update browsers
   - Check port 8080 is available

2. **Build Errors**:
   - Clear node_modules and reinstall
   - Check TypeScript errors with `npm run lint`
   - Verify all environment variables are set

3. **Supabase Connection**:
   - Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
   - Check network connectivity
   - Review Supabase dashboard for quota limits