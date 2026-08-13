// Continuously-moving testimonial carousel. The track is duplicated for a
// seamless loop; it pauses on hover/focus and falls back to a static wrapped
// grid under prefers-reduced-motion. Edge fades keep the ends soft.
export default function TestimonialCarousel({ items, speed = 6 }) {
  const track = (hidden) => (
    <ul className="tcar-track" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <li className="tcar-card" key={`${t.who}-${i}`}>
          <blockquote>{t.q}</blockquote>
          <div className="tcar-attr">
            <b>{t.who}</b>
            <span>{t.role}</span>
          </div>
        </li>
      ))}
    </ul>
  )
  return (
    <div className="tcar" aria-label="What people say">
      <div className="tcar-inner" style={{ '--tcar-dur': `${Math.round(items.length * speed)}s` }}>
        {track(false)}
        {track(true)}
      </div>
    </div>
  )
}
