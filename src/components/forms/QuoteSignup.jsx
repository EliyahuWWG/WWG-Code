import { useRef, useState } from 'react'
import { EMAIL } from '../../data'
import { Field, Honeypot } from './Field'
import { useForm, email as emailRule } from './useForm'
import { submitForm } from './submit'

// Daily-quote email capture.
//
// `compact` is the footer version: email only, on one line, light-on-dark. The
// full card asks for a name too; in a footer that is one field too many for
// something someone signs up to in passing, and the name is not needed to send
// a daily line.
export default function QuoteSignup({ compact = false }) {
  const ref = useRef(null)
  const [state, setState] = useState('idle')
  const f = useForm({ name: '', email: '' }, { email: emailRule })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!f.validateAll()) return
    if (ref.current.querySelector('[name="bot-field"]').value) return
    setState('sending')
    try {
      await submitForm('dailyQuote', new FormData(ref.current))
      setState('success')
    } catch { setState('error') }
  }

  if (state === 'success') {
    return compact
      ? <p className="fq-done">You’re on the list. Watch for a short thought next workday morning.</p>
      : (
        <div className="form-done">
          <h3>You’re on the list.</h3>
          <p>Watch for a short thought next workday morning. You can unsubscribe anytime.</p>
        </div>
      )
  }

  if (compact) {
    return (
      <form ref={ref} className="fq-form" name="dailyQuote" method="POST" data-netlify="true"
        netlify-honeypot="bot-field" noValidate onSubmit={onSubmit}>
        <input type="hidden" name="form-name" value="dailyQuote" />
        <Honeypot />
        <div className="fq-row">
          <input
            type="email" name="email" autoComplete="email" placeholder="you@company.com"
            aria-label="Your email address"
            aria-invalid={f.touched.email && !!f.errors.email ? true : undefined}
            value={f.values.email} onChange={f.onChange} onBlur={f.onBlur} />
          <button className="btn btn-onink fq-btn" disabled={state === 'sending'}>
            {state === 'sending' ? 'Sending…' : 'Sign up'}
          </button>
        </div>
        {f.touched.email && f.errors.email && <span className="fq-err">{f.errors.email}</span>}
        {state === 'error' && (
          <span className="fq-err">Something went wrong. Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</span>
        )}
      </form>
    )
  }

  return (
    <div className="quote-card">
      <ul className="quote-perks">
        <li>One short, practical thought each workday morning</li>
        <li>Written by Eliyahu himself. No fluff, no daily sermon</li>
        <li>Occasional word about upcoming free events</li>
      </ul>
      <form ref={ref} className="form quote-form" name="dailyQuote" method="POST" data-netlify="true"
        netlify-honeypot="bot-field" noValidate onSubmit={onSubmit}>
        <input type="hidden" name="form-name" value="dailyQuote" />
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
