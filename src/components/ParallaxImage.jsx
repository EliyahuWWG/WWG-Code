import { useEffect, useRef } from 'react'

/**
 * Scroll parallax for a framed image: the frame stays put, the picture drifts
 * inside it. The image is rendered oversized so there is real material to
 * move without ever exposing an edge.
 *
 * Cost control, since this runs on scroll:
 *   - transform only, so no layout and no paint, just a compositor shift
 *   - the scroll listener is passive and coalesced into one rAF per frame
 *   - an IntersectionObserver detaches the listener entirely while the frame
 *     is off screen, so scrolling the rest of the page costs nothing
 *   - off under prefers-reduced-motion and on coarse pointers, where the
 *     effect reads as jitter rather than depth
 */
export default function ParallaxImage({
  children,
  className = '',
  amount = 0.10,          // fraction of frame height travelled across the viewport
  ...rest
}) {
  const frameRef = useRef(null)

  useEffect(() => {
    const frame = frameRef.current
    if (!frame || typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(min-width: 768px)').matches) return

    const inner = frame.querySelector('img')
    if (!inner) return

    frame.classList.add('is-parallax')

    let raf = 0
    let attached = false

    const update = () => {
      raf = 0
      const r = frame.getBoundingClientRect()
      const vh = window.innerHeight || 1
      // -1 when the frame is just below the fold, +1 when just above it.
      const progress = ((r.top + r.height / 2) / (vh + r.height)) * 2 - 1
      const shift = -progress * r.height * amount
      inner.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0) scale(${1 + amount * 2})`
    }

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }

    const attach = () => {
      if (attached) return
      attached = true
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll, { passive: true })
      update()
    }
    const detach = () => {
      if (!attached) return
      attached = false
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) { cancelAnimationFrame(raf); raf = 0 }
    }

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? attach() : detach()), { rootMargin: '120px' })
    io.observe(frame)

    return () => {
      io.disconnect()
      detach()
      frame.classList.remove('is-parallax')
      inner.style.transform = ''
    }
  }, [amount])

  return (
    <div ref={frameRef} className={className} {...rest}>
      {children}
    </div>
  )
}
