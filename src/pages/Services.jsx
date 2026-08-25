import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import CTA from '../components/CTA'
import Arrow from '../components/Arrow'
import MaskLines from '../components/MaskLines'
import BookCallLink from '../components/BookCallLink'
import Seo from '../components/Seo'
import { breadcrumbSchema } from '../seo/schema'
import { coachingPoints, mastersClassPoints } from '../data'

export default function Services() {
  return (
    <>
      <Seo
        title="Ways to Engage, Coaching, Master’s Class & Speaking | Working With God"
        description="Three ways to work with Dr. Eliyahu Lotzar: one-to-one executive coaching, the two-day Master’s Class on the Ten Modes of Elevated Leadership, and inspirational speaking, bringing God into real leadership decisions."
        path="/services"
        schema={[breadcrumbSchema([{ name: 'Services', path: '/services' }])]}
      />

      <section className="phero">
        <div className="container">
          <div className="eyebrow">Engage</div>
          <h1 className="h1 mt-3 balance"><MaskLines>Ways to work with me.</MaskLines></h1>
          <p className="lead">Coaching for the leader, the owner, the professional. A two day immersion for really getting the Ten Modes and how to utilize them ongoingly. Speaking to your people to inspire and instigate forward movement.</p>
        </div>
      </section>

      {/* One quote before the offers. The page asks for money; something
          should vouch for him before it does. */}
      <section className="section-sm on-bone">
        <div className="container">
          <Reveal className="pullquote" style={{ borderTop: 0, paddingTop: 0 }}>
            <blockquote>“I can’t recommend Eliyahu enough as a coach. He identifies the key attributes you bring as a leader, then offers usable tactics to strengthen your skills and become a better leader.”</blockquote>
            <div className="attr"><b>TJ Schulz</b>, President, Airport Consultants Council</div>
          </Reveal>
        </div>
      </section>

      {/* EXECUTIVE COACHING */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <Reveal><h2 className="h2 maxw-60">Skilled coaching, prayer, and the Ten Modes, applied to your challenge.</h2>
              <p className="mt-2 muted maxw-60">For leaders whose business is <span className="serif-it">coasting along, plateaued</span> and for those at a transition point who feel stagnant or underutilized, or overwhelmed and anxious.</p></Reveal>
          </div>
          <Reveal className="ilist mt-4 draw" stagger={0.08}>
            {coachingPoints.map((p, i) => (
              <div className="irow" key={p.t} style={{ gridTemplateColumns: '88px 1fr' }}>
                <div className="n">0{i + 1}</div>
                <div><h3>{p.t}</h3><p className="mt-1">{p.d}</p></div>
              </div>
            ))}
          </Reveal>
          <div className="mt-3">
            <BookCallLink className="btn btn-solid">Contact Eliyahu About Coaching</BookCallLink>
          </div>
        </div>
      </section>

      {/* MASTER'S CLASS */}
      <section className="section on-bone">
        <div className="container">
          <div className="sec-head">
            <Reveal><h2 className="h2 maxw-60">Two days on your most complex operational matters.</h2>
              <p className="mt-2 muted maxw-60">An experiential deep-dive into the Ten Modes and <span className="serif-it">Modal Agility</span>. I have been leading leadership workshops since 1989.</p></Reveal>
          </div>
          <Reveal className="ilist mt-4 draw" stagger={0.08}>
            {mastersClassPoints.map((p, i) => (
              <div className="irow" key={p.t} style={{ gridTemplateColumns: '88px 1fr' }}>
                <div className="n">0{i + 1}</div>
                <div><h3>{p.t}</h3><p className="mt-1">{p.d}</p></div>
              </div>
            ))}
          </Reveal>
          <div className="mt-3">
            <BookCallLink className="btn btn-solid">Find Out More / Register</BookCallLink>
          </div>
        </div>
      </section>

      {/* SPEAKING */}
      <section className="section">
        <div className="container">
          <div className="grid two" style={{ alignItems: 'start' }}>
            <Reveal>
              <h2 className="h2 mt-2 maxw-60">A picture of what can be.</h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="lead">I will show you a picture of what becomes possible when you consciously lead <span className="serif-it">with</span> God, not just <span className="serif-it">for</span> Him.</p>
              <div className="mt-3">
                <BookCallLink className="tlink" arrow={false}>Contact Eliyahu About Speaking to Your People</BookCallLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CTA />
    </>
  )
}

// react-router lazy() route entry
export const Component = Services
