import { Link } from 'react-router-dom'
import { openCalendly, warmCalendly } from './useCalendly'
import Arrow from './Arrow'

/**
 * The booking CTA, used everywhere so the tracked event and the lazy-load
 * behaviour stay consistent.
 *
 * The href now points at /book-a-call rather than straight at calendly.com.
 * That page carries the same inline calendar plus the proof and context, so
 * anyone who middle-clicks, opens in a new tab, or has JS disabled lands
 * somewhere that still sells. The Calendly popup still opens in place for
 * everyone else, which stays the fastest path.
 */
export default function BookCallLink({ className = 'btn btn-solid', children = 'Book a call', arrow = true }) {
  return (
    <Link to="/book-a-call" onClick={openCalendly}
      onPointerEnter={warmCalendly} onFocus={warmCalendly} className={className}>
      {children}{arrow && <> <Arrow /></>}
    </Link>
  )
}
