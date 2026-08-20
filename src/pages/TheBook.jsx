import Reveal from '../components/Reveal'
import CTA from '../components/CTA'
import Arrow from '../components/Arrow'
import MaskLines from '../components/MaskLines'
import Tilt from '../components/Tilt'
import Seo from '../components/Seo'
import { bookSchema, breadcrumbSchema } from '../seo/schema'
import { endorsements, AMAZON } from '../data'

export default function TheBook() {
  return (
    <>
      <Seo
        title="The Book, Working With God: The Ten Modes of Elevated Leadership"
        description="Working With God is a practical way to partner with God in your toughest work challenges. It introduces Modal Leadership and the Ten Modes of Elevated Leadership. Available in print, Kindle, and Audible."
        path="/the-book"
        type="book"
        schema={[bookSchema(), breadcrumbSchema([{ name: 'The Book', path: '/the-book' }])]}
      />

      <section className="phero">
        <div className="container">
          <div className="grid two" style={{ alignItems: 'center' }}>
            <div>
              <div className="eyebrow">The book</div>
              <h1 className="h1 mt-3 balance"><MaskLines>God is ready to work with you.</MaskLines></h1>
              <p className="lead">Working With God is more than just a book, it’s a practical way to partner with God right in the middle of your toughest work challenges.</p>
              <div className="row mt-3">
                <a href={AMAZON} target="_blank" rel="noopener" className="btn btn-onink">PURCHASE in Print, Kindle, or Audible <Arrow /></a>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {/* Static cover with the shared hover zoom. A three.js version was
                  tried and pulled: ~190 KB of chunk, a WebGL context and a
                  render loop, for something the flat image says just as well. */}
              <Tilt max={9}>
                <div className="book-cover">
                  {/* LCP element on this page, so deliberately NOT lazy. */}
                  <picture>
                    <source srcSet="/book-cover.webp" type="image/webp" />
                    <img src="/book-cover.jpg" width="620" height="930" fetchPriority="high" decoding="async"
                      alt="Working With God: The Ten Modes of Elevated Leadership, by Dr. Eliyahu Lotzar" />
                  </picture>
                </div>
              </Tilt>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL LEADERSHIP */}
      <section className="section">
        <div className="container">
          <div className="grid two" style={{ alignItems: 'start' }}>
            <Reveal>
              <h2 className="h2 mt-2 maxw-60">Introducing “Modal Leadership.”</h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="lead">A framework for dialoguing with God about business challenges. You identify the operational <span className="serif-it">mode</span> you’re in, then build the agility to shift to the mode each situation actually needs.</p>
              <p className="mt-2 muted maxw-60">It’s not about being holier at the office. It’s about strategy, hiring, budgets, and timing, the real decisions leaders make every week.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* THE TEN MODES */}
      <section className="section on-bone">
        <div className="container">
          <div className="sec-head">
            <Reveal><h2 className="h2 maxw-60">Six for the known. Four for the unknown.</h2></Reveal>
          </div>
          <div className="grid two mt-4">
            <Reveal style={{ borderTop: '1px solid var(--line)', paddingTop: 28 }}>
              <div className="label">The first six</div>
              <p className="mt-2 lead" style={{ maxWidth: '38ch' }}>Address the “knowns” of daily operations, the decisions and patterns you already recognize.</p>
            </Reveal>
            <Reveal delay={0.05} style={{ borderTop: '1px solid var(--gold-500)', paddingTop: 28 }}>
              <div className="label" style={{ color: 'var(--gold-600)' }}>The last four</div>
              <p className="mt-2 lead" style={{ maxWidth: '38ch' }}>Engage the “unknown” as leaders step into God’s larger business.</p>
            </Reveal>
          </div>
          <p className="mt-3 muted maxw-60">The specific modes are taught in the book and in the Master’s Class.</p>
        </div>
      </section>

      {/* WHY DIFFERENT */}
      <section className="section">
        <div className="container">
          <div className="grid two" style={{ alignItems: 'start' }}>
            <Reveal>
              <h2 className="h2 mt-2 maxw-60">Real stories, real tools, real next steps.</h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="lead">Replete with stories from CEOs and concrete action steps, it gives you strategic tools for connecting with God about your team, project, or organization, and it builds your agility for the moment a hard decision lands.</p>
              <p className="mt-2 serif-it" style={{ fontSize: '1.15rem' }}>Expect support, expect challenge, expect the unexpected, expect God’s love at work.</p>
            </Reveal>
          </div>
          <Reveal className="mt-4">
            <div className="label">What you’ll walk away with</div>
            <ul className="ticks ticks-2 mt-2">
              <li>The Ten Modes of Elevated Leadership, taught through real business stories</li>
              <li>“Modal Agility”, or how to shift to the mode a decision actually needs</li>
              <li>Concrete action steps you can use on Monday, not just ideas</li>
              <li>A repeatable way to bring God into strategy, hiring, budgets, and timing</li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ENDORSEMENTS */}
      <section className="section on-bone">
        <div className="container">
          <div className="sec-head">
            <Reveal><h2 className="h2 maxw-60">Endorsements.</h2></Reveal>
          </div>
          <Reveal className="qgrid c2 mt-4 draw" stagger={0.08}>
            {endorsements.map(e => (
              <div className="q" key={e.who}>
                <blockquote>{e.q}</blockquote>
                <div className="attr"><b>{e.who}</b><span>{e.role}</span></div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <CTA
        label="(→) Read it, then talk"
        title="God is ready to work with you."
        text="Pick up the book, or bring the decision in front of you to a call and we’ll apply the method to it directly."
      />
    </>
  )
}

// react-router lazy() route entry
export const Component = TheBook
