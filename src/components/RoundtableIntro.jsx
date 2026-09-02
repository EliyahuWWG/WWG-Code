import { Link } from 'react-router-dom'
import { roundtableIntro, roundtableMonth, NEXT_ROUNDTABLE } from '../data'

/**
 * The copy Eliyahu sent on 1 Sep, shown above the registration form in the
 * pop-up. Kept as its own component so the wording lives in one place and the
 * month heading follows NEXT_ROUNDTABLE rather than being typed in twice.
 */
export default function RoundtableIntro() {
  const month = roundtableMonth()
  const { when, where, overview, series } = roundtableIntro
  return (
    <div className="rt-intro">
      {month && <p className="rt-month">WWG Roundtable for {month}</p>}

      <dl className="rt-details">
        <dt>When</dt><dd>{when}</dd>
        <dt>Where</dt><dd>{where}</dd>
        <dt>Next Meeting</dt><dd>{NEXT_ROUNDTABLE}</dd>
      </dl>

      {overview.map(p => <p className="rt-p" key={p.slice(0, 24)}>{p}</p>)}

      <p className="rt-p">
        {series.lead}
        <Link className="tlink" style={{ display: 'inline' }} to={series.href}>{series.link}</Link>.
      </p>
    </div>
  )
}
