import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import CTA from '../components/CTA'
import Arrow from '../components/Arrow'
import MaskLines from '../components/MaskLines'
import VideoFacade from '../components/VideoFacade'
import BookCallLink from '../components/BookCallLink'
import Tilt from '../components/Tilt'
import TestimonialCarousel from '../components/TestimonialCarousel'
import FAQ from '../components/FAQ'
import QuoteSignup from '../components/forms/QuoteSignup'
import Seo from '../components/Seo'
import { organizationSchema, personSchema, faqSchema } from '../seo/schema'
import { pillars, offerings, testimonials, testimonialsArchive, endorsements, faqs } from '../data'

export default function Home() {
  const feature = testimonials.find(t => t.feature) || testimonials[0]
  // Real quotes only: coaching testimonials + book endorsements + archive.
  const carouselQuotes = [...testimonials.filter(t => t !== feature), ...endorsements, ...testimonialsArchive]

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

      {/* VIDEO */}
      <section className="section-sm">
        <div className="container">
          <Reveal style={{ maxWidth: 880, margin: '0 auto' }}>
            <VideoFacade />
            <figcaption className="video-cap">
              <b>Dr. Eliyahu Lotzar</b>
              <span>Ed.D., MSW · Author of Working With God</span>
            </figcaption>
          </Reveal>
        </div>
      </section>

      {/* PROOF */}
      <section className="section on-bone" id="testimonials" style={{ scrollMarginTop: 110 }}>
        <div className="container">
          <div className="sec-head">
            <div className="label">What people say</div>
            <Reveal className="pullquote" style={{ borderTop: 0, paddingTop: 0 }}>
              <blockquote>“{feature.q}”</blockquote>
              <div className="attr"><b>{feature.who}</b>, {feature.role}</div>
            </Reveal>
          </div>
        </div>
        <Reveal className="mt-4">
          <TestimonialCarousel items={carouselQuotes} />
        </Reveal>
      </section>

      {/* MEET ELIYAHU */}
      <section className="section">
        <div className="container">
          <div className="person-grid">
            <Reveal className="portrait">
              <img src="/eliyahu.jpg" alt="Dr. Eliyahu Lotzar" width="1200" height="1600" loading="lazy" />
              <div className="cap"><b>Dr. Eliyahu Lotzar, Ed.D., MSW</b><span>Executive coach · facilitator · author</span></div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="label">Meet Eliyahu</div>
              {/* TODO(client): he is rewriting this line. Superlative removed for now. */}
              <h2 className="h2 mt-2 maxw-60">Bringing a bigger perspective into the room.</h2>
              <p className="mt-2 lead">Eliyahu has been coaching, counseling, and facilitating leadership groups for over 30 years, and working specifically with CEOs and owners for the past seven. He is a clinical therapist by training, a former business owner, and a scholar of what makes organizations healthy.</p>
              <p className="mt-2 muted maxw-60">Working With God is where all of that meets faith: a practical way to hear what God wants to do through your leadership, right in the middle of real strategy, hiring, and timing.</p>
              <div className="mt-3"><Link to="/about" className="tlink">Read his story <Arrow /></Link></div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOUR PILLARS */}
      <section className="section on-bone">
        <div className="container">
          <div className="sec-head">
            <div className="label">Why work with God</div>
            <Reveal><h2 className="h2 maxw-60">Not asking God to bless your plans. Asking what He wants to do through your leadership.</h2></Reveal>
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

      {/* WAYS TO ENGAGE */}
      <section className="section on-bone">
        <div className="container">
          <div className="sec-head">
            <div className="label">Ways to engage</div>
            <Reveal><h2 className="h2 maxw-60">Bring God into your next decision.</h2>
              <p className="mt-2 muted maxw-60">Four ways to begin. Two of them are free.</p></Reveal>
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
        </div>
      </section>

      {/* BOOK TEASER */}
      <section className="section on-bone">
        <div className="container">
          <div className="grid two" style={{ alignItems: 'center' }}>
            <Reveal>
              <div className="label">The book</div>
              <h2 className="h2 mt-2 maxw-60">God is ready to work with you.</h2>
              <p className="mt-2 muted maxw-60">Working With God is more than just a book, it’s a practical way to partner with God right in the middle of your toughest work challenges. It introduces <span className="serif-it">Modal Leadership</span> and the Ten Modes of Elevated Leadership.</p>
              <div className="row mt-3">
                <Link to="/the-book" className="btn btn-solid">About the book <Arrow /></Link>
                <BookCallLink className="tlink" arrow={false}>Talk to Eliyahu</BookCallLink>
              </div>
            </Reveal>
            <Reveal delay={0.05} style={{ display: 'flex', justifyContent: 'center' }}>
              <Tilt max={9}>
                <div className="book-cover">
                  <img src="/book-cover.jpg" width="760" height="1140"
                    alt="Working With God: The Ten Modes of Elevated Leadership, by Dr. Eliyahu Lotzar" />
                </div>
              </Tilt>
            </Reveal>
          </div>
        </div>
      </section>

      {/* DAILY QUOTE SIGNUP */}
      <section className="section">
        <div className="container">
          <div className="grid two" style={{ alignItems: 'start' }}>
            <Reveal>
              <div className="label">Daily quote</div>
              <h2 className="h2 mt-2 maxw-60">A short word for the workday.</h2>
              <p className="mt-2 muted maxw-60">Get a <span className="serif-it">short</span> inspirational quote each workday morning, and occasional news about new events.</p>
              <p className="mt-2 muted" style={{ fontSize: '.9rem' }}>No selling of your data. Unsubscribe anytime.</p>
            </Reveal>
            <Reveal delay={0.05}><QuoteSignup /></Reveal>
          </div>
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
