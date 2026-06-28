import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import GradientText from './GradientText'
import './Preloader.css'

export default function Preloader({ onComplete }) {
  const wrapRef = useRef(null)
  const onCompleteCb = useCallback(() => onComplete?.(), [onComplete])

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const ctx = gsap.context(() => {
      const master = gsap.timeline({
        onComplete: () => {
          // Exit animation: Split the curtains (which contain the text halves)
          gsap.to('.pre-curtain-top', { yPercent: -100, duration: 0.8, ease: 'power4.inOut' })
          gsap.to('.pre-curtain-bottom', { yPercent: 100, duration: 0.8, ease: 'power4.inOut', onComplete: () => {
            document.body.style.overflow = ''
            onCompleteCb()
          }})
        }
      })

      // 1. Content reveal
      master.fromTo('.preloader-inner', 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        0.3
      )

      // 2. Hold (reduced for speed)
      master.to({}, { duration: 0.8 })

    }, wrapRef)

    return () => ctx.revert()
  }, [onCompleteCb])

  return (
    <div ref={wrapRef} className="preloader">
      {/* Top Half */}
      <div className="pre-curtain pre-curtain-top">
        <div className="pre-content-wrapper pre-content-top">
          <div className="preloader-inner">
            <GradientText
              colors={['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#8b00ff']}
              animationSpeed={1.5}
              showBorder={false}
              className="pre-brand-text"
              yoyo={false}
            >
              COLOUR PARROT
            </GradientText>
          </div>
        </div>
      </div>

      {/* Bottom Half */}
      <div className="pre-curtain pre-curtain-bottom">
        <div className="pre-content-wrapper pre-content-bottom">
          <div className="preloader-inner">
            <GradientText
              colors={['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#8b00ff']}
              animationSpeed={1.5}
              showBorder={false}
              className="pre-brand-text"
              yoyo={false}
            >
              COLOUR PARROT
            </GradientText>
          </div>
        </div>
      </div>
    </div>
  )
}
