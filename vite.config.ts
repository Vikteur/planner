import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Where the API is during `npm run dev`. The e2e harness overrides it to point
// at a throwaway instance with its own database.
const apiTarget = process.env.API_URL ?? `http://127.0.0.1:${process.env.API_PORT ?? '8080'}`

/*
  The planner is served under /planner/ in production: the DJ app owns / on the
  same hostname and the couple's intake owns /guest/ and /g/.

  Set here rather than only in nginx so the dev server uses the same base. A dev
  build that lives at / and a production one that lives at /planner/ differ in
  exactly the way that is invisible until deploy - asset URLs and router paths -
  and this is the cheapest way to never find that out on the box.
*/
const BASE = '/planner/'

export default defineConfig({
  base: BASE,
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
      '/api': { target: apiTarget, changeOrigin: false },
    },
  },
})
