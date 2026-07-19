import { useEffect, useState } from 'react'

// Auto-rotating pullquote. All quotes ship in the DOM stacked in one grid
// cell (container sizes to the tallest — no layout shift on rotation).
// Pauses on hover/focus; never auto-advances under prefers-reduced-motion.
export default function QuoteRotator({ quotes, interval = 7000 }) {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const [auto, setAuto] = useState(false)

  useEffect(() => {
    setAuto(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    if (!auto || paused || quotes.length < 2) return
    const t = setInterval(() => setIdx(i => (i + 1) % quotes.length), interval)
    return () => clearInterval(t)
  }, [auto, paused, quotes.length, interval])

  return (
    <div
      className="pullquote qrot"
      style={{ borderTop: 0, paddingTop: 0 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="qrot-stack">
        {quotes.map((q, i) => (
          <div className={`qrot-item ${i === idx ? 'on' : ''}`} key={q.who} aria-hidden={i !== idx || undefined}>
            <blockquote>“{q.q}”</blockquote>
            <div className="attr">— <b>{q.who}</b>, {q.role}</div>
          </div>
        ))}
      </div>
      {quotes.length > 1 && (
        <div className="label qrot-ix">{String(idx + 1).padStart(2, '0')} / {String(quotes.length).padStart(2, '0')}</div>
      )}
    </div>
  )
}
