// Live site content, edited by Eliyahu rather than by us.
//
// WHY THIS EXISTS
//   The sponsor and the meeting date change most weeks. Changing them in the
//   code means a commit and a Netlify rebuild, and the plan allows 300 credits
//   a month while charging 15 per production deploy. Twenty deploys and every
//   site on the account is paused. Spending one of those on a name is a bad
//   trade, and it also means he waits for us.
//
// HOW IT WORKS
//   He edits at https://workingwithgod.sanity.studio and presses Publish. This
//   reads the published document straight from Sanity's CDN - a plain GET, no
//   token, no server of ours in the middle - and the page shows the new values
//   within about a minute. Nothing is rebuilt.
//
// HOW IT FAILS
//   Safely, and invisibly, in every direction. The values compiled into the
//   site are the fallback, so a slow response, an empty field, a document
//   someone deleted, or Sanity being down all leave the last deployed values
//   on the page. The fetch never blocks rendering: the prerendered HTML
//   already contains the fallback, and a live value replaces it a moment later
//   only if it differs.
import { useEffect, useState } from 'react'
import {
  SPONSOR_LINE, NEXT_ROUNDTABLE_ISO, NEXT_ROUNDTABLE, ROUNDTABLE_MEETING_TIME, SANITY,
  roundtableIntro, roundtableWhatHappens, roundtableWhoShouldAttend,
} from '../data'
import { parseISODate, formatMeetingDate, ensureFutureISO, todayISO } from './meetingDate'

const QUERY = '*[_id=="siteSettings"][0]{sponsorLine,nextRoundtable,roundtableTime,' +
  'roundtableWhere,roundtableOverview,whatHappens,whoShouldAttend,registrationNote}'
const ENDPOINT = SANITY.projectId
  ? `https://${SANITY.projectId}.apicdn.sanity.io/v${SANITY.apiVersion}` +
    `/data/query/${SANITY.dataset}?query=${encodeURIComponent(QUERY)}`
  : ''

const CACHE_KEY = 'wwg:content:v3'
const CACHE_MS = 5 * 60 * 1000
const TIMEOUT_MS = 5000

// What the page shows if nothing better arrives.
const BAKED_IN = {
  sponsorLine: SPONSOR_LINE,
  roundtable: {
    nextISO: NEXT_ROUNDTABLE_ISO || '',
    next: NEXT_ROUNDTABLE || '',
    time: ROUNDTABLE_MEETING_TIME || '',
    where: roundtableIntro.where || '',
    overview: roundtableIntro.overview || [],
    whatHappens: roundtableWhatHappens || [],
    whoShouldAttend: roundtableWhoShouldAttend || [],
    note: roundtableIntro.privacy || '',
  },
}

/**
 * Returns the current sponsor line and roundtable details, live where possible
 * and baked-in otherwise. Safe during prerendering: the first render is always
 * the baked-in values, so the generated HTML is complete on its own.
 */
export function useSiteContent() {
  const [content, setContent] = useState(BAKED_IN)

  useEffect(() => {
    let cancelled = false

    // Apply the staleness guard to the deployed values straight away, so a
    // date that has already passed is corrected even if the editor is
    // unreachable. Deliberately not done during the first render: the
    // prerendered HTML has to be the same every time it is built, and "today"
    // is not.
    setContent(merge(null))

    if (!ENDPOINT) return

    const cached = readCache()
    if (cached) { setContent(merge(cached)); return undefined }

    loadContent().then(live => {
      if (cancelled || !live) return
      writeCache(live)
      setContent(merge(live))
    })

    return () => { cancelled = true }
  }, [])

  return content
}

// --- the request ------------------------------------------------------------

// Two components on the Events page ask for this content, and they mount
// together. One shared promise means one request rather than two, and means
// they can never briefly disagree with each other. Cleared on failure so a
// later visit can try again; a success stays, backed by sessionStorage.
let inFlight = null

function loadContent() {
  if (inFlight) return inFlight
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  inFlight = fetch(ENDPOINT, { signal: controller.signal })
    .then(res => (res.ok ? res.json() : null))
    .then(body => (body && body.result) || null)
    .catch(() => { inFlight = null; return null })
    .finally(() => clearTimeout(timer))
  return inFlight
}

// --- shaping ---------------------------------------------------------------

// An empty field means "I have not filled this in", never "show nothing", so
// a half-finished edit can never wipe the sponsor off the page.
export function merge(live, today = todayISO()) {
  const out = {
    sponsorLine: BAKED_IN.sponsorLine,
    roundtable: { ...BAKED_IN.roundtable },
  }

  if (live && typeof live === 'object') {
    if (hasText(live.sponsorLine)) out.sponsorLine = live.sponsorLine

    if (parseISODate(live.nextRoundtable)) {
      out.roundtable.nextISO = String(live.nextRoundtable).trim()
    }

    text(live.roundtableTime, v => { out.roundtable.time = v })
    text(live.roundtableWhere, v => { out.roundtable.where = v })
    text(live.registrationNote, v => { out.roundtable.note = v })

    list(live.roundtableOverview, v => { out.roundtable.overview = v })
    list(live.whatHappens, v => { out.roundtable.whatHappens = v })
    list(live.whoShouldAttend, v => { out.roundtable.whoShouldAttend = v })
  }

  // Last, and after everything else, because the sponsor heading takes its
  // month from this date and the two have to agree.
  const effective = ensureFutureISO(out.roundtable.nextISO, today)
  out.roundtable.nextISO = effective
  out.roundtable.next = formatMeetingDate(effective) || BAKED_IN.roundtable.next

  return out
}

// A field that has been emptied, or filled with nothing but spaces, means
// "I have not written this yet" rather than "show nothing here", so it is
// left to the version that was deployed.
function text(value, apply) {
  const v = String(value == null ? '' : value).trim()
  if (v) apply(v)
}

// Same for a list, with the blank rows dropped: adding a row in the editor
// creates an empty one, so a list being edited would otherwise render a run of
// empty bullets on the live page between one keystroke and the next.
function list(value, apply) {
  if (!Array.isArray(value)) return
  const rows = value
    .map(v => String(v == null ? '' : v).trim())
    .filter(Boolean)
  if (rows.length) apply(rows)
}

// Rich text can be present and still be empty - an editor that has been
// clicked into and back out of leaves a block with one blank span, which would
// otherwise replace the real sponsor with nothing at all.
export function hasText(blocks) {
  return Array.isArray(blocks) && blocks.some(b =>
    b && Array.isArray(b.children) &&
    b.children.some(c => c && String(c.text == null ? '' : c.text).trim() !== ''))
}

// --- cache -----------------------------------------------------------------

function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { at, content } = JSON.parse(raw)
    if (!at || Date.now() - at > CACHE_MS) return null
    return content
  } catch { return null }
}

function writeCache(content) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), content }))
  } catch { /* private browsing, quota, or no storage at all - not important */ }
}
