import { useState } from 'react'

// Minimal form state + validation. Validators is a map of name → (value, all) =>
// error string ('' means valid). Validates on blur, and re-validates a touched
// field on change so errors clear as the user fixes them.
export function useForm(initial, validators = {}) {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const runField = (name, vals = values) => {
    const fn = validators[name]
    const msg = fn ? fn(vals[name], vals) : ''
    setErrors(e => ({ ...e, [name]: msg }))
    return !msg
  }

  const onChange = (e) => {
    const { name, type, checked, value } = e.target
    const v = type === 'checkbox' ? checked : value
    const next = { ...values, [name]: v }
    setValues(next)
    if (touched[name]) runField(name, next)
  }

  const onBlur = (e) => {
    const { name } = e.target
    setTouched(t => ({ ...t, [name]: true }))
    runField(name)
  }

  const validateAll = () => {
    const next = {}
    let ok = true
    Object.keys(validators).forEach(k => {
      const msg = validators[k](values[k], values)
      next[k] = msg
      if (msg) ok = false
    })
    setErrors(next)
    setTouched(Object.fromEntries(Object.keys(validators).map(k => [k, true])))
    return ok
  }

  return { values, errors, touched, onChange, onBlur, validateAll, setValues }
}

// --- reusable validators ---
export const required = (label) => (v) =>
  (v == null || String(v).trim() === '') ? `${label} is required.` : ''

export const email = (v) => {
  if (!v || String(v).trim() === '') return 'Email is required.'
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address.'
}

export const phone = (v) => {
  if (!v || String(v).trim() === '') return 'Mobile phone is required.'
  const digits = String(v).replace(/[^\d]/g, '')
  return digits.length >= 10 ? '' : 'Enter a valid phone number.'
}

// Phone, but blank is a valid answer. Format is still checked once something is
// typed, so a half-entered number is still caught.
export const phoneOptional = (v) => {
  if (!v || String(v).trim() === '') return ''
  const digits = String(v).replace(/[^\d]/g, '')
  return digits.length >= 10 ? '' : 'Enter a valid phone number, or leave it blank.'
}
