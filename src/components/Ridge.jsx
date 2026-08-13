import { useEffect, useState } from 'react'

// Hero backdrop: layered mountain silhouettes (elevation / perspective — the
// brand's core idea) under a subtle starfield. Calm and premium; no chart
// lines. Stars twinkle only when motion is allowed.
const MTN_BACK = 'M0,810 L0,566 L170,516 L330,580 L500,474 L680,566 L880,456 L1090,548 L1290,478 L1440,542 L1440,810 Z'
const MTN_MID = 'M0,810 L0,648 L230,598 L460,660 L690,586 L930,652 L1170,590 L1440,638 L1440,810 Z'
const MTN_FRONT = 'M0,810 L0,724 L300,688 L620,728 L920,684 L1200,722 L1440,700 L1440,810 Z'

const STARS = [
  { x: 120, y: 168, r: 2, d: 0, g: false }, { x: 300, y: 120, r: 1.4, d: 1.2, g: false },
  { x: 520, y: 200, r: 2.6, d: 0.5, g: true }, { x: 760, y: 148, r: 1.5, d: 2, g: false },
  { x: 980, y: 208, r: 1.9, d: 0.8, g: false }, { x: 1180, y: 138, r: 2.4, d: 1.6, g: true },
  { x: 1350, y: 198, r: 1.5, d: 0.3, g: false }, { x: 200, y: 322, r: 1.5, d: 1.9, g: false },
  { x: 640, y: 300, r: 2, d: 1.1, g: false }, { x: 1080, y: 330, r: 1.5, d: 2.4, g: false },
  { x: 1300, y: 296, r: 2.2, d: 0.6, g: true }, { x: 420, y: 402, r: 1.4, d: 1.4, g: false },
  { x: 880, y: 420, r: 1.9, d: 2.1, g: false }, { x: 1240, y: 440, r: 1.4, d: 0.9, g: false },
  { x: 60, y: 250, r: 1.5, d: 1.7, g: false }, { x: 700, y: 468, r: 1.4, d: 0.4, g: false },
]

export default function Ridge() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = requestAnimationFrame(() => setOn(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <svg className={`ridge ${on ? 'in' : ''}`} viewBox="0 0 1440 810"
      preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <g className="stars">
        {STARS.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} className={s.g ? 'g' : undefined}
            style={{ animationDelay: `${s.d}s` }} />
        ))}
      </g>
      <path className="mtn mtn-back" d={MTN_BACK} />
      <path className="mtn mtn-mid" d={MTN_MID} />
      <path className="mtn mtn-front" d={MTN_FRONT} />
    </svg>
  )
}
