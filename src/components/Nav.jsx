import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { openCalendly, warmCalendly } from './useCalendly'

const links = [
  { to: '/business', label: 'Business' },
  { to: '/working-with-god', label: 'Working With God' },
  { to: '/about', label: 'About' },
  { to: '/results', label: 'Results' },
]

export default function Nav() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; }, [open])

  return (
    <>
      <header className={`nav dark ${solid ? 'solid' : ''}`}>
        <div className="container nav-in">
          <Link to="/" className="wordmark"><span className="dot" />Reframed Reality</Link>
          <nav className="nav-links">
            {links.map(l => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => isActive ? 'active' : ''}>{l.label}</NavLink>
            ))}
          </nav>
          <div className="nav-right">
            <Link to="/book-a-call" onClick={openCalendly} onPointerEnter={warmCalendly} onFocus={warmCalendly}
              className={`btn ${solid ? 'btn-solid' : 'btn-line-lt'}`}>Book a call</Link>
            <button className="nav-burger" aria-label="Open menu" onClick={() => setOpen(true)}>
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      <div className={`menu ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div className="menu-top">
          <Link to="/" className="wordmark" style={{ color: 'var(--bone)' }} onClick={() => setOpen(false)}><span className="dot" />Reframed Reality</Link>
          <button className="menu-x" aria-label="Close menu" onClick={() => setOpen(false)}>✕</button>
        </div>
        <nav className="menu-links">
          {links.map((l, i) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>
              {l.label}<span className="n">{String(i + 1).padStart(2, '0')}</span>
            </Link>
          ))}
          <Link to="/book-a-call" onClick={() => setOpen(false)}>
            Book a call<span className="n">05</span>
          </Link>
        </nav>
      </div>
    </>
  )
}
