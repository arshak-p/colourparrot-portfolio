import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
export function useGSAP(callback, deps = []) {
  const ctxRef = useRef(null)

  useEffect(() => {
    ctxRef.current = gsap.context(() => { callback() })
    return () => ctxRef.current?.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
