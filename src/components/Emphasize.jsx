/**
 * Bolds named phrases inside a plain string.
 *
 * The alternative was putting <b> tags into data.js and rendering with
 * dangerouslySetInnerHTML. This keeps the copy as plain text, so nothing in a
 * data file can ever inject markup, and a phrase that stops appearing in the
 * copy simply stops being bolded instead of leaving a stray tag behind.
 */
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export default function Emphasize({ text, terms }) {
  if (!terms || !terms.length) return text
  const rx = new RegExp(`(${terms.map(escape).join('|')})`, 'g')
  // split() with a capturing group keeps the matches, so the string is
  // reassembled in order with the matched parts wrapped.
  return text.split(rx).map((part, i) =>
    terms.includes(part) ? <b key={i}>{part}</b> : part
  )
}
