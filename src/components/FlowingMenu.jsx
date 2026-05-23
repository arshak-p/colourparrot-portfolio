import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { Link } from 'react-router-dom'

/* ─────────────────────────────────────────────
   FlowingMenu — pure inline-styles, no Tailwind
   Matches react-bits FlowingMenu-JS logic exactly
───────────────────────────────────────────── */

function FlowingMenu({ items = [], speed = 18 }) {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <nav style={{ display: 'flex', flexDirection: 'column', height: '100%', margin: 0, padding: 0 }}>
        {items.map((item, idx) => (
          <MenuItem key={idx} {...item} speed={speed} isFirst={idx === 0} index={idx + 1} />
        ))}
      </nav>
    </div>
  )
}

function MenuItem({ link, text, image, accent, speed, isFirst, index }) {
  const itemRef       = useRef(null)
  const marqueeRef    = useRef(null)
  const marqueeInnerRef = useRef(null)
  const animationRef  = useRef(null)
  const [repetitions, setRepetitions] = useState(5)

  const animDefaults = { duration: 0.6, ease: 'expo.out' }

  const closestEdge = (mx, my, w, h) => {
    const top = (mx - w / 2) ** 2 + my ** 2
    const bot = (mx - w / 2) ** 2 + (my - h) ** 2
    return top < bot ? 'top' : 'bottom'
  }

  // Calculate how many repetitions fill the screen
  useEffect(() => {
    const calc = () => {
      if (!marqueeInnerRef.current) return
      const part = marqueeInnerRef.current.querySelector('.fm-part')
      if (!part) return
      const cw = part.offsetWidth
      if (!cw) return
      setRepetitions(Math.max(5, Math.ceil(window.innerWidth / cw) + 2))
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [text, image])

  // Horizontal marquee scroll animation
  useEffect(() => {
    const setup = () => {
      if (!marqueeInnerRef.current) return
      const part = marqueeInnerRef.current.querySelector('.fm-part')
      if (!part) return
      const cw = part.offsetWidth
      if (!cw) return
      animationRef.current?.kill()
      animationRef.current = gsap.fromTo(
        marqueeInnerRef.current,
        { x: 0 },
        { x: -cw, duration: speed, ease: 'none', repeat: -1 }
      )
    }
    const t = setTimeout(setup, 60)
    return () => {
      clearTimeout(t)
      animationRef.current?.kill()
    }
  }, [text, image, repetitions, speed])

  const onEnter = (ev) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return
    const r = itemRef.current.getBoundingClientRect()
    const e = closestEdge(ev.clientX - r.left, ev.clientY - r.top, r.width, r.height)
    gsap.timeline({ defaults: animDefaults })
      .set(marqueeRef.current,      { y: e === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { y: e === 'top' ? '101%'  : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0)
  }

  const onLeave = (ev) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return
    const r = itemRef.current.getBoundingClientRect()
    const e = closestEdge(ev.clientX - r.left, ev.clientY - r.top, r.width, r.height)
    gsap.timeline({ defaults: { duration: 0.55, ease: 'expo.inOut' } })
      .to(marqueeRef.current,      { y: e === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: e === 'top' ? '101%'  : '-101%' }, 0)
  }

  // Resolve CSS variable to its actual hex value for marquee background
  const accentMap = {
    'var(--green)':  '#0ae469',
    'var(--cyan)':   '#28c1e5',
    'var(--purple)': '#7a43ff',
    'var(--yellow)': '#f9cc3d',
    'var(--red)':    '#f45b42',
  }
  const accentHex = accentMap[accent] || accent

  return (
    <div
      ref={itemRef}
      style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
        borderBottom: '1px solid rgba(242,242,242,0.06)',
        display: 'flex',
      }}
    >
      {/* Main label link */}
      <Link
        to={link}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          height: '100%',
          textDecoration: 'none',
          textTransform: 'uppercase',
          fontFamily: 'ClashGrotesk, var(--font-primary)',
          fontWeight: 500,
          fontSize: 'clamp(2.2rem, 8vh, 5.2rem)',
          letterSpacing: '-0.04em',
          color: accent,
          position: 'relative',
          zIndex: 1,
          cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: '0.35em', fontWeight: 600, opacity: 0.5, letterSpacing: '0.05em' }}>
            {'0' + index}
          </span>
        {text}
      </Link>

      {/* Marquee overlay panel — slides in from top/bottom on hover */}
      <div
        ref={marqueeRef}
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          transform: 'translateY(101%)',
          zIndex: 2,
          backgroundColor: accentHex,
        }}
      >
        <div
          ref={marqueeInnerRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            width: 'fit-content',
            willChange: 'transform',
          }}
        >
          {Array.from({ length: repetitions }).map((_, i) => (
            <div
              key={i}
              className="fm-part"
              style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}
            >
              <span style={{
                whiteSpace: 'nowrap',
                textTransform: 'uppercase',
                fontFamily: 'ClashGrotesk, var(--font-primary)',
                fontWeight: 500,
                fontSize: 'clamp(1.8rem, 5.5vh, 3.8rem)',
                letterSpacing: '-0.04em',
                padding: '0 4vw',
                color: '#010d12',
              }}>
                {text}
              </span>
              <div style={{
                width: '14vh',
                height: '6vh',
                margin: '0 2.5vw',
                borderRadius: 100,
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.9,
                flexShrink: 0,
              }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FlowingMenu
