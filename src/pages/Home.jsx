import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import CTA from '../components/CTA'
import Arrow from '../components/Arrow'
import MaskLines from '../components/MaskLines'
import Marquee from '../components/Marquee'
import { openCalendly } from '../components/useCalendly'
import { orgs, testimonials } from '../data'

export default function Home() {
  const feature = testimonials.find(t => t.feature)
  const twoQuotes = testimonials.filter(t => !t.feature).slice(0, 2)

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="label"><span className="idx">(01)</span> &nbsp;Organizational development &amp; executive coaching — Washington, DC</div>
          <div className="hero-top mt-3">
            <h1 className="display balance"><MaskLines>Your leaders don’t plateau for lack of effort. They plateau for lack of <span className="serif-it">perspective.</span></MaskLines></h1>
            <div className="hero-side">
              <p>I’m Dr. Eliyahu Lotzar — an organizational therapist who helps CEOs, executives, and teams break through the challenges that quietly cap their growth.</p>
              <div className="mt-2">
                <Link to="/book-a-call" onClick={openCalendly} className="btn btn-onink">Book a discovery call <Arrow /></Link>
              </div>
            </div>
          </div>

          <Reveal className="hero-meta" stagger={0.07}>
            <div><div className="k">Doctorate</div><div className="v">Ed.D., Exec. Leadership</div></div>
            <div><div className="k">Clinical</div><div className="v">MSW · Therapist</div></div>
            <div><div className="k">Certified</div><div className="v">Adizes · DiSC · Arbinger</div></div>
            <div><div className="k">Author</div><div className="v">Working With God</div></div>
          </Reveal>

          {/* DUAL DOORS */}
          <Reveal className="doors" stagger={0.12}>
            <Link to="/business" className="door">
              <div className="dnum">Track 01 — For organizations</div>
              <h3>Business &amp; Leadership</h3>
              <p>Organizational health, executive &amp; team coaching, and strategic planning for commercial ventures and national associations ready to grow — and sustain it.</p>
              <div className="dmeta">Org health · Exec coaching · Strategy · Teams &amp; DiSC</div>
              <span className="go">Explore business services <Arrow /></span>
            </Link>
            <Link to="/working-with-god" className="door">
              <div className="dnum">Track 02 — For faith-driven leaders</div>
              <h3>Working With God</h3>
              <p>A book, a method, and a peer group for leaders who want to bring God into the real work of leadership — strategy, people, timing, and the hard decisions.</p>
              <div className="dmeta">Modal Leadership · Coaching · Roundtable · The book</div>
              <span className="go">Discern divine direction <Arrow /></span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* TRUST */}
      <div className="trust">
        <div className="container">
          <div className="lbl">Trusted by leaders at commercial ventures, national associations &amp; government</div>
          <Marquee items={orgs} />
        </div>
      </div>

      {/* THE PRACTITIONER */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <div className="label"><span className="idx">(02)</span><br />The practitioner</div>
            <Reveal><h2 className="h2 maxw-60">Part strategist, part therapist — all in service of your growth.</h2></Reveal>
          </div>

          <div className="grid two mt-4" style={{ alignItems: 'start' }}>
            <Reveal className="portrait">
              {/* REPLACE .ph with <img src="/eliyahu.jpg" alt="Dr. Eliyahu Lotzar" /> */}
              <div className="ph">
                <div><div className="mono">EL</div><small>Add headshot → /public/eliyahu.jpg</small></div>
              </div>
              <div className="cap"><b>Dr. Eliyahu Lotzar, Ed.D., MSW</b><span>Founder &amp; Principal Consultant</span></div>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="lead">Most consultants hand you a report and leave. With a doctorate in executive leadership and years as a clinical therapist, I do something different: I get inside the real dynamics — the competing values, the unspoken conflicts, the people challenges — and stay until change takes root.</p>
              <p className="mt-2 muted">My dissertation on soft skills and organizational culture has been accessed in 130+ countries. But the work that matters is closer to home: helping a CEO make a hard call, aligning a leadership team, turning a high-producer into a real people-leader.</p>
              <div className="tags mt-3">
                <span className="tag">Competing Values Framework</span>
                <span className="tag">Adizes Methodology</span>
                <span className="tag">Everything DiSC®</span>
                <span className="tag">Arbinger</span>
                <span className="tag">5-Factor Org Health</span>
              </div>
              <div className="mt-3"><Link to="/about" className="tlink">More about Eliyahu &amp; the RR approach <Arrow /></Link></div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TWO TRACKS */}
      <section className="section on-bone">
        <div className="container">
          <div className="sec-head">
            <div className="label"><span className="idx">(03)</span><br />Two ways to work</div>
            <Reveal><h2 className="h2 maxw-60">Choose the door that fits where you lead from.</h2></Reveal>
          </div>
          <div className="grid two mt-4">
            <Reveal style={{ borderTop: '1px solid var(--line)', paddingTop: 32 }}>
              <div className="label">Track 01</div>
              <h3 className="h3 mt-1">Business &amp; Leadership</h3>
              <p className="mt-1 muted">For owners, executives, and association leaders — change at three levels:</p>
              <div className="stack-tight mt-2">
                <div><b>Organization</b> — health assessment, growth &amp; change, strategic + action planning</div>
                <div><b>Team</b> — senior-team alignment, new-manager training, high-performing teams, DiSC</div>
                <div><b>Individual</b> — executive &amp; management coaching, a truth-telling sounding board</div>
              </div>
              <div className="mt-3"><Link to="/business" className="btn btn-line">Explore business services <Arrow /></Link></div>
            </Reveal>
            <Reveal delay={0.05} style={{ borderTop: '1px solid var(--clay)', paddingTop: 32 }}>
              <div className="label" style={{ color: 'var(--clay-ink)' }}>Track 02</div>
              <h3 className="h3 mt-1">Working With God</h3>
              <p className="mt-1 muted">For faith-driven leaders who want more than faith-at-work language — a grounded way to bring God into real decisions:</p>
              <div className="stack-tight mt-2">
                <div><b>The book</b> — <span className="serif-it">Working With God: The Ten Modes of Elevated Leadership</span></div>
                <div><b>The method</b> — Modal Leadership, to discern divine direction in real decisions</div>
                <div><b>The community</b> — faith-based coaching, webinars &amp; a monthly roundtable</div>
              </div>
              <div className="mt-3"><Link to="/working-with-god" className="btn btn-line">Discover Working With God <Arrow /></Link></div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <div className="label"><span className="idx">(04)</span><br />The work speaks</div>
            <Reveal className="pullquote" style={{ borderTop: 0, paddingTop: 0 }}>
              <blockquote>“{feature.q}”</blockquote>
              <div className="attr">— <b>{feature.who}</b>, {feature.role}</div>
            </Reveal>
          </div>
          <Reveal className="qgrid c2 mt-4" stagger={0.1}>
            {twoQuotes.map(t => (
              <div className="q" key={t.who}>
                <blockquote>{t.q}</blockquote>
                <div className="attr"><b>{t.who}</b><span>{t.role}</span></div>
              </div>
            ))}
          </Reveal>
          <div className="mt-3"><Link to="/results" className="tlink">Read all client results &amp; recommendations <Arrow /></Link></div>
        </div>
      </section>

      {/* BOOK */}
      <section className="section on-bone">
        <div className="container">
          <div className="grid two" style={{ alignItems: 'center' }}>
            <Reveal>
              <div className="label"><span className="idx">(05)</span> &nbsp;The book</div>
              <h2 className="h2 mt-2 maxw-60">A real-time dialogue with the Creator — about spreadsheets, budgets, teams, and timing.</h2>
              <p className="mt-2 muted maxw-60">Not a book about being “holier” at the office. It introduces <span className="serif-it">Modal Leadership</span>: ten operating modes that help you analyze, pray, discern, decide, and implement — turning complex hurdles into clear paths forward. Available in print, Kindle, and Audible.</p>
              <div className="row mt-3">
                <Link to="/working-with-god" className="btn btn-solid">Learn the method <Arrow /></Link>
                <Link to="/book-a-call" onClick={openCalendly} className="tlink">Talk to Eliyahu</Link>
              </div>
            </Reveal>
            <Reveal delay={0.05} style={{ display: 'flex', justifyContent: 'center' }}>
              {/* REPLACE with <img src="/book-cover.jpg" alt="Working With God" /> */}
              <div className="book">
                <div className="k">Dr. Eliyahu Lotzar</div>
                <div><div className="t">Working<br />With <b>God</b></div><div className="sub">The Ten Modes of Elevated Leadership</div></div>
                <div className="k">Print · Kindle · Audible</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CTA />
    </>
  )
}
