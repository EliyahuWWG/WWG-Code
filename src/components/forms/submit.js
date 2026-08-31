// Host-agnostic form submission.
//
// - If VITE_FORM_ENDPOINT is set (Formspree / Web3Forms), POST the FormData there.
// - Otherwise POST to "/" for Netlify Forms. For Netlify to accept these, a
//   static HTML copy of each form (matching `form-name` + field names) lives in
//   index.html so the build-time crawler registers it. See index.html.
//
// TODO(client): decide where submissions are delivered (see spec §14 Q2) and set
// VITE_FORM_ENDPOINT if not deploying to Netlify.
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || ''

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
