
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Router from './Router'
import { Toaster } from 'sonner'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { queryClient } from './lib/react-query'

// Create a root at the 'root' element in the HTML
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster position="top-right" richColors closeButton />
    </QueryClientProvider>
  </React.StrictMode>,
)
