import Reveal from '../components/Reveal'
import MaskLines from '../components/MaskLines'
import Arrow from '../components/Arrow'
import Seo from '../components/Seo'
import RoundtableForm from '../components/forms/RoundtableForm'
import { breadcrumbSchema, roundtableEventSchema } from '../seo/schema'
import { roundtableTopics, ROUNDTABLE_ADDRESS, ROUNDTABLE_TIME } from '../data'

const flow = [
  { t: 'Gather', d: 'Coffee and introductions. A room of leaders who actually run things: owners, CEOs, senior managers.' },
  { t: 'A topic worth the hour', d: 'One leadership challenge each month, whether that is agility, hiring, kingdom economics, or sales, opened up honestly around the table.' },
  { t: 'Scripture & prayer, applied', d: 'Not a devotional. We bring God into the real decision in front of you and ask what He wants to do through it.' },
  { t: 'Leave with a next step', d: 'You walk out with a clearer head on something specific, plus a few leaders who’ll check in on how it went.' },
]

export default function Roundtable() {
  return (
    <>
      <Seo
        title="Register for the WWG Roundtable | Working With God"
        description="Register for the Working With God Roundtable, a free, in-person monthly meetup for Christian business leaders near Chantilly, VA. 3rd Wednesdays, 8:00–9:55 a.m. Refreshments provided."
        path="/roundtable"
        schema={[breadcrumbSchema([{ name: 'Events', path: '/events' }, { name: 'Roundtable', path: '/roundtable' }]), roundtableEventSchema()]}
      />

      <section className="phero">
        <div className="container">
          <div className="eyebrow">Roundtable · free</div>
          <h1 className="h1 mt-3 balance"><MaskLines>A monthly table for leaders who want God in the room.</MaskLines></h1>
          <p className="lead">We meet for two hours near Chantilly, Virginia, and we spend them together: talking honestly about the work, opening scripture, and praying over what is actually on our desks. There is no charge, and there is always coffee waiting.</p>
          <div className="row mt-3">
            <a href="#register" className="btn btn-onink btn-lg">Save your seat <Arrow /></a>
            <span className="phero-note">{ROUNDTABLE_TIME}</span>
          </div>
        </div>
      </section>

      {/* WHAT IT IS */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <Reveal>
              <h2 className="h2 maxw-60">A real table, not a webinar and not a sermon.</h2>
              <p className="mt-2 muted maxw-60">Most faith-and-work events are a talk you watch. This is a conversation you are in. A small circle of leaders working through the real decisions in front of them, with God invited into every one of them.</p>
            </Reveal>
          </div>
          <Reveal className="mt-4">
            <ul className="ticks ticks-2">
              <li>For owners, CEOs, and senior leaders of faith in Northern Virginia</li>
              <li>Confidential. What is said at the table stays at the table</li>
              <li>Practical. We talk about strategy, people, money, and timing</li>
              <li>Free, with refreshments, on the 3rd Wednesday each month</li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* A TYPICAL MORNING */}
      <section className="section on-bone">
        <div className="container">
          <div className="sec-head">
            <Reveal><h2 className="h2 maxw-60">How the two hours actually go.</h2></Reveal>
          </div>
          <Reveal className="ilist mt-4 draw" stagger={0.08}>
            {flow.map((s, i) => (
              <div className="irow" key={s.t}>
                <div className="n">{String(i + 1).padStart(2, '0')}</div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </Reveal>
          <div className="mt-4">
            <div className="label">Topics have included</div>
            <div className="tags mt-2">
              {roundtableTopics.map(t => <span className="tag" key={t}>{t}</span>)}
            </div>
          </div>
        </div>
      </section>

      {/* REGISTER */}
      <section className="section" id="register" style={{ scrollMarginTop: 96 }}>
        <div className="container">
          <div className="sec-head">
            <Reveal><h2 className="h2 maxw-60">Save your seat at the next Roundtable.</h2></Reveal>
          </div>
          {/* The tall When / Where / Cost / Next meeting / Sponsor list that used
              to sit beside this form is gone. It made the form share a narrow
              half-column for information nobody re-reads at the moment they are
              typing their name in. The venue and time stay, as one line, because
              the full address appears nowhere else on this page and someone
              signing up does need to know where they are going. */}
          <Reveal className="register-single mt-4">
            <p className="reg-facts">
              <span>{ROUNDTABLE_TIME}</span>
              <span>Private room at Starbucks · {ROUNDTABLE_ADDRESS}</span>
              <span>No fee. Refreshments provided.</span>
            </p>
            <RoundtableForm />
            <p className="mt-3 muted">You’ll get an email confirmation with meeting details and a calendar invite, usually within 24 hours.</p>
          </Reveal>
        </div>
      </section>
    </>
  )
}

// react-router lazy() route entry
export const Component = Roundtable
