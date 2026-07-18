import Reveal from '../components/Reveal'
import CTA from '../components/CTA'
import MaskLines from '../components/MaskLines'
import Marquee from '../components/Marquee'
import { orgsFull } from '../data'

const education = [
  ['Ed.D.', 'Doctorate in Executive Leadership', 'St. John Fisher University'],
  ['MSW', 'Master of Social Work Administration', 'The Hebrew University of Jerusalem'],
  ['BA', 'Political Philosophy', 'James Madison College, Michigan State University'],
]
const certs = [
  'Adizes Institute Associate (2024) & Team Integrator (2019)',
  'Arbinger Institute Certified Facilitator',
  'Everything DiSC® Authorized Partner & Certified Trainer',
  'Competing Values Framework & OCAI practitioner',
  'Certified Group Facilitator — Israel Ministry of Education (1994) & Labor & Welfare (2000)',
  'Marquis Who’s Who Honoree (2024)',
]
const pubs = [
  ['Working With God: The Ten Modes of Elevated Leadership', 'Book — print, Kindle, Audible'],
  ['Employee Soft Skills and Organizational Culture', 'Doctoral dissertation — accessed in 130+ countries'],
  ['NPR Marketplace Morning Report', 'Interview on “human skills” in the workplace'],
  ['U.S. House of Representatives', 'Testimony on workforce development'],
]

export default function About() {
  return (
    <>
      <section className="phero">
        <div className="container">
          <div className="label"><span className="idx">(→)</span> &nbsp;About</div>
          <h1 className="h1 mt-3"><MaskLines>Dr. Eliyahu Lotzar, <span className="serif-it">Ed.D., MSW</span></MaskLines></h1>
          <p className="lead">Founder &amp; Principal Consultant of Reframed Reality — an organizational-development consultancy based in the Washington, DC area, with international reach. Business owner, clinical therapist, and academic.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid two" style={{ alignItems: 'start' }}>
            <Reveal className="portrait">
              {/* REPLACE .ph with <img src="/eliyahu.jpg" alt="Dr. Eliyahu Lotzar" /> */}
              <div className="ph"><div><div className="mono">EL</div><small>Add headshot → /public/eliyahu.jpg</small></div></div>
              <div className="cap"><b>“A true organizational therapist.”</b><span>— Michael Barry, CAE · Public Health Foundation</span></div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="label"><span className="idx">(01)</span> &nbsp;The approach</div>
              <h2 className="h2 mt-2">Growth-oriented. Ethical. Relentlessly practical.</h2>
              <p className="mt-2 muted">Eliyahu helps leaders and organizations solve core, system, process, and people challenges. His orientation is growth: strategic and innovative thinking, tough love, values-based agile leadership, and practical, outcome-focused methodologies. He is also God-oriented, expressing that as appropriate — his goal is to build your internal capability, never dependency.</p>
              <p className="mt-2 muted">His direction-setting doctoral research — on the connection between employee soft skills and organizational culture — has been sought after in 130+ countries by commercial ventures, higher education, governments, and military agencies.</p>
              <div className="tags mt-3">
                <span className="tag">Growth &amp; strategy</span><span className="tag">Tough love, values-based</span>
                <span className="tag">Outcome-focused</span><span className="tag">Builds capability</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section on-bone">
        <div className="container">
          <div className="grid two">
            <Reveal>
              <div className="label"><span className="idx">(02)</span> &nbsp;Education</div>
              <div className="ilist mt-3">
                {education.map(([k, t, s]) => (
                  <div className="irow" key={k} style={{ gridTemplateColumns: '72px 1fr', padding: '22px 0' }}>
                    <div className="n" style={{ fontFamily: 'var(--f-disp)', fontSize: '1.1rem', color: 'var(--clay)' }}>{k}</div>
                    <div><h3 style={{ fontSize: '1.2rem' }}>{t}</h3><p className="muted mt-1">{s}</p></div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="label"><span className="idx">(03)</span> &nbsp;Certifications &amp; honors</div>
              <div className="stack-tight mt-3">
                {certs.map(c => (
                  <div key={c} style={{ borderBottom: '1px solid var(--line)', padding: '14px 0', display: 'flex', gap: 14 }}>
                    <span style={{ color: 'var(--clay)' }}>—</span><span>{c}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sec-head">
            <div className="label"><span className="idx">(04)</span><br />Selected work</div>
            <Reveal>
              <div className="ilist">
                {pubs.map(([t, s]) => (
                  <div className="irow" key={t} style={{ gridTemplateColumns: '1fr', gap: 6, padding: '22px 0' }}>
                    <h3 style={{ fontSize: '1.25rem' }} className="serif-it">{t}</h3><p className="muted">{s}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 muted maxw-60">Beyond the practice, Eliyahu serves as an Emeritus Member of the Board of the Chesapeake Bay Organizational Development Network (CBODN) and formerly advised the Airport Cooperative Research Program as its organizational-development expert. Fluent in English and Hebrew.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section on-bone">
        <div className="container">
          <div className="sec-head">
            <div className="label"><span className="idx">(05)</span><br />Organizations served</div>
            <Reveal><h2 className="h2 maxw-60">45+ commercial, association &amp; government clients.</h2></Reveal>
          </div>
          <Reveal className="mt-4">
            <Marquee items={orgsFull.slice(0, Math.ceil(orgsFull.length / 2))} speed={6} />
            <Marquee items={orgsFull.slice(Math.ceil(orgsFull.length / 2))} speed={6} reverse className="mt-2" />
          </Reveal>
        </div>
      </section>

      <CTA label="(→) Work with Eliyahu" title="Let’s talk about where you’re headed." text="A focused, no-pressure conversation about the challenge in front of you." />
    </>
  )
}
