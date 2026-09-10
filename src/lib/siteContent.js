// Live site content, edited in the spreadsheet rather than in the code.
//
// WHY THIS EXISTS
//   Changing the monthly sponsor used to mean editing src/data.js, committing,
//   and letting Netlify rebuild. Netlify's free plan allows 300 credits a month
//   and charges 15 of them per production deploy — twenty deploys and every
//   site on the account is paused. Spending one of those twenty on a name
//   change is a bad trade. Eliyahu now edits a cell in the "Site content" tab
//   of the same spreadsheet the form submissions land in, and the page picks it
//   up within five minutes. No commit, no rebuild, no credits.
//
// HOW IT FAILS
//   Safely, and invisibly. The values built into the site at deploy time are
//   the fallback, so if the script is slow, unreachable, or returns nonsense,
//   the page shows the last deployed sponsor instead of an empty space. The
//   fetch never blocks rendering: the prerendered HTML already contains the
//   fallback, and the live value replaces it a moment later if it differs.
import { useEffect, useState } from 'react'
import { SPONSOR, NEXT_ROUNDTABLE } from '../data'

const ENDPOINT = (import.meta.env.VITE_SHEET_ENDPOINT || '').trim()
const CACHE_KEY = 'wwg:content:v1'
const CACHE_MS = 5 * 60 * 1000
const TIMEOUT_MS = 4000

// What the page shows if nothing better arrives. Same shape as the live data.
const BAKED_IN = {
  sponsor: {
    name: SPONSOR.name || '',
    creds: SPONSOR.creds || '',
    role: SPONSOR.role || '',
    href: SPONSOR.href || '',
  },
  roundtable: { next: NEXT_ROUNDTABLE || '' },
}

/**
 * Returns the current sponsor and roundtable date, live where possible and
 * baked-in otherwise. Safe during prerendering: the first render is always the
 * baked-in values, so the generated HTML is complete and correct on its own.
 */
export function useSiteContent() {
  const [content, setContent] = useState(BAKED_IN)

  useEffect(() => {
    if (!ENDPOINT) return
    let cancelled = false

    const cached = readCache()
    if (cached) { setContent(merge(cached)); return }

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

    fetch(`${ENDPOINT}?what=content`, { signal: controller.signal, redirect: 'follow' })
      .then(res => (res.ok ? res.json() : null))
      .then(body => {
        if (cancelled || !body || !body.ok || !body.content) return
        writeCache(body.content)
        setContent(merge(body.content))
      })
      .catch(() => { /* keep the baked-in values; never surface this */ })
      .finally(() => clearTimeout(timer))

    return () => { cancelled = true; clearTimeout(timer); controller.abort() }
  }, [])

  return content
}

// A blank cell means "use what the site already had", not "show nothing" — so
// a half-filled row can never wipe the sponsor off the page.
function merge(live) {
  const out = { sponsor: { ...BAKED_IN.sponsor }, roundtable: { ...BAKED_IN.roundtable } }
  if (live.sponsor) {
    for (const k of Object.keys(out.sponsor)) {
      const v = String(live.sponsor[k] ?? '').trim()
      if (v) out.sponsor[k] = v
    }
    // A sponsor named in the sheet with no link should lose the old link
    // rather than inherit the previous sponsor's.
    if (String(live.sponsor.name ?? '').trim() &&
        String(live.sponsor.name).trim() !== BAKED_IN.sponsor.name) {
      for (const k of ['creds', 'role', 'href']) {
        out.sponsor[k] = String(live.sponsor[k] ?? '').trim()
      }
    }
  }
  const next = String(live.roundtable?.next ?? '').trim()
  if (next) out.roundtable.next = next
  return out
}

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
  } catch { /* private browsing, quota, or no storage at all — not important */ }
}
