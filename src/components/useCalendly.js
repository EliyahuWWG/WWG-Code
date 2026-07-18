import { CALENDLY } from '../data'

// Opens the Calendly popup if the widget is loaded; otherwise the <a href> falls through.
export function openCalendly(e) {
  if (typeof window !== 'undefined' && window.Calendly && window.Calendly.initPopupWidget) {
    if (e) e.preventDefault()
    window.Calendly.initPopupWidget({ url: CALENDLY })
  }
}
