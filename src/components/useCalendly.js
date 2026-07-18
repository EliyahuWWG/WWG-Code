import { CALENDLY } from '../data'

let loading = null

// Injects Calendly's widget.js + widget.css once, on demand. Wired to
// pointerenter/focus on booking CTAs so the widget is usually ready by the
// time the visitor clicks — nothing Calendly loads on first paint.
export function warmCalendly() {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.Calendly) return Promise.resolve()
  if (loading) return loading
  loading = new Promise((resolve) => {
    const css = document.createElement('link')
    css.rel = 'stylesheet'
    css.href = 'https://assets.calendly.com/assets/external/widget.css'
    document.head.appendChild(css)
    const s = document.createElement('script')
    s.src = 'https://assets.calendly.com/assets/external/widget.js'
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => { loading = null; resolve() }
    document.head.appendChild(s)
  })
  return loading
}

// Conversion event — every booking CTA funnels through here (Plausible).
export function trackBookCall(source) {
  if (typeof window === 'undefined' || typeof window.plausible !== 'function') return
  window.plausible('book_call_click', {
    props: { source: source || (window.location && window.location.pathname) || '' },
  })
}

// Opens the Calendly popup if the widget is ready; otherwise starts loading it
// and lets the <a href> fall through to /book-a-call (inline calendar there).
export function openCalendly(e) {
  if (typeof window === 'undefined') return
  trackBookCall()
  if (window.Calendly && window.Calendly.initPopupWidget) {
    if (e) e.preventDefault()
    window.Calendly.initPopupWidget({ url: CALENDLY })
  } else {
    warmCalendly()
  }
}
