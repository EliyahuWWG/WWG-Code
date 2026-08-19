import { useEffect, useState } from 'react'
import { VIDEO_ID } from '../data'

// YouTube facade: shows the poster + a play button, and only loads the iframe
// on click. Keeps the heavy YouTube player off the critical path.
export default function VideoFacade({ id = VIDEO_ID, title = 'Working With God' }) {
  const [playing, setPlaying] = useState(false)
  // maxresdefault is 1280x720; hqdefault (480x360) is what looked pixelated on
  // a retina display. Not every upload has a maxres frame, so fall back.
  const maxres = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
  const hq = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
  const [poster, setPoster] = useState(maxres)

  // YouTube answers a missing maxresdefault with a 120x90 grey placeholder
  // rather than a 404, so probe the natural width and step down if needed.
  useEffect(() => {
    let live = true
    const probe = new Image()
    probe.onload = () => { if (live && probe.naturalWidth < 600) setPoster(hq) }
    probe.onerror = () => { if (live) setPoster(hq) }
    probe.src = maxres
    return () => { live = false }
  }, [maxres, hq])

  if (playing) {
    return (
      <div className="video">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <button className="video video-facade" onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
      style={{ backgroundImage: `url(${poster})` }}>
      <span className="video-play" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="26" height="26"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
      </span>
    </button>
  )
}
