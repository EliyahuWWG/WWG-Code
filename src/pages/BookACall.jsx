import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import Reveal from '../components/Reveal'
import Seo from '../components/Seo'
import { breadcrumbSchema } from '../seo/schema'
import { calendlyUrl, warmCalendly } from '../components/useCalendly'
import { CALENDLY, EMAIL, testimonials } from '../data'

export default function BookACall() {
  // Inline embed rather than throwing the highest-intent click on the site to
  // calendly.com in a new tab, where the proof and the context are gone.
  useEffect(() => {
    let cancelled = false
    warmCalendly().then(() => {
      if (cancelled || !window.Calendly) return
      const host = document.getElementById('cal-embed')
      if (!host || host.childElementCount) return
      window.Calendly.initInlineWidget({ url: calendlyUrl(CALENDLY), parentElement: host })
    })
    return () => { cancelled = true }
  }, [])

  const proof = testimonials.slice(0, 2)

  return (
    <>
      <Seo
        title="Book a call with Dr. Eliyahu Lotzar | Working With God"
        description="Book a no-pressure discovery call with Dr. Eliyahu Lotzar. Bring the decision you are stuck on, and we will look at it together."
        path="/book-a-call"
        schema={[breadcrumbSchema([{ name: 'Book a call', path: '/book-a-call' }])]}
      />

      <section className="post-head">
        <div className="container">
          <h1 className="h1">Let’s talk about the decision you’re stuck on.</h1>
          <p className="lead">Bring something real: a hire, a number, a conversation you’ve been putting off. Thirty minutes, no pitch, and you’ll know quickly whether I’m the right person for it.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 'clamp(28px,4vw,44px)' }}>
        <div className="container">
          <div className="cal-wrap">
            <Reveal>
              {/* Calendly fills this once its widget script has loaded. */}
              <div id="cal-embed" style={{ minWidth: 320, height: 680 }} />
              <noscript>
                <p className="muted">
                  <a className="tlink" href={CALENDLY} target="_blank" rel="noopener">Open the booking calendar</a>
                </p>
              </noscript>
            </Reveal>

            <Reveal delay={0.05} className="cal-rail">
              <h2 className="h3">What happens on the call</h2>
              <ul className="ticks mt-2">
                <li>You describe the situation. I mostly listen.</li>
                <li>We look at which mode it actually calls for.</li>
                <li>You leave with one thing to try, whether or not we work together.</li>
              </ul>

              <div className="cal-proof mt-4">
                {proof.map(t => (
                  <blockquote key={t.who}>
                    “{t.q}”
                    <cite><b>{t.who}</b>, {t.role}</cite>
                  </blockquote>
                ))}
              </div>

              <p className="mt-4 muted">
                Prefer to write first? <a className="tlink" style={{ display: 'inline' }} href={`mailto:${EMAIL}`}>{EMAIL}</a>,
                or use the <Link className="tlink" style={{ display: 'inline' }} to="/contact">contact form</Link>.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}

export const Component = BookACall
