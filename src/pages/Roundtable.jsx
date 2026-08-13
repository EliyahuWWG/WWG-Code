import Reveal from '../components/Reveal'
import MaskLines from '../components/MaskLines'
import Seo from '../components/Seo'
import RoundtableForm from '../components/forms/RoundtableForm'
import { breadcrumbSchema, roundtableEventSchema } from '../seo/schema'
import { ROUNDTABLE_ADDRESS, ROUNDTABLE_TIME, NEXT_ROUNDTABLE } from '../data'

export default function Roundtable() {
  return (
    <>
      <Seo
        title="Register for the WWG Roundtable | Working With God"
        description="Register for the Working With God Roundtable, a free, in-person monthly meetup for Christian business leaders near Chantilly, VA. 3rd Wednesdays, 8:00–9:55 a.m. Refreshments provided."
        path="/roundtable"
        schema={[breadcrumbSchema([{ name: 'Events', path: '/events' }, { name: 'Roundtable', path: '/roundtable' }]), roundtableEventSchema()]}
      />

      <section className="phero" style={{ paddingBottom: 'clamp(40px,5vw,64px)' }}>
        <div className="container">
          <div className="eyebrow">Roundtable · free</div>
          <h1 className="h1 mt-3 balance"><MaskLines>Register for the WWG Roundtable’s next meeting</MaskLines></h1>
          <p className="lead">Two hours of in-person community, leadership practice, scripture, and prayer, no fee, refreshments provided.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 'clamp(40px,5vw,64px)' }}>
        <div className="container">
          <div className="grid two" style={{ alignItems: 'start' }}>
            <Reveal>
              <div className="label">The details</div>
              <div className="stack-tight mt-3">
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}><b>When</b><br /><span className="muted">{ROUNDTABLE_TIME}</span></div>
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}><b>Where</b><br /><span className="muted">Private room at Starbucks · {ROUNDTABLE_ADDRESS}</span></div>
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}><b>Cost</b><br /><span className="muted">No fee. Refreshments provided.</span></div>
                {/* TODO(client): update monthly, the specific next date */}
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}><b>Next meeting</b><br /><span className="muted">3rd Wednesday, monthly{NEXT_ROUNDTABLE !== 'TBD' ? ` · ${NEXT_ROUNDTABLE}` : ''}</span></div>
              </div>
              <p className="mt-3 muted maxw-46">You’ll get an email confirmation with meeting details and a calendar invite, usually within 24 hours.</p>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="label">Register</div>
              <h2 className="h2 mt-2" style={{ marginBottom: 24 }}>Save your seat.</h2>
              <RoundtableForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}

// react-router lazy() route entry
export const Component = Roundtable
