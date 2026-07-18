import { Children, cloneElement, isValidElement, useEffect, useRef, useState } from 'react'

// Scroll-triggered fade-up. With `stagger`, direct children animate in
// sequence instead of the wrapper (used for grids / index lists).
export default function Reveal({ children, as: Tag = 'div', className = '', delay = 0, stagger = 0, ...rest }) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.unobserve(el) }
    }, { threshold: 0.12 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // will-change only while animating: clear it once the transition settles.
  useEffect(() => {
    if (!seen || !ref.current) return
    const el = ref.current
    const count = stagger ? Children.count(children) : 1
    const settle = (delay + stagger * count) * 1000 + 900
    const t = setTimeout(() => {
      el.style.willChange = 'auto'
      el.querySelectorAll(':scope > *').forEach(c => { c.style.willChange = 'auto' })
    }, settle)
    return () => clearTimeout(t)
  }, [seen]) // eslint-disable-line react-hooks/exhaustive-deps

  if (stagger) {
    const kids = Children.map(children, (c, i) =>
      isValidElement(c)
        ? cloneElement(c, { style: { ...c.props.style, transitionDelay: `${delay + i * stagger}s` } })
        : c
    )
    return (
      <Tag ref={ref} className={`reveal-group ${seen ? 'in' : ''} ${className}`} {...rest}>
        {kids}
      </Tag>
    )
  }

  return (
    <Tag ref={ref} className={`reveal ${seen ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}s` }} {...rest}>
      {children}
    </Tag>
  )
}
