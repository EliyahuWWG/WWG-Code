// Everything the site knows about turning a meeting date into words, in one
// place so the visible date, the fallback in src/data.js and the Event markup
// Google reads can never drift apart from each other.

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

const pad = n => String(n).padStart(2, '0')

/**
 * Accepts only a real calendar date written as YYYY-MM-DD, and returns null
 * for anything else - including dates that look fine but do not exist, like
 * 2026-02-31, which a naive parser happily turns into the 3rd of March.
 */
export function parseISODate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso == null ? '' : iso).trim())
  if (!m) return null
  const y = Number(m[1]), mo = Number(m[2]), d = Number(m[3])
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null
  const probe = new Date(Date.UTC(y, mo - 1, d))
  if (probe.getUTCFullYear() !== y || probe.getUTCMonth() !== mo - 1 || probe.getUTCDate() !== d) return null
  return { y, m: mo, d }
}

export function toISO(parts) {
  return `${parts.y}-${pad(parts.m)}-${pad(parts.d)}`
}

/**
 * "2026-10-21" becomes "October 21st".
 *
 * Built from the parts rather than from `new Date(iso).toLocaleDateString()`,
 * which reads a bare date as midnight UTC and therefore shows the previous day
 * to everyone west of Greenwich. A meeting date that is off by one in Virginia
 * is worse than no date at all, because nobody would think to check it.
 */
export function formatMeetingDate(iso) {
  const p = parseISODate(iso)
  return p ? `${MONTHS[p.m - 1]} ${p.d}${ordinal(p.d)}` : ''
}

export function ordinal(d) {
  const teens = d % 100
  if (teens >= 11 && teens <= 13) return 'th'
  return ['th', 'st', 'nd', 'rd'][d % 10] || 'th'
}

/** Today where the visitor is, as YYYY-MM-DD. */
export function todayISO(now = new Date()) {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

/** The day of the month the third Wednesday falls on. */
export function thirdWednesday(y, m) {
  const firstDay = new Date(Date.UTC(y, m - 1, 1)).getUTCDay() // 0 Sun ... 3 Wed
  return 1 + ((3 - firstDay + 7) % 7) + 14
}

/** The first third Wednesday that is today or later. */
export function thirdWednesdayOnOrAfter(iso) {
  const t = parseISODate(iso)
  if (!t) return ''
  let { y, m } = t
  let d = thirdWednesday(y, m)
  if (d < t.d) {
    m += 1
    if (m > 12) { m = 1; y += 1 }
    d = thirdWednesday(y, m)
  }
  return toISO({ y, m, d })
}

/**
 * The staleness guard.
 *
 * The meeting date is whatever Eliyahu last published. If he has not got to it
 * yet, the page would otherwise go on advertising a meeting that has already
 * happened - and the sponsor heading takes its month from the same value, so
 * the whole block would be a month behind. A date in the past is never right,
 * and the site states its own rule on four pages: third Wednesdays. So once
 * the stored date has passed, roll forward to the next third Wednesday.
 *
 * Only ever applied to a date that is already in the past, so a date he has
 * deliberately moved off the usual Wednesday is left exactly as he set it.
 */
export function ensureFutureISO(storedISO, today = todayISO()) {
  const stored = parseISODate(storedISO)
  const now = parseISODate(today)
  if (!stored || !now) return storedISO
  // ISO dates sort correctly as plain strings, which avoids a second timezone.
  if (toISO(stored) >= toISO(now)) return storedISO
  return thirdWednesdayOnOrAfter(today) || storedISO
}
