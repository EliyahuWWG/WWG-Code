import { Link } from 'react-router-dom'
import { roundtableIntro, roundtableMonth } from '../data'
import { useSiteContent } from '../lib/siteContent'

/**
 * The copy Eliyahu sent on 1 Sep, shown above the registration form in the
 * pop-up. Kept as its own component so the wording lives in one place.
 *
 * The meeting date comes from the "Site content" tab of the registrations
 * spreadsheet where one is reachable, and from NEXT_ROUNDTABLE in src/data.js
 * otherwise. Both the month in the heading and the When line follow it, so
 * next month is a cell edit rather than a commit and a deploy.
 */
export default function RoundtableIntro() {
  const { roundtable } = useSiteContent()
  const next = roundtable.next
  const month = roundtableMonth(next)
  const { where, time, overview, series } = roundtableIntro
  return (
    <div className="rt-intro">
      {/* The month is the one word he wants to jump out of this line. */}
      {month && <p className="rt-month">WWG Roundtable for <strong>{month}</strong></p>}

      {/* No "Next Meeting" row: When now carries the actual date, so a second
          line repeating it was telling them twice what they are registering
          for. Removed per his note of 18 Sep. */}
      <dl className="rt-details">
        <dt>When</dt><dd>{next}, {time}</dd>
        <dt>Where</dt><dd>{where}</dd>
      </dl>

      {overview.map(p => <p className="rt-p" key={p.slice(0, 24)}>{p}</p>)}

      <p className="rt-p">
        {series.lead}
        <Link className="tlink" style={{ display: 'inline' }} to={series.href}>{series.link}</Link>.
      </p>
    </div>
  )
}
