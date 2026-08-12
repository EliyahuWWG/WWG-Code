import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import CTA from '../components/CTA'
import Arrow from '../components/Arrow'
import MaskLines from '../components/MaskLines'
import Marquee from '../components/Marquee'
import Seo from '../components/Seo'
import { personSchema, breadcrumbSchema } from '../seo/schema'
import { testimonials, orgsFull, RR_SITE } from '../data'

const credentials = [
  'Author — Working With God: The Ten Modes of Elevated Leadership',
  'Founder of the organizational consultancy Reframed Reality',
  'Ed.D., Executive Leadership — St. John Fisher University',
  'MSW — The Hebrew University of Jerusalem',
  'Adizes and Everything DiSC® certified',
  'Marquis Who’s Who honoree (2024)',
]

export default function About() {
  const says = testimonials.filter(t => !t.feature).slice(0, 3)
  return (
    <>
      <Seo
        title="About Dr. Eliyahu Lotzar — A Teacher of the Word in Business"
        description="Dr. Eliyahu Lotzar is an executive coach, group facilitator, and author who helps Christian leaders work with God — not just for Him — as the “Chief’s Executive Officer.” Ed.D., MSW, Adizes & DiSC certified."
        path="/about"
        type="profile"
        schema={[personSchema(), breadcrumbSchema([{ name: 'About', path: '/about' }])]}
      />

      <section className="phero">
        <div className="container">
          <div className="eyebrow">About</div>
          <h1 className="h1 mt-3 balance"><MaskLines>Dr. Eliyahu Lotzar: A Teacher of the Word in Business</MaskLines></h1>
          <p className="lead">Executive coach, group facilitator, and leadership consultant — helping leaders step into their calling as the <span className="serif-it">Chief’s Executive Officer</span>, working with God, not just for Him.</p>
        </div>
      </section>

      {/* STORY */}
      <section className="section">
        <div className="container">
          <div className="grid two" style={{ alignItems: 'start' }}>
            <Reveal className="portrait">
              {/* TODO(client): replace .ph with <img src="/eliyahu.jpg" alt="Dr. Eliyahu Lotzar" /> */}
              <div className="ph"><div><div className="mono">EL</div><small>Add headshot → /public/eliyahu.jpg</small></div></div>
              <div className="cap"><b>Dr. Eliyahu Lotzar, Ed.D., MSW</b><span>Executive coach · facilitator · author</span></div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="label"><span className="idx">(01)</span> &nbsp;The story</div>
              <h2 className="h2 mt-2 maxw-60">It started at eight years old.</h2>
              <p className="mt-2 lead">It all started when Eliyahu was eight years old. In a moment of revelation (that he’s happy to share), the Ancient of Days infused him with a unique, out-of-the-box knack for noticing the deep details of how people relate to themselves, each other, and to Him. That encounter set him on a lifelong quest to help us live and lead from the largest perspective.</p>
              <p className="mt-2 muted maxw-60">Today he brings that calling to leaders through the Working With God method — social work, corporate life, small-business ownership, and academia all folded into one practical way of leading with God.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CREDENTIALS */}
      <section className="section on-bone">
        <div className="container">
          <div className="sec-head">
            <div className="label"><span className="idx">(02)</span><br />Background</div>
            <Reveal><h2 className="h2 maxw-60">A therapist, business owner, and academic — in one leadership practice.</h2>
              <p className="mt-2 muted maxw-60">His doctoral research on organizational culture has been sought after in many countries. His work as a former therapist and small-business owner grounds the coaching in the real world.</p></Reveal>
          </div>
          <Reveal className="stack-tight mt-4">
            {credentials.map(c => (
              <div key={c} style={{ borderBottom: '1px solid var(--line)', padding: '16px 0', display: 'flex', gap: 16 }}>
                <span style={{ color: 'var(--gold-600)' }} aria-hidden="true">—</span>
                <span>{c}</span>
              </div>
            ))}
          </Reveal>
          <p className="mt-3 muted" style={{ fontSize: '.92rem' }}>
            Eliyahu is also the founder of the organizational consultancy <a className="tlink" style={{ display: 'inline' }} href={RR_SITE} target="_blank" rel="noopener">Reframed Reality</a>.
          </p>
        </div>
      </section>

      {/* WHAT PEOPLE SAY */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <div className="label"><span className="idx">(03)</span><br />What people say about Eliyahu</div>
            <Reveal><h2 className="h2 maxw-60">Leaders who’ve worked with him.</h2></Reveal>
          </div>
          <Reveal className="qgrid c3 mt-4 draw" stagger={0.08}>
            {says.map(t => (
              <div className="q" key={t.who}>
                <blockquote>{t.q}</blockquote>
                <div className="attr"><b>{t.who}</b><span>{t.role}</span></div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ORGS SERVED */}
      <section className="section on-bone">
        <div className="container">
          <div className="sec-head">
            <div className="label"><span className="idx">(04)</span><br />A sample of organizations served by Dr. Lotzar</div>
            <Reveal><h2 className="h2 maxw-60">Where the work has landed.</h2></Reveal>
          </div>
          <Reveal className="mt-4">
            <Marquee items={orgsFull.slice(0, Math.ceil(orgsFull.length / 2))} speed={6} />
            <Marquee items={orgsFull.slice(Math.ceil(orgsFull.length / 2))} speed={6} reverse className="mt-2" />
          </Reveal>
        </div>
      </section>

      <CTA />
    </>
  )
}

// react-router lazy() route entry
export const Component = About
