import { Link } from 'react-router-dom'
import { EMAIL, LINKEDIN, WWG } from '../data'
import { openCalendly } from './useCalendly'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="grid-f">
          <div>
            <Link to="/" className="wordmark"><span className="dot" />Reframed Reality</Link>
            <p className="fdesc">Organizational development, executive coaching, and faith-based leadership for the people who lead. Based in the Washington, DC area — serving clients nationally and internationally.</p>
          </div>
          <div>
            <h4>Explore</h4>
            <Link className="fl" to="/business">For Business</Link>
            <Link className="fl" to="/working-with-god">Working With God</Link>
            <Link className="fl" to="/about">About Eliyahu</Link>
            <Link className="fl" to="/results">Results</Link>
          </div>
          <div>
            <h4>Get in touch</h4>
            <Link className="fl" to="/book-a-call" onClick={openCalendly}>Book a discovery call</Link>
            <a className="fl" href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <a className="fl" href={LINKEDIN} target="_blank" rel="noopener">LinkedIn</a>
            <a className="fl" href={WWG} target="_blank" rel="noopener">workingwithgod.live</a>
          </div>
        </div>
        <div className="fbot">
          <span>© {new Date().getFullYear()} Reframed Reality, LLC</span>
          <span>Reston, Virginia · Washington, DC Metro</span>
        </div>
      </div>
    </footer>
  )
}
