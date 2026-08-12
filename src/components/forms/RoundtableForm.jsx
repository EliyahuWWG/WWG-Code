import { useRef, useState } from 'react'
import { EMAIL } from '../../data'
import { Field, Honeypot } from './Field'
import { useForm, required, email as emailRule, phone as phoneRule } from './useForm'
import { submitForm } from './submit'

// Roundtable registration (§5d / §7b).
export default function RoundtableForm() {
  const ref = useRef(null)
  const [state, setState] = useState('idle')
  const f = useForm(
    { name: '', email: '', phone: '', org: '' },
    { email: emailRule, phone: phoneRule, org: required('Business / organization') },
  )

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!f.validateAll()) return
    if (ref.current.querySelector('[name="bot-field"]').value) return
    setState('sending')
    try {
      await submitForm('roundtable', new FormData(ref.current))
      setState('success')
    } catch { setState('error') }
  }

  if (state === 'success') {
    return (
      <div className="form-done">
        <h3>You’re registered.</h3>
        <p>You’ll get an email confirmation with meeting details and a calendar invite, usually within 24 hours.</p>
      </div>
    )
  }

  return (
    <form ref={ref} className="form" name="roundtable" method="POST" data-netlify="true"
      netlify-honeypot="bot-field" noValidate onSubmit={onSubmit}>
      <input type="hidden" name="form-name" value="roundtable" />
      <Honeypot />
      <div className="form-row two">
        <Field label="Name" name="name" autoComplete="name"
          value={f.values.name} onChange={f.onChange} onBlur={f.onBlur} />
        <Field label="Email" name="email" type="email" required autoComplete="email"
          value={f.values.email} onChange={f.onChange} onBlur={f.onBlur}
          error={f.errors.email} touched={f.touched.email} />
      </div>
      <div className="form-row two">
        <Field label="Mobile Phone" name="phone" type="tel" required autoComplete="tel"
          value={f.values.phone} onChange={f.onChange} onBlur={f.onBlur}
          error={f.errors.phone} touched={f.touched.phone} />
        <Field label="Name of Business / Organization" name="org" required autoComplete="organization"
          value={f.values.org} onChange={f.onChange} onBlur={f.onBlur}
          error={f.errors.org} touched={f.touched.org} />
      </div>
      <div>
        <button className="btn btn-solid btn-lg" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : 'SEND TO REGISTER'}
        </button>
      </div>
      {state === 'error' && (
        <p className="form-err">Something went wrong. Email Eliyahu directly at <a className="tlink" style={{ display: 'inline' }} href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>
      )}
    </form>
  )
}
