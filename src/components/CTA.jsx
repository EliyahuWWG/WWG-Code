import { CALENDLY } from '../data'
import { openCalendly, warmCalendly } from './useCalendly'
import Arrow from './Arrow'
import Reveal from './Reveal'

export default function CTA({
  label = '(→) Start the conversation', title = 'God is ready to work with you.', text = 'Bring the real decision in front of you, strategy, a hire, a budget, the timing of a risk. A focused call to see how the Working With God method applies to it.',
}) {
  return (
    <section className="cta">
      <div className="container">
        <Reveal className="inner">
          <div className="label"><span className="idx">{label}</span></div>
          <h2 className="h2 cta-title">{title}</h2>
          <div className="cta-body">
            <p>{text}</p>
            <div className="mt-2">
              <a href={CALENDLY} target="_blank" rel="noopener" onClick={openCalendly}
                onPointerEnter={warmCalendly} onFocus={warmCalendly} className="btn btn-onink btn-lg">
                Book a call <Arrow />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
