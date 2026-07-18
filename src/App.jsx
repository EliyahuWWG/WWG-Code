import { useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Business from './pages/Business'
import WorkingWithGod from './pages/WorkingWithGod'
import About from './pages/About'
import Results from './pages/Results'
import BookCall from './pages/BookCall'

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

export default function App() {
  const { pathname } = useLocation()
  useEffect(() => { document.documentElement.classList.add('smooth') }, [])
  return (
    <>
      <ScrollToTop />
      <ScrollProgress />
      <Nav />
      <main>
        {/* Keyed wrapper re-mounts on navigation → short fade + rise. */}
        <div className="route-fade" key={pathname}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/business" element={<Business />} />
            <Route path="/working-with-god" element={<WorkingWithGod />} />
            <Route path="/about" element={<About />} />
            <Route path="/results" element={<Results />} />
            <Route path="/book-a-call" element={<BookCall />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </>
  )
}
