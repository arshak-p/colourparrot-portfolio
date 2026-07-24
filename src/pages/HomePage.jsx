import { useRef, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { InstagramIcon, BehanceIcon, FacebookIcon, LinkedInIcon } from '../components/SocialIcons'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '../hooks/useGSAP'
import { lenis } from '../components/SmoothScroll'

gsap.registerPlugin(ScrollTrigger)

import SpaceGrid from '../components/SpaceGrid'
import { setStarWarp, setStarfieldPaused } from '../components/Starfield'
import PosterCard from '../components/PosterCard'
import { brandingItems } from '../data/brandingData'
import { row1Projects, row2Projects } from '../data/creativesData'

const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const shuffledRow1 = shuffleArray(row1Projects).slice(0, 12);
const shuffledRow2 = shuffleArray(row2Projects).slice(0, 12);

import StarBorderBtn from '../components/StarBorderBtn'
import Magnet from '../components/Magnet'
import ClientLogos from "../components/ClientLogos";
import BorderGlow from '../components/BorderGlow'
import ScrollVelocity from '../components/ScrollVelocity'
import ParallaxStrip from '../components/ParallaxStrip'
import FlowingMenu from '../components/FlowingMenu'
import ScrollFloat from '../components/ScrollFloat';
import PixelCard from '../components/PixelCard';
import CurvedLoop from '../components/CurvedLoop'
import { TestimonialsMarquee } from '../components/TestimonialsMarquee';

import { 
  services, 
  workItems, 
  industries,
  marqueeItems1, 
  marqueeItems2 
} from '../data'

import RotatingText from '../components/RotatingText'
import TextPressure from '../components/TextPressure'
export default function HomePage() {
  const marqueeText1 = marqueeItems1.join('  ·  ') + '  ·'
  const marqueeText2 = marqueeItems2.join('  ·  ') + '  ·'
  const darkWrapperRef = useRef(null)

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: darkWrapperRef.current,
      start: 'top 50%',
      end: 'bottom 50%',
      refreshPriority: -1,
      toggleClass: { targets: 'body', className: 'inverted-theme' }
    });
  }, { scope: darkWrapperRef })

  return (
    <>
      <div className="homepage-wrapper">
        <HeroSection />
        <ScrollVelocity texts={[marqueeText1]} velocity={60} className="scroll-text-green" />
        <AboutSection />
        <ScrollVelocity texts={[marqueeText2]} velocity={-60} className="scroll-text-cyan" />
        <ServicesSection />
        <div ref={darkWrapperRef} className="dark-theme-wrapper" style={{ position: 'relative', color: '#ffffff' }}>
          <ProjectsSection />
          <PosterSection />
          <ClientLogos />
        </div>
        <IndustriesSection />
        <ProcessSection />
        <TestimonialsSection />
        <FAQSection />
        <ParallaxStrip />
        <ContactSection />
      </div>
    </>
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
    <section id="hero" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @media (max-width: 768px) {
          #hero h1 { font-size: clamp(2.5rem, 12vw, 4rem) !important; line-height: 1.05 !important; }
          #hero .hero-sub { font-size: 0.92rem !important; margin-bottom: 2.5rem !important; }
          #hero .hero-btns { gap: 1rem !important; }
        }
      `}</style>
      
      <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: 'clamp(2rem, 8vh, 5rem)', paddingBottom: 'clamp(2rem, 5vh, 4rem)' }}>
        
        <h1 style={{ fontSize: 'clamp(3rem, 8.5vw, 6.8rem)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 0.95, marginBottom: '2rem', textTransform: 'none' }}>
          <span style={{ overflow: 'hidden', display: 'block', paddingBottom: '0.08em' }}>
            <span className="hero-word g" style={{ display: 'inline-block', transform: 'translateY(110%)', marginRight: '0.22em' }}>Building</span>
            <span className="hero-word" style={{ display: 'inline-block', transform: 'translateY(110%)' }}>Brands</span>
          </span>
          <span style={{ overflow: 'hidden', display: 'block', paddingBottom: '0.08em' }}>
            <span className="hero-word c" style={{ display: 'inline-block', transform: 'translateY(110%)', marginRight: '0.22em' }}>That</span>
            <span className="hero-word p" style={{ display: 'inline-block', transform: 'translateY(110%)' }}>Shape</span>
          </span>
          <span style={{ overflow: 'hidden', display: 'block', paddingBottom: '0.08em' }}>
            <RotatingText
              texts={['Markets', 'Culture', 'Experiences', 'Perception', 'The Future']}
              mainClassName="hero-word y hero-rotate-text"
              staggerFrom="first"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-120%", opacity: 0 }}
              staggerDuration={0.02}
              splitLevelClassName="overflow-hidden pb-0.5"
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              rotationInterval={2800}
              style={{ display: 'inline-flex', transform: 'translateY(110%)' }}
            />
          </span>
        </h1>

        {/* Tag below heading */}
        <p className="hero-tag" style={{ fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--green)', fontWeight: 600, opacity: 0, transform: 'translateY(12px)', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
          <span style={{ width: 26, height: 1, background: 'var(--green)', display: 'inline-block', opacity: 0.4, flexShrink: 0 }} />
          Kozhikode · Kerala · Est. 2024
        </p>
        
        <p className="hero-sub" style={{ maxWidth: 520, fontSize: '1.05rem', lineHeight: 1.8, color: 'rgba(242,242,242,0.45)', fontWeight: 400, opacity: 0, transform: 'translateY(12px)', marginBottom: '3rem' }}>
          We combine strategy, creativity, and digital innovation to build brands that stand out and drive meaningful growth.
        </p>
        
        <div className="hero-btns" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', opacity: 0, transform: 'translateY(12px)', alignItems: 'center' }}>
          <StarBorderBtn href="/contact" className="highlight-cta">Start a Project</StarBorderBtn>
          <StarBorderBtn onClick={() => scrollTo('#services')}>Our Services</StarBorderBtn>
        </div>
      </div>

      {/* Side badges - Adjusted to fit 100vh height */}
      <div className="hero-badges" style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '0.8rem', opacity: 0 }}>
        <style>{`
          @media (max-width: 1024px) { .hero-badges { display: none !important; } }
          .hero-badge-link:hover {
            transform: scale(1.05);
            background: rgba(255,255,255,0.05) !important;
          }
        `}</style>
        {[
          { label: 'Brand Identity',   color: 'var(--green)',  bc: 'rgba(10,228,105,0.2)', link: '/services/brand-identity' },
          { label: 'Motion Graphics',  color: 'var(--cyan)',   bc: 'rgba(40,193,229,0.2)', link: '/services/video-production#section-motion' },
          { label: 'Digital Marketing',color: 'var(--purple)', bc: 'rgba(122,67,255,0.2)', link: '/services/digital-marketing' },
          { label: 'Video Production', color: 'var(--yellow)', bc: 'rgba(249,204,61,0.2)', link: '/services/video-production' },
        ].map((b) => (
          <Link to={b.link} key={b.label} className="hero-badge-link" style={{ 
            padding: '0.5rem 1.1rem', fontSize: '0.5rem', letterSpacing: '0.12em', textTransform: 'uppercase', 
            fontWeight: 500, color: b.color, borderRadius: '100px', border: `1px solid ${b.bc}`,
            background: 'rgba(2,23,30,0.4)', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease',
            textDecoration: 'none', display: 'block', textAlign: 'center'
          }}>
            {b.label}
          </Link>
        ))}
      </div>
    </section>
  )
}

function AboutSection() {
  const cardsRef = useRef(null)
  const cards = [
    { n: '50+',  l: 'Projects Delivered',     col: 'var(--green)',  bg: 'rgba(10,228,105,0.06)',   bd: 'rgba(10,228,105,0.18)',  span: 1 },
    { n: '6+',   l: 'Industries Served',      col: 'var(--cyan)',   bg: 'rgba(40,193,229,0.06)',   bd: 'rgba(40,193,229,0.18)',  span: 1 },
    { n: '360°', l: 'Integrated Creative Solutions — Branding · Motion · Web · Production · Digital', col: 'var(--purple)', bg: 'rgba(122,67,255,0.06)', bd: 'rgba(122,67,255,0.18)', span: 2 },
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
    <section id="about" className="pad" style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>

      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(3rem, 6vw, 7rem)', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <div>
          <p className="sec-label">About us</p>
          <ScrollFloat className="sec-title" tag="h2">
            Where Strategy Meets<br /><span className="c">Creative Excellence</span>
          </ScrollFloat>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: 'rgba(242,242,242,0.55)', fontWeight: 400, marginBottom: '1.5rem', maxWidth: 500 }}>
            Colour Parrot is a full-service creative agency helping businesses build brands that are clear, consistent, and unforgettable. We combine strategic thinking with bold creativity to create work that delivers real business impact.
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
    images: s.images,
    accent: s.accent,
    index: idx + 1,
  }))

  return (
    <section
      id="services"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      {/* Section header */}
      <div className="container" style={{ paddingTop: 'clamp(5rem, 9vh, 8rem)', paddingBottom: 'clamp(1.5rem, 3vh, 2.5rem)' }}>
        <p className="sec-label">Our Expertise</p>
        <ScrollFloat className="sec-title" tag="h2" style={{ marginBottom: 0 }}>
          What We <span className="g">Do</span>
        </ScrollFloat>
      </div>

      {/* FlowingMenu fills remaining height */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(242,242,242,0.07)' }}>
        <FlowingMenu items={menuItems} speed={35} />
      </div>
    </section>
  )
}



function ProjectsSection() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const row1Ref = useRef(null)
  const row2Ref = useRef(null)

  useGSAP(() => {
    // 1. Pinned Sliding Animation Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: () => "+=" + (window.innerWidth <= 768 ? 3000 : 3000),
        pin: true,
        pinSpacing: true,
        anticipatePin: 0,
        scrub: 0.5,
        fastScrollEnd: true,
        lazy: false
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
      { x: 0, ease: 'none', duration: 8 },
      0
    )

    // Row 2 — RIGHT entry, sweeps left (enters completely from offscreen right)
    tl.fromTo(row2Ref.current,
      { x: () => window.innerWidth + 100 },
      { x: () => -getRowOverflow(row2Ref.current), ease: 'none', duration: 8 },
      0
    )

    // Smooth exit — services fade back
    tl.to('#services', { opacity: 1, pointerEvents: 'auto', duration: 1.2, ease: 'power2.inOut' }, 6)


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
      height: '100dvh',
      padding: 0,
      boxSizing: 'border-box'
    }}>
      {/* Title */}
      <div ref={headerRef} className="container" style={{ 
        position: 'absolute', 
        top: '2vh', 
        left: 0,
        right: 0,
        zIndex: 10, 
        opacity: 1,
        pointerEvents: 'auto'
      }}>
        <div className="proj-header-flex">
          <div>
            <p className="sec-label" style={{ color: 'var(--green)' }}>Recent Work</p>
            <ScrollFloat className="sec-title" tag="h2" style={{ margin: 0 }}>
              Featured <span className="g">Projects</span>
            </ScrollFloat>
          </div>
          <div className="desktop-only-btn">
            <StarBorderBtn href="/projects" color="var(--green)">View All Work</StarBorderBtn>
          </div>
        </div>
      </div>

      {/* Rows wrapper — gap: 4vh */}
      <div className="proj-rows-wrapper" style={{ 
        height: '100dvh',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        gap: '4vh',
        width: '100%',
        margin: 0,
        overflow: 'hidden'
      }}>
        {/* Row 1 */}
        <div style={{ overflow: 'visible', width: '100%', height: 'auto', transform: 'translateZ(0)' }}>
          <div ref={row1Ref} className="proj-row-scroll" style={{ opacity: 1, height: '100%', gap: '3vw', transform: 'translateZ(0)' }}>
            {shuffledRow1.map((p, idx) => (
              <div 
                key={idx} 
                className="proj-img-wrapper" 
                style={{ 
                  animationDelay: `${idx * 0.35}s`, 
                  animationDuration: `${4 + (idx % 3) * 1.5}s`,
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
        <div style={{ overflow: 'visible', width: '100%', height: 'auto', transform: 'translateZ(0)' }}>
          <div ref={row2Ref} className="proj-row-scroll" style={{ opacity: 1, height: '100%', gap: '3vw', transform: 'translateZ(0)' }}>
            {shuffledRow2.map((p, idx) => (
              <div 
                key={idx} 
                className="proj-img-wrapper" 
                style={{ 
                  animationDelay: `${idx * 0.45}s`, 
                  animationDuration: `${4 + (idx % 3) * 1.5}s`,
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
      
      <div className="mobile-only-btn" style={{ position: 'absolute', bottom: '4vh', left: '50%', transform: 'translateX(-50%)', zIndex: 10, pointerEvents: 'auto' }}>
        <StarBorderBtn href="/projects" color="var(--green)">View All Work</StarBorderBtn>
      </div>
    </section>
  )
}



function PosterSection() {
  const sectionRef = useRef(null)
  const [group2Ready, setGroup2Ready] = useState(false)
  const selectedSlugs = ['aptitude', 'healthicart', 'liara', 'nuvana', 'taiwo-fx', 'topnotch', 'aidenx', 'fobas'];
  const posters = selectedSlugs.map(slug => brandingItems.find(item => item.slug === slug)).filter(Boolean);
  
  const group1 = posters.slice(4, 8)
  const group2 = posters.slice(0, 4)

  useGSAP(() => {
    // 1. Initial entrance animation
    const tlIntro = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
        once: true
      }
    })

    tlIntro.fromTo(
      '.poster-header > *',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
    )

    const g1 = document.querySelector('.group1-grid')
    const g2 = document.querySelector('.group2-grid')

    const tlScrub = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'center center',
        end: '+=3000',
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        anticipatePin: 1,
        fastScrollEnd: true,
        onEnter: () => setStarfieldPaused(true),
        onLeave: () => setStarfieldPaused(false),
        onEnterBack: () => setStarfieldPaused(true),
        onLeaveBack: () => setStarfieldPaused(false),
        onUpdate: (self) => { if (self.progress > 0.3 && !group2Ready) setGroup2Ready(true) }
      }
    })

    tlScrub.to('.group1-grid', {
      scale: 1.8,
      autoAlpha: 0,
      transformOrigin: '50% 50%',
      ease: 'power1.in',
      duration: 0.8,
      onUpdate: function() {
        if (g1) g1.style.setProperty('--grid-gap', `${1 + this.progress() * 6}rem`)
      }
    }, 0)

    tlScrub.to({ val: 0 }, {
      val: 1,
      duration: 0.4,
      ease: 'power1.in',
      onUpdate: function() { setStarWarp(this.targets()[0].val) }
    }, 0)

    tlScrub.to({ val: 1 }, {
      val: 0,
      duration: 0.4,
      ease: 'power1.out',
      onUpdate: function() { setStarWarp(this.targets()[0].val) }
    }, 0.4)

    tlScrub.fromTo('.group2-grid',
      { scale: 0.15, autoAlpha: 0, transformOrigin: '50% 50%' },
      { scale: 1, autoAlpha: 1, transformOrigin: '50% 50%', ease: 'power1.out', duration: 0.8 }
    , 0.4)

    tlScrub.to('.group2-grid', {
      scale: 1.8,
      autoAlpha: 0,
      transformOrigin: '50% 50%',
      ease: 'power1.in',
      duration: 0.8,
      onUpdate: function() {
        if (g2) g2.style.setProperty('--grid-gap', `${1 + this.progress() * 6}rem`)
      }
    }, 1.2)

    tlScrub.to({ val: 0 }, {
      val: 1,
      duration: 0.4,
      ease: 'power1.in',
      onUpdate: function() { setStarWarp(this.targets()[0].val) }
    }, 1.2)

    tlScrub.to({ val: 1 }, {
      val: 0,
      duration: 0.4,
      ease: 'power1.out',
      onUpdate: function() { setStarWarp(this.targets()[0].val) }
    }, 1.6)

    tlScrub.to('.poster-btn-wrap', {
      scale: 1,
      autoAlpha: 1,
      ease: 'back.out(1.4)',
      duration: 0.6
    }, 1.8)

  }, [])

  return (
    <section id="posters" ref={sectionRef} style={{ backgroundColor: 'transparent', position: 'relative', zIndex: 1, overflow: 'hidden', paddingTop: 'clamp(1rem, 3vh, 3rem)', paddingBottom: 'clamp(1rem, 3vh, 3rem)' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div className="poster-header" style={{ marginBottom: '1rem', width: '100%' }}>
          <p className="sec-label" style={{ color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.75rem', marginBottom: '0.5rem', paddingLeft: '0' }}>PORTFOLIO GRID</p>
          <ScrollFloat className="sec-title" tag="h2" style={{ margin: 0, letterSpacing: '-0.03em', justifyContent: 'center' }}>
            <span style={{ color: '#ffffff' }}>Selected </span> 
            <span style={{ color: 'var(--cyan)' }}>Brandings</span>
          </ScrollFloat>
        </div>
        
        <div style={{ position: 'relative', width: '100%', minHeight: '500px' }}>
          <style>{`
            .posters-grid-layer {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: var(--grid-gap, 1rem);
              width: 100%;
              transform-origin: center center;
              will-change: transform, opacity, gap;
              transform: translateZ(0);
            }
            @media (max-width: 768px) {
              .posters-grid-layer { grid-template-columns: 1fr !important; }
            }
          `}</style>
          
          {/* DUMMY GRID FOR STABLE HEIGHT (Invisible) */}
          <div className="posters-grid-layer" style={{ position: 'relative', visibility: 'hidden', opacity: 0, pointerEvents: 'none', zIndex: 0 }}>
            {group1.map((item, idx) => (
              <div key={idx} className="poster-card-wrapper" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <PosterCard item={item} />
              </div>
            ))}
          </div>

          {/* LAYER 2 (Behind) */}
          <div className="posters-grid-layer group2-grid" style={{ position: 'absolute', inset: 0, opacity: 0, visibility: 'hidden', transform: 'scale(0.15)' }}>
            {group2.map((item, idx) => (
              <div key={idx} className="poster-card-wrapper" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <PosterCard item={item} shouldLoad={group2Ready} />
              </div>
            ))}
          </div>

          {/* LAYER 1 (Front) */}
          <div className="posters-grid-layer group1-grid" style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
            {group1.map((item, idx) => (
              <div key={idx} className="poster-card-wrapper" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <PosterCard item={item} />
              </div>
            ))}
          </div>

          {/* View More Button (Hidden Initially, centered in the grid area) */}
          <div className="poster-btn-wrap" style={{ position: 'absolute', top: '50%', left: '50%', zIndex: 3, display: 'flex', justifyContent: 'center', width: '100%', opacity: 0, visibility: 'hidden', transform: 'translate(-50%, -50%) scale(0.5)' }}>
            <StarBorderBtn href="/projects" color="var(--cyan)">
              View More Works →
            </StarBorderBtn>
          </div>

        </div>
      </div>
    </section>
  )
}



function IndustriesSection() {
  const listRef = useRef(null)
  useGSAP(() => {
    gsap.fromTo('.ind-tag.desktop', { scale: 0.85, opacity: 0 }, {
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
      <div className="container" style={{ position: 'relative' }}>
        <p className="sec-label" style={{ color: 'var(--red)' }}>Sectors we serve</p>
        <ScrollFloat className="sec-title" tag="h2">
          Industries We've <span className="r">Explored</span>
        </ScrollFloat>
        
        <style>{`
          .industries-desktop {
            display: flex;
            flex-wrap: wrap;
            gap: 0.65rem;
            margin-top: 1rem;
            padding-right: 130px;
          }
          
          .industries-mobile {
            display: none;
            margin-top: 2rem;
            margin-left: -20px;
            margin-right: -20px;
            overflow: hidden;
          }
          
          .ind-row-wrap {
            position: relative;
            width: 100vw;
            overflow: hidden;
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            margin-bottom: 0.75rem;
          }
          
          .ind-row {
            display: flex;
            gap: 0.75rem;
            width: max-content;
          }
          
          .ind-row.fwd {
            animation: scroll-left 30s linear infinite;
          }
          
          .ind-row.rev {
            animation: scroll-right 35s linear infinite;
          }
          
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          
          @keyframes scroll-right {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          
          .ind-tag {
            font-size: clamp(0.85rem, 1.8vw, 1.1rem);
            font-weight: 500;
            letter-spacing: -0.02em;
            padding: clamp(0.4rem, 1.5vh, 0.7rem) clamp(1rem, 3.5vw, 1.6rem);
            border-radius: 100px;
            transition: all 0.35s;
            cursor: default;
            white-space: nowrap;
          }

          @media (max-width: 768px) {
            .industries-desktop { display: none; }
            .industries-mobile { display: block; }
          }
        `}</style>

        <div ref={listRef} className="industries-desktop">
          {industries.map((tag) => (
            <span key={tag} className="ind-tag desktop glass-card" onMouseEnter={e => e.currentTarget.classList.add('hovered')} onMouseLeave={e => e.currentTarget.classList.remove('hovered')}>{tag}</span>
          ))}
        </div>

        <div className="industries-mobile">
          {[
            ['Logistics', 'Hospitality', 'Real Estate'],
            ['Food & Beverage', 'Fashion & Apparel', 'Technology & AI'],
            ['Event Management', 'Retail & E-commerce', 'Logistics'],
            ['Hospitality', 'Real Estate', 'Food & Beverage']
          ].map((row, rowIndex) => {
            const duplicated = [...row, ...row, ...row, ...row];
            return (
              <div key={rowIndex} className="ind-row-wrap">
                <div className={`ind-row ${rowIndex % 2 === 0 ? 'fwd' : 'rev'}`}>
                  {duplicated.map((tag, i) => (
                    <span key={i} className="ind-tag glass-card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>{tag}</span>
                  ))}
                </div>
              </div>
            );
          })}
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
            gsap.to(container, { scrollLeft: 0, duration: 1.8, ease: 'power3.inOut' })
          } else {
            const scrollDist = container.clientWidth;
            gsap.to(container, { scrollLeft: container.scrollLeft + scrollDist, duration: 1.8, ease: 'power3.inOut' })
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
  const [activeIndex, setActiveIndex] = useState(0)
  
  useAutoScroll(ref, 6000)

  const handleScroll = () => {
    if (!ref.current) return;
    const cardWidth = window.innerWidth;
    const newIndex = Math.round(ref.current.scrollLeft / cardWidth);
    setActiveIndex(newIndex);
  };

  const scrollTo = (index) => {
    if (!ref.current) return;
    const cardWidth = window.innerWidth;
    ref.current.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
  };

  const steps = [
    {
      number: '01',
      title: 'Discovery',
      desc: 'We uncover your brand\'s vision, audience, and opportunities to build a strong strategic foundation.',
      color: 'var(--green)',
      bg: 'rgba(10,228,105,0.06)',
      border: 'rgba(10,228,105,0.15)',
    },
    {
      number: '02',
      title: 'Strategy',
      desc: 'We define the positioning, messaging, and creative direction that align with your business goals.',
      color: 'var(--cyan)',
      bg: 'rgba(40,193,229,0.06)',
      border: 'rgba(40,193,229,0.15)',
    },
    {
      number: '03',
      title: 'Creation',
      desc: 'Our team transforms strategy into compelling identities, content, campaigns, and digital experiences.',
      color: 'var(--purple)',
      bg: 'rgba(122,67,255,0.06)',
      border: 'rgba(122,67,255,0.15)',
    },
    {
      number: '04',
      title: 'Launch',
      desc: 'We launch, optimize, and measure every initiative to maximize performance and long-term growth.',
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
        <ScrollFloat className="sec-title" tag="h2" style={{ marginBottom: 'clamp(1.5rem, 2vw, 4rem)' }}>
          Our <span className="c">Process</span>
        </ScrollFloat>
        
        <div style={{ position: 'relative', width: '100%' }}>
          <div 
            className="process-grid mobile-slider" 
            ref={ref} 
            onScroll={handleScroll}
            style={{
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
              marginTop: '3rem',
              width: '100%',
              transform: 'translateZ(0)'
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

          <div className="mobile-only-btn" style={{ width: '100%', marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center' }}>
              {steps.map((_, i) => (
                <div key={i} onClick={() => scrollTo(i)} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i === activeIndex ? 'var(--yellow)' : 'rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'background 0.3s ease' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const sectionRef = useRef(null)

  useGSAP(() => {
    gsap.from('.testimonial-reveal', {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        once: true
      },
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out'
    })
  }, { scope: sectionRef })

  const testimonials = [
    {
      id: 1,
      title: 'Nizam - Capitus',
      description: 'Working with Colour Parrot has been an absolute delight. They understand our vision without us having to over-explain, and that’s what makes the process so easy. Every idea we share comes back better, sharper, & perfectly in tune with who we are as an institute. Their team is an excellent creative bunch, consistent, thoughtful, and full of fresh ideas.',
      image: '/logos/capitus.webp',
      initial: 'N',
      color: 'var(--green)'
    },
    {
      id: 2,
      title: 'Aparna - Fobas',
      description: 'Color Parrot is doing a great job in Digital marketing! Their videos and posters are really creative and effective. I’m very happy with their work and highly recommend their services. 👍 Fobas Institute appreciates the excellent digital marketing support from Color Parrot. Their creative videos and posters have greatly enhanced our online presence',
      image: '/logos/fobas.webp',
      initial: 'A',
      color: 'var(--cyan)'
    },
    {
      id: 3,
      title: 'Arun Krishna - Founder, Nuvana Health',
      description: 'The motion graphics they created for our product launch exceeded every expectation. Truly a world-class creative team based right here in Kerala.',
      image: '/logos/nuvana-logo.webp',
      initial: 'A',
      color: 'var(--purple)'
    },
    {
      id: 4,
      title: 'Abdul Hameed - Mask',
      description: 'Digital marketing with Colour Parrot is effortless. Creative posters, effective social media management, and stunning graphics make every campaign pop.',
      image: '',
      initial: 'A',
      color: 'var(--blue)'
    },
    {
      id: 5,
      title: 'Shameema - Brain Boot',
      description: 'Colour Parrot! Innovative ideas and creative approach make their work truly stand out. I really appreciate their professionalism and positive attitude. They are affordable, friendly, and always maintain a strong focus on quality in everything they do. I’ve already recommended Colour Parrot to my brothers and friends. A perfect choice for anyone looking for reliable and effective digital marketing support!',
      image: '',
      initial: 'S',
      color: 'var(--orange)'
    },
    {
      id: 6,
      title: 'Muhammed Ashar V - Star Eye Care',
      description: 'Very good service. The marketing was worth the money. Really good communication. The commissioned posters were all great in quality in terms of graphics, content, and marketability.',
      image: '',
      initial: 'M',
      color: 'var(--pink)'
    },
    {
      id: 7,
      title: 'Shahdad EK - Frywings',
      description: 'From content creation to social media campaigns, Colour Parrot knows how to engage audiences. Poster designs are always on point!',
      image: '',
      initial: 'S',
      color: 'var(--yellow)'
    },
    {
      id: 8,
      title: 'Sahl Mundoli - Jadwa',
      description: 'Great team and coordination with the client. Willing to listen and improve based on the requirements.',
      image: '',
      initial: 'S',
      color: 'var(--green)'
    }
  ]

  return (
    <section id="testimonials" ref={sectionRef} className="pad" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
      <div className="container testimonial-reveal">
        <p className="sec-label" style={{ color: 'var(--yellow)' }}>Client Stories</p>
        <ScrollFloat className="sec-title" tag="h2" style={{ marginBottom: 'clamp(1.5rem, 2vw, 3.5rem)' }}>
          What They <span className="y">Say</span>
        </ScrollFloat>
        
        <div className="testimonial-reveal" style={{ marginTop: '3rem', width: '100%' }}>
          <TestimonialsMarquee items={testimonials} />
        </div>
        
      </div>
    </section>
  )
}

function FAQSection() {
  const faqs = [
    { q: "What services does Colour Parrot offer?", a: "We provide end-to-end creative solutions, including brand identity, video production, digital marketing, web & UI/UX design, content creation, and creative advertising." },
    { q: "Which industries do you work with?", a: "We work with businesses across logistics, hospitality, real estate, food & beverage, fashion & apparel, technology & AI, event management, retail, and e-commerce. Our approach is tailored to every industry and business goal." },
    { q: "Do you work with startups as well as established businesses?", a: "Yes. Whether you're launching a new brand or scaling an existing one, we develop creative strategies that align with your stage of growth." },
    { q: "Can you handle an entire project from strategy to execution?", a: "Absolutely. From brand strategy and creative direction to production, marketing, and launch, we manage the complete creative process under one roof." },
    { q: "Do you offer custom solutions?", a: "Yes. Every business is different, so every solution we deliver is tailored to your objectives, audience, and market." },
    { q: "How does your creative process work?", a: "Our process consists of four stages: Discovery, Strategy, Creation, and Launch. This structured approach ensures every project is aligned with your business goals and delivers measurable results." },
    { q: "How long does a typical project take?", a: "Project timelines vary depending on the scope and complexity. After understanding your requirements, we'll provide a detailed timeline before the project begins." },
    { q: "How do I get started?", a: "Simply reach out through our contact form or schedule a consultation. We'll discuss your goals, understand your requirements, and recommend the best approach for your brand." }
  ]
  
  const [open, setOpen] = useState(null)

  return (
    <section id="faq" className="pad" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: 1100 }}>
        <p className="sec-label" style={{ color: 'var(--purple)', justifyContent: 'center' }}>Got Questions?</p>
        <ScrollFloat className="sec-title" tag="h2" style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 2vw, 3rem)' }}>
          Frequently Asked <span className="p">Questions</span>
        </ScrollFloat>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              style={{ 
                border: '1px solid rgba(255,255,255,0.08)', 
                borderRadius: '16px', 
                padding: '1.5rem',
                cursor: 'pointer',
                background: open === i ? 'rgba(255,255,255,0.03)' : 'transparent',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500, color: open === i ? 'var(--purple)' : '#fff' }}>{faq.q}</h4>
                <span style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.5)', transform: open === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s ease' }}>+</span>
              </div>
              <div style={{ 
                maxHeight: open === i ? '200px' : '0', 
                overflow: 'hidden', 
                transition: 'max-height 0.3s ease',
                marginTop: open === i ? '1rem' : '0'
              }}>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  const titleRef = useRef(null)
  const [status, setStatus] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');
    const formData = new FormData(e.target);
    formData.append("access_key", "dd36d479-f98a-4f9b-8ad3-2fd4184c54f7"); 
    try {
      const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: formData });
      const data = await response.json();
      if (data.success) {
        setStatus('Message sent successfully!');
        e.target.reset();
      } else {
        setStatus('Failed to send message. Please try again.');
      }
    } catch (error) {
      setStatus('An error occurred. Please try again later.');
    }
  };

  return (
    <section id="contact" className="pad" style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(3rem, 6vw, 6rem)', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <div>
          <p className="sec-label">Get in touch</p>
          <h2 ref={titleRef} style={{ fontSize: 'clamp(3.5rem, 10vw, 7rem)', fontWeight: 500, letterSpacing: '-0.06em', lineHeight: 0.88, marginBottom: '2.75rem' }}>
            <span className="g">LET'S</span><br /><span className="c">BUILD.</span>
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
            {[ 
              { label: 'Email', value: 'info@colourparrot.com', link: 'mailto:info@colourparrot.com' }, 
              { label: 'Phone', value: '+91 96338 65774', link: 'tel:+919633865774' },
              { label: 'Location', value: "Kozhikode, Kerala", link: 'https://www.google.com/maps/search/Colour+Parrot+Branding+%26+Advertising/@11.2256954,75.7985431,17z/data=!3m1!4b1?entry=ttu' }, 
              { 
                label: 'Social', 
                value: (
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <a href="https://www.instagram.com/colour.parrot/" target="_blank" rel="noreferrer" className="social-link" onMouseEnter={e=>e.currentTarget.classList.add('hovered')} onMouseLeave={e=>e.currentTarget.classList.remove('hovered')}><InstagramIcon width="22" height="22" /></a>
                    <a href="https://www.behance.net/colourparrotbranding" target="_blank" rel="noreferrer" className="social-link" onMouseEnter={e=>e.currentTarget.classList.add('hovered')} onMouseLeave={e=>e.currentTarget.classList.remove('hovered')}><BehanceIcon width="22" height="22" /></a>
                    <a href="https://www.facebook.com/share/1F9u1EHMhb/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="social-link" onMouseEnter={e=>e.currentTarget.classList.add('hovered')} onMouseLeave={e=>e.currentTarget.classList.remove('hovered')}><FacebookIcon width="22" height="22" /></a>
                    <a href="https://www.linkedin.com/company/colour-parrot/" target="_blank" rel="noreferrer" className="social-link" onMouseEnter={e=>e.currentTarget.classList.add('hovered')} onMouseLeave={e=>e.currentTarget.classList.remove('hovered')}><LinkedInIcon width="22" height="22" /></a>
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
          
          <div style={{ marginTop: '1rem' }}>
            {status && (
              <div style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: '8px', background: status.includes('success') ? 'rgba(10,228,105,0.1)' : 'rgba(255,255,255,0.05)', color: status.includes('success') ? 'var(--green)' : 'white', fontSize: '0.9rem' }}>
                {status}
              </div>
            )}
            <form style={{ display: 'grid', gap: '1.2rem' }} onSubmit={handleSubmit}>
              <input name="name" required type="text" placeholder="Full Name" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: '1rem 1.5rem', borderRadius: '12px', color: 'white', outline: 'none', transition: 'border-color 0.3s', fontFamily: 'inherit' }} onFocus={e=>e.target.style.borderColor='var(--green)'} onBlur={e=>e.target.style.borderColor='var(--glass-border)'} />
              <input name="email" required type="email" placeholder="Email Address" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: '1rem 1.5rem', borderRadius: '12px', color: 'white', outline: 'none', transition: 'border-color 0.3s', fontFamily: 'inherit' }} onFocus={e=>e.target.style.borderColor='var(--green)'} onBlur={e=>e.target.style.borderColor='var(--glass-border)'} />
              <textarea name="message" required rows="3" placeholder="How can we help?" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: '1rem 1.5rem', borderRadius: '12px', color: 'white', outline: 'none', transition: 'border-color 0.3s', resize: 'none', fontFamily: 'inherit' }} onFocus={e=>e.target.style.borderColor='var(--green)'} onBlur={e=>e.target.style.borderColor='var(--glass-border)'}></textarea>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <Magnet padding={40} disabled={false}>
                  <StarBorderBtn as="button" type="submit" size="lg" disabled={status === 'Sending...'}>
                    {status === 'Sending...' ? 'Sending...' : 'Send Message →'}
                  </StarBorderBtn>
                </Magnet>
              </div>
            </form>
          </div>
        </div>

        {/* Map Integration */}
        <div style={{ 
          position: 'relative', height: 'clamp(320px, 45vh, 550px)', borderRadius: '40px', overflow: 'hidden',
          border: '1px solid var(--glass-border)', boxShadow: '0 40px 100px rgba(0,0,0,0.6)'
        }}>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6277.856447745043!2d75.79854311168889!3d11.225695361399202!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba659d721eb6aeb%3A0x972a68879fe6780!2sColour%20Parrot%20Branding%20%26%20Advertising!5e0!3m2!1sen!2sin!4v1760282951078!5m2!1sen!2sin" 
            width="100%" height="100%" style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)' }} 
            allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  )
}
