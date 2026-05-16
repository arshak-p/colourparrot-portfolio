import { useEffect, memo } from 'react'
import Lenis from '@studio-freight/lenis'

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

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Handle hash links
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
      // We don't destroy global lenis here to avoid breaking other components
      // but we remove the listener
      document.removeEventListener('click', handleHashClick)
    }
  }, [])

  return null
})

export default SmoothScroll
