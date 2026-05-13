import { useEffect, useRef } from 'react'

export default function Starfield() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let W, H
    let scrollY = window.scrollY

    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.2 + 0.2,
      a: Math.random(),
      da: Math.random() * 0.008 - 0.004,
      s: Math.random() * 0.5 + 0.1,
    }))

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

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      
      stars.forEach((s) => {
        s.a = Math.max(0.05, Math.min(1, s.a + s.da))
        if (s.a <= 0.05 || s.a >= 1) s.da *= -1

        const parallaxOffset = scrollY * s.s * 0.4
        let drawY = (s.y * H - parallaxOffset) % H
        if (drawY < 0) drawY += H

        ctx.beginPath()
        ctx.arc(s.x * W, drawY, s.r, 0, Math.PI * 2)
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

        const grad = ctx.createLinearGradient(x1, y1, x2, y2)
        grad.addColorStop(0, `rgba(10,228,105,${c.opacity})`)
        grad.addColorStop(1, 'rgba(10,228,105,0)')

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
    draw()
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
