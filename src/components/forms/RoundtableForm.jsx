import { useRef, useState } from 'react'
import { EMAIL } from '../../data'
import { Field, Honeypot } from './Field'
import { useForm, required, email as emailRule, phoneOptional as phoneRule } from './useForm'
import { submitForm } from './submit'

// Roundtable registration (§5d / §7b).
export default function RoundtableForm() {
  const ref = useRef(null)
  const [state, setState] = useState('idle')
  // First and last are separate fields, matching the registration form he sent
  // on 1 Sep. Two columns beats one "Full name" box when the list is later used
  // to greet people by first name.
  const f = useForm(
    { firstName: '', lastName: '', email: '', phone: '', org: '' },
    {
      firstName: required('First name'),
      lastName: required('Last name'),
      email: emailRule,
      phone: phoneRule,          // optional on purpose; blank is a valid answer
      org: required('Business / organization'),
    },
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
        {/* NOTE: nothing automated sends this. Netlify emails Eliyahu on every
            submission; he sends the confirmation and calendar invite himself,
            exactly as he did on the old site. Wording matches his own promise
            on workingwithgod.live/roundtable-reg, including "business day",
            which does not over-promise across a weekend. If this ever becomes
            automated, that is a Netlify Function on submission-created. */}
        <p>You’ll get an email confirmation with meeting details and a calendar invite, typically within one business day.</p>
      </div>
    )
  }

  return (
    <form ref={ref} className="form" name="roundtable" method="POST" data-netlify="true"
      netlify-honeypot="bot-field" noValidate onSubmit={onSubmit}>
      <input type="hidden" name="form-name" value="roundtable" />
      <Honeypot />
      <div className="form-row two">
        <Field label="First Name" name="firstName" required autoComplete="given-name"
          value={f.values.firstName} onChange={f.onChange} onBlur={f.onBlur}
          error={f.errors.firstName} touched={f.touched.firstName} />
        <Field label="Last Name" name="lastName" required autoComplete="family-name"
          value={f.values.lastName} onChange={f.onChange} onBlur={f.onBlur}
          error={f.errors.lastName} touched={f.touched.lastName} />
      </div>
      <div className="form-row two">
        <Field label="Email" name="email" type="email" required autoComplete="email"
          value={f.values.email} onChange={f.onChange} onBlur={f.onBlur}
          error={f.errors.email} touched={f.touched.email} />
        <Field label="Mobile Phone (optional)" name="phone" type="tel" autoComplete="tel"
          value={f.values.phone} onChange={f.onChange} onBlur={f.onBlur}
          error={f.errors.phone} touched={f.touched.phone} />
      </div>
      <Field label="What is the name of your business or business you represent?" name="org" required
        autoComplete="organization"
        value={f.values.org} onChange={f.onChange} onBlur={f.onBlur}
        error={f.errors.org} touched={f.touched.org} />
      <div>
        <button className="btn btn-solid btn-lg" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : 'REGISTER'}
        </button>
      </div>
      {state === 'error' && (
        <p className="form-err">Something went wrong. Email Eliyahu directly at <a className="tlink" style={{ display: 'inline' }} href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>
      )}
    </form>
  )
}
