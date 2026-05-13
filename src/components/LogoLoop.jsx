import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function LogoLoop({ logos = [], reverse = false, speed = 40 }) {
  const containerRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    // Clone the logos twice for a total of 3 sets to ensure coverage
    // We'll use the scrollWidth of ONE set for the loop
    const children = Array.from(track.children)
    const singleSetCount = logos.length
    const singleSetWidth = children.slice(0, singleSetCount).reduce((acc, child) => {
      const style = window.getComputedStyle(child)
      return acc + child.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight)
    }, 0) + (parseFloat(window.getComputedStyle(track).gap) * (singleSetCount))

    const tl = gsap.to(track, {
      x: reverse ? `+=${singleSetWidth}` : `-=${singleSetWidth}`,
      duration: speed,
      ease: 'none',
      repeat: -1,
      onReverseComplete: () => {
        gsap.set(track, { x: 0 })
      }
    })

    return () => tl.kill()
  }, [logos, reverse, speed])

  const tripled = [...logos, ...logos, ...logos]

  return (
    <div ref={containerRef} style={{ overflow: 'hidden', padding: '3rem 0', width: '100%', position: 'relative' }}>
      <div 
        ref={trackRef} 
        style={{ 
          display: 'flex', 
          gap: '8rem', 
          width: 'max-content', 
          alignItems: 'center', 
          willChange: 'transform' 
        }}
      >
        {tripled.map((logo, i) => (
          <div 
            key={i} 
            style={{ 
              position: 'relative', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              filter: 'drop-shadow(0 0 10px rgba(10,228,105,0))',
              transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
            }}
            className="logo-item"
            onMouseEnter={e => {
              e.currentTarget.style.filter = 'drop-shadow(0 0 20px rgba(40,193,229,0.45))'
              e.currentTarget.style.transform = 'scale(1.15) translateY(-5px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.filter = 'drop-shadow(0 0 10px rgba(10,228,105,0))'
              e.currentTarget.style.transform = 'scale(1) translateY(0)'
            }}
          >
            <img 
              src={logo} 
              alt="Client Logo" 
              style={{ 
                height: 'clamp(80px, 12vh, 140px)', // Significantly bigger
                width: 'auto', 
                opacity: 0.65, 
                filter: 'grayscale(1) invert(1) brightness(1.2)',
              }} 
            />
          </div>
        ))}
      </div>
      
      {/* Galaxy Glow Overlay - Optional masking for depth */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(90deg, var(--dark) 0%, transparent 15%, transparent 85%, var(--dark) 100%)', zIndex: 2 }} />
    </div>
  )
}
