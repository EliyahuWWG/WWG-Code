import { CALENDLY } from '../data'
import { openCalendly, warmCalendly } from './useCalendly'
import Arrow from './Arrow'

// A booking link that opens the Calendly popup when the widget is ready and
// otherwise falls through to the Calendly page. Used everywhere a "Book a call"
// CTA appears so the tracked event + lazy-load behaviour stays consistent.
export default function BookCallLink({ className = 'btn btn-solid', children = 'Book a call', arrow = true }) {
  return (
    <a href={CALENDLY} target="_blank" rel="noopener" onClick={openCalendly}
      onPointerEnter={warmCalendly} onFocus={warmCalendly} className={className}>
      {children}{arrow && <> <Arrow /></>}
    </a>
  )
}
