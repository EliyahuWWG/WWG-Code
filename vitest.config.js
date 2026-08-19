import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { markdownPlugin } from './vite.config.js'

export default defineConfig({
  // The markdown plugin has to be here too, or importing src/blog.js in a test
  // tries to parse raw .md as JavaScript.
  plugins: [markdownPlugin, react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    include: ['tests/**/*.test.{js,jsx}'],
    coverage: { provider: 'v8', reporter: ['text', 'html'], include: ['src/**'] },
  },
})
