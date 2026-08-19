import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Arrow from './components/Arrow'
import { CALENDLY } from './data'
import { openCalendly, warmCalendly } from './components/useCalendly'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      // Scroll to the #anchor once it exists (handles lazy-loaded routes):
      // retry across frames for up to ~1.2s before giving up.
      const id = hash.slice(1)
      let tries = 0
      let raf = 0
      const go = () => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        else if (tries++ < 72) raf = requestAnimationFrame(go)
      }
      raf = requestAnimationFrame(go)
      return () => cancelAnimationFrame(raf)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

// Thin gold progress bar along the top of the viewport.
function ScrollProgress() {
  const ref = useRef(null)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0
      if (ref.current) ref.current.style.transform = `scaleX(${p})`
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
  return <div className="scroll-progress" ref={ref} aria-hidden="true" />
}

// Slim bottom booking bar on small screens; hidden on the contact page,
// and only slides in once the visitor has scrolled past the hero.
function StickyCTA() {
  const { pathname } = useLocation()
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 560)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  if (pathname === '/contact') return null
  return (
    <div className={`sticky-cta ${show ? 'show' : ''}`}>
      <a href={CALENDLY} target="_blank" rel="noopener" onClick={openCalendly}
        onPointerEnter={warmCalendly} onFocus={warmCalendly} className="btn btn-onink">
        Book a call <Arrow />
      </a>
    </div>
  )
}

function Layout() {
  useEffect(() => { document.documentElement.classList.add('smooth') }, [])
  const { pathname } = useLocation()
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <ScrollToTop />
      <ScrollProgress />
      <Nav />
      <main id="main" tabIndex={-1}>
        {/* Keyed wrapper re-mounts on navigation → short fade + rise. */}
        <div className="route-fade" key={pathname}>
          <Outlet />
        </div>
      </main>
      <Footer />
      <StickyCTA />
    </>
  )
}

// Route records consumed by ViteReactSSG (build-time prerender + client router).
// Pages are lazy so each route ships as its own chunk.
export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, lazy: () => import('./pages/Home') },
      { path: 'services', lazy: () => import('./pages/Services') },
      { path: 'events', lazy: () => import('./pages/Events') },
      { path: 'roundtable', lazy: () => import('./pages/Roundtable') },
      { path: 'the-book', lazy: () => import('./pages/TheBook') },
      { path: 'about', lazy: () => import('./pages/About') },
      { path: 'contact', lazy: () => import('./pages/Contact') },
      // Prerendered so Netlify has a real 404.html to serve (see scripts/postbuild.mjs).
      { path: '404', lazy: () => import('./pages/NotFound') },
      { path: '*', lazy: () => import('./pages/NotFound') },
    ],
  },
]
