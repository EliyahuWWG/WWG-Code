// Host-agnostic form submission.
//
// - If VITE_FORM_ENDPOINT is set (Formspree / Web3Forms), POST the FormData
//   there instead of to Netlify.
// - Otherwise POST to "/" for Netlify Forms. For Netlify to accept these, a
//   static HTML copy of each form (matching `form-name` + field names) lives in
//   index.html so the build-time crawler registers it. See index.html.
//
// VITE_SHEET_ENDPOINT is separate and additive: the Google Apps Script address,
// key and all. When set, every submission is ALSO sent straight from the
// browser to the spreadsheet, which takes Netlify's outgoing webhook out of the
// chain. Worth doing, because that webhook is the one link here nobody can see
// working or failing: Netlify reports nothing about it, and Apps Script only
// logs a call it actually receives. Netlify Forms stays the record of truth
// either way, so if this second request fails the submission is still safe.
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || ''
const SHEET_ENDPOINT = (import.meta.env.VITE_SHEET_ENDPOINT || '').trim()

export async function submitForm(formName, data) {
  const fd = data instanceof FormData ? data : toFormData(data)
  fd.append('form-name', formName)

  const url = ENDPOINT || '/'

  // Netlify accepts both encodings, but urlencoded is the better-trodden path
  // for text-only forms: multipart bodies are what its parser handles least
  // predictably, and a submission that silently fails to register is the worst
  // possible failure here because nobody finds out until someone complains they
  // registered and never heard back. Only reach for multipart when the form
  // genuinely carries a file, since urlencoded cannot express one.
  const hasFile = [...fd.values()].some(v => typeof File !== 'undefined' && v instanceof File && v.size > 0)

  const res = await fetch(url, {
    method: 'POST',
    body: hasFile ? fd : new URLSearchParams(stripEmptyFiles(fd)),
    headers: ENDPOINT
      ? { Accept: 'application/json' }
      : (hasFile ? undefined : { 'Content-Type': 'application/x-www-form-urlencoded' }),
  })
  if (!res.ok) throw new Error(`Submit failed (${res.status})`)

  // Fire-and-forget. Deliberately not awaited and deliberately swallowed: the
  // person has already submitted successfully at this point, and a spreadsheet
  // that is briefly behind is not a reason to show them an error.
  if (SHEET_ENDPOINT && !ENDPOINT) sendToSheet(fd)
}

// `no-cors` because Apps Script publishes no CORS headers and redirects /exec
// to another host. We cannot read the reply, and do not need to. Keeping the
// body urlencoded makes this a "simple" request, so there is no preflight to be
// refused either.
function sendToSheet(fd) {
  try {
    fetch(SHEET_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      keepalive: true,          // survives the page navigating away
      body: new URLSearchParams(stripEmptyFiles(fd)),
    }).catch(() => {})
  } catch { /* never let this affect the visitor */ }
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
