import { useEffect, useState } from 'react'
import { VIDEO_ID, HERO_BG_VIDEO } from '../data'

/**
 * Faint moving backdrop for the hero.
 *
 * Rules this has to respect, in priority order:
 *
 * 1. It must never touch the LCP. The H1 is the largest paint on this page and
 *    the hero is above the fold, so the backdrop mounts only AFTER the first
 *    frame has been painted. Until then the hero is exactly what it was: a
 *    navy gradient. Nothing here is on the critical path.
 * 2. It must degrade to a still. No file configured, reduced-motion, Save-Data,
 *    a 2G-ish connection, or a browser that refuses to autoplay all land on the
 *    poster frame instead. A still at the same opacity reads almost identically.
 * 3. It must not cost contrast. The clip sits under a navy scrim (see
 *    .hero-backdrop::after) so bone text keeps its ratio over the bright parts
 *    of the footage.
 */
export default function HeroBackdrop() {
  // Gate on mount, not on render, so SSG emits the still and the browser does
  // no video work during the first paint.
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  // Only fade the video in once it is genuinely playing, so a slow first frame
  // never shows as a dark rectangle over the still.
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const conn = navigator.connection || {}
    const netOk = !conn.saveData && !/2g/.test(conn.effectiveType || '')
    if (!HERO_BG_VIDEO || !motionOk || !netOk) return

    // Two frames after mount: the hero has painted, the main thread is free.
    const idle = window.requestIdleCallback || (cb => setTimeout(cb, 400))
    const handle = idle(() => setReady(true))
    return () => (window.cancelIdleCallback || clearTimeout)(handle)
  }, [])

  // Prefer the poster frame that comes off the backdrop clip itself. Falls back
  // to the YouTube thumbnail only if no backdrop is configured at all.
  const still = HERO_BG_VIDEO?.poster || `https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`

  return (
    <div className="hero-backdrop" data-video={playing ? 'on' : 'off'} aria-hidden="true">
      {/* Always rendered, so there is something behind the video while it
          buffers and something permanent if the video never arrives. */}
      <img className="hero-backdrop-still" src={still} alt="" loading="lazy" decoding="async" />

      {ready && !failed && (
        <video
          className="hero-backdrop-video"
          autoPlay muted loop playsInline
          preload="none"
          poster={still}
          onPlaying={() => setPlaying(true)}
          onError={() => setFailed(true)}
          tabIndex={-1}
        >
          {HERO_BG_VIDEO.webm && <source src={HERO_BG_VIDEO.webm} type="video/webm" />}
          {HERO_BG_VIDEO.mp4 && <source src={HERO_BG_VIDEO.mp4} type="video/mp4" />}
        </video>
      )}
    </div>
  )
}
