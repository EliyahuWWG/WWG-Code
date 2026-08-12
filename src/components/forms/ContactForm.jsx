import { useRef, useState } from 'react'
import { EMAIL } from '../../data'
import { Field, TextArea, Honeypot } from './Field'
import { useForm, required, email as emailRule, phone as phoneRule } from './useForm'
import { submitForm } from './submit'

// Contact form (§5a-form / §7a). Mirrors his live form + an added Message field.
export default function ContactForm() {
  const ref = useRef(null)
  const [state, setState] = useState('idle')
  const f = useForm(
    { name: '', email: '', phone: '', message: '' },
    {
      name: required('Name'),
      email: emailRule,
      phone: phoneRule,
      message: required('Message'),
    },
  )

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!f.validateAll()) return
    if (ref.current.querySelector('[name="bot-field"]').value) return
    setState('sending')
    try {
      // FormData carries the text fields, the checkbox, and the optional file.
      await submitForm('contact', new FormData(ref.current))
      setState('success')
    } catch { setState('error') }
  }

  if (state === 'success') {
    return (
      <div className="form-done">
        <h3>Your message is on its way.</h3>
        <p>Thank you for reaching out. Eliyahu will get back to you personally.</p>
      </div>
    )
  }

  return (
    <form ref={ref} className="form" name="contact" method="POST" data-netlify="true"
      netlify-honeypot="bot-field" encType="multipart/form-data" noValidate onSubmit={onSubmit}>
      <input type="hidden" name="form-name" value="contact" />
      <Honeypot />
      <div className="form-row two">
        <Field label="Name" name="name" required autoComplete="name"
          value={f.values.name} onChange={f.onChange} onBlur={f.onBlur}
          error={f.errors.name} touched={f.touched.name} />
        <Field label="Email" name="email" type="email" required autoComplete="email"
          value={f.values.email} onChange={f.onChange} onBlur={f.onBlur}
          error={f.errors.email} touched={f.touched.email} />
      </div>
      <Field label="Mobile Phone" name="phone" type="tel" required autoComplete="tel"
        value={f.values.phone} onChange={f.onChange} onBlur={f.onBlur}
        error={f.errors.phone} touched={f.touched.phone} />
      <TextArea label="Message" name="message" required
        value={f.values.message} onChange={f.onChange} onBlur={f.onBlur}
        error={f.errors.message} touched={f.touched.message} />
      <div className="field">
        <label htmlFor="f-file">Attach files <span className="muted" style={{ textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
        <input id="f-file" name="attachment" type="file" />
      </div>
      <label className="field-check">
        <input type="checkbox" name="email-list" />
        <span>Sign up for the email list for event announcements and/or inspirational messages.</span>
      </label>
      <div>
        <button className="btn btn-solid btn-lg" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : 'Send'}
        </button>
      </div>
      {state === 'error' && (
        <p className="form-err">Something went wrong. Email Eliyahu directly at <a className="tlink" style={{ display: 'inline' }} href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>
      )}
    </form>
  )
}
