import { Link } from 'react-router-dom'
import { openCalendly, warmCalendly } from './useCalendly'
import Arrow from './Arrow'
import Reveal from './Reveal'

export default function CTA({
  label = '(→) Let’s talk',
  title = 'One honest conversation can reframe the whole picture.',
  text = 'No pitch, no pressure — a focused conversation about the challenge in front of you and whether Reframed Reality is the right partner to help.',
}) {
  return (
    <section className="cta">
      <div className="container">
        <Reveal className="inner">
          <div>
            <div className="label"><span className="idx">{label}</span></div>
            <h2 className="h2 mt-2">{title}</h2>
          </div>
          <div>
            <p>{text}</p>
            <div className="mt-2">
              <Link to="/book-a-call" onClick={openCalendly} onPointerEnter={warmCalendly} onFocus={warmCalendly} className="btn btn-onink btn-lg">
                Book a discovery call <Arrow />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
