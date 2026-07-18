import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `vite preview` only falls back to the SPA index for extensionless paths;
// real hosts (Netlify/Vercel) resolve /business → business/index.html. Mirror
// that locally so the prerendered pages can be verified with `npm run preview`.
const previewDirIndex = {
  name: 'preview-dir-index',
  configurePreviewServer(server) {
    server.middlewares.use((req, _res, next) => {
      const url = (req.url || '').split('?')[0]
      if (url !== '/' && !url.includes('.') && existsSync(join(process.cwd(), 'dist', url, 'index.html'))) {
        req.url = url.replace(/\/?$/, '/')
      }
      next()
    })
  },
}

export default defineConfig({
  plugins: [react(), previewDirIndex],
  base: '/',
  ssgOptions: {
    dirStyle: 'nested',
  },
})
