import { useEffect, useState } from 'react'

// The hero's mountain / line-chart scene (perspective, the brand's core idea).
// Two translucent mountain layers at the base, a gold and a blue "line chart"
// that draw themselves on load and sit in the lower third so they integrate
// with the content, plus glowing gold/blue nodes at the peaks. Static under
// prefers-reduced-motion. Purely decorative (aria-hidden).
// Scene routed to FILL the empty navy: line peaks rise into the gaps (far-left,
// the centre gap between heading and description, the top-right), while valleys
// tuck under the text columns so nothing is ever crossed. Layered mountains at
// the base. Coordinates tuned so peaks land in the empty zones.
const MTN_BACK = 'M0,810 L0,650 L260,614 L520,656 L790,606 L1050,652 L1310,610 L1440,632 L1440,810 Z'
const MTN_FRONT = 'M0,810 L0,714 L360,690 L720,716 L1080,688 L1440,702 L1440,810 Z'
const GOLD = '0,506 210,586 430,636 620,560 730,440 840,548 1020,636 1210,600 1440,548'
const BLUE = '0,612 230,664 450,700 640,632 780,560 900,662 1090,636 1260,516 1370,410 1440,300'

const NODES = [
  { x: 210, y: 586, c: 'gold', r: 5 }, { x: 730, y: 440, c: 'gold', r: 6 }, { x: 1210, y: 600, c: 'gold', r: 5 }, { x: 780, y: 560, c: 'blue', r: 4 }, { x: 1090, y: 636, c: 'blue', r: 5 }, { x: 1260, y: 516, c: 'blue', r: 5 }, { x: 1440, y: 300, c: 'cyan', r: 7 },
]

export default function Ridge() {
  const [draw, setDraw] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = requestAnimationFrame(() => setDraw(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <svg className={`ridge ${draw ? 'draw' : ''}`} viewBox="0 0 1440 810"
      preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="rg-mtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#16249c" stopOpacity="0.4" />
          <stop offset="1" stopColor="#02061f" stopOpacity="0" />
        </linearGradient>
        <filter id="rg-glow" x="-90%" y="-90%" width="280%" height="280%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      <path className="rg-mtn-back" d={MTN_BACK} />
      <path className="rg-mtn-front" d={MTN_FRONT} />

      <polyline className="rg-line rg-gold" points={GOLD} fill="none" />
      <polyline className="rg-line rg-blue" points={BLUE} fill="none" />

      {NODES.map((n, i) => (
        <g className="rg-node" key={i} style={{ animationDelay: `${1.05 + i * 0.09}s` }}>
          <circle cx={n.x} cy={n.y} r={n.r * 2} className={`rg-fill-${n.c}`} filter="url(#rg-glow)" opacity="0.4" />
          <circle cx={n.x} cy={n.y} r={n.r} className={`rg-fill-${n.c}`} />
        </g>
      ))}
    </svg>
  )
}
