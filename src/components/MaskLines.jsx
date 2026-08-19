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
    const makeMask = () => {
      const w = document.createElement('span')
      w.className = 'mask-w'
      const i = document.createElement('span')
      i.className = 'mask-wi'
      w.appendChild(i)
      return { w, i }
    }
    Array.from(el.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const parts = node.textContent.split(/(\s+)/)
        const frag = document.createDocumentFragment()
        parts.forEach((p) => {
          if (!p) return
          if (/^\s+$/.test(p)) {
            frag.appendChild(document.createTextNode(' '))
          } else {
            const { w, i } = makeMask()
            i.appendChild(document.createTextNode(p))
            frag.appendChild(w)
          }
        })
        el.replaceChild(frag, node)
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
        // Swap the wrapper into the node's place first, then move the node
        // inside it, moving first would detach it and break replaceChild.
        const { w, i } = makeMask()
        el.replaceChild(w, node)
        i.appendChild(node)
      }
    })

    // Group words into visual lines by vertical position, stagger per line.
    // READ pass first, then WRITE pass. Interleaving them made every offsetTop
    // force a fresh style+layout: 13 forced reflows on the home H1 alone, all
    // inside the hydration commit, before first paint.
    const words = Array.from(el.querySelectorAll('.mask-w'))
    const offsets = words.map((w) => w.offsetTop)          // reads only
    const tops = []
    const lineOf = offsets.map((top) => {
      let line = tops.findIndex((t) => Math.abs(t - top) < 8)
      if (line === -1) { tops.push(top); line = tops.length - 1 }
      return line
    })
    words.forEach((w, i) => {                              // writes only
      w.firstChild.style.transitionDelay = `${lineOf[i] * stagger}s`
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
