import { useEffect, memo } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export let lenis = null

const SmoothScroll = memo(function SmoothScroll() {
  const { pathname } = useLocation()

  // Track route changes to reset scroll position and recalculate page heights
  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
      // Delay slightly to let the DOM settle before measuring heights
      const timer = setTimeout(() => {
        lenis.resize()
        ScrollTrigger.refresh()
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [pathname])

  useEffect(() => {
    if (typeof window === 'undefined') return

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)

    // Instantiate Lenis inside useEffect to make sure DOM is loaded
    lenis = new Lenis({
      lerp: 0.1,           // Snappier response
      wheelMultiplier: 0.6, // Scroll speed
      smoothWheel: true,   // Enable for mouse wheel
      smoothTouch: false,  // Disable for mobile (use native momentum touch)
      infinite: false,
    })

    // Keep ScrollTrigger in sync with Lenis
    lenis.on('scroll', ScrollTrigger.update)

    // Use GSAP's ticker to drive Lenis raf loop
    const updateLenis = (time) => {
      if (lenis) {
        lenis.raf(time * 1000) // Convert time from seconds to milliseconds
      }
    }
    gsap.ticker.add(updateLenis)

    // Disable lag smoothing in GSAP to prevent jumping/stuttering
    gsap.ticker.lagSmoothing(0)

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

    // Force layout recalculation for GSAP
    ScrollTrigger.refresh()

    return () => {
      document.removeEventListener('click', handleHashClick)
      gsap.ticker.remove(updateLenis)
      if (lenis) {
        lenis.destroy()
        lenis = null
      }
    }
  }, [])

  return null
})

export default SmoothScroll
