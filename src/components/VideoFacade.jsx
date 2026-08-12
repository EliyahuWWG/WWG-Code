import { useState } from 'react'
import { VIDEO_ID } from '../data'

// YouTube facade: shows the poster + a play button, and only loads the iframe
// on click. Keeps the heavy YouTube player off the critical path.
export default function VideoFacade({ id = VIDEO_ID, title = 'Working With God' }) {
  const [playing, setPlaying] = useState(false)
  const poster = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

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
