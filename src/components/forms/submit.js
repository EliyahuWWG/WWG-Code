// Form submission.
//
// The spreadsheet is the primary destination. The browser posts straight to the
// Google Apps Script web app and WAITS for its answer, so a failure is visible
// to the visitor in about two seconds — while they are still sitting in front
// of the form with their own data on screen. That is a stronger guarantee than
// anything downstream can offer.
//
// Why not Netlify's outgoing webhook, which is what this used to rely on: Apps
// Script answers every POST with a 302 redirect that cannot be switched off,
// Netlify counts a 302 as a failed delivery, and Netlify silently disables a
// webhook after a handful of failures. So that path died *while working*, with
// no alert and no delivery log. It is gone.
//
// Netlify Forms is kept as a second, parallel copy while we confirm the two
// agree (VITE_KEEP_NETLIFY_FORMS). It also serves as the fallback if the script
// is unreachable: a submission recorded in either place is not lost.
const SHEET_ENDPOINT = (import.meta.env.VITE_SHEET_ENDPOINT || '').trim()
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || ''
const KEEP_NETLIFY = String(import.meta.env.VITE_KEEP_NETLIFY_FORMS ?? 'true') !== 'false'

export async function submitForm(formName, data) {
  const fd = data instanceof FormData ? data : toFormData(data)
  fd.append('form-name', formName)

  // Minted once, before the first attempt, and reused by every retry below.
  // The script writes it to a hidden Ref column and ignores anything whose Ref
  // it already holds — so retrying is free of the risk of a double entry, and
  // that is what makes it safe to retry at all.
  const submissionId = makeId()
  fd.append('submissionId', submissionId)

  const fields = Object.fromEntries(stripEmptyFiles(fd).entries())

  // A third-party form backend, if one is ever configured, takes precedence
  // and is used on its own.
  if (ENDPOINT) {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      body: new URLSearchParams(fields),
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) throw new Error(`Submit failed (${res.status})`)
    return
  }

  const netlify = KEEP_NETLIFY ? postToNetlify(fields) : null

  if (SHEET_ENDPOINT) {
    const sheet = await postToSheet(fields)
    if (sheet.ok) {
      // Don't make the visitor wait on the shadow copy.
      netlify?.catch(() => {})
      return
    }
    // The script did not take it. Fall back to Netlify rather than telling
    // someone their registration failed when there is still a way to keep it.
    if (netlify && (await netlify.catch(() => false))) return
    throw new Error(sheet.error || 'Submit failed')
  }

  // No script endpoint configured — Netlify only.
  if (!(await (netlify ?? postToNetlify(fields)).catch(() => false))) {
    throw new Error('Submit failed')
  }
}

// JSON, sent as text/plain on purpose. That combination is still a CORS
// "simple" request, so the browser sends it without a preflight — which
// matters because Apps Script cannot answer a preflight. Anything that would
// trigger one (a JSON content type, a custom header) fails before it is sent.
async function postToSheet(fields, attempt = 0) {
  try {
    const res = await fetch(SHEET_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(fields),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      redirect: 'follow',
    })
    const body = await res.json().catch(() => null)
    if (res.ok && body && body.ok) return { ok: true, row: body.row }
    if (attempt === 0) return postToSheet(fields, 1)
    return { ok: false, error: (body && body.error) || `Sheet said ${res.status}` }
  } catch (err) {
    // Network-level failure, or a CORS policy that stopped us reading the
    // reply. Retry once: the first attempt may still have been recorded, and
    // the shared submissionId means a second one cannot duplicate it.
    if (attempt === 0) return postToSheet(fields, 1)
    return { ok: false, error: String(err) }
  }
}

// Netlify Forms wants a urlencoded POST to a path the build-time crawler has
// registered. Resolves true/false rather than throwing so a caller can treat
// it as one of two chances rather than an error.
async function postToNetlify(fields) {
  try {
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(fields),
    })
    return res.ok
  } catch {
    return false
  }
}

function makeId() {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  } catch { /* fall through */ }
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10)
}

// An untouched <input type="file"> still yields an empty File in the FormData,
// which URLSearchParams would stringify as "[object File]". Drop those.
function stripEmptyFiles(fd) {
  const out = new FormData()
  for (const [k, v] of fd.entries()) {
    if (typeof File !== 'undefined' && v instanceof File) continue
    out.append(k, v)
  }
  return out
}

function toFormData(obj) {
  const fd = new FormData()
  Object.keys(obj).forEach(k => {
    const v = obj[k]
    if (v == null) return
    fd.append(k, typeof v === 'boolean' ? (v ? 'yes' : 'no') : v)
  })
  return fd
}
