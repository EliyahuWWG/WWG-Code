import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { readFileSync } from 'node:fs'
import { marked } from 'marked'
import * as yaml from 'js-yaml'
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

// Markdown posts are compiled to HTML at BUILD time, so `marked` never reaches
// the browser bundle. Each .md becomes a module exporting its front matter
// plus the rendered html.
export const markdownPlugin = {
  name: 'markdown-posts',
  enforce: 'pre',
  transform(code, id) {
    if (!id.endsWith('.md')) return null
    const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(code)
    const data = m ? yaml.load(m[1]) : {}
    const body = m ? code.slice(m[0].length) : code
    const html = marked.parse(body, { mangle: false, headerIds: true })
    // Reading time from the source text, not the HTML.
    const words = body.replace(/[#>*`\-\[\]()]/g, ' ').split(/\s+/).filter(Boolean).length
    const post = { ...data, html, words, readingMinutes: Math.max(1, Math.round(words / 220)) }
    return { code: `export default ${JSON.stringify(post)}`, map: null }
  },
}

export default defineConfig({
  plugins: [markdownPlugin, react(), previewDirIndex, dropWoff1],
  base: '/',
  build: {
    modulePreload: {
      // three.js is loaded on demand by Book3D, and only on desktop, only in
      // view, only without prefers-reduced-motion. Vite's automatic
      // modulepreload was pulling all ~190 KB gz of it into the initial HTML
      // of /the-book, which paid the cost for every visitor including the ones
      // the component deliberately skips.
      resolveDependencies: (_url, deps) => deps.filter(d => !d.includes('three.module')),
    },
  },
  ssgOptions: {
    dirStyle: 'nested',
  },
})
