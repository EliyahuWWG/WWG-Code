import { useEffect, useRef, useState } from 'react'

// Honest numbers only, each already appears in the site copy.
const STATS = [
  { to: 45, suffix: '+', label: 'Organizations served' }, { to: 130, suffix: '+', label: 'Countries reached by his research' }, { to: 25, suffix: '+', label: 'Leadership tools in the kit' },
]

// Static HTML ships the final values (SEO / no-JS); the count-up only runs
// once the strip scrolls into view, and not under prefers-reduced-motion.
export default function Stats() {
  const ref = useRef(null)
  const [run, setRun] = useState(false)
  const [vals, setVals] = useState(STATS.map(s => s.to))

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setRun(true); io.unobserve(el) }
    }, { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!run) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf
    const dur = 900
    const t0 = performance.now()
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setVals(STATS.map(s => Math.round(s.to * e)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run])

  return (
    <div className="stats" ref={ref}>
      {STATS.map((s, i) => (
        <div className="stat" key={s.label}>
          <div className="num">{vals[i]}<span className="sfx">{s.suffix}</span></div>
          <div className="label mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
