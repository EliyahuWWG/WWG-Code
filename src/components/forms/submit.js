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
  const res = await fetch(url, {
    method: 'POST',
    body: fd,
    headers: ENDPOINT ? { Accept: 'application/json' } : undefined,
  })
  if (!res.ok) throw new Error(`Submit failed (${res.status})`)
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
