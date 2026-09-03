import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import CTA from '../components/CTA'
import Arrow from '../components/Arrow'
import MaskLines from '../components/MaskLines'
import BookCallLink from '../components/BookCallLink'
import Seo from '../components/Seo'
import { breadcrumbSchema } from '../seo/schema'
import Emphasize from '../components/Emphasize'
import { coachingPoints, mastersClassPoints, coachingScripture, CALENDLY_ZOOM } from '../data'

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
          <p className="lead"><strong>Coaching</strong> for the leader, the owner, the professional. <strong>A two day immersion</strong> for really getting the Ten Modes and how to utilize them ongoingly. <strong>Speaking</strong> to your people to inspire and instigate forward movement.</p>
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
            <Reveal><h2 className="h2 maxw-60">Skilled coaching.</h2>
              <p className="mt-2 muted maxw-60">For those whose business plateaued, who feel stagnant or underutilized; for those at an inflection point; or for those who feel overwhelmed and anxious: <span className="serif-it">expert coaching is available</span>. Dr. Eliyahu Lotzar provides a confidential space to find greater clarity, peace, and focused forward momentum for the success of what you are called to be and do.</p></Reveal>
          </div>
          <Reveal className="ilist mt-4 draw" stagger={0.08}>
            {coachingPoints.map((p, i) => (
              <div className="irow" key={p.t} style={{ gridTemplateColumns: '88px 1fr' }}>
                <div className="n">0{i + 1}</div>
                <div><h3>{p.t}</h3><p className="mt-1"><Emphasize text={p.d} terms={p.bold} /></p></div>
              </div>
            ))}
          </Reveal>
          {/* The list above ends on a rule, and the button sat tight against it
              with nothing to anchor it. Centred, with room either side, it now
              reads as the close of the section rather than a stray control. */}
          <div className="cta-close">
            <BookCallLink className="btn btn-solid btn-lg" url={CALENDLY_ZOOM}>
              Schedule a free exploratory conversation
            </BookCallLink>
            <p className="cta-close-note">No charge, no obligation. Bring one decision you are sitting on.</p>
          </div>
          {/* His scripture, set apart from the sell above it: display face, a
              gold rule instead of quote marks, and its own breathing room. */}
          <Reveal className="scripture mt-5">
            <blockquote>{coachingScripture.text}</blockquote>
            <cite>{coachingScripture.ref}</cite>
          </Reveal>
        </div>
      </section>

      {/* MASTER'S CLASS
          id + scroll-margin so the "Find out more" link on the home page lands
          on this section with the heading clear of the fixed nav. */}
      <section className="section on-bone" id="masters-class" style={{ scrollMarginTop: 110 }}>
        <div className="container">
          <div className="sec-head">
            <Reveal><h2 className="h2 maxw-60">Two days of empowering perspective on identity, strategy, and operations.</h2>
              <p className="mt-2 muted maxw-60">A deep-dive into the Ten Modes. Really get <span className="serif-it">Modal Agility</span> and see how you can follow God more closely in your decision-making.</p></Reveal>
          </div>
          <Reveal className="ilist mt-4 draw" stagger={0.08}>
            {mastersClassPoints.map((p, i) => (
              <div className="irow" key={p.t} style={{ gridTemplateColumns: '88px 1fr' }}>
                <div className="n">0{i + 1}</div>
                <div><h3>{p.t}</h3><p className="mt-1"><Emphasize text={p.d} terms={p.bold} /></p></div>
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
          <div className="sec-head">
            <Reveal><h2 className="h2 maxw-60">Speaking: A picture of what can be.</h2>
              <p className="mt-2 muted maxw-60">I show your group a picture of what becomes possible when you consciously lead <span className="serif-it">with</span> God, not just <span className="serif-it">for</span> Him.</p></Reveal>
          </div>
          <div className="mt-3">
            <Link className="btn btn-solid" to="/speaking">Find Out More About Eliyahu’s Speaking Engagements</Link>
          </div>
        </div>
      </section>

      <CTA />
    </>
  )
}

// react-router lazy() route entry
export const Component = Services
