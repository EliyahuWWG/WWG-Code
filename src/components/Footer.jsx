import { Link } from 'react-router-dom'
import { CALENDLY, EMAIL, LINKEDIN, MEETUP, SERVICE_AREA } from '../data'
import { openCalendly, warmCalendly } from './useCalendly'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="grid-f">
          <div>
            <Link to="/" className="footer-brand" aria-label="Working With God, home">
              <img src="/wwg-logo.jpg" alt="Working With God" width="300" height="300" loading="lazy" decoding="async" />
            </Link>
            <p className="fdesc">Lead as the CHIEF’S Executive Officer, working with God, not just for Him. Faith-based leadership coaching, a two-day Master’s Class, and free community events. {SERVICE_AREA}.</p>
          </div>
          <div>
            <h2 className="fh">Explore</h2>
            <Link className="fl" to="/services">Services</Link>
            <Link className="fl" to="/events">Events</Link>
            <Link className="fl" to="/the-book">The Book</Link>
            <Link className="fl" to="/speaking">Speaking</Link>
            <Link className="fl" to="/blog">Writing</Link>
            <Link className="fl" to="/about">About Eliyahu</Link>
            <Link className="fl" to="/contact">Contact</Link>
          </div>
          <div>
            <h2 className="fh">Get in touch</h2>
            <a className="fl" href={CALENDLY} target="_blank" rel="noopener" onClick={openCalendly} onPointerEnter={warmCalendly} onFocus={warmCalendly}>Book a call</a>
            <a className="fl" href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <a className="fl" href={MEETUP} target="_blank" rel="noopener">Join on Meetup</a>
            <a className="fl" href={LINKEDIN} target="_blank" rel="noopener">LinkedIn</a>
          </div>
        </div>
        <div className="fbot">
          <span>© {new Date().getFullYear()} Working With God · Dr. Eliyahu Lotzar</span>
          <span>{SERVICE_AREA}</span>
        </div>
      </div>
    </footer>
  )
}
