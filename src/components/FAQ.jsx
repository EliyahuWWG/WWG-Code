import { useState } from 'react'
import Reveal from './Reveal'
import { faqs } from '../data'

// Accordion in the house style: hairline rows, mono index, plus/minus mark.
// Content stays in the DOM (grid-rows animation); closed answers are
// visibility:hidden so they leave the tab order and accessibility tree.
export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0)
  return (
    <section className="section">
      <div className="container">
        <div className="sec-head">
          <div className="label">Questions, answered</div>
          <Reveal><h2 className="h2 maxw-60">The things people ask before they book.</h2></Reveal>
        </div>
        <Reveal className="faq mt-4">
          {faqs.map((f, i) => {
            const open = openIdx === i
            return (
              <div className={`faq-item ${open ? 'open' : ''}`} key={f.q}>
                <h3 className="faq-h">
                  <button
                    className="faq-q"
                    aria-expanded={open}
                    aria-controls={`faq-a-${i}`}
                    id={`faq-q-${i}`}
                    onClick={() => setOpenIdx(open ? -1 : i)}
                  >
                    <span className="n">{String(i + 1).padStart(2, '0')}</span>
                    <span className="qt">{f.q}</span>
                    <span className="faq-x" aria-hidden="true" />
                  </button>
                </h3>
                <div className="faq-a" id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`}>
                  <div><p>{f.a}</p></div>
                </div>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
