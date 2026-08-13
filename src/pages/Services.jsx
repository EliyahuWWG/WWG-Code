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
          <div className="eyebrow">Ways to engage</div>
          <h1 className="h1 mt-3 balance"><MaskLines>Ways to Engage With Working With God</MaskLines></h1>
          <p className="lead">Coaching for the leader, a two-day immersion for the toughest decisions, and speaking for your people. Each one brings God into the real work of leadership.</p>
        </div>
      </section>

      {/* EXECUTIVE COACHING */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <div className="label"><span className="sec-num">01</span><br />Executive coaching · 1:1</div>
            <Reveal><h2 className="h2 maxw-60">Skilled coaching, prayer, and the Ten Modes, applied to your challenge.</h2>
              <p className="mt-2 muted maxw-60">For leaders whose business is <span className="serif-it">coasting along, plateaued</span>and for those at a transition point who feel stagnant or underutilized, or overwhelmed and anxious.</p></Reveal>
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
            <div className="label"><span className="sec-num">02</span><br />The Master’s Class · 2-day workshop</div>
            <Reveal><h2 className="h2 maxw-60">Two days on your most complex operational matters.</h2>
              <p className="mt-2 muted maxw-60">An experiential deep-dive into the Ten Modes and <span className="serif-it">Modal Agility</span>. Dr. Lotzar has led leadership workshops since 1989.</p></Reveal>
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
              <div className="label"><span className="sec-num">03</span><br />Inspirational speaking</div>
              <h2 className="h2 mt-2 maxw-60">A picture of what can be.</h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="lead">Dr. Lotzar inspires you with a picture of what can be when you consciously lead <span className="serif-it">with</span> God, not just <span className="serif-it">for</span> Him.</p>
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
