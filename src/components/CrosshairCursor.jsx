import { useEffect, useRef, memo } from 'react'
import { useLocation } from 'react-router-dom'
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
  const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches
  if (isTouchDevice) return null

  const { pathname } = useLocation()
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
      
      if (containerRef?.current) {
        const bounds = containerRef.current.getBoundingClientRect()
        if (
          ev.clientX < bounds.left ||
          ev.clientX > bounds.right ||
          ev.clientY < bounds.top ||
          ev.clientY > bounds.bottom
        ) {
          gsap.to([circleRef.current, dotRef.current], { opacity: 0 })
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

    const lastMouse = { x: 0, y: 0 }
    let currentSpeedScale = 1

    gsap.set([circleRef.current, dotRef.current], { opacity: 0 })

    const onMouseMoveInitial = () => {
      renderedStyles.tx.previous = renderedStyles.tx.current = mouse.current.x
      renderedStyles.ty.previous = renderedStyles.ty.current = mouse.current.y
      lastMouse.x = mouse.current.x
      lastMouse.y = mouse.current.y


      gsap.to([circleRef.current, dotRef.current], {
        duration: 0.9,
        ease: 'Power3.easeOut',
        opacity: 1
      })

      startRender()
      target.removeEventListener('mousemove', onMouseMoveInitial)
    }

    target.addEventListener('mousemove', onMouseMoveInitial)

    const primitiveValues = { turbulence: 0 }

    const tl = gsap
      .timeline({
        paused: true
      })
      .to(primitiveValues, {
        duration: 0.5,
        ease: 'power3.out',
        startAt: { turbulence: 1 },
        turbulence: 0
      })

    const enter = () => {
      tl.restart()
      gsap.to(circleScale.current, { val: 2, duration: 0.4, ease: 'power2.out' })
    }
    const leave = () => {
      tl.progress(1).kill()
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

      // Calculate mouse speed per frame
      const dx = mouse.current.x - lastMouse.x
      const dy = mouse.current.y - lastMouse.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      // Update lastMouse
      lastMouse.x = mouse.current.x
      lastMouse.y = mouse.current.y

      // Calculate target scale expansion based on speed (up to 2.2x scale increase when moving fast)
      const targetSpeedScale = 1 + Math.min(dist * 0.05, 1.2)
      
      // Smoothly interpolate the speed scale factor
      currentSpeedScale = lerp(currentSpeedScale, targetSpeedScale, 0.15)

      const dot = dotRef.current
      const circle = circleRef.current
      if (circle && dot) {
        const x = renderedStyles.tx.previous
        const y = renderedStyles.ty.previous
        
        // Use direct hardware-accelerated transforms to bypass GSAP overhead in requestAnimationFrame
        dot.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%)`
        circle.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${circleScale.current.val * currentSpeedScale})`
      }

      requestAnimationFrame(render)
    }

    let rafId
    const startRender = () => {
      rafId = requestAnimationFrame(render)
    }

    const getInteractiveEl = (el) => {
      if (!el || typeof el.closest !== 'function') return null
      
      let interactive = el.closest(
        'a, button, [role="button"], input[type="submit"], input[type="button"], select, textarea, [tabindex="0"], .interactive-hover, .glass-card, .ind-tag, .star-border-container'
      )
      
      if (!interactive) {
        let current = el
        while (current && current !== document.body && current.parentElement) {
          if (window.getComputedStyle(current).cursor === 'pointer') {
            interactive = current
            break
          }
          current = current.parentElement
        }
      }
      return interactive
    }

    let currentInteractive = null

    const handleMouseOver = (e) => {
      const interactive = getInteractiveEl(e.target)
      if (interactive) {
        if (interactive !== currentInteractive) {
          currentInteractive = interactive
          enter()
        }
      }
    }

    const handleMouseOut = (e) => {
      if (!currentInteractive) return

      if (!e.relatedTarget || !currentInteractive.contains(e.relatedTarget)) {
        const nextInteractive = getInteractiveEl(e.relatedTarget)
        if (nextInteractive) {
          if (nextInteractive !== currentInteractive) {
            currentInteractive = nextInteractive
          }
        } else {
          currentInteractive = null
          leave()
        }
      }
    }

    const delegationTarget = containerRef?.current || document
    delegationTarget.addEventListener('mouseover', handleMouseOver)
    delegationTarget.addEventListener('mouseout', handleMouseOut)

    return () => {
      cancelAnimationFrame(rafId)
      target.removeEventListener('mousemove', handleMouseMove)
      target.removeEventListener('mousemove', onMouseMoveInitial)
      delegationTarget.removeEventListener('mouseover', handleMouseOver)
      delegationTarget.removeEventListener('mouseout', handleMouseOut)
    }
  }, [containerRef, color, pathname])

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
