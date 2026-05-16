import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import styles from './LogoLoop.module.css'

export default function LogoLoop({ logos = [], reverse = false, speed = 40 }) {
  const containerRef = useRef(null)
  const trackRef = useRef(null)
  const trackColorRef = useRef(null)
  const tlRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    const trackColor = trackColorRef.current
    if (!track || !trackColor) return

    const children = Array.from(track.children)
    const singleSetCount = logos.length
    const singleSetWidth = children.slice(0, singleSetCount).reduce((acc, child) => {
      const style = window.getComputedStyle(child)
      return acc + child.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight)
    }, 0) + (parseFloat(window.getComputedStyle(track).gap) * (singleSetCount))

    // Animate both tracks in sync
    const animation = {
      x: reverse ? `+=${singleSetWidth}` : `-=${singleSetWidth}`,
      duration: speed,
      ease: 'none',
      repeat: -1,
      onReverseComplete: () => {
        gsap.set([track, trackColor], { x: 0 })
      }
    }

    tlRef.current = gsap.to([track, trackColor], animation)

    return () => tlRef.current?.kill()
  }, [logos, reverse, speed])

  const handleMouseEnter = () => tlRef.current?.pause()
  const handleMouseLeave = () => tlRef.current?.play()

  // Track container position for the lens math
  useEffect(() => {
    const updateBounds = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        containerRef.current.style.setProperty('--container-left', `${rect.left}px`)
        containerRef.current.style.setProperty('--container-top', `${rect.top}px`)
      }
    }
    updateBounds()
    window.addEventListener('scroll', updateBounds)
    window.addEventListener('resize', updateBounds)
    return () => {
      window.removeEventListener('scroll', updateBounds)
      window.removeEventListener('resize', updateBounds)
    }
  }, [])

  const tripled = [...logos, ...logos, ...logos]

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Background Grayscale Track */}
      <div 
        ref={trackRef} 
        className={styles.track}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {tripled.map((logo, i) => (
          <div key={i} className={styles.logoItem}>
            <img src={logo} alt="Client Logo" className={styles.logoImgGray} />
          </div>
        ))}
      </div>

      {/* Foreground Color Lens Track */}
      <div className={styles.lens}>
        <div 
          ref={trackColorRef} 
          className={styles.track}
        >
          {tripled.map((logo, i) => (
            <div key={i} className={styles.logoItem}>
              <img src={logo} alt="Client Logo" className={styles.logoImgColor} />
            </div>
          ))}
        </div>
      </div>
      
      <div className={styles.overlay} />
    </div>
  )
}
