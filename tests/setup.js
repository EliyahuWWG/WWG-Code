import '@testing-library/jest-dom/vitest'
import { vi, beforeEach } from 'vitest'

// jsdom implements neither of these, and several components branch on them.
// Defaults describe a desktop user with no reduced-motion preference; a test
// overrides them when it wants the other branch.
globalThis.matchMedia = globalThis.matchMedia || ((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
  dispatchEvent: vi.fn(),
}))

class IO {
  constructor(cb) { this.cb = cb }
  observe(el) { this.cb([{ isIntersecting: true, target: el }], this) }
  unobserve() {}
  disconnect() {}
}
globalThis.IntersectionObserver = globalThis.IntersectionObserver || IO
globalThis.ResizeObserver = globalThis.ResizeObserver || class { observe(){} unobserve(){} disconnect(){} }

beforeEach(() => { document.documentElement.className = '' })
