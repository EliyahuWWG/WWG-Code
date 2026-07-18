import { useEffect, useRef } from 'react'
import Reveal from '../components/Reveal'
import MaskLines from '../components/MaskLines'
import Seo from '../components/Seo'
import { breadcrumbSchema } from '../seo/schema'
import { CALENDLY, EMAIL, LINKEDIN, WWG } from '../data'

const steps = [
  ['01', 'You bring the challenge', 'Growth, people, strategy, a stuck team, a hard decision — whatever’s on your plate.'],
  ['02', 'We reframe it together', 'A fresh perspective and a couple of frameworks to see it more clearly.'],
  ['03', 'You leave with a next step', 'Whether or not we work together, you’ll walk away with something useful.'],
]

function loadCalendly() {
  return new Promise((resolve) => {
    if (window.Calendly) return resolve()
    const existing = document.querySelector('script[data-calendly]')
    if (existing) { existing.addEventListener('load', () => resolve()); return }
    const s = document.createElement('script')
    s.src = 'https://assets.calendly.com/assets/external/widget.js'
    s.async = true
    s.setAttribute('data-calendly', '1')
    s.addEventListener('load', () => resolve())
    document.body.appendChild(s)
  })
}

export default function BookCall() {
  const ref = useRef(null)
  useEffect(() => {
    let alive = true
    loadCalendly().then(() => {
      if (!alive || !ref.current || !window.Calendly) return
      ref.current.innerHTML = ''
      window.Calendly.initInlineWidget({
        url: `${CALENDLY}?hide_gdpr_banner=1&primary_color=b3623c`,
        parentElement: ref.current,
      })
    })
    return () => { alive = false }
  }, [])

  return (
    <>
      <Seo
        title="Book a Discovery Call | Reframed Reality"
        description="Schedule a free 30-minute discovery call with Dr. Eliyahu Lotzar — a focused, no-pressure conversation about the leadership or organizational challenge in front of you."
        path="/book-a-call"
        schema={[breadcrumbSchema([{ name: 'Book a call', path: '/book-a-call' }])]}
      />
      <section className="phero" style={{ paddingBottom: 'clamp(40px,5vw,64px)' }}>
        <div className="container">
          <div className="label"><span className="idx">(→)</span> &nbsp;Let’s talk</div>
          <h1 className="h1 mt-3 balance"><MaskLines>One honest conversation can reframe the whole picture.</MaskLines></h1>
          <p className="lead">No pitch, no pressure — just a focused conversation about the challenge in front of you and whether Reframed Reality is the right partner to help. Pick a time below.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 'clamp(40px,5vw,64px)' }}>
        <div className="container">
          <div className="grid two" style={{ alignItems: 'start' }}>
            <Reveal>
              <div className="cal-wrap">
                <div ref={ref} style={{ minWidth: 320, height: 680 }}>
                  <div className="cal-fallback">
                    <div>
                      <p className="muted" style={{ marginBottom: 16 }}>Loading Eliyahu’s calendar…</p>
                      <a className="btn btn-solid" href={CALENDLY} target="_blank" rel="noopener">Open the booking page</a>
                    </div>
                  </div>
                </div>
              </div>
              <p className="muted mt-1" style={{ fontSize: '.86rem' }}>Prefer email? Write to <a className="tlink" style={{ display: 'inline' }} href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="label"><span className="idx">(01)</span> &nbsp;What to expect</div>
              <h2 className="h2 mt-2">A 30-minute reframe.</h2>
              <div className="ilist mt-3">
                {steps.map(([n, t, d]) => (
                  <div className="irow" key={n} style={{ gridTemplateColumns: '52px 1fr', padding: '20px 0' }}>
                    <div className="n">{n}</div>
                    <div><h3 style={{ fontSize: '1.15rem' }}>{t}</h3><p className="muted mt-1">{d}</p></div>
                  </div>
                ))}
              </div>
              <div className="label mt-3">Reach Reframed Reality</div>
              <div className="stack-tight mt-2">
                <a className="tlink" href={`mailto:${EMAIL}`}>{EMAIL}</a>
                <a className="tlink" href={LINKEDIN} target="_blank" rel="noopener">Connect on LinkedIn</a>
                <a className="tlink" href={WWG} target="_blank" rel="noopener">Working With God community</a>
              </div>
              <p className="muted mt-3" style={{ fontSize: '.9rem' }}>Reston, Virginia · Serving the Washington, DC metro, nationally, and internationally.</p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}

// react-router lazy() route entry
export const Component = BookCall
