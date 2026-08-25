import { Link } from 'react-router-dom'
import { CALENDLY } from '../data'
import { openCalendly, warmCalendly } from './useCalendly'
import Arrow from './Arrow'
import Reveal from './Reveal'

export default function CTA({
  label = '(→) Start the conversation', title = 'Start the journey.', text = 'Bring the real decision in front of you, strategy, a hire, a budget, the timing of a risk. A focused call to see how the Working With God method applies to it.',
  showRoundtable = true,
}) {
  return (
    <section className="cta">
      <div className="container">
        <Reveal className="inner">
          <div className="label"><span className="idx">{label}</span></div>
          <h2 className="h2 cta-title">{title}</h2>
          <div className="cta-body">
            <p>{text}</p>
            <div className="mt-2 row">
              <a href={CALENDLY} target="_blank" rel="noopener" onClick={openCalendly}
                onPointerEnter={warmCalendly} onFocus={warmCalendly} className="btn btn-onink btn-lg">
                Book a call to discuss coaching. <Arrow />
              </a>
              {showRoundtable && (
                <Link to="/roundtable" className="btn btn-onink btn-lg">
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
