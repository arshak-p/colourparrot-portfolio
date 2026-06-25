import { useEffect, useRef, memo } from 'react'
import styles from './Starfield.module.css'

export let setStarWarp = (intensity) => {}
export let setStarfieldPaused = (val) => {}

const Starfield = memo(function Starfield() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let W, H
    let scrollY = window.scrollY
    let lastScrollY = window.scrollY

    let mouseX = 0.5
    let mouseY = 0.5
    let targetMouseX = 0.5
    let targetMouseY = 0.5

    let warpIntensity = 0
    let targetWarpIntensity = 0
    setStarWarp = (val) => { targetWarpIntensity = val }

    let isPaused = false
    setStarfieldPaused = (val) => { isPaused = val }

    const stars = Array.from({ length: 300 }, () => {
      const r = Math.random() * 1.2 + 0.2;
      return {
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.00008, // Subtle continuous drift X
        vy: (Math.random() - 0.5) * 0.00008, // Subtle continuous drift Y
        r: r,
        baseR: r,
        a: Math.random(),
        da: Math.random() * 0.008 - 0.004,
        s: Math.random() * 0.5 + 0.1,
      };
    })

    const comets = Array.from({ length: 3 }, () => resetComet({}))

    function resetComet(c) {
      c.x = Math.random() * 1.2 - 0.1
      c.y = -0.1
      c.s = Math.random() * 0.003 + 0.001
      c.opacity = Math.random() * 0.5 + 0.2
      return c
    }

    const resize = () => {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }

    const handleScroll = () => {
      scrollY = window.scrollY
    }

    const handleMouseMove = (e) => {
      targetMouseX = e.clientX / window.innerWidth
      targetMouseY = e.clientY / window.innerHeight
    }
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    if (!isTouchDevice) {
      window.addEventListener('mousemove', handleMouseMove)
    }

    const draw = () => {
      // Only pause drawing if we are not actively warping
      if (isPaused && targetWarpIntensity === 0 && warpIntensity < 0.01) {
        animId = requestAnimationFrame(draw)
        return
      }
      ctx.clearRect(0, 0, W, H)
      
      const scrollDelta = scrollY - lastScrollY;
      lastScrollY = scrollY;
      
      warpIntensity += (targetWarpIntensity - warpIntensity) * 0.06

      mouseX += (targetMouseX - mouseX) * 0.05
      mouseY += (targetMouseY - mouseY) * 0.05

      stars.forEach((s) => {
        // Continuous drifting motion like Veldara
        s.x += s.vx;
        s.y += s.vy;

        // Hyperdrive motion tied directly to scroll movement
        if (warpIntensity > 0.001 && Math.abs(scrollDelta) > 0.1) {
          const dx = s.x - 0.5;
          const dy = s.y - 0.5;
          // scrollDelta is positive when scrolling down (forward), negative when up (backward)
          const speed = scrollDelta * 0.0015 * warpIntensity;
          s.x += dx * speed;
          s.y += dy * speed;
        }
        
        // Wrap around bounds (normalized coordinates 0 to 1)
        if (s.x < 0 || s.x > 1 || s.y < 0 || s.y > 1) {
          if (warpIntensity > 0.01) {
            // Respawn randomly across the screen to prevent center clumping
            s.x = Math.random();
            s.y = Math.random();
            s.a = 0; // fade in smoothly
          } else {
            // Normal wrap around when not warping
            if (s.x < 0) s.x += 1;
            if (s.x > 1) s.x -= 1;
            if (s.y < 0) s.y += 1;
            if (s.y > 1) s.y -= 1;
          }
        }

        s.a = Math.max(0.05, Math.min(1, s.a + s.da));
        if (s.a <= 0.05 || s.a >= 1) s.da *= -1;

        const parallaxOffset = scrollY * s.s * 0.4
        
        const mouseOffsetX = (mouseX - 0.5) * s.s * 80
        const mouseOffsetY = (mouseY - 0.5) * s.s * 80
        
        let drawX = ((s.x * W) + mouseOffsetX) % W
        if (drawX < 0) drawX += W
        
        let drawY = (s.y * H - parallaxOffset + mouseOffsetY) % H
        if (drawY < 0) drawY += H

        ctx.beginPath()
        ctx.arc(drawX, drawY, s.baseR, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${s.a})`
        ctx.fill()
      })

      comets.forEach((c) => {
        c.x -= c.s
        c.y += c.s
        if (c.y > 1.1 || c.x < -0.1) resetComet(c)

        const x1 = c.x * W
        const y1 = c.y * H
        const x2 = (c.x + c.s * 15) * W
        const y2 = (c.y - c.s * 15) * H

        const isInverted = document.body.classList.contains('inverted-theme')
        const cometColor = isInverted ? '255, 255, 255' : '10, 228, 105'

        const grad = ctx.createLinearGradient(x1, y1, x2, y2)
        grad.addColorStop(0, `rgba(${cometColor},${c.opacity})`)
        grad.addColorStop(1, `rgba(${cometColor},0)`)

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        ctx.stroke()
      })

      animId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', handleScroll, { passive: true })

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        animId = requestAnimationFrame(draw)
      } else {
        cancelAnimationFrame(animId)
      }
    })
    if (canvasRef.current) {
      observer.observe(canvasRef.current)
    }

    return () => {
      observer.disconnect()
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', handleScroll)
      if (!isTouchDevice) {
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      aria-hidden="true"
    />
  )
})

export default Starfield
