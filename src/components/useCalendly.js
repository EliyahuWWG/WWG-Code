import { CALENDLY } from '../data'

let loading = null

// Forward campaign attribution into Calendly so bookings can be traced back to
// the page/campaign that produced them. Maps ?utm_* to Calendly's utm_ params
// (Calendly surfaces these in the event record and any connected CRM).
export function calendlyUrl(base = CALENDLY) {
  if (typeof window === 'undefined') return base
  try {
    const src = new URLSearchParams(window.location.search)
    const url = new URL(base)
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']) {
      const v = src.get(k)
      if (v) url.searchParams.set(k, v)
    }
    if (!url.searchParams.has('utm_source') && document.referrer) {
      try { url.searchParams.set('utm_source', new URL(document.referrer).hostname) } catch { /* ignore */ }
    }
    return url.toString()
  } catch {
    return base
  }
}

// Injects Calendly's widget.js + widget.css once, on demand. Wired to
// pointerenter/focus on booking CTAs so the widget is usually ready by the
// time the visitor clicks, nothing Calendly loads on first paint.
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

// Conversion event, every booking CTA funnels through here (Google Analytics 4).
export function trackBookCall(source) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', 'book_call_click', {
    source: source || (window.location && window.location.pathname) || '',
  })
}

// On-brand colours for the Calendly booking page (hex without the #), plus a
// trim of Calendly's own landing/GDPR chrome so the popup is shorter and does
// not overflow. Colours mirror the site tokens: bone background, navy accent,
// ink text.
export const CAL_PAGE_SETTINGS = {
  backgroundColor: 'faf7ef',
  primaryColor: '0a1568',
  textColor: '1a1f38',
  hideLandingPageDetails: true,
  hideGdprBanner: true,
}

// Opens the Calendly popup if the widget is ready; otherwise starts loading it
// and lets the <a href> fall through to /book-a-call (inline calendar there).
export function openCalendly(e, base) {
  if (typeof window === 'undefined') return
  trackBookCall()
  if (window.Calendly && window.Calendly.initPopupWidget) {
    if (e) e.preventDefault()
    window.Calendly.initPopupWidget({ url: calendlyUrl(base), pageSettings: CAL_PAGE_SETTINGS })
  } else {
    warmCalendly()
  }
}
