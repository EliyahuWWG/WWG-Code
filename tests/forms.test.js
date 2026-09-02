import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(__dirname, '..')
const read = p => readFileSync(resolve(root, p), 'utf8')

// Netlify registers a form at deploy time by crawling the built HTML for a
// <form data-netlify>. Our real forms are rendered by React and submitted with
// fetch, so a static copy of each lives in index.html purely to be found.
//
// The dangerous failure is asymmetric and silent: add a field to the React form,
// forget the static copy, and Netlify accepts the POST but drops the unknown
// field. Nobody notices until someone says they registered and never heard back.
// These tests make that impossible to ship.

function staticForms(html) {
  const out = {}
  for (const m of html.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/g)) {
    const attrs = m[1]
    if (!/data-netlify/.test(attrs)) continue
    const name = /name="([^"]+)"/.exec(attrs)?.[1]
    if (!name) continue
    const fields = new Set()
    for (const f of m[2].matchAll(/\bname="([^"]+)"/g)) fields.add(f[1])
    // Keep the first (hidden registration) copy of each form name.
    if (!out[name]) out[name] = fields
  }
  return out
}

// Field names the React component actually submits.
function reactFields(src) {
  const fields = new Set()
  for (const m of src.matchAll(/\bname="([^"]+)"/g)) fields.add(m[1])
  return fields
}

const components = {
  roundtable: 'src/components/forms/RoundtableForm.jsx',
  contact: 'src/components/forms/ContactForm.jsx',
  'dailyQuote': 'src/components/forms/QuoteSignup.jsx',
}

describe('Netlify form registration', () => {
  const registered = staticForms(read('index.html'))

  it('registers every form the site renders', () => {
    expect(Object.keys(registered).sort()).toEqual(Object.keys(components).sort())
  })

  for (const [formName, file] of Object.entries(components)) {
    it(`"${formName}" static copy covers every field the component sends`, () => {
      const sent = reactFields(read(file))
      const known = registered[formName]
      expect(known, `no static <form name="${formName}"> in index.html`).toBeTruthy()
      // form-name is the routing key, not a data field Netlify needs declared.
      // Skip two non-fields: `form-name` is the routing key, and the form
      // element's own name="<formName>" attribute is not an input.
      const missing = [...sent].filter(f => f !== 'form-name' && f !== formName && !known.has(f))
      expect(missing, `fields missing from the static copy in index.html: ${missing.join(', ')}`).toEqual([])
    })
  }

  it('every registered form keeps its honeypot', () => {
    for (const [name, fields] of Object.entries(registered)) {
      expect(fields.has('bot-field'), `${name} has no bot-field`).toBe(true)
    }
  })
})

describe('roundtable registration matches the form it replaces', () => {
  // Parity with https://workingwithgod.live/roundtable-reg, checked 29 Aug.
  const src = read('src/components/forms/RoundtableForm.jsx')
  // He sent his own registration form on 1 Sep with the name split in two.
  // Five fields now, and `name` must be gone entirely: leaving it behind would
  // mean the sheet quietly gained a column nothing ever fills.
  it('collects first name, last name, email, phone and organization', () => {
    for (const f of ['firstName', 'lastName', 'email', 'phone', 'org']) {
      expect(src).toContain(`name="${f}"`)
    }
    expect(src).not.toContain('name="name"')
  })
  // Was "SEND TO REGISTER", copied from his original form. He asked for plain
  // "REGISTER" once the form started appearing in a dialog, where "send"
  // described the wrong action.
  it('uses the register wording, not send', () => {
    expect(src).toContain('REGISTER')
    expect(src).not.toContain('SEND TO REGISTER')
  })
  it('requires email and organization, but not name or phone', () => {
    expect(src).toMatch(/email:\s*emailRule/)
    expect(src).toMatch(/org:\s*required/)
    expect(src).not.toMatch(/\bname:\s*required/)
  })
  // Phone was made optional on purpose. Guard both halves of that: the rule
  // must be the lenient one, and the field must not be marked required in the
  // markup, or the label and the validation would disagree.
  it('treats phone as optional', () => {
    expect(src).toMatch(/phoneOptional as phoneRule/)
    expect(src).not.toMatch(/name="phone"[^>]*\srequired/)
    expect(src).toContain('Mobile Phone (optional)')
  })
})

describe('contact form phone is optional too', () => {
  const src = read('src/components/forms/ContactForm.jsx')
  it('uses the lenient phone rule and does not mark the field required', () => {
    expect(src).toMatch(/phoneOptional as phoneRule/)
    expect(src).not.toMatch(/name="phone"[^>]*\srequired/)
    expect(src).toContain('Mobile Phone (optional)')
  })
  it('still requires name, email and message', () => {
    expect(src).toMatch(/name:\s*required/)
    expect(src).toMatch(/email:\s*emailRule/)
    expect(src).toMatch(/message:\s*required/)
  })
})
