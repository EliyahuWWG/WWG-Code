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

// @fontsource CSS lists a legacy .woff fallback after every .woff2. Vite emits
// both, and no browser since 2016 fetches the .woff. Has to run at
// generateBundle: a `transform` hook never sees these files, because
// postcss-import reads @imported CSS straight off disk.
const dropWoff1 = {
  name: 'drop-woff1',
  generateBundle(_opts, bundle) {
    for (const [file, chunk] of Object.entries(bundle)) {
      if (chunk.type === 'asset' && file.endsWith('.css')) {
        chunk.source = String(chunk.source)
          .replace(/,\s*url\(([^)]*?)\.woff\)\s*format\("?'?woff'?"?\)/g, '')
      }
    }
    let dropped = 0, bytes = 0
    for (const [file, chunk] of Object.entries(bundle)) {
      if (file.endsWith('.woff')) {
        bytes += chunk.source?.length ?? 0
        delete bundle[file]
        dropped++
      }
    }
    if (dropped) this.warn(`[drop-woff1] removed ${dropped} legacy .woff files (${bytes} B)`)
  },
}

export default defineConfig({
  plugins: [react(), previewDirIndex, dropWoff1],
  base: '/',
  ssgOptions: {
    dirStyle: 'nested',
  },
})
