import { useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import Modal from '../components/Modal'
import RoundtableForm from '../components/forms/RoundtableForm'
import CTA from '../components/CTA'
import Arrow from '../components/Arrow'
import MaskLines from '../components/MaskLines'
import Seo from '../components/Seo'
import { breadcrumbSchema, roundtableEventSchema } from '../seo/schema'
import { roundtableWhatHappens, roundtableWhoShouldAttend, roundtableSponsorLabel,
  MEETUP, ROUNDTABLE_ADDRESS, ROUNDTABLE_TIME, NEXT_ROUNDTABLE, SPONSOR } from '../data'

export default function Events() {
  // Registering used to mean leaving the page for /roundtable, which asked
  // someone who had just decided to come to read a second page first. The form
  // opens here instead. /roundtable still exists and still works, for anyone
  // arriving from a link or with JavaScript off.
  const [registerOpen, setRegisterOpen] = useState(false)
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
            <Reveal>
              <h2 className="h2 maxw-60">The Working With God Roundtable</h2>
              <p className="mt-2 muted maxw-60">Two hours that combine leadership practice, scripture, and prayer. Facilitated by Dr. Eliyahu Lotzar. Refreshments provided.</p>
            </Reveal>
          </div>

          <div className="grid two mt-4" style={{ alignItems: 'start' }}>
            <Reveal>
              <div className="label">What happens in the room</div>
              <ul className="ticks mt-2">
                {roundtableWhatHappens.map(t => <li key={t}>{t}</li>)}
              </ul>
              {/* Was a row of topic tags. He replaced it with who the room is
                  for, which is sentences, not labels, so it is a list now. */}
              <div className="label mt-3">Who should attend</div>
              <ul className="ticks mt-2">
                {roundtableWhoShouldAttend.map(t => <li key={t}>{t}</li>)}
              </ul>
              <div className="mt-3">
                <button type="button" className="btn btn-solid" onClick={() => setRegisterOpen(true)}>
                  Register for the next Roundtable <Arrow />
                </button>
              </div>
              <p className="mt-2 muted" style={{ fontSize: '.9rem' }}>
                Or <Link className="tlink" style={{ display: 'inline' }} to="/roundtable">read more about the Roundtable</Link> first.
              </p>
            </Reveal>
            <Reveal className="stack-tight" delay={0.05}>
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}><b>When</b><br /><span className="muted">{ROUNDTABLE_TIME}</span></div>
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}><b>Where</b><br /><span className="muted">Private room at Starbucks · {ROUNDTABLE_ADDRESS}</span></div>
              {/* Both of these come from the monthly block at the top of
                  src/data.js. The sponsor label follows the date's month. */}
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}><b>Next meeting</b><br /><span className="muted">{NEXT_ROUNDTABLE}</span></div>
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}><b>{roundtableSponsorLabel()}</b><br /><span className="muted">{SPONSOR}</span></div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* WEBINAR */}
      <section className="section on-bone">
        <div className="container">
          <div className="sec-head">
            <Reveal>
              <h2 className="h2 maxw-60">The Monthly Webinar</h2>
              <p className="mt-2 muted maxw-60">A 60-minute interactive introduction to the Working With God method, for leaders anywhere, no travel required.</p>
            </Reveal>
          </div>
          <Reveal className="mt-4">
            <ul className="ticks ticks-2">
              <li>What the “Ten Modes of Elevated Leadership” are, in plain terms</li>
              <li>How to tell which mode the decision in front of you actually needs</li>
              <li>A worked example on a real business challenge: cash flow, succession planning, a new hire</li>
              <li>Live Q&amp;A with Eliyahu</li>
            </ul>
            <div className="mt-4"><a href={MEETUP} target="_blank" rel="noopener" className="btn btn-line">Register on Meetup <Arrow /></a></div>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="section on-bone">
        <div className="container">
          <Reveal className="pullquote">
            <blockquote>“I found the Working With God roundtable event so valuable. The recent session on clarifying my Godly identity was truly enlightening; it was a foundational conversation for being fully the leader God made me to be. It was real, relevant and relatable (authentic). I enjoyed meeting folks and look forward to further interactions.”</blockquote>
            <div className="attr"><b>Sylvia Palmer</b>, Chief Impact Officer, Amplify</div>
          </Reveal>
        </div>
      </section>

      <Modal open={registerOpen} onClose={() => setRegisterOpen(false)} title="Save your seat at the next Roundtable">
        <p className="muted" style={{ marginBottom: 18 }}>{ROUNDTABLE_TIME} · {ROUNDTABLE_ADDRESS}</p>
        <RoundtableForm />
      </Modal>

      <CTA label="(→) Come to the next one" title="There’s a seat for you at the Roundtable." text="It’s free, it’s in person, and it’s two hours well spent with other leaders inviting God into their daily work." showCoaching={false} />
    </>
  )
}

// react-router lazy() route entry
export const Component = Events
