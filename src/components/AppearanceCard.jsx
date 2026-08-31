import { useEffect, useState } from 'react'
import Arrow from './Arrow'

/**
 * One appearance: a preview tile that plays in place where playback is real,
 * and an honest outbound link where it is not.
 *
 * The playable kinds follow the same facade rule as the hero video: nothing
 * from YouTube or Apple loads until someone actually asks for it. Four embeds
 * mounted eagerly on this page would cost more than the rest of the site put
 * together, for media most visitors will never press play on.
 */
export default function AppearanceCard({ item }) {
  const [playing, setPlaying] = useState(false)
  const playable = item.kind === 'youtube' || item.kind === 'apple'

  // YouTube publishes a maxres frame only for some uploads; fall back rather
  // than shipping their 120x90 grey placeholder stretched across a card.
  const maxres = item.id ? `https://i.ytimg.com/vi/${item.id}/maxresdefault.jpg` : null
  const [thumb, setThumb] = useState(maxres)
  useEffect(() => {
    if (!maxres) return
    let live = true
    const probe = new Image()
    probe.onload = () => { if (live && probe.naturalWidth < 600) setThumb(`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`) }
    probe.onerror = () => { if (live) setThumb(`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`) }
    probe.src = maxres
    return () => { live = false }
  }, [maxres, item.id])

  const meta = (
    <div className="appear-meta">
      <h3>{item.t}</h3>
      <p className="appear-where">
        {item.where}{item.note ? <span className="appear-note"> {item.note}</span> : null}
      </p>
    </div>
  )

  // ---- Not playable: a link, and it looks like one. No play button. ----
  if (!playable) {
    return (
      <a className="appear appear-link" href={item.href} target="_blank" rel="noopener">
        <div className="appear-stage appear-stage-plain">
          <span className="appear-wordmark" aria-hidden="true">{item.where}</span>
        </div>
        {meta}
        <span className="go">Listen on {item.where} <Arrow /></span>
      </a>
    )
  }

  // ---- Playing: the real embed, in the card, at the same aspect ratio. ----
  if (playing) {
    const src = item.kind === 'youtube'
      ? `https://www.youtube-nocookie.com/embed/${item.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
      : item.embed
    return (
      <div className="appear">
        <div className={`appear-stage ${item.kind === 'apple' ? 'appear-stage-audio' : ''}`}>
          <iframe
            src={src}
            title={item.t}
            loading="lazy"
            allow="autoplay; encrypted-media; clipboard-write; picture-in-picture"
            allowFullScreen
          />
        </div>
        {meta}
      </div>
    )
  }

  // ---- Facade: poster (or a designed stand-in) plus the play affordance. ----
  return (
    <div className="appear">
      <button
        className="appear-stage appear-facade"
        onClick={() => setPlaying(true)}
        aria-label={`Play: ${item.t}`}
        style={thumb ? { backgroundImage: `url(${thumb})` } : undefined}
      >
        {/* Apple gives us no artwork we can hotlink, so that card gets a
            designed ground rather than a broken image. */}
        {!thumb && <span className="appear-wordmark" aria-hidden="true">{item.where}</span>}
        <span className="video-play" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="24" height="24"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
        </span>
      </button>
      {meta}
    </div>
  )
}
