// Labeled input / textarea with inline error text and aria wiring.
export function Field({ label, name, type = 'text', required, value, onChange, onBlur, error, touched, placeholder, autoComplete }) {
  const id = `f-${name}`
  const invalid = touched && !!error
  return (
    <div className="field">
      <label htmlFor={id}>{label} {required && <span className="req" aria-hidden="true">*</span>}</label>
      <input
        id={id} name={name} type={type} value={value} placeholder={placeholder}
        autoComplete={autoComplete}
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-err` : undefined}
        onChange={onChange} onBlur={onBlur}
      />
      {invalid && <span className="err" id={`${id}-err`}>{error}</span>}
    </div>
  )
}

export function TextArea({ label, name, required, value, onChange, onBlur, error, touched, placeholder, rows = 5 }) {
  const id = `f-${name}`
  const invalid = touched && !!error
  return (
    <div className="field">
      <label htmlFor={id}>{label} {required && <span className="req" aria-hidden="true">*</span>}</label>
      <textarea
        id={id} name={name} rows={rows} value={value} placeholder={placeholder}
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-err` : undefined}
        onChange={onChange} onBlur={onBlur}
      />
      {invalid && <span className="err" id={`${id}-err`}>{error}</span>}
    </div>
  )
}

// Off-screen honeypot. Bots fill it; humans never see it.
export function Honeypot() {
  return (
    <p className="hp" aria-hidden="true">
      <label>Don’t fill this out if you’re human: <input name="bot-field" tabIndex={-1} autoComplete="off" /></label>
    </p>
  )
}
