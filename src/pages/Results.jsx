import Reveal from '../components/Reveal'
import CTA from '../components/CTA'
import MaskLines from '../components/MaskLines'
import Seo from '../components/Seo'
import { breadcrumbSchema } from '../seo/schema'
import { testimonials } from '../data'

export default function Results() {
  const feature = testimonials.find(t => t.feature)
  const rest = testimonials.filter(t => !t.feature)
  return (
    <>
      <Seo
        title="Client Results & Testimonials | Reframed Reality"
        description="What presidents, HR directors, deans, and VPs say about working with Dr. Eliyahu Lotzar — executive coaching, retreats, DiSC training, and organizational development across associations, government, and business."
        path="/results"
        schema={[breadcrumbSchema([{ name: 'Results', path: '/results' }])]}
      />
      <section className="phero">
        <div className="container">
          <div className="label"><span className="idx">(→)</span> &nbsp;Results</div>
          <h1 className="h1 mt-3 balance"><MaskLines>The work speaks. So do the people who’ve done it.</MaskLines></h1>
          <p className="lead">Presidents, HR directors, deans, and VPs across associations, government, and commercial ventures — in their own words.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="pullquote" style={{ marginBottom: 8 }}>
            <blockquote>“{feature.q}”</blockquote>
            <div className="attr">— <b>{feature.who}</b>, {feature.role}</div>
          </Reveal>
        </div>
        <div className="container">
          <Reveal className="qgrid c3 mt-4" stagger={0.07}>
            {rest.map(t => (
              <div className="q" key={t.who}>
                <blockquote>{t.q}</blockquote>
                <div className="attr"><b>{t.who}</b><span>{t.role}</span></div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <CTA label="(→) Your turn" title="Add your name to this list." text="Start with one honest conversation about the challenge you’re facing." />
    </>
  )
}

// react-router lazy() route entry
export const Component = Results
