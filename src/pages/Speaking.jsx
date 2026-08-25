import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import CTA from '../components/CTA'
import Arrow from '../components/Arrow'
import BookCallLink from '../components/BookCallLink'
import Seo from '../components/Seo'
import { breadcrumbSchema } from '../seo/schema'
import { speakingTopics, speakingFormats, pastEvents, EMAIL } from '../data'

export default function Speaking() {
  return (
    <>
      <Seo
        title="Speaking: keynotes, workshops and panels | Dr. Eliyahu Lotzar"
        description="Dr. Eliyahu Lotzar speaks on faith and leadership: working with God rather than only for Him, the Ten Modes of Elevated Leadership, and organizational health for faith-led teams. Keynote, workshop, panel and in-house formats."
        path="/speaking"
        schema={[breadcrumbSchema([{ name: 'Speaking', path: '/speaking' }])]}
      />

      <section className="phero">
        <div className="container">
          <div className="eyebrow">Speaking</div>
          <h1 className="h1 mt-3 balance">Bring me in to talk to your people.</h1>
          <p className="lead">I speak to leadership teams, associations and conferences about what changes when you stop asking God to bless the plan and start asking what He wants to do through it. Rigorous, practical, and aimed at the decisions in the room.</p>
          <div className="row mt-3">
            <BookCallLink className="btn btn-onink btn-lg">Check my availability</BookCallLink>
            <a className="tlink" style={{ display: 'inline' }} href={`mailto:${EMAIL}?subject=Speaking%20enquiry`}>Or email me directly</a>
          </div>
        </div>
      </section>

      {/* WHAT I SPEAK ON */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <Reveal><h2 className="h2">What I speak on.</h2>
              <p className="mt-2 muted">Each of these adapts to your audience. Tell me who is in the room and what they are wrestling with, and I will shape it around that.</p></Reveal>
          </div>
          <Reveal className="ilist mt-4 draw" stagger={0.08}>
            {speakingTopics.map(t => (
              <div className="irow" key={t.n}>
                <div className="n">{t.n}</div>
                <h3>{t.t}</h3>
                <p>{t.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* FORMATS */}
      <section className="section on-bone">
        <div className="container">
          <div className="sec-head">
            <Reveal><h2 className="h2">Formats.</h2></Reveal>
          </div>
          <Reveal className="grid two mt-4" stagger={0.06}>
            {speakingFormats.map(f => (
              <div key={f.t} className="fmt">
                <h3 className="h3">{f.t}</h3>
                <p className="mt-2 muted">{f.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* WHERE I HAVE BEEN */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <Reveal><h2 className="h2">Recent rooms.</h2></Reveal>
          </div>
          <Reveal className="ilist mt-4">
            {pastEvents.map(e => (
              <div className="irow evrow" key={e.when + e.what}>
                <div className="n">{e.when}</div>
                <p>{e.what}</p>
              </div>
            ))}
          </Reveal>
          <Reveal className="mt-4">
            <p className="muted maxw-60">
              I also run a <Link className="tlink" style={{ display: 'inline' }} to="/events">free monthly Roundtable</Link> near Chantilly, Virginia, which is the easiest way to see how I work before you book me for anything.
            </p>
          </Reveal>
        </div>
      </section>

      <CTA label="(→) Speaking" title="Tell me about your event." text="Send me the audience, the date and what you want them to walk out with. If I am not the right speaker for it, I will say so and try to point you at someone who is." showRoundtable={false} />
    </>
  )
}

export const Component = Speaking
