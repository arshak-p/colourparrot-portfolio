import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '../hooks/useGSAP'

import StarBorderBtn from '../components/StarBorderBtn'
import ClientLogos from "../components/ClientLogos";
import BorderGlow from '../components/BorderGlow'
import MarqueeStrip from '../components/MarqueeStrip'

import ParallaxStrip from '../components/ParallaxStrip'


import { 
  services, 
  workItems, 
  planets, 
  industries, 
  marqueeItems1, 
  marqueeItems2 
} from '../data'

import logo from '../assets/logo.png'


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
      <ClientLogos />
      <IndustriesSection />

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
  const scrollTo = (id) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="hero" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 8%', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @media (max-width: 768px) {
          #hero { padding: 0 6% !important; }
          #hero .container { paddingTop: 8vh !important; }
          #hero h1 { font-size: clamp(2.5rem, 12vw, 4rem) !important; line-height: 1.1 !important; }
          #hero .hero-sub { font-size: 0.9rem !important; margin-bottom: 2rem !important; }
          #hero .hero-btns { gap: 0.8rem !important; }
        }
      `}</style>
      
      <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '12vh' }}>
        
        <h1 style={{ fontSize: 'clamp(3rem, 8.5vw, 6.8rem)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 0.95, marginBottom: '1.5rem', textTransform: 'none' }}>
          {[
            [{ text: 'Where', cls: 'g' }, { text: 'Brands', cls: '' }],
            [{ text: 'Go',   cls: 'c' }, { text: 'Beyond',  cls: 'p' }],
            [{ text: 'Gravity', cls: 'y' }],
          ].map((line, li) => (
            <span key={li} style={{ overflow: 'hidden', display: 'block', paddingBottom: '0.1em' }}>
              {line.map((w, wi) => (
                <span key={wi} className={`hero-word ${w.cls}`} style={{ display: 'inline-block', transform: 'translateY(110%)', marginRight: wi < line.length - 1 ? '0.2em' : 0 }}>{w.text}</span>
              ))}
            </span>
          ))}
        </h1>

        {/* Tag below heading with reduced margin */}
        <p className="hero-tag" style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--green)', fontWeight: 500, opacity: 0, transform: 'translateY(12px)', display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
          <span style={{ width: 25, height: 1, background: 'var(--green)', display: 'inline-block', opacity: 0.4 }} />
          Kozhikode · Kerala · Est. 2020
        </p>
        
        <p className="hero-sub" style={{ maxWidth: 460, fontSize: '1rem', lineHeight: 1.8, color: 'rgba(242,242,242,0.4)', fontWeight: 400, opacity: 0, transform: 'translateY(12px)', marginBottom: '2.5rem' }}>
          Colour Parrot is a full-spectrum creative agency — branding, motion, production, digital — launching brands into orbit from Calicut.
        </p>
        
        <div className="hero-btns" style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', opacity: 0, transform: 'translateY(12px)', alignItems: 'center' }}>
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
      scrollTrigger: { trigger: cardsRef.current, start: 'top 78%' },
    })
  }, [])

  return (
    <section id="about" className="pad" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(2rem, 5vw, 6rem)', alignItems: 'center' }}>
        <div>
          <p className="sec-label">About us</p>
          <h2 className="sec-title">A Creative Force<br />From <span className="c">Deep Space</span></h2>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'rgba(242,242,242,0.6)', fontWeight: 400, marginBottom: '3rem' }}>
            Based in Kozhikode, Colour Parrot is a full-service branding and advertising agency that transforms ideas into iconic brand experiences. We live at the intersection of strategy and art — every pixel, frame, and word is intentional.
          </p>
          <StarBorderBtn onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}>Work With Us</StarBorderBtn>
        </div>
        <div ref={cardsRef} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
          {cards.map((c, i) => (
            <BorderGlow
              key={i}
              className="acard"
              style={{ gridColumn: c.span === 2 ? '1/-1' : undefined }}
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
              backgroundColor="#061014"
              borderRadius={28}
            >
              <div style={{ padding: '2rem' }}>
                <div style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 500, letterSpacing: '-0.05em', lineHeight: 1, marginBottom: '0.5rem', color: c.col }}>{c.n}</div>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500, opacity: 0.6 }}>{c.l}</div>
              </div>
            </BorderGlow>
          ))}
        </div>

      </div>
    </section>
  )
}

function ServicesSection() {
  const menuRef = useRef(null)
  useEffect(() => {
    const menu = menuRef.current
    if (!menu) return
    const cleanups = []
    services.forEach((item, idx) => {
      const wrap  = menu.children[idx]
      const link  = wrap.querySelector('a')
      const marq  = wrap.querySelector('.svc-marquee')
      const inner = wrap.querySelector('.svc-minner')
      const part = inner.querySelector('.svc-mpart')
      if (part) {
        const timer = setTimeout(() => {
          const cw = part.offsetWidth || 350
          gsap.to(inner, { x: -cw, duration: 15, ease: 'none', repeat: -1 })
        }, 200)
        cleanups.push(() => clearTimeout(timer))
      }
      const AD = { duration: 0.55, ease: 'expo.out' }
      const dist = (x,y,x2,y2) => (x-x2)**2 + (y-y2)**2
      const edge = (mx,my,w,h) => dist(mx,my,w/2,0) < dist(mx,my,w/2,h) ? 'top' : 'bottom'
      const onEnter = (ev) => {
        const r = wrap.getBoundingClientRect()
        const e = edge(ev.clientX-r.left, ev.clientY-r.top, r.width, r.height)
        gsap.timeline({ defaults: AD }).set(marq, { y: e==='top' ? '-101%' : '101%' }).set(inner, { y: e==='top' ? '101%' : '-101%' }).to([marq, inner], { y: '0%' })
      }
      const onLeave = (ev) => {
        const r = wrap.getBoundingClientRect()
        const e = edge(ev.clientX-r.left, ev.clientY-r.top, r.width, r.height)
        gsap.timeline({ defaults: AD }).to(marq, { y: e==='top' ? '-101%' : '101%' }).to(inner, { y: e==='top' ? '101%' : '-101%' }, 0)
      }
      link.addEventListener('mouseenter', onEnter)
      link.addEventListener('mouseleave', onLeave)
      cleanups.push(() => { link.removeEventListener('mouseenter', onEnter); link.removeEventListener('mouseleave', onLeave) })
    })
    return () => cleanups.forEach(fn => fn())
  }, [])

  return (
    <section id="services" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, overflow: 'hidden' }}>
      <div className="container" style={{ padding: '8vh 5% 4vh' }}>
        <p className="sec-label">Our Expertise</p>
        <h2 className="sec-title" style={{ marginBottom: 0 }}>Services in <span className="g">Orbit</span></h2>
      </div>
      <div style={{ flex: 1, width: '100%', borderTop: '1px solid rgba(242,242,242,0.08)', display: 'flex', flexDirection: 'column' }}>
        <div ref={menuRef} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {services.map((item, idx) => (
            <div key={idx} style={{ flex: 1, minHeight: '120px', position: 'relative', overflow: 'hidden', borderBottom: '1px solid rgba(242,242,242,0.06)', display: 'flex' }}>

              <Link to={`/services/${item.slug}`} style={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: '100%', 
                textDecoration: 'none', 
                textTransform: 'uppercase', 
                fontWeight: 500, 
                fontSize: 'clamp(1.5rem, 6vh, 5.2rem)', 
                fontFamily: 'ClashGrotesk, var(--font)', 
                letterSpacing: '-0.04em', 
                gap: '1.2rem', 
                position: 'relative', 
                zIndex: 1, 
                cursor: 'pointer', 
                color: item.accent,
                padding: '1.5rem 0'
              }}>
                <span style={{ fontSize: '0.35em', fontWeight: 600, opacity: 0.5, letterSpacing: '0.05em' }}>0{idx+1}</span>
                {item.name}
              </Link>


              <div className="svc-marquee" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', transform: 'translateY(101%)', zIndex: 2, backgroundColor: item.accent }}>
                <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
                  <div className="svc-minner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: 'max-content', willChange: 'transform' }}>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="svc-mpart" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                        <span style={{ whiteSpace: 'nowrap', textTransform: 'uppercase', fontWeight: 500, fontSize: 'clamp(1.2rem, 4vh, 3.8rem)', padding: '0 4vw', fontFamily: 'ClashGrotesk, var(--font)', letterSpacing: '-0.04em', color: '#010d12' }}>{item.name}</span>
                        <div style={{ width: '12vh', height: '5vh', margin: '0 2.5vw', borderRadius: 100, backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.9 }} />
                      </div>

                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectsSection() {
  const scrollRef = useRef(null)
  const projects = [
    { name: 'Astro Identity', category: 'Branding', image: 'https://picsum.photos/800/600?random=101' },
    { name: 'Nebula Motion',  category: 'Motion',   image: 'https://picsum.photos/800/600?random=102' },
    { name: 'Cosmos Digital', category: 'Digital',  image: 'https://picsum.photos/800/600?random=103' },
  ]
  useGSAP(() => {
    gsap.fromTo('.proj-card', { y: 50, opacity: 0 }, {
      y: 0, opacity: 1, stagger: 0.15, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: scrollRef.current, start: 'top 80%' },
    })
  }, [])

  return (
    <section id="projects" ref={scrollRef} className="pad" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '5rem' }}>
          <div>
            <p className="sec-label" style={{ color: 'var(--purple)' }}>Recent Work</p>
            <h2 className="sec-title">Featured <span className="p">Projects</span></h2>
          </div>
          <StarBorderBtn href="/projects" color="var(--purple)">View All Work</StarBorderBtn>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
          {projects.map((p, i) => (
            <div key={i} className="proj-card" style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
              <div style={{ width: '100%', aspectRatio: '16/10', overflow: 'hidden', borderRadius: 24 }}>
                <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.12)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
              </div>
              <div style={{ padding: '2.5rem 1rem' }}>
                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--purple)', fontWeight: 500, marginBottom: '1rem' }}>{p.category}</p>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 500, letterSpacing: '-0.03em' }}>{p.name}</h3>
              </div>
            </div>
          ))}
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
      scrollTrigger: { trigger: listRef.current, start: 'top 82%' },
    })
  }, [])
  return (
    <section id="industries" className="pad" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="container">
        <p className="sec-label" style={{ color: 'var(--red)' }}>Sectors we serve</p>
        <h2 className="sec-title">Industries We've <span className="r">Explored</span></h2>
        <div ref={listRef} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '2.5rem' }}>
          {industries.map((tag) => (
            <span key={tag} className="ind-tag glass-card" style={{ fontSize: 'clamp(0.9rem, 2vw, 1.2rem)', fontWeight: 500, letterSpacing: '-0.02em', padding: '0.8rem 2rem', borderRadius: 100, color: 'rgba(242,242,242,0.4)', transition: 'all 0.4s', cursor: 'default' }} onMouseEnter={e => { e.currentTarget.style.color='var(--green)'; e.currentTarget.style.borderColor='var(--green)'; e.currentTarget.style.background='rgba(10,228,105,0.08)'; e.currentTarget.style.transform='translateY(-4px)' }} onMouseLeave={e => { e.currentTarget.style.color='rgba(242,242,242,0.4)'; e.currentTarget.style.borderColor='var(--glass-border)'; e.currentTarget.style.background='var(--glass)'; e.currentTarget.style.transform='' }}>{tag}</span>
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
      scrollTrigger: { trigger: titleRef.current, start: 'top 72%' },
    })
  }, [])
  return (
    <section id="contact" className="pad" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '5rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <div>
          <p className="sec-label">Get in touch</p>
          <h2 ref={titleRef} style={{ fontSize: 'clamp(4rem, 12vw, 8rem)', fontWeight: 500, letterSpacing: '-0.06em', lineHeight: 0.85, marginBottom: '3rem' }}>
            <span className="g">LET'S</span><br /><span className="c">BUILD.</span>
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '4rem' }}>
            {[ 
              { label: 'Email', value: 'info@colourparrot.com', link: 'mailto:info@colourparrot.com' }, 
              { label: 'Phone', value: '+91 94008 90105', link: 'tel:+919400890105' },
              { label: 'Location', value: "Kozhikode, Kerala", link: 'https://www.google.com/maps/search/Colour+Parrot+Branding+%26+Advertising/@11.2256954,75.7985431,17z/data=!3m1!4b1?entry=ttu' }, 
              { 
                label: 'Social', 
                value: (
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.6rem' }}>
                    <a href="https://www.instagram.com/colour.parrot/" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.3s' }} onMouseEnter={e=>e.currentTarget.style.color='var(--green)'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.4)'}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
                    <a href="https://www.behance.net/colourparrotbranding" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.3s' }} onMouseEnter={e=>e.currentTarget.style.color='var(--green)'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.4)'}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12h-4"></path><path d="M9 16h-4"></path><path d="M5 8h4a2 2 0 1 1 0 4h-4v-4z"></path><path d="M5 12h4a2 2 0 1 1 0 4h-4v-4z"></path><path d="M13 12h7"></path><path d="M20 12c0-3-2-5-5-5s-5 2-5 5 2 5 5 5 5-2 5-5z"></path></svg></a>
                    <a href="https://www.facebook.com/share/1F9u1EHMhb/?mibextid=wwXIfr" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.3s' }} onMouseEnter={e=>e.currentTarget.style.color='var(--green)'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.4)'}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
                    <a href="https://www.linkedin.com/company/colour-parrot/" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.3s' }} onMouseEnter={e=>e.currentTarget.style.color='var(--green)'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.4)'}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
                  </div>
                ),
                link: '#' 
              }, 
            ].map(({ label, value, link }) => (
              <div key={label}>
                <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,242,242,0.3)', fontWeight: 500, marginBottom: '0.6rem' }}>{label}</p>
                {typeof value === 'string' ? (
                  <a href={link} style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--light)', textDecoration: 'none', display: 'block', transition: 'color 0.3s' }} onMouseEnter={e=>e.currentTarget.style.color='var(--green)'} onMouseLeave={e=>e.currentTarget.style.color='var(--light)'}>{value}</a>
                ) : (
                  value
                )}
              </div>
            ))}
          </div>
          
          <StarBorderBtn href="mailto:info@colourparrot.com" size="lg">Start a Project →</StarBorderBtn>
        </div>

        {/* Map Integration */}
        <div style={{ 
          position: 'relative', height: '550px', borderRadius: '40px', overflow: 'hidden',
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
