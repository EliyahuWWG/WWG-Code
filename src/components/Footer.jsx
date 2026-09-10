import { Link } from 'react-router-dom'
import { CALENDLY, EMAIL, LINKEDIN, MEETUP, SERVICE_AREA } from '../data'
import { openCalendly, warmCalendly } from './useCalendly'
import QuoteSignup from './forms/QuoteSignup'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="grid-f">
          <div>
            <Link to="/" className="footer-brand" aria-label="Working With God, home">
              <img src="/wwg-logo.jpg" alt="Working With God" width="300" height="300" loading="lazy" decoding="async" />
            </Link>
            <p className="fdesc">Lead as the CHIEF’S Executive Officer, working with God, not just for Him. Faith-based professional coaching, a two-day Master’s Class, and free community events.</p>
          </div>
          <div>
            <h2 className="fh">Explore</h2>
            <Link className="fl" to="/services">Services</Link>
            <Link className="fl" to="/events">Events</Link>
            <Link className="fl" to="/the-book">The Book</Link>
            <Link className="fl" to="/speaking">Speaking</Link>
            {/* Writing hidden until the writing pages are reviewed. */}
            {/* <Link className="fl" to="/blog">Writing</Link> */}
            <Link className="fl" to="/about">About Eliyahu</Link>
          </div>
          <div>
            <h2 className="fh">Get in touch</h2>
            <a className="fl" href={CALENDLY} target="_blank" rel="noopener" onClick={openCalendly} onPointerEnter={warmCalendly} onFocus={warmCalendly}>Book a call</a>
            <a className="fl" href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <a className="fl" href={MEETUP} target="_blank" rel="noopener">Join on Meetup</a>
            <a className="fl" href={LINKEDIN} target="_blank" rel="noopener">LinkedIn</a>
            <Link className="fl" to="/contact">Contact</Link>
          </div>
        </div>
        {/* Moved out of the Contact page on 3 Sep. A whole section there asked a
            lot for an email list; in the footer it is on every page and costs
            nobody a scroll. */}
        <div className="footer-signup">
          <div className="fs-copy">
            <h2 className="fh">Inspirational Words</h2>
            <p>One short, practical thought each workday morning, written by Eliyahu. Unsubscribe anytime.</p>
          </div>
          <QuoteSignup compact />
        </div>

        <div className="fbot">
          <span>© {new Date().getFullYear()} Working With God · Dr. Eliyahu Lotzar</span>
          <span>{SERVICE_AREA}</span>
        </div>
      </div>
    </footer>
  )
}
