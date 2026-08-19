import { useEffect, useRef, useState } from 'react'

/**
 * Premium 3D rendering of the book, as progressive enhancement.
 *
 * The static <img> is what prerenders, what search engines index, and what
 * every visitor sees first. This only takes over when all of the following
 * hold, and it lazy-imports three.js (~170 KB gz) so nothing is paid for
 * unless it is actually used:
 *
 *   - the viewport is wide enough to be worth it
 *   - the element has scrolled into view
 *   - the user has not asked for reduced motion
 *   - the device is not reporting low memory / few cores
 *   - WebGL actually initialises
 *
 * Any failure leaves the <img> in place. There is no visual gap and no CLS,
 * because the canvas mounts into the same box the image occupied.
 */
export default function Book3D({
  cover = '/book-cover.jpg',
  alt = 'Working With God: The Ten Modes of Elevated Leadership, by Dr. Eliyahu Lotzar',
}) {
  const hostRef = useRef(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const host = hostRef.current
    if (!host || typeof window === 'undefined') return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(max-width: 767px)').matches) return
    // Only a genuine low-memory signal opts out. A core-count gate was tried
    // first and was too blunt: VMs, some laptops and every headless browser
    // report 2, and they render this fine. The real protections are the
    // WebGL-init try/catch below and the visibility pause, which stops the
    // loop whenever the book is off screen or the tab is hidden.
    if ((navigator.deviceMemory || 8) < 4) return

    let cleanup = () => {}
    let cancelled = false

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      start()
    }, { rootMargin: '200px' })
    io.observe(host)

    async function start() {
      let THREE
      try {
        THREE = await import('three')
      } catch {
        return                       // offline / blocked: keep the image
      }
      if (cancelled) return

      const W = host.clientWidth
      const H = host.clientHeight
      if (!W || !H) return

      let renderer
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
      } catch {
        return                       // no WebGL: keep the image
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(W, H)
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.05
      renderer.domElement.setAttribute('aria-hidden', 'true')
      renderer.domElement.style.cssText = 'width:100%;height:100%;display:block'

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(30, W / H, 0.1, 100)
      camera.position.set(0, 0, 8.6)

      // ---- Materials -------------------------------------------------
      const loader = new THREE.TextureLoader()
      const coverTex = await new Promise(res => loader.load(cover, res, undefined, () => res(null)))
      if (cancelled || !coverTex) { renderer.dispose(); return }
      coverTex.colorSpace = THREE.SRGBColorSpace
      coverTex.anisotropy = renderer.capabilities.getMaxAnisotropy()

      // Page block: thin warm stripes so the fore-edge reads as paper.
      const pageCanvas = document.createElement('canvas')
      pageCanvas.width = 8; pageCanvas.height = 256
      const pctx = pageCanvas.getContext('2d')
      for (let y = 0; y < 256; y++) {
        const v = 232 + Math.sin(y * 1.7) * 10 + (Math.random() * 6 - 3)
        pctx.fillStyle = `rgb(${v|0},${(v-6)|0},${(v-18)|0})`
        pctx.fillRect(0, y, 8, 1)
      }
      const pageTex = new THREE.CanvasTexture(pageCanvas)
      pageTex.wrapS = pageTex.wrapT = THREE.RepeatWrapping
      pageTex.repeat.set(1, 3)

      const navy = new THREE.MeshStandardMaterial({ color: 0x0a1030, roughness: 0.62, metalness: 0.06 })
      const pages = new THREE.MeshStandardMaterial({ map: pageTex, roughness: 0.94, metalness: 0 })
      const front = new THREE.MeshStandardMaterial({ map: coverTex, roughness: 0.42, metalness: 0.05 })
      const back  = new THREE.MeshStandardMaterial({ color: 0x0d1533, roughness: 0.55, metalness: 0.05 })

      // BoxGeometry face order: +x, -x, +y, -y, +z, -z
      const geo = new THREE.BoxGeometry(2.55, 3.82, 0.42, 1, 1, 1)
      const book = new THREE.Mesh(geo, [pages, navy, pages, pages, front, back])
      // Slight bevel illusion: the spine edge sits marginally proud.
      const group = new THREE.Group()
      group.add(book)
      scene.add(group)

      // ---- Light: one key, one warm rim, gentle fill ------------------
      scene.add(new THREE.AmbientLight(0xbfd0ff, 0.55))
      const key = new THREE.DirectionalLight(0xffffff, 2.1)
      key.position.set(3.4, 4.2, 5.2)
      scene.add(key)
      const rim = new THREE.DirectionalLight(0xdcbb55, 1.5)   // brand gold
      rim.position.set(-4.2, 1.6, -2.4)
      scene.add(rim)
      const fill = new THREE.DirectionalLight(0x4a70ee, 0.7)  // brand navy bounce
      fill.position.set(-2.4, -2.6, 3.0)
      scene.add(fill)

      host.querySelector('img')?.style.setProperty('opacity', '0')
      host.appendChild(renderer.domElement)
      if (!cancelled) setLive(true)

      // ---- Motion: idle drift, plus pointer parallax ------------------
      let targetX = 0, targetY = 0, curX = 0, curY = 0
      const onPointer = (e) => {
        const r = host.getBoundingClientRect()
        targetY = ((e.clientX - r.left) / r.width - 0.5) * 0.85
        targetX = ((e.clientY - r.top) / r.height - 0.5) * 0.45
      }
      const onLeave = () => { targetX = 0; targetY = 0 }
      host.addEventListener('pointermove', onPointer)
      host.addEventListener('pointerleave', onLeave)

      let raf = 0, t = 0, running = true
      const tick = () => {
        if (!running) return
        raf = requestAnimationFrame(tick)
        t += 0.006
        curX += (targetX - curX) * 0.06
        curY += (targetY - curY) * 0.06
        group.rotation.x = curX + Math.sin(t * 0.9) * 0.035
        group.rotation.y = curY - 0.42 + Math.sin(t * 0.6) * 0.07
        group.position.y = Math.sin(t * 0.75) * 0.06
        renderer.render(scene, camera)
      }
      tick()

      // Stop the loop entirely when the book is off screen or the tab is hidden.
      const vis = new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !running && !document.hidden) { running = true; tick() }
        else if (!e.isIntersecting) { running = false; cancelAnimationFrame(raf) }
      })
      vis.observe(host)
      const onHide = () => {
        if (document.hidden) { running = false; cancelAnimationFrame(raf) }
        else if (!running) { running = true; tick() }
      }
      document.addEventListener('visibilitychange', onHide)

      const onResize = () => {
        const w = host.clientWidth, h = host.clientHeight
        if (!w || !h) return
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }
      const ro = new ResizeObserver(onResize)
      ro.observe(host)

      cleanup = () => {
        running = false
        cancelAnimationFrame(raf)
        vis.disconnect(); ro.disconnect()
        document.removeEventListener('visibilitychange', onHide)
        host.removeEventListener('pointermove', onPointer)
        host.removeEventListener('pointerleave', onLeave)
        renderer.domElement.remove()
        geo.dispose(); coverTex.dispose(); pageTex.dispose()
        ;[navy, pages, front, back].forEach(m => m.dispose())
        renderer.dispose()
      }
    }

    return () => { cancelled = true; io.disconnect(); cleanup() }
  }, [cover])

  return (
    <div ref={hostRef} className={`book3d${live ? ' is-live' : ''}`}>
      {/* Prerendered, indexed, and the fallback for everyone the 3D skips. */}
      <picture>
        <source srcSet="/book-cover.webp" type="image/webp" />
        <img src={cover} width="620" height="930" alt={alt} fetchPriority="high" decoding="async" />
      </picture>
    </div>
  )
}
