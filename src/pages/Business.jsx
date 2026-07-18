import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import CTA from '../components/CTA'
import Arrow from '../components/Arrow'
import MaskLines from '../components/MaskLines'
import Seo from '../components/Seo'
import { openCalendly, warmCalendly } from '../components/useCalendly'
import { breadcrumbSchema } from '../seo/schema'
import { businessServices, challenges } from '../data'

export default function Business() {
  return (
    <>
      <Seo
        title="Organizational Health, Team Alignment & Executive Coaching | Reframed Reality"
        description="Organizational development consulting for commercial ventures and national associations: organizational health assessment, growth & change management, strategic planning, senior leadership team alignment, DiSC training, and executive coaching."
        path="/business"
        schema={[breadcrumbSchema([{ name: 'Business & Leadership', path: '/business' }])]}
      />
      <section className="phero">
        <div className="container">
          <div className="label"><span className="idx">Track 01</span> &nbsp;For organizations</div>
          <h1 className="h1 mt-3 balance"><MaskLines>Entropy happens on its own. Sustained success takes courage, wisdom, and focus.</MaskLines></h1>
          <p className="lead">For owners, executives, and national associations. Whether you’re guarding against the risks of sudden growth or breaking through a stubborn plateau, we work at three levels — organization, team, and individual — to make success a little easier and a lot more durable.</p>
          <div className="row mt-3">
            <Link to="/book-a-call" onClick={openCalendly} onPointerEnter={warmCalendly} onFocus={warmCalendly} className="btn btn-onink">Book a discovery call <Arrow /></Link>
            <Link to="/results" className="tlink lt">See the results</Link>
          </div>
        </div>
      </section>

      {/* THREE LEVELS */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <div className="label"><span className="idx">(01)</span><br />Three levels of change</div>
            <Reveal><h2 className="h2 maxw-60">People are the biggest — and most manageable — lever for growth.</h2></Reveal>
          </div>
          <div className="grid mt-4" style={{ gridTemplateColumns: '1fr' }}>
            <div className="grid two" style={{ gap: 0 }}>
              {[
                ['Organization', 'Map and improve the health of the whole system — vision, structure, people, information flow, finance — then plan and execute strategic growth.'],
                ['Team', 'Align senior teams, forge high-performing groups, and turn newly-promoted high-producers into confident, effective people-leaders.'],
              ].map(([t, d], i) => (
                <Reveal key={t} style={{ borderTop: '1px solid var(--line)', padding: '28px 0', paddingRight: i === 0 ? 40 : 0 }}>
                  <div className="label">0{i + 1}</div><h3 className="h3 mt-1">{t}</h3><p className="mt-1 muted">{d}</p>
                </Reveal>
              ))}
            </div>
            <Reveal style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', padding: '28px 0' }}>
              <div className="label">03</div><h3 className="h3 mt-1">Individual</h3>
              <p className="mt-1 muted maxw-60">One-to-one executive &amp; management coaching — a truth-telling sounding board that turns weaknesses into strengths and strengths into genius.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FULL SERVICE INDEX */}
      <section className="section on-bone">
        <div className="container">
          <div className="sec-head">
            <div className="label"><span className="idx">(02)</span><br />What we actually do</div>
            <Reveal><h2 className="h2 maxw-46">The full toolkit</h2></Reveal>
          </div>
          <Reveal className="ilist mt-4" stagger={0.07}>
            {businessServices.map(s => (
              <div className="irow" key={s.n}>
                <div className="n">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* CHALLENGES */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <div className="label"><span className="idx">(03)</span><br />Sound familiar?</div>
            <Reveal><h2 className="h2 maxw-60">The challenges we guide you through.</h2>
              <p className="mt-2 muted maxw-60">Every engagement begins with careful situational assessment — the aim isn’t only to fix today’s problem but to prevent tomorrow’s and position you to seize opportunity.</p>
            </Reveal>
          </div>
          <Reveal className="ilist mt-4" stagger={0.07}>
            {challenges.map(c => (
              <div className="irow" key={c.n} style={{ gridTemplateColumns: '64px 1fr' }}>
                <div className="n">{c.n}</div>
                <div><h3 style={{ fontSize: '1.4rem' }}>{c.t}</h3><p className="mt-1">{c.d}</p></div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <CTA title="Let’s find the right next step for your organization." text="Bring the challenge in front of you — we’ll talk it through and figure out whether Reframed Reality is the right partner to help." />
    </>
  )
}

// react-router lazy() route entry
export const Component = Business
