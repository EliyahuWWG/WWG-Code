import Reveal from '../components/Reveal'
import MaskLines from '../components/MaskLines'
import Seo from '../components/Seo'
import BookCallLink from '../components/BookCallLink'
import ContactForm from '../components/forms/ContactForm'
import { breadcrumbSchema } from '../seo/schema'
import { EMAIL, LINKEDIN, SERVICE_AREA } from '../data'

export default function Contact() {
  return (
    <>
      <Seo
        title="Contact | Working With God"
        description="Get in touch with Dr. Eliyahu Lotzar about coaching, the Master’s Class, speaking, or the Roundtable, or book a call directly. In-person in NOVA / Metro DC, and online worldwide."
        path="/contact"
        schema={[breadcrumbSchema([{ name: 'Contact', path: '/contact' }])]}
      />

      <section className="phero" style={{ paddingBottom: 'clamp(40px,5vw,64px)' }}>
        <div className="container">
          <div className="eyebrow">Contact</div>
          <h1 className="h1 mt-3 balance"><MaskLines>Eliyahu looks forward to connecting with you.</MaskLines></h1>
          <p className="lead">Tell him what’s in front of you. He reads every message personally.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 'clamp(40px,5vw,64px)' }}>
        <div className="container">
          <div className="grid two" style={{ alignItems: 'start' }}>
            <Reveal>
              <div className="label">Send a message</div>
              <div className="mt-3"><ContactForm /></div>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="label">Other ways to reach him</div>
              <div className="stack-tight mt-3">
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}>
                  <b>Email</b><br />
                  <a className="tlink" style={{ display: 'inline' }} href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </div>
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}>
                  <b>LinkedIn</b><br />
                  <a className="tlink" style={{ display: 'inline' }} href={LINKEDIN} target="_blank" rel="noopener">Connect with Eliyahu</a>
                </div>
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}>
                  <b>Where</b><br /><span className="muted">{SERVICE_AREA}.</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="label">Prefer to just book a time?</div>
                <div className="mt-2"><BookCallLink className="btn btn-solid">Book a call</BookCallLink></div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}

// react-router lazy() route entry
export const Component = Contact
