import { useRef, useState } from 'react'
import { EMAIL } from '../../data'
import { Field, Honeypot } from './Field'
import { useForm, email as emailRule } from './useForm'
import { submitForm } from './submit'

// Daily-quote email capture (Home + could be reused in footer).
export default function QuoteSignup() {
  const ref = useRef(null)
  const [state, setState] = useState('idle')
  const f = useForm({ name: '', email: '' }, { email: emailRule })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!f.validateAll()) return
    if (ref.current.querySelector('[name="bot-field"]').value) return
    setState('sending')
    try {
      await submitForm('quote-signup', new FormData(ref.current))
      setState('success')
    } catch { setState('error') }
  }

  if (state === 'success') {
    return (
      <div className="form-done">
        <h3>You’re on the list.</h3>
        <p>Watch for a short quote next workday morning. You can unsubscribe anytime.</p>
      </div>
    )
  }

  return (
    <div className="quote-card">
      <ul className="quote-perks">
        <li>One short, practical line each workday morning</li>
        <li>Written by Eliyahu — no fluff, no daily sermon</li>
        <li>Occasional word about upcoming free events</li>
      </ul>
      <form ref={ref} className="form quote-form" name="quote-signup" method="POST" data-netlify="true"
        netlify-honeypot="bot-field" noValidate onSubmit={onSubmit}>
        <input type="hidden" name="form-name" value="quote-signup" />
        <Honeypot />
        <Field label="Name" name="name" autoComplete="name"
          value={f.values.name} onChange={f.onChange} onBlur={f.onBlur} />
        <Field label="Email" name="email" type="email" required autoComplete="email"
          value={f.values.email} onChange={f.onChange} onBlur={f.onBlur}
          error={f.errors.email} touched={f.touched.email} />
        <button className="btn btn-solid btn-lg quote-submit" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : 'Get the daily quote'}
        </button>
        {state === 'error' && (
          <p className="form-err">Something went wrong. Email Eliyahu directly at <a className="tlink" style={{ display: 'inline' }} href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>
        )}
      </form>
    </div>
  )
}
