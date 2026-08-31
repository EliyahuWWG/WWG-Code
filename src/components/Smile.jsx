/**
 * A small drawn smile, in the brand gold.
 *
 * Deliberately an SVG and not the 🙂 emoji. An emoji renders in the OS font,
 * which means a different picture on every device, a colour palette nobody
 * chose, and a glyph sitting at a size and baseline that ignore the type it
 * sits in. This one inherits currentColor and the surrounding font size, so it
 * lines up with the sentence and stays on-brand.
 */
export default function Smile({ className = '', title = 'smile' }) {
  return (
    <svg className={`smile ${className}`} viewBox="0 0 24 24" role="img" aria-label={title}
      fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <circle cx="12" cy="12" r="9.1" />
      <path d="M8.2 14.1c.9 1.35 2.25 2.05 3.8 2.05s2.9-.7 3.8-2.05" />
      <path d="M9.1 9.6v.02" />
      <path d="M14.9 9.6v.02" />
    </svg>
  )
}
