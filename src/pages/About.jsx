import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import CTA from '../components/CTA'
import Arrow from '../components/Arrow'
import MaskLines from '../components/MaskLines'
import Marquee from '../components/Marquee'
import Seo from '../components/Seo'
import { personSchema, breadcrumbSchema } from '../seo/schema'
import { testimonials, orgsFull, RR_SITE } from '../data'

// Per Eliyahu 27 Aug: Arbinger added, Marquis Who's Who removed, Lead Well added.
const credentials = [
  'Author, Working With God: The Ten Modes of Elevated Leadership',
  'Founder of the organizational consultancy Reframed Reality',
  'Ed.D., Executive Leadership, St. John Fisher University',
  'MSW, The Hebrew University of Jerusalem',
  'Adizes, Arbinger, Everything DiSC® certifications',
  'Honors graduate, Lead Well (Every Nation)',
]

export default function About() {
  const says = testimonials.filter(t => !t.feature).slice(0, 3)
  return (
    <>
      <Seo
        title="About Dr. Eliyahu Lotzar, A Teacher of the Word in Business"
        description="Dr. Eliyahu Lotzar is an executive coach, group facilitator, and author who helps Christian leaders work with God, not just for Him, as the CHIEF’S Executive Officer. Ed.D., MSW, Adizes & DiSC certified."
        path="/about"
        type="profile"
        schema={[personSchema(), breadcrumbSchema([{ name: 'About', path: '/about' }])]}
      />

      <section className="phero">
        <div className="container">
          <div className="eyebrow">About</div>
          <h1 className="h1 mt-3 balance"><MaskLines>A teacher of the Word, in business.</MaskLines></h1>
          <p className="lead">I am an executive coach, organizational consultant, and process facilitator. And a bit of a teacher as I help leaders fulfill their higher calling to be the CHIEF’s Executive Officer.</p>
        </div>
      </section>

      {/* STORY */}
      <section className="section">
        <div className="container">
          <div className="person-grid">
            <Reveal className="portrait">
              <picture>
                <source srcSet="/eliyahu.webp" type="image/webp" />
                <img src="/eliyahu.jpg" alt="Dr. Eliyahu Lotzar" width="920" height="1227" loading="lazy" decoding="async" />
              </picture>
              <div className="cap"><b>Dr. Eliyahu Lotzar, Ed.D., MSW</b><span>Executive coach · facilitator · author</span></div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="h2 mt-2 maxw-60">It started when I was eight years old.</h2>
              <p className="mt-2 lead">When I was eight years old, in a “revelation” moment, the Ancient of Days gave me an out-of-the-box perspective. It has shown up as a knack for noticing the deep details of how people relate to themselves, each other, and to God. And it set me on a lifelong quest to help us live and lead from the largest perspective.</p>
              <p className="mt-2 muted maxw-60">That question, <span className="serif-it">how do we live and lead from the largest possible perspective?</span>, took me through clinical social work and student counseling, a stint in corporate America, two small businesses of my own, and a research project that has ended up in the hands of corporations, governments, educational institutions, and militaries in over 130 countries. I am the therapist who reads the room, the owner who has signed the front of a paycheck, and the scholar who studies what actually makes teams and organizations healthy.</p>
              <p className="mt-2 muted maxw-60">These days it all shows up in one place: helping leaders discern what God is actually asking of them, and then helping them do something about it. I coach owners, CEOs, EDs, solopreneurs, and managers wanting to level-up. I facilitate teams. I help people put the Ten Modes of Elevated Leadership method into practice so that faith and Tuesday afternoon can speak the same language.</p>
              <p className="mt-2 muted maxw-60">A few honest specifics, for the curious: I’m a DiSC D; an Adizes PaEI; my top Gallup strengths are Input, Strategic, Learner, Achiever, and Empathy; and, depending on the season and context, you’ll find either an ENTJ or an ISFP. I also apparently have a sparkling sense of humor, though it doesn’t show up in a website this earnest. I live in the rolling hills of northern Virginia with my wife, Shira, still curious, amazed, and endlessly grateful.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CREDENTIALS */}
      <section className="section on-bone">
        <div className="container">
          <div className="sec-head">
            <Reveal><h2 className="h2 maxw-60">A therapist, a business owner, and an academic, in one practice.</h2>
              <p className="mt-2 muted maxw-60">His doctoral research on organizational culture has been sought after in many countries. Years as a clinical therapist and small-business owner keep the coaching grounded in the real world, not the seminar room.</p></Reveal>
          </div>
          <Reveal className="stack-tight mt-4">
            {credentials.map(c => (
              <div key={c} style={{ borderBottom: '1px solid var(--line)', padding: '16px 0', display: 'flex', gap: 16 }}>
                <span style={{ color: 'var(--gold-600)' }} aria-hidden="true">·</span>
                <span>{c}</span>
              </div>
            ))}
          </Reveal>
          <p className="mt-3 muted maxw-60">
            Before Working With God, I built <a className="tlink" style={{ display: 'inline' }} href={RR_SITE} target="_blank" rel="noopener">Reframed Reality</a>, an organizational-development and executive-coaching practice serving commercial ventures, national associations, and not-for-profits. That work is the engine room behind the method: the same tools that turn around a stuck team now help leaders bring God into decisioning and implementing with the help of The Ten Modes.
          </p>
        </div>
      </section>

      {/* WHAT PEOPLE SAY */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <Reveal><h2 className="h2 maxw-60">Leaders I have worked with as a coach, trainer, or high-level consultant.</h2></Reveal>
          </div>
          <Reveal className="qgrid c3 mt-4 draw" stagger={0.08}>
            {says.map(t => (
              <div className="q" key={t.who}>
                <blockquote>{t.q}</blockquote>
                <div className="attr"><b>{t.who}</b><span>{t.role}</span></div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ORGS SERVED */}
      <section className="section on-bone">
        <div className="container">
          <div className="sec-head">
            <Reveal><h2 className="h2 maxw-60">Trusted across business, government, and the nonprofit worlds.</h2></Reveal>
          </div>
          <Reveal className="mt-4">
            <Marquee items={orgsFull.slice(0, Math.ceil(orgsFull.length / 2))} speed={6} />
            <Marquee items={orgsFull.slice(Math.ceil(orgsFull.length / 2))} speed={6} reverse className="mt-2" />
          </Reveal>
        </div>
      </section>

      <CTA />
    </>
  )
}

// react-router lazy() route entry
export const Component = About
