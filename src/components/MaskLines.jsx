import { useEffect, useLayoutEffect, useRef } from 'react'

// useLayoutEffect warns during static rendering; fall back to useEffect there.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

// Line-by-line mask reveal for hero headlines.
// The full text ships in the DOM (SEO / screen readers see the real markup).
// On mount we wrap words, group them into visual lines by offsetTop, stagger a
// clipped translateY reveal per line, then restore the original markup.
export default function MaskLines({ children, stagger = 0.06, duration = 0.7 }) {
  const ref = useRef(null)

  useIsoLayoutEffect(() => {
    const el = ref.current
    if (!el || typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const original = el.innerHTML

    // Wrap every word (and atomic inline elements like <span class="serif-it">)
    // in an overflow-hidden mask + inner slide span.
    const wrap = (node) => {
      const frag = document.createDocumentFragment()
      const w = document.createElement('span')
      w.className = 'mask-w'
      const i = document.createElement('span')
      i.className = 'mask-wi'
      i.appendChild(node)
      w.appendChild(i)
      frag.appendChild(w)
      return frag
    }
    Array.from(el.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const parts = node.textContent.split(/(\s+)/)
        const frag = document.createDocumentFragment()
        parts.forEach((p) => {
          if (!p) return
          if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(' '))
          else frag.appendChild(wrap(document.createTextNode(p)))
        })
        el.replaceChild(frag, node)
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
        el.replaceChild(wrap(node), node)
      }
    })

    // Group words into visual lines by vertical position, stagger per line.
    const words = Array.from(el.querySelectorAll('.mask-w'))
    const tops = []
    words.forEach((w) => {
      const top = w.offsetTop
      let line = tops.findIndex((t) => Math.abs(t - top) < 8)
      if (line === -1) { tops.push(top); line = tops.length - 1 }
      w.firstChild.style.transitionDelay = `${line * stagger}s`
      w.firstChild.style.transitionDuration = `${duration}s`
    })

    const raf = requestAnimationFrame(() => el.classList.add('in'))
    const total = (tops.length * stagger + duration) * 1000 + 150
    const timer = setTimeout(() => { el.innerHTML = original }, total)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
      el.classList.remove('in')
      el.innerHTML = original
    }
  }, [])

  return <span className="mask-lines" ref={ref}>{children}</span>
}
