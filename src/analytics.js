/**
 * Analytics loader.
 *
 * These used to be two hardcoded <script> tags in index.html carrying the
 * placeholder IDs G-XXXXXXXXXX and CLARITY_PROJECT_ID. That shipped: every
 * visitor's browser opened connections to googletagmanager.com and clarity.ms
 * to report to accounts that do not exist. Wasted requests, console noise, and
 * a third-party connection on a page that had no analytics to show for it.
 *
 * Now nothing loads unless a real ID is configured, and when one is, it loads
 * AFTER first paint so it never competes with the page the visitor came for.
 *
 * Configure in a .env file at the project root (see .env.example):
 *   VITE_GA_ID       G-XXXXXXXXXX   from analytics.google.com
 *   VITE_CLARITY_ID  abcde12345     from clarity.microsoft.com
 *
 * Leave either blank and that tool is simply absent. Nothing breaks.
 */

const GA = (import.meta.env.VITE_GA_ID || '').trim()
const CLARITY = (import.meta.env.VITE_CLARITY_ID || '').trim()

// Guard against the old placeholders ever creeping back in via a copied .env.
const isReal = (id, prefix) =>
  Boolean(id) && !/X{4,}|PROJECT_ID|PASTE|CHANGE/i.test(id) && (!prefix || id.startsWith(prefix))

function loadGA(id) {
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  window.gtag('config', id)

  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
  document.head.appendChild(s)
}

function loadClarity(id) {
  ;(function (c, l, a, r, i) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) }
    const t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i
    const y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y)
  })(window, document, 'clarity', 'script', id)
}

export function initAnalytics() {
  if (typeof window === 'undefined') return   // prerender runs in Node

  const start = () => {
    if (isReal(GA, 'G-')) loadGA(GA)
    if (isReal(CLARITY)) loadClarity(CLARITY)
  }

  // Off the critical path. Analytics measuring the page must never be the
  // reason the page is slow.
  const idle = window.requestIdleCallback || (cb => setTimeout(cb, 1200))
  idle(start)
}
