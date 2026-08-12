import { useEffect, useRef, useState } from 'react'

// The signature moment: a mountain ridge line that draws itself once on load
// (stroke-dashoffset). Mountains = perspective, the theme of the whole brand.
// A back ridge (light navy) and a front ridge (gold), both low-opacity so the
// hero copy stays dominant. Static (no draw) under prefers-reduced-motion.
const BACK = 'M0,300 L120,238 L210,270 L330,150 L430,208 L560,92 L680,178 L820,58 L960,188 L1080,120 L1220,220 L1320,158 L1440,248'
const FRONT = 'M0,320 L160,292 L280,300 L400,250 L520,286 L640,230 L780,280 L900,242 L1040,290 L1180,256 L1300,296 L1440,270'

export default function Ridge() {
  const ref = useRef(null)
  const [draw, setDraw] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = requestAnimationFrame(() => setDraw(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <svg ref={ref} className={`ridge ${draw ? 'draw' : ''}`} viewBox="0 0 1440 320"
      preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path className="ridge-back" d={BACK} fill="none" />
      <path className="ridge-front" d={FRONT} fill="none" />
    </svg>
  )
}
