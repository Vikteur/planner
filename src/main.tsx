import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App } from './App'
import { AuthProvider } from './auth'
import { ApiError } from './api/client'
import { installCssVars } from './theme'
import './index.css'
import './responsive.css'

installCssVars()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /**
       * Do not retry what will not succeed. A 401 means the session is gone
       * and the app is already on its way to the sign-in screen; a 404 means
       * the wedding is not there. Retrying either just delays the answer by a
       * few seconds and hides it behind a spinner.
       */
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status < 500) return false
        return failureCount < 2
      },
      staleTime: 30_000,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* Matches vite's base, so every route is relative to /planner/. */}
      <BrowserRouter basename="/planner">
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
