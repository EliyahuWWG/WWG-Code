import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import CTA from '../components/CTA'
import Arrow from '../components/Arrow'
import MaskLines from '../components/MaskLines'
import VideoFacade from '../components/VideoFacade'
import HeroBackdrop from '../components/HeroBackdrop'
import BookCallLink from '../components/BookCallLink'
import FAQ from '../components/FAQ'
import Seo from '../components/Seo'
import { organizationSchema, personSchema, faqSchema } from '../seo/schema'
import { offerings, testimonials, faqs } from '../data'

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
        {/* Backdrop first in the DOM so the aurora blobs layer over the footage
            rather than under it, which is what gives the hero depth. */}
        <HeroBackdrop />
        <span className="aurora aurora-1" aria-hidden="true" />
        <span className="aurora aurora-2" aria-hidden="true" />
        <span className="aurora aurora-3" aria-hidden="true" />
        <div className="container">
          <div className="hero-top">
            <div className="hero-lead">
              <h1 className="display">
                <MaskLines>Leaders don’t plateau for lack of effort. They plateau for lack of <em className="hi-it">perspective.</em></MaskLines>
              </h1>
            </div>

            {/* Right column, matching the reference layout: a short first-person
                introduction, then the call to action directly beneath it. The
                column is aligned to the lower half of the headline rather than
                its top, which is what makes the two blocks read as one
                composition instead of two stacked ones. */}
            <div className="hero-side">
              {/* No brand lockup here: the site is already called Working With
                  God in the nav, the title and the footer, and repeating it
                  above this paragraph was a second headline competing with the
                  H1. Matches the reference hero, which carries only the
                  introduction and the CTA in this column. */}
              {/* Replaced the paragraph-length introduction on 3 Sep. His words. */}
              <p className="hero-intro">Coaching for Christian Professional</p>
              <div className="hero-cta">
                <BookCallLink className="btn btn-onink btn-lg">Book a discovery call</BookCallLink>
              </div>
            </div>
          </div>

          {/* Credentials, as on the reference hero he asked us to return to.
              Order and the "Certified by" wording are his, from 1 Sep. */}
          <div className="hero-meta">
            <div><div className="k">Author</div><div className="v">Working With God</div></div>
            <div><div className="k">Doctorate</div><div className="v">Ed.D., Executive Leadership</div></div>
            <div><div className="k">Clinical</div><div className="v">MSW, Therapist</div></div>
            <div><div className="k">Certified by</div><div className="v">Adizes · Arbinger · DiSC</div></div>
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
          {/* Heading, video and caption all share ONE column, so the text
              starts on the video's left edge rather than the container's.
              The video is narrower than the container (it is capped by
              viewport height), which is why they did not line up before. */}
          <div className="video-inner">
            <Reveal className="video-feature-head">
              <h2 className="h2">Welcome to Working With God</h2>
            </Reveal>
            <Reveal delay={0.06} className="video-stage mt-3">
              <VideoFacade />
              <figcaption className="video-cap">
                <b>Dr. Eliyahu Lotzar</b>
                <span>Ed.D., MSW · Author of Working With God</span>
              </figcaption>
            </Reveal>
          </div>
        </div>
      </section>

      {/* MEET ELIYAHU */}
      <section className="section">
        <div className="container">
          <div className="person-grid">
            <Reveal className="portrait">
              <picture>
                <source srcSet="/eliyahu.webp" type="image/webp" />
                <img src="/eliyahu.jpg" alt="Dr. Eliyahu Lotzar" width="920" height="1227"
                  loading="lazy" decoding="async" />
              </picture>
              <div className="cap"><b>Dr. Eliyahu Lotzar, Ed.D., MSW</b><span>Executive coach · facilitator · author</span></div>
            </Reveal>
            <Reveal delay={0.05}>
              {/* TODO(client): he is rewriting this line. Superlative removed for now. */}
              <h2 className="h2 maxw-60">I bring a bigger perspective into the room.</h2>
              <p className="mt-2 lead">I have been coaching, counseling, consulting and facilitating for over 30 years. Experience brings some perspective. I also have been walking more and more closely with God for decades, and that brings an even more trustworthy, challenging, and valuable perspective.</p>
              <p className="mt-2 muted maxw-60">Working With God is where all of that meets you and your situation. Whether things feel blocked and dragging or chaotic and on fire, WWG coaching helps you hone in on what God wants to do through your leadership, right in the middle of real strategy and implementation.</p>
              <div className="mt-3"><Link to="/about" className="tlink">Read my story <Arrow /></Link></div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* WAYS TO ENGAGE — the offer ladder. Every rung ends at a conversation. */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <Reveal><h2 className="h2">Bring God into your next decision.</h2>
              <p className="mt-2 muted">Five ways to begin. Two of them are free.</p></Reveal>
          </div>
          <Reveal className="ilist mt-4 draw" stagger={0.08}>
            {offerings.map(o => (
              <div className="irow" key={o.n}>
                <div className="n">{o.n}</div>
                <h3>{o.title} {o.tag && <span className="pill">{o.tag}</span>}</h3>
                <div className={o.cover ? 'irow-withcover' : undefined}>
                  <div>
                    <p>{o.body}</p>
                    {o.external
                      ? <a className="go" href={o.href} target="_blank" rel="noopener">{o.cta} <Arrow /></a>
                      : <Link className="go" to={o.href}>{o.cta} <Arrow /></Link>}
                  </div>
                  {/* The cover is a second route to the same page, not a
                      decoration — people click book covers. aria-hidden because
                      the "Read my book" link beside it already says this to a
                      screen reader, and two identical links read as a stutter. */}
                  {o.cover && (
                    <Link to={o.href} className="irow-cover" tabIndex={-1} aria-hidden="true">
                      <picture>
                        <source srcSet={o.cover.webp} type="image/webp" />
                        <img src={o.cover.jpg} width="620" height="930" loading="lazy" decoding="async" alt={o.cover.alt} />
                      </picture>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </Reveal>
          <Reveal className="mt-4">
            <p className="muted maxw-60">Still deciding? <a className="tlink" style={{ display: 'inline' }} href="#faq">Read the questions people usually ask</a>.</p>
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
