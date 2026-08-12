import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import CTA from '../components/CTA'
import Arrow from '../components/Arrow'
import MaskLines from '../components/MaskLines'
import Ridge from '../components/Ridge'
import VideoFacade from '../components/VideoFacade'
import BookCallLink from '../components/BookCallLink'
import FAQ from '../components/FAQ'
import QuoteSignup from '../components/forms/QuoteSignup'
import Seo from '../components/Seo'
import { organizationSchema, personSchema, faqSchema } from '../seo/schema'
import { pillars, offerings, testimonials, faqs, MEETUP } from '../data'

export default function Home() {
  const feature = testimonials.find(t => t.feature) || testimonials[0]
  const rest = testimonials.filter(t => t !== feature).slice(0, 3)

  return (
    <>
      <Seo
        title="Working With God — Faith-Based Leadership Coaching | Dr. Eliyahu Lotzar"
        description="Bring God into real business decisions — strategy, hiring, budgets, timing. Working With God is faith-based executive coaching, a two-day Master’s Class, and a free monthly Roundtable, built on the Ten Modes of Elevated Leadership."
        path="/"
        schema={[organizationSchema(), personSchema(), faqSchema(faqs)]}
      />

      {/* HERO */}
      <section className="hero">
        <Ridge />
        <div className="container">
          <div className="eyebrow">When it’s time to be the leader HE needs you to be.</div>
          <div className="hero-top mt-3">
            <div>
              <h1 className="display"><MaskLines>Working With God</MaskLines></h1>
              <p className="hero-sub">The Ten Modes of Elevated Leadership</p>
            </div>
            <div className="hero-side">
              <p>Leaders don’t plateau for lack of effort. They plateau for lack of <span className="serif-it">perspective.</span> Working With God gives you the biggest and best perspective possible.</p>
              <div className="row mt-3">
                <BookCallLink className="btn btn-onink">Book a call</BookCallLink>
                <Link to="/roundtable" className="tlink lt">Join the next Roundtable — free</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VIDEO */}
      <section className="section-sm">
        <div className="container">
          <Reveal style={{ maxWidth: 880, margin: '0 auto' }}><VideoFacade /></Reveal>
        </div>
      </section>

      {/* FOUR PILLARS */}
      <section className="section on-bone">
        <div className="container">
          <div className="sec-head">
            <div className="label"><span className="idx">(01)</span><br />Why work with God</div>
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

      {/* WHAT IS WWG */}
      <section className="section">
        <div className="container">
          <div className="grid two" style={{ alignItems: 'start' }}>
            <Reveal>
              <div className="label"><span className="idx">(02)</span> &nbsp;The idea</div>
              <h2 className="h2 mt-2 maxw-60">What is Working With God?</h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="lead">Working With God (WWG) is a vehicle for leaders to discern divine direction. It is a set of professional services and free events.</p>
              <p className="mt-2 muted maxw-60">It’s based on the <span className="serif-it">Ten Modes of Elevated Leadership</span> method from Dr. Lotzar’s book — a practical way to bring God into strategy, hiring, budgets, and timing.</p>
              <div className="mt-3"><Link to="/the-book" className="tlink">Read about the method <Arrow /></Link></div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* WAYS TO ENGAGE */}
      <section className="section on-bone">
        <div className="container">
          <div className="sec-head">
            <div className="label"><span className="idx">(03)</span><br />Ways to engage</div>
            <Reveal><h2 className="h2 maxw-60">Four ways to start — two of them free.</h2></Reveal>
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

      {/* PROOF */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <div className="label"><span className="idx">(04)</span><br />What people say</div>
            <Reveal className="pullquote" style={{ borderTop: 0, paddingTop: 0 }}>
              <blockquote>“{feature.q}”</blockquote>
              <div className="attr">— <b>{feature.who}</b>, {feature.role}</div>
            </Reveal>
          </div>
          <Reveal className="qgrid c3 mt-4 draw" stagger={0.08}>
            {rest.map(t => (
              <div className="q" key={t.who}>
                <blockquote>{t.q}</blockquote>
                <div className="attr"><b>{t.who}</b><span>{t.role}</span></div>
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
              <div className="label"><span className="idx">(05)</span> &nbsp;The book</div>
              <h2 className="h2 mt-2 maxw-60">God is ready to work with you.</h2>
              <p className="mt-2 muted maxw-60">Working With God is more than just a book — it’s a practical way to partner with God right in the middle of your toughest work challenges. It introduces <span className="serif-it">Modal Leadership</span> and the Ten Modes of Elevated Leadership.</p>
              <div className="row mt-3">
                <Link to="/the-book" className="btn btn-solid">About the book <Arrow /></Link>
                <BookCallLink className="tlink" arrow={false}>Talk to Eliyahu</BookCallLink>
              </div>
            </Reveal>
            <Reveal delay={0.05} style={{ display: 'flex', justifyContent: 'center' }}>
              {/* TODO(client): replace with real cover → /public/book-cover.jpg (alt="Working With God") */}
              <div className="book">
                <div className="k">Dr. Eliyahu Lotzar</div>
                <div><div className="t">Working<br />With <b>God</b></div><div className="sub">The Ten Modes of Elevated Leadership</div></div>
                <div className="k">Print · Kindle · Audible</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* DAILY QUOTE SIGNUP */}
      <section className="section">
        <div className="container">
          <div className="grid two" style={{ alignItems: 'start' }}>
            <Reveal>
              <div className="label"><span className="idx">(06)</span> &nbsp;Daily quote</div>
              <h2 className="h2 mt-2 maxw-60">A short word for the workday.</h2>
              <p className="mt-2 muted maxw-60">Get a <span className="serif-it">short</span> inspirational quote each workday morning, and occasional news about new events.</p>
              <p className="mt-2 muted" style={{ fontSize: '.9rem' }}>No selling of your data. Unsubscribe anytime.</p>
            </Reveal>
            <Reveal delay={0.05}><QuoteSignup /></Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ label="(07)" />

      <CTA />
    </>
  )
}

// react-router lazy() route entry
export const Component = Home
