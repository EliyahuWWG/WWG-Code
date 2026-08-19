import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import ParallaxImage from '../components/ParallaxImage'
import CTA from '../components/CTA'
import Arrow from '../components/Arrow'
import MaskLines from '../components/MaskLines'
import Marquee from '../components/Marquee'
import Seo from '../components/Seo'
import { personSchema, breadcrumbSchema } from '../seo/schema'
import { testimonials, orgsFull, RR_SITE } from '../data'

const credentials = [
  'Author, Working With God: The Ten Modes of Elevated Leadership', 'Founder of the organizational consultancy Reframed Reality', 'Ed.D., Executive Leadership, St. John Fisher University', 'MSW, The Hebrew University of Jerusalem', 'Adizes and Everything DiSC® certified', 'Marquis Who’s Who honoree (2024)',
]

export default function About() {
  const says = testimonials.filter(t => !t.feature).slice(0, 3)
  return (
    <>
      <Seo
        title="About Dr. Eliyahu Lotzar, A Teacher of the Word in Business"
        description="Dr. Eliyahu Lotzar is an executive coach, group facilitator, and author who helps Christian leaders work with God, not just for Him, as the CHIEF’S Executive Officer. Ed.D., MSW, Adizes & DiSC certified."
        path="/about"
        type="profile"
        schema={[personSchema(), breadcrumbSchema([{ name: 'About', path: '/about' }])]}
      />

      <section className="phero">
        <div className="container">
          <div className="eyebrow">About</div>
          <h1 className="h1 mt-3 balance"><MaskLines>Dr. Eliyahu Lotzar: A Teacher of the Word in Business</MaskLines></h1>
          <p className="lead">I am an executive coach, group facilitator, and leadership consultant. I help leaders step into their calling as the CHIEF’S Executive Officer, working with God, not just for Him.</p>
        </div>
      </section>

      {/* STORY */}
      <section className="section">
        <div className="container">
          <div className="person-grid">
            <Reveal><ParallaxImage className="portrait">
              <picture>
                <source srcSet="/eliyahu.webp" type="image/webp" />
                <img src="/eliyahu.jpg" alt="Dr. Eliyahu Lotzar" width="920" height="1227" loading="lazy" decoding="async" />
              </picture>
              <div className="cap"><b>Dr. Eliyahu Lotzar, Ed.D., MSW</b><span>Executive coach · facilitator · author</span></div>
            </ParallaxImage></Reveal>
            <Reveal delay={0.05}>
              <h2 className="h2 mt-2 maxw-60">It started when I was eight years old.</h2>
              <p className="mt-2 lead">When I was eight years old I had a moment of revelation, and I am happy to tell you about it if we ever sit down together. The Ancient of Days gave me an out-of-the-box knack for noticing the deep details of how people relate to themselves, to each other, and to Him. That encounter set me on a lifelong quest to help us live and lead from a bigger perspective.</p>
              <p className="mt-2 muted maxw-60">That quest took me through clinical social work, corporate life, small-business ownership, and years of academic research. Each chapter added a lens. I am the therapist who reads the room, the owner who has signed the front of a paycheck, and the scholar who studies what actually makes an organization healthy.</p>
              <p className="mt-2 muted maxw-60">Today those lenses come together in one practical way of leading, with God, not just for Him. I coach CEOs and owners, I facilitate leadership groups, and I teach the Ten Modes of Elevated Leadership so that faith and the daily work of running something finally speak the same language.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CREDENTIALS */}
      <section className="section on-bone">
        <div className="container">
          <div className="sec-head">
            <Reveal><h2 className="h2 maxw-60">A therapist, a business owner, and an academic, in one practice.</h2>
              <p className="mt-2 muted maxw-60">His doctoral research on organizational culture has been sought after in many countries. Years as a clinical therapist and small-business owner keep the coaching grounded in the real world, not the seminar room.</p></Reveal>
          </div>
          <Reveal className="stack-tight mt-4">
            {credentials.map(c => (
              <div key={c} style={{ borderBottom: '1px solid var(--line)', padding: '16px 0', display: 'flex', gap: 16 }}>
                <span style={{ color: 'var(--gold-600)' }} aria-hidden="true">·</span>
                <span>{c}</span>
              </div>
            ))}
          </Reveal>
          <p className="mt-3 muted maxw-60">
            Before Working With God, I built <a className="tlink" style={{ display: 'inline' }} href={RR_SITE} target="_blank" rel="noopener">Reframed Reality</a>, an organizational-development and executive-coaching practice serving commercial ventures, national associations, and government. That work is the engine room behind the method: the same tools that turn around a stuck team now help leaders bring God into the decision itself.
          </p>
        </div>
      </section>

      {/* WHAT PEOPLE SAY */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <Reveal><h2 className="h2 maxw-60">Leaders I have worked with as a coach, trainer, or high-level consultant.</h2></Reveal>
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
            <Reveal><h2 className="h2 maxw-60">Trusted across business, government, and the nonprofit world.</h2></Reveal>
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
