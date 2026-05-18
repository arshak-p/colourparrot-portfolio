import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '../hooks/useGSAP'
import styles from './ParallaxStrip.module.css'
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
    <div className={styles.container}>
      <div ref={bgRef} className={styles.parallaxBg} />
      <div className={styles.gradientOverlay} />
      <div className={styles.content}>
        <p className={styles.locationLabel}>
          Kozhikode · Kerala · India
        </p>
        <h2 className={styles.title}>
          Every great brand starts with a single{' '}
          <span className={styles.accent}>signal</span>.
        </h2>
      </div>
    </div>
  )
}
