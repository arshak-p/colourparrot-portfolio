import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '../hooks/useGSAP'
import StarBorderBtn from './StarBorderBtn'

/**
 * HERO EXPERIMENT COMPONENT
 * 
 * Use this file to experiment with new Hero Section designs.
 * This will NOT affect the main HomePage.jsx unless you import and use it there.
 */

export default function HeroExperiment() {
  const sectionRef = useRef(null)
  
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
    tl.to('.exp-tag',      { opacity: 1, y: 0, duration: 0.8, delay: 0.3 })
      .to('.exp-word',     { y: '0%', duration: 1.2, stagger: 0.055 }, '-=0.45')
      .to('.exp-sub',      { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
      .to('.exp-btns',     { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
  }, [])

  return (
    <section 
      id="hero-experiment" 
      ref={sectionRef} 
      style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        padding: '0 5%', 
        position: 'relative', 
        overflow: 'hidden',
        background: '#010d12' // Dark space background for context
      }}
    >
      
      {/* Experiment Tag */}
      <p className="exp-tag" style={{ position: 'absolute', top: '12vh', left: '5%', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--green)', fontWeight: 500, opacity: 0, transform: 'translateY(12px)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span style={{ width: 22, height: 1, background: 'var(--green)', display: 'inline-block' }} />
        EXPERIMENT MODE · HERO SECTION
      </p>
      
      <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '5vh' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 10.5vw, 9rem)', fontWeight: 500, letterSpacing: '-0.06em', lineHeight: 0.85, marginBottom: '1.5rem', textTransform: 'none' }}>
          {[
            [{ text: 'New', cls: 'g' }, { text: ' Hero', cls: '' }],
            [{ text: 'Test ', cls: 'c' }, { text: 'Layout', cls: 'p' }],
            [{ text: 'Design', cls: 'y' }],
          ].map((line, li) => (
            <span key={li} style={{ overflow: 'hidden', display: 'block', paddingBottom: '0.15em', marginBottom: '-0.15em' }}>
              {line.map((w, wi) => (
                <span key={wi} className={`exp-word ${w.cls}`} style={{ display: 'inline-block', transform: 'translateY(110%)' }}>{w.text}</span>
              ))}
            </span>
          ))}
        </h1>
        
        <p className="exp-sub" style={{ maxWidth: 400, fontSize: '0.8rem', lineHeight: 1.6, color: 'rgba(242,242,242,0.3)', fontWeight: 400, opacity: 0, transform: 'translateY(12px)', marginBottom: '2.5rem' }}>
          Edit src/components/HeroExperiment.jsx to try out new animations, typography, or layouts without breaking the live home page.
        </p>
        
        <div className="exp-btns" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', opacity: 0, transform: 'translateY(12px)', alignItems: 'center' }}>
          <StarBorderBtn>Primary Action</StarBorderBtn>
          <StarBorderBtn>Secondary Action</StarBorderBtn>
        </div>
      </div>
    </section>
  )
}
