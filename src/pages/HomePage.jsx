import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '../hooks/useGSAP'
import { lenis } from '../components/SmoothScroll'

gsap.registerPlugin(ScrollTrigger)

import StarBorderBtn from '../components/StarBorderBtn'
import Magnet from '../components/Magnet'
import ClientLogos from "../components/ClientLogos";
import BorderGlow from '../components/BorderGlow'
import MarqueeStrip from '../components/MarqueeStrip'
import ParallaxStrip from '../components/ParallaxStrip'
import FlowingMenu from '../components/FlowingMenu'


import { 
  services, 
  workItems, 
  planets, 
  industries, 
  marqueeItems1, 
  marqueeItems2 
} from '../data'

import ShapeBlur from '../components/ShapeBlur'


// ── Consolidated HomePage ──

export default function HomePage() {
  return (
    <div className="homepage-wrapper">
      <HeroSection />
      <MarqueeStrip items={marqueeItems1} accent="green" />
      <AboutSection />
      <MarqueeStrip items={marqueeItems2} accent="cyan" reverse />
      <ServicesSection />
      <ProjectsSection />
      <PosterSection />
      <ClientLogos />
      <IndustriesSection />
      <ProcessSection />
      <TestimonialsSection />
      <ParallaxStrip />
      <ContactSection />
    </div>
  )
}

// ── Components ──

function HeroSection() {
  const sectionRef = useRef(null)
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
    tl.to('.hero-tag',      { opacity: 1, y: 0, duration: 0.8, delay: 0.3 })
      .to('.hero-word',     { y: '0%', duration: 1.2, stagger: 0.055 }, '-=0.45')
      .to('.hero-sub',      { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
      .to('.hero-btns',     { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
      .to('.hero-badges',   { opacity: 1, duration: 0.8 }, '-=0.3')
  }, [])
  const scrollTo = (id) => {
    if (lenis) {
      lenis.scrollTo(id)
    } else {
      document.querySelector(id)?.scrollIntoView({ behavior: 'auto' })
    }
  }

  return (
    <section id="hero" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @media (max-width: 768px) {
          #hero h1 { font-size: clamp(2.5rem, 12vw, 4rem) !important; line-height: 1.05 !important; }
          #hero .hero-sub { font-size: 0.92rem !important; margin-bottom: 2.5rem !important; }
          #hero .hero-btns { gap: 1rem !important; }
        }
      `}</style>
      
      <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: 'clamp(2rem, 8vh, 5rem)', paddingBottom: 'clamp(2rem, 5vh, 4rem)' }}>
        
        <h1 style={{ fontSize: 'clamp(3rem, 8.5vw, 6.8rem)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 0.95, marginBottom: '2rem', textTransform: 'none' }}>
          {[
            [{ text: 'Where', cls: 'g' }, { text: 'Brands', cls: '' }],
            [{ text: 'Go',   cls: 'c' }, { text: 'Beyond',  cls: 'p' }],
            [{ text: 'Gravity', cls: 'y' }],
          ].map((line, li) => (
            <span key={li} style={{ overflow: 'hidden', display: 'block', paddingBottom: '0.08em' }}>
              {line.map((w, wi) => (
                <span key={wi} className={`hero-word ${w.cls}`} style={{ display: 'inline-block', transform: 'translateY(110%)', marginRight: wi < line.length - 1 ? '0.22em' : 0 }}>{w.text}</span>
              ))}
            </span>
          ))}
        </h1>

        {/* Tag below heading */}
        <p className="hero-tag" style={{ fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--green)', fontWeight: 600, opacity: 0, transform: 'translateY(12px)', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
          <span style={{ width: 26, height: 1, background: 'var(--green)', display: 'inline-block', opacity: 0.4, flexShrink: 0 }} />
          Kozhikode · Kerala · Est. 2020
        </p>
        
        <p className="hero-sub" style={{ maxWidth: 520, fontSize: '1.05rem', lineHeight: 1.8, color: 'rgba(242,242,242,0.45)', fontWeight: 400, opacity: 0, transform: 'translateY(12px)', marginBottom: '3rem' }}>
          Colour Parrot is a full-spectrum creative agency — branding, motion, production, digital — launching brands into orbit from Calicut.
        </p>
        
        <div className="hero-btns" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', opacity: 0, transform: 'translateY(12px)', alignItems: 'center' }}>
          <StarBorderBtn onClick={() => scrollTo('#projects')}>Explore Work</StarBorderBtn>
          <StarBorderBtn onClick={() => scrollTo('#services')}>Our Services</StarBorderBtn>
        </div>
      </div>

      {/* Side badges - Adjusted to fit 100vh height */}
      <div className="hero-badges" style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '0.8rem', opacity: 0 }}>
        <style>{`
          @media (max-width: 1024px) { .hero-badges { display: none !important; } }
        `}</style>
        {[
          { label: 'Brand Identity',   color: 'var(--green)',  bc: 'rgba(10,228,105,0.2)'  },
          { label: 'Motion Graphics',  color: 'var(--cyan)',   bc: 'rgba(40,193,229,0.2)'  },
          { label: 'Digital Marketing',color: 'var(--purple)', bc: 'rgba(122,67,255,0.2)'  },
          { label: 'Video Production', color: 'var(--yellow)', bc: 'rgba(249,204,61,0.2)'  },
        ].map((b) => (
          <div key={b.label} style={{ 
            padding: '0.5rem 1.1rem', fontSize: '0.5rem', letterSpacing: '0.12em', textTransform: 'uppercase', 
            fontWeight: 500, color: b.color, borderRadius: '100px', border: `1px solid ${b.bc}`,
            background: 'rgba(2,23,30,0.4)', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease'
          }}>
            {b.label}
          </div>
        ))}
      </div>
    </section>
  )
}

function AboutSection() {
  const cardsRef = useRef(null)
  const cards = [
    { n: '50+',  l: 'Projects Launched',     col: 'var(--green)',  bg: 'rgba(10,228,105,0.06)',   bd: 'rgba(10,228,105,0.18)',  span: 1 },
    { n: '6+',   l: 'Industries Served',      col: 'var(--cyan)',   bg: 'rgba(40,193,229,0.06)',   bd: 'rgba(40,193,229,0.18)',  span: 1 },
    { n: '360°', l: 'Full Spectrum Creative — Brand · Motion · Web · Production', col: 'var(--purple)', bg: 'rgba(122,67,255,0.06)', bd: 'rgba(122,67,255,0.18)', span: 2 },
  ]
  useGSAP(() => {
    gsap.fromTo('.acard', { y: 35, opacity: 0 }, {
      y: 0, opacity: 1, stagger: 0.1, duration: 0.75, ease: 'power3.out',
      scrollTrigger: { 
        trigger: cardsRef.current, 
        start: 'top 78%',
        toggleActions: 'play none none reverse'
      },
    })
  }, [])

  return (
    <section id="about" className="pad" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>

      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(3rem, 6vw, 7rem)', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <div>
          <p className="sec-label">About us</p>
          <h2 className="sec-title">A Creative Force<br />From <span className="c">Deep Space</span></h2>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: 'rgba(242,242,242,0.55)', fontWeight: 400, marginBottom: '1.5rem', maxWidth: 500 }}>
            Based in Kozhikode, Colour Parrot is a full-service branding and advertising agency that transforms ideas into iconic brand experiences. We live at the intersection of strategy and art — every pixel, frame, and word is intentional.
          </p>
          <StarBorderBtn onClick={() => lenis ? lenis.scrollTo('#contact') : document.querySelector('#contact')?.scrollIntoView({ behavior: 'auto' })}>Work With Us</StarBorderBtn>
        </div>
        <div ref={cardsRef} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {cards.map((c, i) => (
            <BorderGlow
              key={i}
              className="acard"
              glowColor={
                c.col === 'var(--green)' ? '160 84 62' :
                c.col === 'var(--cyan)' ? '190 80 60' :
                '260 70 60'
              }
              colors={
                c.col === 'var(--green)' ? ['#1D9E75', '#0ae469'] :
                c.col === 'var(--cyan)' ? ['#28c1e5', '#38bdf8'] :
                ['#7a43ff', '#c084fc']
              }
              backgroundColor={c.bg}
              borderRadius={28}
              style={{
                gridColumn: c.span === 2 ? '1/-1' : undefined,
                border: `1px solid ${c.bd}`,
                transition: 'transform 0.3s ease',
                cursor: 'default',
              }}
            >
              <div style={{ padding: '2.25rem' }}>
                <div style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 500, letterSpacing: '-0.05em', lineHeight: 1, marginBottom: '0.6rem', color: c.col }}>{c.n}</div>
                <div style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, opacity: 0.55 }}>{c.l}</div>
              </div>
            </BorderGlow>
          ))}
        </div>

      </div>
    </section>
  )
}

function ServicesSection() {
  // Map services data to FlowingMenu item format
  const menuItems = services.map((s, idx) => ({
    link: `/services/${s.slug}`,
    text: s.name,
    image: s.image,
    accent: s.accent,
    index: idx + 1,
  }))

  return (
    <section
      id="services"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      {/* Section header */}
      <div className="container" style={{ paddingTop: 'clamp(5rem, 9vh, 8rem)', paddingBottom: '2.5rem' }}>
        <p className="sec-label">Our Expertise</p>
        <h2 className="sec-title" style={{ marginBottom: 0 }}>
          Services in <span className="g">Orbit</span>
        </h2>
      </div>

      {/* FlowingMenu fills remaining height */}
      <div style={{ flex: 1, borderTop: '1px solid rgba(242,242,242,0.07)' }}>
        <FlowingMenu items={menuItems} speed={18} />
      </div>
    </section>
  )
}



function ProjectsSection() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const row1Ref = useRef(null)
  const row2Ref = useRef(null)

  const row1Projects = [
    { name: 'Creative 1', category: 'Creative Design', image: '/creatives/1.webp', ratio: 0.8 },
    { name: 'Creative 2', category: 'Creative Design', image: '/creatives/2.webp', ratio: 1.0 },
    { name: 'Creative 3', category: 'Creative Design', image: '/creatives/3.webp', ratio: 1.0 },
    { name: 'Creative 4', category: 'Creative Design', image: '/creatives/4.webp', ratio: 0.8 },
    { name: 'Creative 5', category: 'Creative Design', image: '/creatives/5.webp', ratio: 1.0 },
    { name: 'Creative 6', category: 'Creative Design', image: '/creatives/6.webp', ratio: 1.0 },
    { name: 'Creative 7', category: 'Creative Design', image: '/creatives/7.webp', ratio: 0.8 },
    { name: 'Creative 8', category: 'Creative Design', image: '/creatives/8.webp', ratio: 1.0 },
    { name: 'Creative 9', category: 'Creative Design', image: '/creatives/9.webp', ratio: 1.0 },
    { name: 'Creative 10', category: 'Creative Design', image: '/creatives/10.webp', ratio: 1.0 },
    { name: 'Creative 11', category: 'Creative Design', image: '/creatives/11.webp', ratio: 0.8 },
    { name: 'Creative 12', category: 'Creative Design', image: '/creatives/12.webp', ratio: 1.0 },
  ]

  const row2Projects = [
    { name: 'Creative 13', category: 'Creative Design', image: '/creatives/13.webp', ratio: 0.8 },
    { name: 'Creative 14', category: 'Creative Design', image: '/creatives/14.webp', ratio: 0.8 },
    { name: 'Creative 15', category: 'Creative Design', image: '/creatives/15.webp', ratio: 1.0 },
    { name: 'Creative 16', category: 'Creative Design', image: '/creatives/16.webp', ratio: 0.8 },
    { name: 'Creative 17', category: 'Creative Design', image: '/creatives/17.webp', ratio: 0.8 },
    { name: 'Creative 18', category: 'Creative Design', image: '/creatives/18.webp', ratio: 0.8 },
    { name: 'Creative 19', category: 'Creative Design', image: '/creatives/19.webp', ratio: 1.0 },
    { name: 'Creative 20', category: 'Creative Design', image: '/creatives/20.webp', ratio: 0.8 },
    { name: 'Creative 21', category: 'Creative Design', image: '/creatives/21.webp', ratio: 1.0 },
    { name: 'Creative 22', category: 'Creative Design', image: '/creatives/22.webp', ratio: 1.0 },
    { name: 'Creative 23', category: 'Creative Design', image: '/creatives/23.webp', ratio: 1.0 },
    { name: 'Creative 24', category: 'Creative Design', image: '/creatives/24.webp', ratio: 0.8 },
  ]

  useGSAP(() => {
    // 1. Pinned Sliding Animation Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=1600',
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.5
      }
    })

    const getRowOverflow = (rowEl) => {
      if (!rowEl) return 0
      return rowEl.scrollWidth - window.innerWidth
    }

    // Smooth transition of services opacity on entry
    tl.to('#services', { opacity: 0, pointerEvents: 'none', duration: 1.5, ease: 'power2.out' }, 0)



    // Row 1 — LEFT entry, sweeps right (enters completely from offscreen left)
    tl.fromTo(row1Ref.current,
      { x: () => -(row1Ref.current.scrollWidth + 100) },
      { x: 0, ease: 'none', duration: 7 },
      0
    )

    // Row 2 — RIGHT entry, sweeps left (enters completely from offscreen right)
    tl.fromTo(row2Ref.current,
      { x: () => window.innerWidth + 100 },
      { x: () => -getRowOverflow(row2Ref.current), ease: 'none', duration: 7 },
      0
    )

    // Dead zone — pause so user sees the final state before unpinning
    tl.to({}, { duration: 1.5 }, 7)

    // Smooth exit — services fade back
    tl.to('#services', { opacity: 1, pointerEvents: 'auto', duration: 1.5, ease: 'power2.inOut' }, 7)

    // 2. Unified Background Color and Comet Color (Inverted Theme) Toggle ScrollTrigger
    // Spans from the start of #projects (bottom of #services) to the end of #clients (top of #industries)
    ScrollTrigger.create({
      trigger: '#services',
      endTrigger: '#industries',
      start: 'bottom top',
      end: 'top top',
      toggleClass: { targets: 'body, html', className: 'inverted-theme' }
    })

    // Trigger layout refresh after initial render to avoid offsets
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 500)

    return () => clearTimeout(refreshTimer)
  }, [])

  return (
    <section id="projects" ref={sectionRef} className="projects-pin-container" style={{ 
      position: 'relative', 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      height: '100vh',
      padding: 0,
      boxSizing: 'border-box'
    }}>
      {/* Title */}
      <div ref={headerRef} className="container" style={{ 
        position: 'absolute', 
        top: '6vh', 
        left: 0,
        right: 0,
        zIndex: 10, 
        opacity: 1,
        pointerEvents: 'auto'
      }}>
        <div className="proj-header-flex">
          <div>
            <p className="sec-label" style={{ color: 'var(--green)' }}>Recent Work</p>
            <h2 className="sec-title" style={{ margin: 0, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
              Featured <span className="g">Projects</span>
            </h2>
          </div>
          <StarBorderBtn href="/projects" color="var(--green)">View All Work</StarBorderBtn>
        </div>
      </div>

      {/* Rows wrapper — gap: 4vh */}
      <div className="proj-rows-wrapper" style={{ 
        height: '100vh',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        gap: '4vh',
        width: '100%',
        margin: 0,
        overflow: 'hidden'
      }}>
        {/* Row 1 */}
        <div style={{ overflow: 'visible', width: '100%', height: 'auto' }}>
          <div ref={row1Ref} className="proj-row-scroll" style={{ opacity: 1, height: '100%', gap: '3vw' }}>
            {row1Projects.map((p, idx) => (
              <div 
                key={idx} 
                className="proj-img-wrapper float-item" 
                style={{ 
                  animationDelay: `${idx * 0.35}s`, 
                  animationDuration: `${7 + (idx % 3) * 1.5}s`,
                  aspectRatio: p.ratio,
                  height: '46vh'
                }}
              >
                <img 
                  src={p.image} 
                  alt={p.name} 
                  className="proj-img-only" 
                  loading="eager"
                  style={{ aspectRatio: p.ratio, width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 */}
        <div style={{ overflow: 'visible', width: '100%', height: 'auto' }}>
          <div ref={row2Ref} className="proj-row-scroll" style={{ opacity: 1, height: '100%', gap: '3vw' }}>
            {row2Projects.map((p, idx) => (
              <div 
                key={idx} 
                className="proj-img-wrapper float-item" 
                style={{ 
                  animationDelay: `${(idx + 1) * 0.4}s`, 
                  animationDuration: `${8 + (idx % 4) * 1.2}s`,
                  aspectRatio: p.ratio,
                  height: '46vh'
                }}
              >
                <img 
                  src={p.image} 
                  alt={p.name} 
                  className="proj-img-only" 
                  loading="eager"
                  style={{ aspectRatio: p.ratio, width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function PosterCard({ item }) {
  const videoRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  const handleMouseEnter = () => {
    setHovered(true)
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }

  const handleMouseLeave = () => {
    setHovered(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <Link 
      to={item.link} 
      className="glass-card" 
      style={{ 
        padding: '1.2rem', 
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderColor: 'rgba(255, 255, 255, 0.05)',
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column', 
        borderRadius: '20px',
        textDecoration: 'none',
        transition: 'transform 0.4s var(--ease-out), border-color 0.4s var(--ease-out)'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={{ 
        borderRadius: '12px', 
        overflow: 'hidden', 
        width: '100%', 
        aspectRatio: '1.4',
        backgroundColor: '#010d12',
        position: 'relative'
      }}>
        {/* Static Image */}
        <img 
          src={item.image} 
          alt={item.title} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            position: 'absolute',
            inset: 0,
            opacity: hovered ? 0 : 1,
            transition: 'opacity 0.4s ease, transform 0.6s var(--ease-out)',
            transform: hovered ? 'scale(1.04)' : 'scale(1)'
          }} 
        />
        {/* Video Preview (Autoplays/Loops on Hover, Muted) */}
        <video
          ref={videoRef}
          src={item.video}
          muted
          loop
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            inset: 0,
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.4s ease',
            pointerEvents: 'none'
          }}
        />
      </div>
      <div style={{ marginTop: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.4)', letterSpacing: '0.05em' }}>{item.category}</span>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 500, color: '#ffffff', marginTop: '0.2rem', letterSpacing: '-0.02em' }}>{item.title}</h3>
        </div>
        <div style={{ 
          width: '36px', 
          height: '36px', 
          borderRadius: '50%', 
          border: '1px solid rgba(255, 255, 255, 0.1)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'var(--cyan)',
          transition: 'all 0.3s ease',
          transform: hovered ? 'translateX(4px)' : 'none',
          borderColor: hovered ? 'var(--cyan)' : 'rgba(255, 255, 255, 0.1)',
          backgroundColor: hovered ? 'rgba(56, 189, 248, 0.05)' : 'transparent'
        }}>
          →
        </div>
      </div>
    </Link>
  )
}

function PosterSection() {
  const sectionRef = useRef(null)
  const posters = [
    { 
      title: 'Cosmic Brand Design', 
      category: 'Branding & Identity', 
      image: '/branding_design_cosmic_1778433637538.png',
      video: 'https://assets.mixkit.co/videos/preview/mixkit-working-at-a-clean-light-desk-with-a-laptop-42173-large.mp4',
      link: '/services/brand-identity'
    },
    { 
      title: 'Stellar Marketing Campaign', 
      category: 'Digital Strategy', 
      image: '/digital_marketing_orbit_1778433698442.png',
      video: 'https://assets.mixkit.co/videos/preview/mixkit-statistics-being-shown-on-a-digital-tablet-42171-large.mp4',
      link: '/services/digital-marketing'
    },
    { 
      title: 'Galactic Visual Production', 
      category: 'Motion Graphics & Film', 
      image: '/video_production_future_1778433657751.png',
      video: 'https://assets.mixkit.co/videos/preview/mixkit-lens-of-a-professional-video-camera-40788-large.mp4',
      link: '/services/video-production'
    },
    { 
      title: 'Interactive Space Architecture', 
      category: 'Web App & Tech', 
      image: '/web_dev_cosmic_code_1778433678220.png',
      video: 'https://assets.mixkit.co/videos/preview/mixkit-typing-on-a-glowing-computer-keyboard-in-the-dark-42176-large.mp4',
      link: '/services/web-design'
    }
  ]

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      }
    })

    tl.fromTo(
      '.poster-header > *',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
      }
    ).fromTo(
      '.poster-card-wrapper',
      { 
        y: 50, 
        scale: 0.94, 
        opacity: 1 
      },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.75,
        stagger: 0.15,
        ease: 'back.out(1.15)',
        clearProps: 'transform'
      },
      '-=0.25'
    ).fromTo(
      '.poster-btn-wrap',
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
      },
      '-=0.2'
    )
  }, [])

  return (
    <section id="posters" ref={sectionRef} style={{ backgroundColor: 'transparent', padding: 'clamp(4rem, 8vh, 6rem) 0', position: 'relative', zIndex: 1 }}>
      <div className="container">
        <div className="poster-header" style={{ marginBottom: '4rem' }}>
          <p className="sec-label" style={{ color: 'var(--cyan)' }}>Portfolio Grid</p>
          <h2 className="sec-title" style={{ margin: 0 }}>Selected <span className="c">Brandings</span></h2>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: 'clamp(1.25rem, 2.5vw, 2.25rem)',
          width: '100%' 
        }}>
          <style>{`
            @media (max-width: 768px) {
              #posters .container > div:last-child { grid-template-columns: 1fr !important; }
            }
          `}</style>
          {posters.map((item, idx) => (
            <div key={idx} className="poster-card-wrapper" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <PosterCard item={item} />
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="poster-btn-wrap" style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
          <StarBorderBtn href="/projects" color="var(--cyan)">
            View More Works →
          </StarBorderBtn>
        </div>
      </div>
    </section>
  )
}



function IndustriesSection() {
  const listRef = useRef(null)
  useGSAP(() => {
    gsap.fromTo('.ind-tag', { scale: 0.85, opacity: 0 }, {
      scale: 1, opacity: 1, stagger: 0.04, duration: 0.45, ease: 'back.out(1.5)',
      scrollTrigger: { 
        trigger: listRef.current, 
        start: 'top 82%',
        toggleActions: 'play none none reverse'
      },
    })
  }, [])
  return (
    <section id="industries" className="pad" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="container">
        <p className="sec-label" style={{ color: 'var(--red)' }}>Sectors we serve</p>
        <h2 className="sec-title">Industries We've <span className="r">Explored</span></h2>
        <div ref={listRef} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginTop: '1rem' }}>
          {industries.map((tag) => (
            <span key={tag} className="ind-tag glass-card" style={{ fontSize: 'clamp(0.85rem, 1.8vw, 1.1rem)', fontWeight: 500, letterSpacing: '-0.02em', padding: 'clamp(0.4rem, 1.5vh, 0.7rem) clamp(1rem, 3.5vw, 1.6rem)', borderRadius: 100, transition: 'all 0.35s', cursor: 'default' }} onMouseEnter={e => e.currentTarget.classList.add('hovered')} onMouseLeave={e => e.currentTarget.classList.remove('hovered')}>{tag}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

function useAutoScroll(ref, delay = 3000) {
  useEffect(() => {
    const container = ref.current
    if (!container) return
    
    let intervalId
    const startScroll = () => {
      clearInterval(intervalId)
      intervalId = setInterval(() => {
        if (window.innerWidth <= 768) {
          const maxScroll = container.scrollWidth - container.clientWidth
          if (container.scrollLeft >= maxScroll - 10) {
            container.scrollTo({ left: 0, behavior: 'smooth' })
          } else {
            const cardWidth = container.clientWidth * 0.85 + 16
            container.scrollBy({ left: cardWidth, behavior: 'smooth' })
          }
        }
      }, delay)
    }

    startScroll()
    
    const pause = () => clearInterval(intervalId)
    const resume = () => startScroll()
    
    container.addEventListener('touchstart', pause, { passive: true })
    container.addEventListener('touchend', resume, { passive: true })
    container.addEventListener('mouseenter', pause)
    container.addEventListener('mouseleave', resume)
    
    return () => {
      clearInterval(intervalId)
      container.removeEventListener('touchstart', pause)
      container.removeEventListener('touchend', resume)
      container.removeEventListener('mouseenter', pause)
      container.removeEventListener('mouseleave', resume)
    }
  }, [ref, delay])
}

function ProcessSection() {
  const ref = useRef(null)
  useAutoScroll(ref, 2500)
  const steps = [
    {
      number: '01',
      title: 'Discovery',
      desc: 'We dive deep into your brand, audience, and goals. Research, strategy, and positioning — everything starts here.',
      color: 'var(--green)',
      bg: 'rgba(10,228,105,0.06)',
      border: 'rgba(10,228,105,0.15)',
    },
    {
      number: '02',
      title: 'Strategy',
      desc: 'We craft a creative blueprint — messaging, visual direction, and campaign architecture built around your objectives.',
      color: 'var(--cyan)',
      bg: 'rgba(40,193,229,0.06)',
      border: 'rgba(40,193,229,0.15)',
    },
    {
      number: '03',
      title: 'Creation',
      desc: 'Design, motion, production — our team brings the strategy to life with precision and creative excellence.',
      color: 'var(--purple)',
      bg: 'rgba(122,67,255,0.06)',
      border: 'rgba(122,67,255,0.15)',
    },
    {
      number: '04',
      title: 'Launch',
      desc: 'We deliver, deploy, and amplify. Your brand goes live and we track performance to keep pushing boundaries.',
      color: 'var(--yellow)',
      bg: 'rgba(249,204,61,0.06)',
      border: 'rgba(249,204,61,0.15)',
    },
  ]

  useGSAP(() => {
    gsap.fromTo(
      '.process-card',
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 78%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, [])

  return (
    <section id="process" className="pad" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <div className="container" style={{ position: 'relative' }}>
        <p className="sec-label" style={{ color: 'var(--cyan)' }}>How We Work</p>
        <h2 className="sec-title" style={{ marginBottom: '4rem' }}>
          Our <span className="c">Process</span>
        </h2>
        
        {/* Background ShapeBlur element on the right of the heading */}
        <div style={{ 
          position: 'absolute', 
          right: '-10%', 
          top: '-150px', 
          pointerEvents: 'none', 
          zIndex: 0, 
          opacity: 0.8,
          width: '550px', 
          height: '550px', 
          overflow: 'hidden' 
        }}>
          <ShapeBlur 
            variation={0}
            pixelRatioProp={window.devicePixelRatio || 1}
            shapeSize={0.23}
            roundness={0.5}
            borderSize={0.04}
            circleSize={0.1}
            circleEdge={1}
            glowColor="#0ae469"
            baseOpacity={0.1}
          />
        </div>
        <div
          ref={ref}
          className="mobile-slider"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {steps.map((s, i) => (
            <BorderGlow
              key={i}
              className="process-card"
              glowColor={
                s.color === 'var(--green)' ? '160 84 62' :
                s.color === 'var(--cyan)' ? '190 80 60' :
                s.color === 'var(--purple)' ? '260 70 60' :
                '45 90 60'
              }
              colors={
                s.color === 'var(--green)' ? ['#1D9E75', '#0ae469'] :
                s.color === 'var(--cyan)' ? ['#28c1e5', '#38bdf8'] :
                s.color === 'var(--purple)' ? ['#7a43ff', '#c084fc'] :
                ['#f9cc3d', '#facc15']
              }
              backgroundColor={s.bg}
              borderRadius={24}
              fillOpacity={0}
              style={{
                border: `1px solid ${s.border}`,
                transition: 'transform 0.3s ease, border-color 0.3s ease',
                cursor: 'default',
              }}
            >
              <div style={{ padding: '2rem 1.75rem', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <div
                  style={{
                    fontSize: '0.68rem',
                    letterSpacing: '0.2em',
                    color: s.color,
                    fontWeight: 600,
                    marginBottom: '1.5rem',
                    opacity: 0.65,
                  }}
                >
                  {s.number}
                </div>
                <h3
                  style={{
                    fontSize: 'clamp(1.3rem, 2.2vw, 1.7rem)',
                    fontWeight: 500,
                    letterSpacing: '-0.03em',
                    color: s.color,
                    marginBottom: '0.9rem',
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.88rem',
                    lineHeight: 1.75,
                    color: 'rgba(242,242,242,0.48)',
                    fontWeight: 400,
                  }}
                >
                  {s.desc}
                </p>
                <div
                  style={{
                    position: 'absolute',
                    top: '1.75rem',
                    right: '1.75rem',
                    fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.06em',
                    color: s.color,
                    opacity: 0.06,
                    lineHeight: 1,
                  }}
                >
                  {s.number}
                </div>
              </div>
            </BorderGlow>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const ref = useRef(null)
  useAutoScroll(ref, 2500)
  const testimonials = [
    {
      quote: 'Colour Parrot completely transformed our brand identity. The team brought creativity and strategy together in a way we had never experienced before.',
      name: 'Rahul Menon',
      role: 'CEO, TechNova Solutions',
      color: 'var(--green)',
      border: 'rgba(10,228,105,0.15)',
      bg: 'rgba(10,228,105,0.04)',
      initial: 'R',
    },
    {
      quote: 'From concept to execution, everything was flawless. Our social media engagement tripled within two months of working with them.',
      name: 'Priya Sharma',
      role: 'Marketing Head, Blossom Retail',
      color: 'var(--cyan)',
      border: 'rgba(40,193,229,0.15)',
      bg: 'rgba(40,193,229,0.04)',
      initial: 'P',
    },
    {
      quote: 'The motion graphics they created for our product launch exceeded every expectation. Truly a world-class creative team based right here in Kerala.',
      name: 'Arun Krishna',
      role: 'Founder, Nuvana Health',
      color: 'var(--purple)',
      border: 'rgba(122,67,255,0.15)',
      bg: 'rgba(122,67,255,0.04)',
      initial: 'A',
    },
  ]

  useGSAP(() => {
    gsap.fromTo(
      '.testi-card',
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 78%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, [])

  return (
    <section id="testimonials" className="pad" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="container">
        <p className="sec-label" style={{ color: 'var(--yellow)' }}>Client Stories</p>
        <h2 className="sec-title" style={{ marginBottom: '3.5rem' }}>
          What They <span className="y">Say</span>
        </h2>
        <div
          ref={ref}
          className="mobile-slider"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {testimonials.map((t, i) => (
            <BorderGlow
              key={i}
              className="testi-card"
              glowColor={
                t.color === 'var(--green)' ? '160 84 62' :
                t.color === 'var(--cyan)' ? '190 80 60' :
                '260 70 60'
              }
              colors={
                t.color === 'var(--green)' ? ['#1D9E75', '#0ae469'] :
                t.color === 'var(--cyan)' ? ['#28c1e5', '#38bdf8'] :
                ['#7a43ff', '#c084fc']
              }
              backgroundColor={t.bg}
              borderRadius={28}
              fillOpacity={0}
              style={{
                border: `1px solid ${t.border}`,
                transition: 'transform 0.3s ease',
                cursor: 'default',
              }}
            >
              <div style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', gap: '1.75rem', height: '100%' }}>
              {/* Quote mark */}
              <div
                style={{
                  fontSize: '3.5rem',
                  lineHeight: 0.8,
                  color: t.color,
                  opacity: 0.35,
                  fontFamily: 'Georgia, serif',
                }}
              >
                “
              </div>

              {/* Quote text */}
              <p
                style={{
                  fontSize: '0.93rem',
                  lineHeight: 1.8,
                  color: 'rgba(242,242,242,0.62)',
                  fontWeight: 400,
                  flex: 1,
                }}
              >
                {t.quote}
              </p>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: t.border,
                    border: `1px solid ${t.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: t.color,
                    flexShrink: 0,
                  }}
                >
                  {t.initial}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: 'rgba(242,242,242,0.9)',
                      marginBottom: '0.2rem',
                    }}
                  >
                    {t.name}
                  </p>
                  <p
                    style={{
                      fontSize: '0.7rem',
                      letterSpacing: '0.08em',
                      color: t.color,
                      opacity: 0.7,
                      textTransform: 'uppercase',
                    }}
                  >
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          </BorderGlow>
        ))}
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  const titleRef = useRef(null)
  useGSAP(() => {
    gsap.fromTo(titleRef.current, { y: 70, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1.1, ease: 'power4.out',
      scrollTrigger: { 
        trigger: titleRef.current, 
        start: 'top 72%',
        toggleActions: 'play none none reverse'
      },
    })
  }, [])
  return (
    <section id="contact" className="pad" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(3rem, 6vw, 6rem)', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <div>
          <p className="sec-label">Get in touch</p>
          <h2 ref={titleRef} style={{ fontSize: 'clamp(3.5rem, 10vw, 7rem)', fontWeight: 500, letterSpacing: '-0.06em', lineHeight: 0.88, marginBottom: '2.75rem' }}>
            <span className="g">LET'S</span><br /><span className="c">BUILD.</span>
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3.5rem' }}>
            {[ 
              { label: 'Email', value: 'info@colourparrot.com', link: 'mailto:info@colourparrot.com' }, 
              { label: 'Phone', value: '+91 94008 90105', link: 'tel:+919400890105' },
              { label: 'Location', value: "Kozhikode, Kerala", link: 'https://www.google.com/maps/search/Colour+Parrot+Branding+%26+Advertising/@11.2256954,75.7985431,17z/data=!3m1!4b1?entry=ttu' }, 
              { 
                label: 'Social', 
                value: (
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <a href="https://www.instagram.com/colour.parrot/" target="_blank" rel="noreferrer" className="social-link" onMouseEnter={e=>e.currentTarget.classList.add('hovered')} onMouseLeave={e=>e.currentTarget.classList.remove('hovered')}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
                    <a href="https://www.behance.net/colourparrotbranding" target="_blank" rel="noreferrer" className="social-link" onMouseEnter={e=>e.currentTarget.classList.add('hovered')} onMouseLeave={e=>e.currentTarget.classList.remove('hovered')}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12h-4"></path><path d="M9 16h-4"></path><path d="M5 8h4a2 2 0 1 1 0 4h-4v-4z"></path><path d="M5 12h4a2 2 0 1 1 0 4h-4v-4z"></path><path d="M13 12h7"></path><path d="M20 12c0-3-2-5-5-5s-5 2-5 5 2 5 5 5 5-2 5-5z"></path></svg></a>
                    <a href="https://www.facebook.com/share/1F9u1EHMhb/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="social-link" onMouseEnter={e=>e.currentTarget.classList.add('hovered')} onMouseLeave={e=>e.currentTarget.classList.remove('hovered')}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
                    <a href="https://www.linkedin.com/company/colour-parrot/" target="_blank" rel="noreferrer" className="social-link" onMouseEnter={e=>e.currentTarget.classList.add('hovered')} onMouseLeave={e=>e.currentTarget.classList.remove('hovered')}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
                  </div>
                ),
                link: '#' 
              }, 
            ].map(({ label, value, link }) => (
              <div key={label}>
                <p style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(242,242,242,0.28)', fontWeight: 600, marginBottom: '0.55rem' }}>{label}</p>
                {typeof value === 'string' ? (
                  <a href={link} className="contact-link" style={{ fontSize: '0.95rem', fontWeight: 600, textDecoration: 'none', display: 'block' }} onMouseEnter={e=>e.currentTarget.classList.add('hovered')} onMouseLeave={e=>e.currentTarget.classList.remove('hovered')}>{value}</a>
                ) : (
                  value
                )}
              </div>
            ))}
          </div>
          
          <Magnet padding={80} disabled={false}>
            <StarBorderBtn href="mailto:info@colourparrot.com" size="lg">Start a Project →</StarBorderBtn>
          </Magnet>
        </div>

        {/* Map Integration */}
        <div style={{ 
          position: 'relative', height: 'clamp(320px, 45vh, 550px)', borderRadius: '40px', overflow: 'hidden',
          border: '1px solid var(--glass-border)', boxShadow: '0 40px 100px rgba(0,0,0,0.6)'
        }}>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6277.856447745043!2d75.79854311168889!3d11.225695361399202!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba659d721eb6aeb%3A0x972a68879fe6780!2sColour%20Parrot%20Branding%20%26%20Advertising!5e0!3m2!1sen!2sin!4v1760282951078!5m2!1sen!2sin" 
            width="100%" height="100%" style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)' }} 
            allowFullScreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  )
}
