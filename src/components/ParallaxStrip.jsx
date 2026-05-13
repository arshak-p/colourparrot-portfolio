import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '../hooks/useGSAP'

gsap.registerPlugin(ScrollTrigger)

export default function ParallaxStrip() {
  const bgRef = useRef(null)

  useGSAP(() => {
    gsap.to(bgRef.current, {
      backgroundPositionY: '30%',
      ease: 'none',
      scrollTrigger: {
        trigger: bgRef.current.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
  }, [])

  return (
    <div style={{ position: 'relative', minHeight: '45vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div ref={bgRef} style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg,#0ae469,#28c1e5,#7a43ff,#f45b42)',
        opacity: 0.1,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, var(--dark) 100%)',
      }} />
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '4rem 3rem' }}>
        <p style={{ fontSize: '0.62rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(242,242,242,0.35)', marginBottom: '1.2rem', fontWeight: 500 }}>
          Kozhikode · Kerala · India
        </p>
        <h2 style={{ fontSize: 'clamp(2rem,6vw,4.2rem)', fontWeight: 500, letterSpacing: '-0.04em', lineHeight: 1, maxWidth: 720 }}>
          Every great brand starts with a single{' '}
          <span style={{ color: 'var(--green)' }}>signal</span>.
        </h2>
      </div>
    </div>
  )
}
