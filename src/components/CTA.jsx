import { Link } from 'react-router-dom'
import { CALENDLY } from '../data'
import { openCalendly, warmCalendly } from './useCalendly'
import Arrow from './Arrow'
import Reveal from './Reveal'

export default function CTA({
  label = 'Start the conversation', title = 'Start the journey.', text = 'Bring the real decision in front of you, strategy, a hire, a budget, the timing of a risk. A focused call to see how the Working With God method applies to it.',
  // Both buttons are on by default. Pages that already sell one of the two
  // switch that one off rather than repeating themselves: Speaking drops the
  // Roundtable, Events drops the coaching call.
  showRoundtable = true,
  showCoaching = true,
}) {
  return (
    <section className="cta">
      <div className="container">
        <Reveal className="inner">
          <div className="label"><span className="idx">{label}</span></div>
          <h2 className="h2 cta-title">{title}</h2>
          <div className="cta-body">
            <p>{text}</p>
            <div className="mt-3 cta-actions">
              {showCoaching && (
                <a href={CALENDLY} target="_blank" rel="noopener" onClick={openCalendly}
                  onPointerEnter={warmCalendly} onFocus={warmCalendly} className="btn btn-onink">
                  Book a call to discuss coaching. <Arrow />
                </a>
              )}
              {showRoundtable && (
                <Link to="/roundtable" className="btn btn-onink">
                  Register for the Roundtable. <Arrow />
                </Link>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
