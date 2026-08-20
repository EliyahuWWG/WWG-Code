import { useEffect, useRef, useState } from 'react'

/**
 * Physical rendering of the book, as progressive enhancement.
 *
 * The static <img> is what prerenders, what search engines index, and what
 * every visitor sees first. This only takes over when all of the following
 * hold, and it lazy-imports three.js (~190 KB gz) so nothing is paid for
 * unless it is actually used:
 *
 *   - the viewport is wide enough to be worth it
 *   - the element has scrolled into view
 *   - the user has not asked for reduced motion
 *   - the device is not reporting low memory
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
      try { THREE = await import('three') } catch { return }
      if (cancelled) return

      const W = host.clientWidth
      const H = host.clientHeight
      if (!W || !H) return

      let renderer
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
      } catch { return }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(W, H)
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.08
      // A real cast shadow, rather than a CSS blob behind the canvas. One
      // casting light at 1024 is plenty at this size.
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      renderer.domElement.setAttribute('aria-hidden', 'true')
      renderer.domElement.style.cssText = 'width:100%;height:100%;display:block'

      const scene = new THREE.Scene()
      // A longer lens from further back flattens the perspective the way a
      // product photograph does. A wide lens up close makes a book look like
      // a toy.
      const camera = new THREE.PerspectiveCamera(21, W / H, 0.1, 100)
      // Pulled back so the book still clears the frame at the extremes of
      // its rotation. It was being clipped at the bottom edge.
      camera.position.set(0, 0.02, 13.4)

      // ---------- Textures ----------
      const loader = new THREE.TextureLoader()
      const coverTex = await new Promise(res => loader.load(cover, res, undefined, () => res(null)))
      if (cancelled || !coverTex) { renderer.dispose(); return }
      coverTex.colorSpace = THREE.SRGBColorSpace
      coverTex.anisotropy = renderer.capabilities.getMaxAnisotropy()

      // Page block: fine alternating lines read as individual leaves; the
      // low-frequency waves stop it looking like a regular pattern.
      const pageCanvas = document.createElement('canvas')
      pageCanvas.width = 16; pageCanvas.height = 512
      const pctx = pageCanvas.getContext('2d')
      for (let y = 0; y < 512; y++) {
        const fine = (y % 2) * 8
        const wave = Math.sin(y * 0.35) * 5 + Math.sin(y * 0.07) * 7
        const v = 228 - fine + wave + (Math.random() * 5 - 2.5)
        pctx.fillStyle = `rgb(${v | 0},${(v - 7) | 0},${(v - 20) | 0})`
        pctx.fillRect(0, y, 16, 1)
      }
      const pageTex = new THREE.CanvasTexture(pageCanvas)
      pageTex.wrapS = pageTex.wrapT = THREE.RepeatWrapping
      pageTex.repeat.set(1, 2)
      pageTex.anisotropy = renderer.capabilities.getMaxAnisotropy()

      // ---------- Materials ----------
      // Matte laminate on the case, uncoated stock in the block.
      const navy      = new THREE.MeshStandardMaterial({ color: 0x0a1030, roughness: 0.56, metalness: 0.04 })
      const spineMat  = new THREE.MeshStandardMaterial({ color: 0x0c1338, roughness: 0.5,  metalness: 0.05 })
      const pages     = new THREE.MeshStandardMaterial({ map: pageTex, roughness: 0.95, metalness: 0 })
      const front     = new THREE.MeshStandardMaterial({ map: coverTex, roughness: 0.36, metalness: 0.07 })
      const back      = new THREE.MeshStandardMaterial({ color: 0x0d1533, roughness: 0.48, metalness: 0.05 })

      // ---------- Bodies ----------
      // A hardback is two things: a page block, and a case slightly larger
      // than it. That overhang is what reads as "book" instead of "textured
      // box".
      const BW = 2.72, BH = 4.06, BD = 0.52, LIP = 0.05

      // BoxGeometry face order: +x, -x, +y, -y, +z, -z
      const caseGeo = new THREE.BoxGeometry(BW, BH, BD)
      const caseMesh = new THREE.Mesh(caseGeo, [spineMat, spineMat, navy, navy, front, back])
      caseMesh.castShadow = true

      const blockGeo = new THREE.BoxGeometry(BW - LIP * 2, BH - LIP * 2, BD - 0.07)
      const block = new THREE.Mesh(blockGeo, [pages, spineMat, pages, pages, pages, pages])
      block.position.x = LIP * 0.7        // pushed toward the fore-edge, away from the spine
      block.castShadow = true

      const group = new THREE.Group()
      group.add(caseMesh, block)
      scene.add(group)

      // Catcher for the cast shadow. ShadowMaterial is transparent, so only
      // the shadow renders over the page background.
      const floorGeo = new THREE.PlaneGeometry(24, 24)
      // The page is light now, so the cast shadow reads much more strongly.
      const floorMat = new THREE.ShadowMaterial({ opacity: 0.28 })
      const floor = new THREE.Mesh(floorGeo, floorMat)
      floor.rotation.x = -Math.PI / 2
      floor.position.y = -BH / 2 - 0.44
      floor.receiveShadow = true
      scene.add(floor)

      // ---------- Light: one key that casts, a warm rim, a cool bounce ----------
      scene.add(new THREE.AmbientLight(0xbfd0ff, 0.48))

      const key = new THREE.DirectionalLight(0xffffff, 2.4)
      key.position.set(3.4, 5.6, 5.2)
      key.castShadow = true
      key.shadow.mapSize.set(1024, 1024)
      key.shadow.camera.near = 1
      key.shadow.camera.far = 24
      key.shadow.camera.left = -6; key.shadow.camera.right = 6
      key.shadow.camera.top = 6;   key.shadow.camera.bottom = -6
      key.shadow.radius = 5
      key.shadow.bias = -0.0015
      scene.add(key)

      const rim = new THREE.DirectionalLight(0xdcbb55, 1.6)   // brand gold
      rim.position.set(-4.4, 1.8, -2.6)
      scene.add(rim)

      const fill = new THREE.DirectionalLight(0x4a70ee, 0.75) // brand navy bounce
      fill.position.set(-2.6, -2.8, 3.2)
      scene.add(fill)

      host.querySelector('img')?.style.setProperty('opacity', '0')
      host.appendChild(renderer.domElement)
      if (!cancelled) setLive(true)

      // ---------- Motion ----------
      // Rest pose: turned a little off-axis so both the cover and the fore-edge
      // read at a glance. The pointer steers from there.
      const REST_Y = -0.40, REST_X = 0.06
      let targetX = 0, targetY = 0, targetZ = 0
      let curX = 0, curY = 0, curZ = 0
      let hover = 0, hoverTarget = 0

      const onPointer = (e) => {
        const r = host.getBoundingClientRect()
        const nx = ((e.clientX - r.left) / r.width) * 2 - 1
        const ny = ((e.clientY - r.top) / r.height) * 2 - 1
        targetY = nx * 0.62          // yaw follows the cursor across
        targetX = ny * 0.34          // pitch follows it down
        targetZ = -nx * 0.05         // a touch of roll, so it feels held not hinged
        hoverTarget = 1
      }
      const onLeave = () => { targetX = 0; targetY = 0; targetZ = 0; hoverTarget = 0 }
      host.addEventListener('pointermove', onPointer)
      host.addEventListener('pointerleave', onLeave)

      let raf = 0, t = 0, running = true
      const tick = () => {
        if (!running) return
        raf = requestAnimationFrame(tick)
        t += 0.006
        // Critically-damped-ish easing: quick to respond, no overshoot.
        curX += (targetX - curX) * 0.075
        curY += (targetY - curY) * 0.075
        curZ += (targetZ - curZ) * 0.075
        hover += (hoverTarget - hover) * 0.07

        // The idle drift fades out as the pointer takes over, so the two
        // motions never fight each other.
        const idle = 1 - hover
        group.rotation.x = REST_X + curX + Math.sin(t * 0.9) * 0.03 * idle
        group.rotation.y = REST_Y + curY + Math.sin(t * 0.6) * 0.06 * idle
        group.rotation.z = curZ
        group.position.y = Math.sin(t * 0.75) * 0.05 * idle
        // Leans toward the viewer on hover.
        group.position.z = hover * 0.34
        renderer.render(scene, camera)
      }
      tick()

      // Stop the loop entirely when off screen or the tab is hidden.
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
        caseGeo.dispose(); blockGeo.dispose(); floorGeo.dispose(); floorMat.dispose()
        coverTex.dispose(); pageTex.dispose()
        ;[navy, spineMat, pages, front, back].forEach(m => m.dispose())
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
