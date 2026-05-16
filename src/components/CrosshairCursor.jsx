import { useEffect, useRef, memo } from 'react'
import { gsap } from 'gsap'
import styles from './CrosshairCursor.module.css'

const lerp = (a, b, n) => (1 - n) * a + n * b

const getMousePos = (e, container) => {
  if (container) {
    const bounds = container.getBoundingClientRect()
    return {
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top
    }
  }
  return { x: e.clientX, y: e.clientY }
}

const CrosshairCursor = memo(function CrosshairCursor({ color = '#0ae469', containerRef = null }) {
  const cursorRef = useRef(null)
  const lineHorizontalRef = useRef(null)
  const lineVerticalRef = useRef(null)
  const circleRef = useRef(null)
  const dotRef = useRef(null)
  const filterXRef = useRef(null)
  const filterYRef = useRef(null)

  const mouse = useRef({ x: 0, y: 0 })
  const circleScale = useRef({ val: 1 })

  useEffect(() => {
    const handleMouseMove = ev => {
      mouse.current = getMousePos(ev, containerRef?.current)
      
      // Set global mouse variables for other components to use
      document.documentElement.style.setProperty('--mouse-x', `${ev.clientX}px`)
      document.documentElement.style.setProperty('--mouse-y', `${ev.clientY}px`)

      if (containerRef?.current) {
        const bounds = containerRef.current.getBoundingClientRect()
        if (
          ev.clientX < bounds.left ||
          ev.clientX > bounds.right ||
          ev.clientY < bounds.top ||
          ev.clientY > bounds.bottom
        ) {
          gsap.to([lineHorizontalRef.current, lineVerticalRef.current, circleRef.current, dotRef.current], { opacity: 0 })
          gsap.to([lineHorizontalRef.current, lineVerticalRef.current], { opacity: 0.08 })
          gsap.to([circleRef.current, dotRef.current], { opacity: 1 })
        }
      }
    }

    const target = containerRef?.current || window
    target.addEventListener('mousemove', handleMouseMove)

    const renderedStyles = {
      tx: { previous: 0, current: 0, amt: 0.15 },
      ty: { previous: 0, current: 0, amt: 0.15 }
    }

    gsap.set([lineHorizontalRef.current, lineVerticalRef.current, circleRef.current, dotRef.current], { opacity: 0 })

    const onMouseMoveInitial = () => {
      renderedStyles.tx.previous = renderedStyles.tx.current = mouse.current.x
      renderedStyles.ty.previous = renderedStyles.ty.current = mouse.current.y

      gsap.to([lineHorizontalRef.current, lineVerticalRef.current], {
        duration: 0.9,
        ease: 'Power3.easeOut',
        opacity: 0.08
      })
      gsap.to([circleRef.current, dotRef.current], {
        duration: 0.9,
        ease: 'Power3.easeOut',
        opacity: 1
      })

      requestAnimationFrame(render)
      target.removeEventListener('mousemove', onMouseMoveInitial)
    }

    target.addEventListener('mousemove', onMouseMoveInitial)

    const primitiveValues = { turbulence: 0 }

    const tl = gsap
      .timeline({
        paused: true,
        onStart: () => {
          if (lineHorizontalRef.current && lineVerticalRef.current) {
            lineHorizontalRef.current.style.filter = `url(#filter-noise-x)`
            lineVerticalRef.current.style.filter = `url(#filter-noise-y)`
          }
        },
        onUpdate: () => {
          if (filterXRef.current && filterYRef.current) {
            filterXRef.current.setAttribute('baseFrequency', primitiveValues.turbulence)
            filterYRef.current.setAttribute('baseFrequency', primitiveValues.turbulence)
          }
        },
        onComplete: () => {
          if (lineHorizontalRef.current && lineVerticalRef.current) {
            lineHorizontalRef.current.style.filter = lineVerticalRef.current.style.filter = 'none'
          }
        }
      })
      .to(primitiveValues, {
        duration: 0.5,
        ease: 'power1',
        startAt: { turbulence: 1 },
        turbulence: 0
      })

    const enter = () => {
      tl.restart()
      gsap.to(circleRef.current, { scale: 2, duration: 0.4, ease: 'power2.out' })
      gsap.to(circleScale.current, { val: 2, duration: 0.4, ease: 'power2.out' })
    }
    const leave = () => {
      tl.progress(1).kill()
      gsap.to(circleRef.current, { scale: 1, duration: 0.4, ease: 'power2.out' })
      gsap.to(circleScale.current, { val: 1, duration: 0.4, ease: 'power2.out' })
    }

    const render = () => {
      renderedStyles.tx.current = mouse.current.x
      renderedStyles.ty.current = mouse.current.y

      for (const key in renderedStyles) {
        renderedStyles[key].previous = lerp(
          renderedStyles[key].previous,
          renderedStyles[key].current,
          renderedStyles[key].amt
        )
      }

      if (lineHorizontalRef.current && lineVerticalRef.current && circleRef.current && dotRef.current) {
        const x = renderedStyles.tx.previous
        const y = renderedStyles.ty.previous
        // Dot follows mouse IMMEDIATELY (no delay)
        gsap.set(dotRef.current, { x: mouse.current.x, y: mouse.current.y })
        
        // Lines and Circle follow with DELAY (lerp)
        gsap.set(lineVerticalRef.current, { x: x })
        gsap.set(lineHorizontalRef.current, { y: y })
        gsap.set(circleRef.current, { x: x, y: y })

        // MASK out the lines inside the circle (slightly larger radius for safety)
        const radius = 23 * circleScale.current.val
        const mask = `radial-gradient(circle ${radius}px at ${x}px ${y}px, transparent ${radius}px, black ${radius}px)`
        lineHorizontalRef.current.style.maskImage = mask
        lineHorizontalRef.current.style.WebkitMaskImage = mask
        lineVerticalRef.current.style.maskImage = mask
        lineVerticalRef.current.style.WebkitMaskImage = mask
      }

      requestAnimationFrame(render)
    }

    const interactiveElements = document.querySelectorAll('a, button, [role="button"]')

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', enter)
      el.addEventListener('mouseleave', leave)
    })

    return () => {
      target.removeEventListener('mousemove', handleMouseMove)
      target.removeEventListener('mousemove', onMouseMoveInitial)
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', enter)
        el.removeEventListener('mouseleave', leave)
      })
    }
  }, [containerRef, color])

  return (
    <div
      ref={cursorRef}
      className={styles.cursor}
      style={{
        position: containerRef ? 'absolute' : 'fixed'
      }}
    >
      <svg className={styles.svgHidden}>
        <defs>
          <filter id="filter-noise-x">
            <feTurbulence type="fractalNoise" baseFrequency="0.000001" numOctaves="1" ref={filterXRef} />
            <feDisplacementMap in="SourceGraphic" scale="40" />
          </filter>
          <filter id="filter-noise-y">
            <feTurbulence type="fractalNoise" baseFrequency="0.000001" numOctaves="1" ref={filterYRef} />
            <feDisplacementMap in="SourceGraphic" scale="40" />
          </filter>
          <filter id="lens-distortion">
            <feImage xlinkHref="data:image/svg+xml;charset=utf-8,%3Csvg%20width='100'%20height='100'%20viewBox='0%200%20100%20100'%20xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3CradialGradient%20id='g'%3E%3Cstop%20offset='0%25'%20stop-color='%23808080'/%3E%3Cstop%20offset='100%25'%20stop-color='%23000'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle%20cx='50'%20cy='50'%20r='50'%20fill='url(%23g)'/%3E%3C/svg%3E" result="map" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale="25" xChannelSelector="R" yChannelSelector="R" />
          </filter>
        </defs>
      </svg>
      
      {/* Horizontal Line - Delayed */}
      <div
        ref={lineHorizontalRef}
        className={styles.lineHorizontal}
      ></div>

      {/* Vertical Line - Delayed */}
      <div
        ref={lineVerticalRef}
        className={styles.lineVertical}
      ></div>

      <div
        ref={circleRef}
        className={styles.circle}
        style={{
          border: `1px solid rgba(10, 228, 105, 0.2)`, 
          boxShadow: `
            inset 0 0 15px rgba(255,255,255,0.05),
            0 0 20px rgba(10,228,105,0.1)
          `
        }}
      ></div>

      {/* Inner Dot - IMMEDIATE */}
      <div
        ref={dotRef}
        className={styles.dot}
        style={{
          background: color
        }}
      ></div>

    </div>
  )
})

export default CrosshairCursor
