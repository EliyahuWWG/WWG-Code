import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

// Thin clay progress bar along the top of the viewport.
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

function Layout() {
  const { pathname } = useLocation()
  useEffect(() => { document.documentElement.classList.add('smooth') }, [])
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
      { path: 'business', lazy: () => import('./pages/Business') },
      { path: 'working-with-god', lazy: () => import('./pages/WorkingWithGod') },
      { path: 'about', lazy: () => import('./pages/About') },
      { path: 'results', lazy: () => import('./pages/Results') },
      { path: 'book-a-call', lazy: () => import('./pages/BookCall') },
      { path: '*', lazy: () => import('./pages/Home') },
    ],
  },
]
