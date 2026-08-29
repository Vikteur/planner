import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    proxy: {
      /**
       * The API, proxied rather than called cross-origin.
       *
       * `changeOrigin: false` is deliberate: the browser sees one origin, so
       * the session cookie is first-party in dev exactly as it is in
       * production behind nginx. Pointing the app at http://localhost:8080
       * instead would make the cookie third-party, which modern browsers block
       * by default — the app would appear to sign in and then be signed out on
       * the next request, for a reason that has nothing to do with the code.
       */
      '/api': { target: 'http://localhost:8080', changeOrigin: false },
    },
  },
})
