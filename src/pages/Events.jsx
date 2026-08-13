import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import CTA from '../components/CTA'
import Arrow from '../components/Arrow'
import MaskLines from '../components/MaskLines'
import Seo from '../components/Seo'
import { breadcrumbSchema, roundtableEventSchema } from '../seo/schema'
import { roundtableTopics, pastEvents, MEETUP, ROUNDTABLE_ADDRESS, ROUNDTABLE_TIME, NEXT_ROUNDTABLE } from '../data'

export default function Events() {
  return (
    <>
      <Seo
        title="Events, The Roundtable & Monthly Webinar | Working With God"
        description="Free community events for Christian business leaders: the in-person Working With God Roundtable on the 3rd Wednesday each month near Chantilly, VA, and a monthly online webinar introducing the method."
        path="/events"
        schema={[breadcrumbSchema([{ name: 'Events', path: '/events' }]), roundtableEventSchema()]}
      />

      <section className="phero">
        <div className="container">
          <div className="eyebrow">Events</div>
          <h1 className="h1 mt-3 balance"><MaskLines>Free ways to practice, in person and online.</MaskLines></h1>
          <p className="lead">Two standing invitations: a monthly in-person Roundtable in Northern Virginia, and an online webinar that introduces the Working With God method.</p>
        </div>
      </section>

      {/* ROUNDTABLE */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <div className="label"><span className="sec-num">01</span><br />In person · free</div>
            <Reveal>
              <h2 className="h2 maxw-60">The Working With God Roundtable</h2>
              <p className="mt-2 muted maxw-60">Two hours that combine leadership practice, scripture, and prayer. Facilitated by Dr. Eliyahu Lotzar. Refreshments provided.</p>
            </Reveal>
          </div>

          <div className="grid two mt-4" style={{ alignItems: 'start' }}>
            <Reveal className="stack-tight">
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}><b>When</b><br /><span className="muted">{ROUNDTABLE_TIME}</span></div>
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}><b>Where</b><br /><span className="muted">Private room at Starbucks · {ROUNDTABLE_ADDRESS}</span></div>
              {/* TODO(client): update monthly, the specific next date */}
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}><b>Next meeting</b><br /><span className="muted">3rd Wednesday, monthly{NEXT_ROUNDTABLE !== 'TBD' ? ` · ${NEXT_ROUNDTABLE}` : ''}</span></div>
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}><b>Sponsor</b><br /><span className="muted">MBH Settlement Group (Rich Nguyen, Esq.)</span></div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="label">Topics have included</div>
              <div className="tags mt-2">
                {roundtableTopics.map(t => <span className="tag" key={t}>{t}</span>)}
              </div>
              <div className="mt-3"><Link to="/roundtable" className="btn btn-solid">Register for the next Roundtable <Arrow /></Link></div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* WEBINAR */}
      <section className="section on-bone">
        <div className="container">
          <div className="grid two" style={{ alignItems: 'start' }}>
            <Reveal>
              <div className="label"><span className="sec-num">02</span><br />Online · free</div>
              <h2 className="h2 mt-2 maxw-60">Monthly Webinar</h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="lead">A 60-minute interactive introduction to the Working With God method, see how the Ten Modes of Elevated Leadership apply to the business challenges you’re facing today.</p>
              <div className="mt-3"><a href={MEETUP} target="_blank" rel="noopener" className="btn btn-line">Register on Meetup <Arrow /></a></div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PAST EVENTS */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <div className="label"><span className="sec-num">03</span><br />Recently</div>
            <Reveal><h2 className="h2 maxw-60">Where Eliyahu has been.</h2></Reveal>
          </div>
          <Reveal className="ilist mt-4 draw" stagger={0.08}>
            {pastEvents.map(e => (
              <div className="irow" key={e.what} style={{ gridTemplateColumns: '160px 1fr' }}>
                <div className="n" style={{ fontSize: '1rem', fontFamily: 'var(--f-mono)', letterSpacing: '.04em' }}>{e.when}</div>
                <p style={{ color: 'var(--ink)' }}>{e.what}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="section on-bone">
        <div className="container">
          <Reveal className="pullquote">
            <blockquote>“I found the Working With God roundtable event so valuable, truly enlightening; it was a foundational conversation.”</blockquote>
            <div className="attr"><b>Sylvia Palmer</b>, Chief Impact Officer, Amplify</div>
          </Reveal>
        </div>
      </section>

      <CTA label="(→) Come to the next one" title="There’s a seat for you at the Roundtable." text="It’s free, it’s in person, and it’s two hours well spent with other leaders inviting God into their daily work." />
    </>
  )
}

// react-router lazy() route entry
export const Component = Events
