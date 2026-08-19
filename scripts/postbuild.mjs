// vite-react-ssg with dirStyle:'nested' emits dist/404/index.html.
// Netlify looks for dist/404.html and serves it with a real 404 status,
// so copy it up. Without this, unknown URLs return 200 and Google indexes
// every typo as a soft 404.
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const dist = 'dist'
const src = join(dist, '404', 'index.html')
const dest = join(dist, '404.html')

if (existsSync(src)) {
  mkdirSync(dist, { recursive: true })
  copyFileSync(src, dest)
  console.log('[postbuild] dist/404/index.html -> dist/404.html')
} else {
  console.warn('[postbuild] WARNING: no prerendered 404 found at', src)
  process.exitCode = 1
}
