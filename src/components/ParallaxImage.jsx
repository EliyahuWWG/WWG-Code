import { useEffect, useRef } from 'react'

/**
 * Subtle hover parallax for a framed image. The frame stays put; the picture
 * drifts a few pixels against the cursor and settles back when the pointer
 * leaves. Scroll position is deliberately not involved: a scroll-driven
 * version moved the image whenever the page moved, which read as drift rather
 * than as a response to the visitor.
 *
 * Cost: one rAF while the pointer is actually inside the frame, and nothing
 * at all otherwise. transform only, so no layout and no paint.
 *
 * Skipped entirely for reduced-motion, coarse pointers (where there is no
 * hover to respond to) and narrow viewports.
 */
export default function ParallaxImage({ children, className = '', strength = 14, ...rest }) {
  const frameRef = useRef(null)

  useEffect(() => {
    const frame = frameRef.current
    if (!frame || typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const inner = frame.querySelector('img')
    if (!inner) return

    frame.classList.add('is-parallax')

    let raf = 0
    let tx = 0, ty = 0        // target
    let cx = 0, cy = 0        // current
    let scale = 1, targetScale = 1
    let running = false

    const render = () => {
      // Ease toward the target, and stop the loop once we are close enough
      // that another frame would not change a pixel.
      cx += (tx - cx) * 0.12
      cy += (ty - cy) * 0.12
      scale += (targetScale - scale) * 0.12
      inner.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`
      const settled = Math.abs(tx - cx) < 0.05 && Math.abs(ty - cy) < 0.05 && Math.abs(targetScale - scale) < 0.0005
      if (settled) { running = false; raf = 0; return }
      raf = requestAnimationFrame(render)
    }
    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(render) } }

    const onMove = (e) => {
      const r = frame.getBoundingClientRect()
      // -1..1 from the centre of the frame.
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1
      // Move against the cursor: the picture feels like it sits behind glass.
      tx = -nx * strength
      ty = -ny * strength
      targetScale = 1.06
      start()
    }
    const onLeave = () => { tx = 0; ty = 0; targetScale = 1; start() }

    frame.addEventListener('pointermove', onMove)
    frame.addEventListener('pointerleave', onLeave)

    return () => {
      frame.removeEventListener('pointermove', onMove)
      frame.removeEventListener('pointerleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
      frame.classList.remove('is-parallax')
      inner.style.transform = ''
    }
  }, [strength])

  return <div ref={frameRef} className={className} {...rest}>{children}</div>
}
