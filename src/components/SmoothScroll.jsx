import { useEffect, memo } from 'react'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)


export const lenis = typeof window !== 'undefined' ? new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
}) : null

const SmoothScroll = memo(function SmoothScroll() {
  useEffect(() => {
    if (!lenis) return

    if (!lenis) return

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)
    lenis.on('scroll', ScrollTrigger.update)

    const handleHashClick = (e) => {
      const link = e.target.closest('a')
      if (link && link.hash && link.origin === window.location.origin) {
        const target = document.querySelector(link.hash)
        if (target) {
          e.preventDefault()
          lenis.scrollTo(target)
        }
      }
    }
    document.addEventListener('click', handleHashClick)

    return () => {
      document.removeEventListener('click', handleHashClick)
      gsap.ticker.remove(lenis.raf)
      lenis.destroy()
    }

  }, [])

  return null
})

export default SmoothScroll
