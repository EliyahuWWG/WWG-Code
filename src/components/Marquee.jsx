// Slow, seamless infinite marquee for organization names.
// The track is duplicated for the loop; the duplicate is aria-hidden.
// Under prefers-reduced-motion the CSS falls back to a static wrapped list.
export default function Marquee({ items, speed = 5, reverse = false, className = '' }) {
  const track = (hidden) => (
    <div className="mq-track" aria-hidden={hidden || undefined}>
      {items.map((o, i) => <span key={i}>{o}</span>)}
    </div>
  )
  return (
    <div className={`mq ${className}`}>
      <div
        className={`mq-inner ${reverse ? 'rev' : ''}`}
        style={{ '--mq-dur': `${Math.round(items.length * speed)}s` }}
      >
        {track(false)}
        {track(true)}
      </div>
    </div>
  )
}
