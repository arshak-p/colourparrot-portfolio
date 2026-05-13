import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

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
      lenis.destroy()
      document.removeEventListener('click', handleHashClick)
    }
  }, [])

  return null
}
