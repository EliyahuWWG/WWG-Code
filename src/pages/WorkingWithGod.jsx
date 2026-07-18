import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import CTA from '../components/CTA'
import Arrow from '../components/Arrow'
import { openCalendly } from '../components/useCalendly'
import { WWG } from '../data'

const offerings = [
  ['01', 'Faith-Based Coaching', 'One-to-one executive coaching that uses the Ten Modes alongside scripture-based principles — for owners and executives who want God in their work.'],
  ['02', 'Webinars & Workshops', 'Live sessions that teach the Modal Leadership method and help you apply divine direction to real strategy and operations.'],
  ['03', 'Monthly Roundtable', 'An in-person executive peer group where leaders tell the truth about themselves, get how God sees them, and make real changes accordingly.'],
]

export default function WorkingWithGod() {
  return (
    <>
      <section className="phero">
        <div className="container">
          <div className="label"><span className="idx">Track 02</span> &nbsp;For faith-driven leaders</div>
          <h1 className="h1 mt-3 balance">Discern divine direction for your leadership.</h1>
          <p className="lead">Ever wish you’d consulted God before a hard hiring choice, a risky partnership, or a big commitment? Working With God is a book, a method, a workshop, and a peer group that takes the spiritual dryness out of work — and turns it into the purposeful adventure of a lifetime.</p>
          <div className="row mt-3">
            <Link to="/book-a-call" onClick={openCalendly} className="btn btn-onink">Book a discovery call <Arrow /></Link>
            <a href={WWG} target="_blank" rel="noopener" className="tlink lt">Visit workingwithgod.live</a>
          </div>
        </div>
      </section>

      {/* THE BOOK */}
      <section className="section">
        <div className="container">
          <div className="grid two" style={{ alignItems: 'center' }}>
            <Reveal style={{ display: 'flex', justifyContent: 'center' }}>
              {/* REPLACE with <img src="/book-cover.jpg" alt="Working With God" /> */}
              <div className="book">
                <div className="k">Dr. Eliyahu Lotzar</div>
                <div><div className="t">Working<br />With <b>God</b></div><div className="sub">The Ten Modes of Elevated Leadership</div></div>
                <div className="k">Print · Kindle · Audible</div>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="label"><span className="idx">(01)</span> &nbsp;The book</div>
              <h2 className="h2 mt-2 maxw-60">Not about being “holier” at the office.</h2>
              <p className="lead mt-2">Many good books on bringing God into your work offer sage advice. This one is different — it’s designed to bring you, your project, your entire organization, and God together.</p>
              <p className="mt-2 muted maxw-60">The book introduces the <b>Modal Leadership</b> method — ten operating modes that promote clarity, wisdom, agility, and strength. Replete with stories from CEOs and concrete action steps, it increases your agility in decision-making by helping you discern divine direction about your team, project, or organization.</p>
              <p className="mt-2 serif-it" style={{ fontSize: '1.15rem' }}>“Expect support, expect challenge, expect the unexpected, expect God’s love at work.”</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* OFFERINGS */}
      <section className="section on-bone">
        <div className="container">
          <div className="sec-head">
            <div className="label"><span className="idx">(02)</span><br />More than a book</div>
            <Reveal><h2 className="h2 maxw-60">A whole practice for leading with God.</h2>
              <p className="mt-2 muted maxw-60">Wherever you are on the comfort-with-God spectrum — exploring the idea, or walking closely for decades.</p></Reveal>
          </div>
          <div className="ilist mt-4">
            {offerings.map(([n, t, d]) => (
              <Reveal className="irow" as="div" key={n}>
                <div className="n">{n}</div><h3>{t}</h3><p>{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ENDORSEMENT */}
      <section className="section">
        <div className="container">
          <Reveal className="pullquote">
            <blockquote>“Lotzar’s vision of ‘Elevated Leadership’ comes from deep in the heart and points us to the Source of quality leadership. Highly recommend.”</blockquote>
            <div className="attr">— <b>Rev. Larry Buxton</b>, author &amp; leadership educator</div>
          </Reveal>
        </div>
      </section>

      <CTA label="(→) You’re not in this alone" title="Bring the greatest possible perspective into your next decision." text="Let’s talk about where God wants to lead you and your business — this year, this quarter, this week." />
    </>
  )
}
