import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Serve api/*.js locally the way Vercel serves them in production.
 *
 * Vite's dev server knows nothing about serverless functions, so without this
 * /api/share 404s locally and the share flow can only be tested after a deploy.
 * Dev-only: `apply: 'serve'` keeps it out of the production build, where Vercel
 * runs the real thing.
 */
function devServerlessApi(): Plugin {
  return {
    name: 'dev-serverless-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/share', async (req, res) => {
        try {
          const mod = await server.ssrLoadModule('/api/share.js')
          const url = new URL(req.originalUrl ?? req.url ?? '/', 'http://localhost')

          mod.default(
            { query: Object.fromEntries(url.searchParams) },
            {
              setHeader: (key: string, value: string) => res.setHeader(key, value),
              status(code: number) {
                res.statusCode = code
                return this
              },
              send(body: string) {
                res.end(body)
                return this
              },
            }
          )
        } catch (error) {
          res.statusCode = 500
          res.end(`dev api error: ${String(error)}`)
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), devServerlessApi()],
  server: {
    port: 3000,
  },
})
