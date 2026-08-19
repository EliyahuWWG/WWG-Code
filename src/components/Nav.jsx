import { useEffect, useRef, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { CALENDLY } from '../data'
import { openCalendly, warmCalendly, trackBookCall } from './useCalendly'

const links = [
  { to: '/services', label: 'Services' },
  { to: '/events', label: 'Events' },
  { to: '/roundtable', label: 'Roundtable' },
  { to: '/the-book', label: 'The Book' },
  { to: '/about', label: 'About' },
  { to: '/#testimonials', label: 'Testimonials' },
  { to: '/contact', label: 'Contact' },
]

export default function Nav() {
  const [min, setMin] = useState(false)
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const burgerRef = useRef(null)

  // Full pill over the hero; once scrolled down it minimizes to just the
  // wordmark + Book a call, and expands back to full near the top.
  useEffect(() => {
    const onScroll = () => setMin(window.scrollY > 100)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Open menu: lock scroll, move focus in, trap Tab, close on Esc,
  // restore focus to the burger on close.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (!open) return
    const menu = menuRef.current
    menu.querySelector('.menu-x')?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') { setOpen(false); return }
      if (e.key !== 'Tab') return
      const items = Array.from(menu.querySelectorAll('a, button'))
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      burgerRef.current?.focus()
    }
  }, [open])

  return (
    <>
      <header className={`nav dark ${min ? 'min' : ''}`}>
        <div className="container nav-in">
          <Link to="/" className="brand" aria-label="Working With God — home"><img className="brand-mark" src="/wwg-mark-t.png" alt="Working With God" width="144" height="78" /></Link>
          <nav className="nav-links" aria-label="Primary">
            {links.map(l => (
              l.to.includes('#')
                ? <Link key={l.to} to={l.to}>{l.label}</Link>
                : <NavLink key={l.to} to={l.to} className={({ isActive }) => isActive ? 'active' : ''}>{l.label}</NavLink>
            ))}
          </nav>
          <div className="nav-right">
            <a href={CALENDLY} target="_blank" rel="noopener" onClick={openCalendly}
              onPointerEnter={warmCalendly} onFocus={warmCalendly}
              className="btn btn-onink">Book a call</a>
            <button ref={burgerRef} className="nav-burger" aria-label="Open menu" aria-expanded={open}
              aria-controls="site-menu" onClick={() => setOpen(true)}>
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      <div id="site-menu" ref={menuRef} className={`menu ${open ? 'open' : ''}`} role="dialog" aria-modal="true"
        aria-label="Site menu" aria-hidden={!open}>
        <div className="menu-top">
          <Link to="/" className="brand" onClick={() => setOpen(false)} aria-label="Working With God — home"><img className="brand-mark" src="/wwg-mark-t.png" alt="Working With God" width="144" height="78" /></Link>
          <button className="menu-x" aria-label="Close menu" onClick={() => setOpen(false)}>✕</button>
        </div>
        <nav className="menu-links" aria-label="Mobile">
          {links.map((l, i) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>
              {l.label}<span className="n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            </Link>
          ))}
          <a href={CALENDLY} target="_blank" rel="noopener" onClick={() => { setOpen(false); trackBookCall('mobile-menu') }}>
            Book a call<span className="n" aria-hidden="true">{String(links.length + 1).padStart(2, '0')}</span>
          </a>
        </nav>
      </div>
    </>
  )
}
