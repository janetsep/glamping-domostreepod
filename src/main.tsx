
import { createRoot } from 'react-dom/client'
import Router from './Router'
import './index.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query'

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <Router />
  </QueryClientProvider>
);
