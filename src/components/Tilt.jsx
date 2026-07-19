import { useEffect, useRef, useState } from 'react'

// Slight perspective tilt following the cursor. Mouse-only (pointer: fine),
// disabled under prefers-reduced-motion; renders children untouched otherwise.
export default function Tilt({ children, max = 4 }) {
  const ref = useRef(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    setOn(
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
  }, [])

  if (!on) return children

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${(x * max * 2).toFixed(2)}deg) rotateX(${(-y * max * 2).toFixed(2)}deg)`
  }
  const onLeave = () => { if (ref.current) ref.current.style.transform = '' }

  return (
    <div className="tilt" ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  )
}
