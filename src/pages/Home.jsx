import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import ParallaxImage from '../components/ParallaxImage'
import CTA from '../components/CTA'
import Arrow from '../components/Arrow'
import MaskLines from '../components/MaskLines'
import VideoFacade from '../components/VideoFacade'
import BookCallLink from '../components/BookCallLink'
import FAQ from '../components/FAQ'
import Seo from '../components/Seo'
import { organizationSchema, personSchema, faqSchema } from '../seo/schema'
import { pillars, offerings, testimonials, faqs } from '../data'

export default function Home() {
  const feature = testimonials.find(t => t.feature) || testimonials[0]

  return (
    <>
      <Seo
        title="Working With God, Faith-Based Leadership Coaching | Dr. Eliyahu Lotzar"
        description="Bring God into real business decisions, strategy, hiring, budgets, timing. Working With God is faith-based executive coaching, a two-day Master’s Class, and a free monthly Roundtable, built on the Ten Modes of Elevated Leadership."
        path="/"
        schema={[organizationSchema(), personSchema(), faqSchema(faqs)]}
      />

      {/* HERO
          Sequenced per client feedback 19 Aug: the visitor’s problem first,
          then who he speaks to, then the solution. The brand lockup moves to
          the right and the Ten Modes subtitle sits beneath it. The competing
          eyebrow ("When it’s time to be the leader HE needs you to be") is gone. */}
      <section className="hero hero-aurora">
        <span className="aurora aurora-1" aria-hidden="true" />
        <span className="aurora aurora-2" aria-hidden="true" />
        <span className="aurora aurora-3" aria-hidden="true" />
        <div className="container">
          <div className="hero-top">
            <div>
              <h1 className="display">
                <MaskLines>Leaders don’t plateau for lack of effort. They plateau for lack of <em className="hi-it">perspective.</em></MaskLines>
              </h1>
              <div className="mt-3">
                <BookCallLink className="btn btn-onink btn-lg">Book a call</BookCallLink>
              </div>
            </div>
            <div className="hero-side">
              <p className="hero-mark">Working With God</p>
              <p className="hero-sub">The Ten Modes of Elevated Leadership</p>
              <p className="mt-3">Working With God gives you the biggest and best perspective possible. A practical way to hear what God wants to do through your leadership, right in the middle of real strategy, hiring, and timing.</p>
            </div>
          </div>

          {/* Credentials, as on the reference hero he asked us to return to. */}
          <div className="hero-meta">
            <div><div className="k">Doctorate</div><div className="v">Ed.D., Executive Leadership</div></div>
            <div><div className="k">Clinical</div><div className="v">MSW, Therapist</div></div>
            <div><div className="k">Certified</div><div className="v">Adizes · DiSC · Arbinger</div></div>
            <div><div className="k">Author</div><div className="v">Working With God</div></div>
          </div>
        </div>
      </section>

      {/* PROOF
          One quote, straight after the hero. The carousel moved off the home
          page: it was three competing things to read in the same screen. */}
      <section className="section on-bone" id="testimonials" style={{ scrollMarginTop: 110 }}>
        <div className="container">
          <Reveal className="pullquote" style={{ borderTop: 0, paddingTop: 0 }}>
            <blockquote>“{feature.q}”</blockquote>
            <div className="attr"><b>{feature.who}</b>, {feature.role}</div>
          </Reveal>
        </div>
      </section>

      {/* VIDEO — the single biggest thing on the page after the hero. He is the
          product, so hearing him is the shortest path to trust. Full-width on
          navy so it reads as a moment rather than an embed in a column. */}
      <section className="section video-feature">
        <div className="container">
          <Reveal className="video-feature-head">
            <h2 className="h2">Give me two minutes.</h2>
            <p className="mt-2">It is the fastest way to work out whether I am the right person for you.</p>
          </Reveal>
          <Reveal delay={0.06} className="video-stage mt-3">
            <VideoFacade />
            <figcaption className="video-cap">
              <b>Dr. Eliyahu Lotzar</b>
              <span>Ed.D., MSW · Author of Working With God</span>
            </figcaption>
          </Reveal>
        </div>
      </section>

      {/* MEET ELIYAHU */}
      <section className="section">
        <div className="container">
          <div className="person-grid">
            <Reveal><ParallaxImage className="portrait">
              <picture>
                <source srcSet="/eliyahu.webp" type="image/webp" />
                <img src="/eliyahu.jpg" alt="Dr. Eliyahu Lotzar" width="920" height="1227"
                  loading="lazy" decoding="async" />
              </picture>
              <div className="cap"><b>Dr. Eliyahu Lotzar, Ed.D., MSW</b><span>Executive coach · facilitator · author</span></div>
            </ParallaxImage></Reveal>
            <Reveal delay={0.05}>
              {/* TODO(client): he is rewriting this line. Superlative removed for now. */}
              <h2 className="h2 maxw-60">I bring a bigger perspective into the room.</h2>
              <p className="mt-2 lead">I have been coaching, counseling, and facilitating leadership groups for over 30 years, and working specifically with CEOs and owners for the past seven. I am a clinical therapist by training, a former business owner, and a scholar of what actually makes organizations healthy.</p>
              <p className="mt-2 muted maxw-60">Working With God is where all of that meets faith. It is a practical way for you to hear what God wants to do through your leadership, right in the middle of real strategy, hiring, and timing.</p>
              <div className="mt-3"><Link to="/about" className="tlink">Read my story <Arrow /></Link></div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* THE ARGUMENT */}
      <section className="section on-bone">
        <div className="container">
          <div className="sec-head">
            <Reveal><h2 className="h2">Not asking God to bless your plans. Asking what He wants to do through your leadership.</h2></Reveal>
          </div>
          <Reveal className="ilist mt-4 draw" stagger={0.08}>
            {pillars.map(p => (
              <div className="irow" key={p.n}>
                <div className="n">{p.n}</div>
                <h3>{p.t}</h3>
                <p dangerouslySetInnerHTML={{ __html: p.body }} />
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* WAYS TO ENGAGE — the offer ladder. Every rung ends at a conversation. */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <Reveal><h2 className="h2">Bring God into your next decision.</h2>
              <p className="mt-2 muted">Four ways to begin. Two of them are free.</p></Reveal>
          </div>
          <Reveal className="ilist mt-4 draw" stagger={0.08}>
            {offerings.map(o => (
              <div className="irow" key={o.n}>
                <div className="n">{o.n}</div>
                <h3>{o.title} {o.tag && <span className="pill">{o.tag}</span>}</h3>
                <div>
                  <p>{o.body}</p>
                  {o.external
                    ? <a className="go" href={o.href} target="_blank" rel="noopener">{o.cta} <Arrow /></a>
                    : <Link className="go" to={o.href}>{o.cta} <Arrow /></Link>}
                </div>
              </div>
            ))}
          </Reveal>
          <Reveal className="mt-4">
            <p className="muted maxw-60">There is also my book, <Link to="/the-book" className="tlink">Working With God: The Ten Modes of Elevated Leadership</Link>, and some <Link to="/blog" className="tlink">writing</Link>, if you would rather start on your own.</p>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      <CTA />
    </>
  )
}

// react-router lazy() route entry
export const Component = Home
