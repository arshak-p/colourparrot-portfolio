import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { services } from '../data'
import StarBorderBtn from '../components/StarBorderBtn'
import BorderGlow from '../components/BorderGlow'
import Magnet from '../components/Magnet'
import { brandingItems } from '../data/brandingData'
import VideoProductionPage from '../components/services/VideoProductionPage'
import DigitalMarketingPage from '../components/services/DigitalMarketingPage'
import WebDesignPage from '../components/services/WebDesignPage'
import ContentCreationPage from '../components/services/ContentCreationPage'
import CreativeAdvertisingPage from '../components/services/CreativeAdvertisingPage'
import ScrollFloat from '../components/ScrollFloat';
import React from 'react'



const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
}

export default function ServiceDetailPage() {
  const { serviceId } = useParams()
  const service = services.find(s => s.slug === serviceId)

  if (!service) {
    return (
      <section className="pad" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <ScrollFloat className="sec-title" tag="h1">Service Not Found</ScrollFloat>
          <Link to="/services"><StarBorderBtn>Back to Services</StarBorderBtn></Link>
        </div>
      </section>
    )
  }

  if (serviceId === 'brand-identity') return <BrandIdentityPage service={service} />;
  if (serviceId === 'video-production') return <VideoProductionPage service={service} />;
  if (serviceId === 'digital-marketing') return <DigitalMarketingPage service={service} />;
  if (serviceId === 'web-design') return <WebDesignPage service={service} />;
  if (serviceId === 'content-creation') return <ContentCreationPage service={service} />;
  if (serviceId === 'creative-advertising') return <CreativeAdvertisingPage service={service} />;

  return <GenericServicePage service={service} />;
}

function BrandIdentityPage({ service }) {
  return (
    <div
      className="page-root"
      style={{ position: 'relative', zIndex: 10, background: '#000000' }}
    >
      {/* Custom Hero for Brand Identity */}
      <section className="pad" style={{ minHeight: '80vh', paddingTop: '15vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ 
          position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', 
          background: `radial-gradient(circle, ${service.accent}20 0%, transparent 70%)`,
          borderRadius: '50%', filter: 'blur(100px)', zIndex: 0
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial="hidden" animate="visible" variants={containerVariants} style={{ maxWidth: '800px' }}>
            <motion.div variants={itemVariants} className="sec-label" style={{ color: service.accent, marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Home</Link> 
              <span style={{ opacity: 0.3 }}>/</span> 
              <Link to="/services" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Services</Link> 
              <span style={{ opacity: 0.3 }}>/</span> 
              <span>Brand Identity</span>
            </motion.div>
            <motion.h1 variants={itemVariants} style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '2rem', letterSpacing: '-0.03em', color: '#fff' }}>
              Crafting <span style={{ color: service.accent }}>Timeless</span><br />
              Brand Identities
            </motion.h1>
            <motion.p variants={itemVariants} style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '3rem', maxWidth: '600px' }}>
              {service.desc}
            </motion.p>
            <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <StarBorderBtn href="/contact" color={service.accent}>Inquire Now</StarBorderBtn>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Core Identity Pillars (Bento Grid) */}
      <BrandingBentoGrid />

      {/* Step-by-step Process Section */}
      <ServiceProcess service={service} steps={brandingSteps} />

      {/* Scrollable Gallery Section */}
      <BrandingShowcase items={brandingItems} accent={service.accent} />

      {/* Footer CTA */}
      <section className="pad" style={{ textAlign: 'center', minHeight: '50vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          {/* Process Section */}
          <ServiceProcess service={service} steps={
            service.slug === 'digital-marketing' ? digitalMarketingSteps :
            service.slug === 'web-design' ? webDesignSteps : null
          } />

          <ScrollFloat className="sec-title" tag="h2" style={{ marginTop: '6rem' }}>
            Ready to <span style={{ color: service.accent }}>Elevate?</span>
          </ScrollFloat>
          <motion.p initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:0.1}} style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '3rem' }}>
            Explore how we can transform your brand identity journey.
          </motion.p>
          <motion.div initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:0.2}} style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <StarBorderBtn href="/services" color="rgba(255,255,255,0.3)">VIEW ALL SERVICES</StarBorderBtn>
            <Magnet padding={80} disabled={false}>
              <StarBorderBtn href="/contact">Get Started</StarBorderBtn>
            </Magnet>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function GenericServicePage({ service }) {

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="page-root"
      style={{ position: 'relative', zIndex: 10 }}
    >
      <section className="pad" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background Decorative Element */}
        <div style={{ 
          position: 'absolute', top: '20%', right: '-10%', width: '60vw', height: '60vw', 
          background: `radial-gradient(circle, ${service.accent}15 0%, transparent 70%)`,
          borderRadius: '50%', filter: 'blur(80px)', zIndex: -1
        }} />

        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <div>
            <motion.div variants={itemVariants} className="sec-label" style={{ color: service.accent }}>
              Service Detail
            </motion.div>
            <ScrollFloat className="sec-title" tag="h1" style={{ marginBottom: '2rem' }}>
              {service.name.split(' ').map((word, i) => (
                <span key={i} style={{ display: 'block' }}>
                  {i === service.name.split(' ').length - 1 ? <span style={{ color: service.accent }}>{word}</span> : word}
                </span>
              ))}
            </ScrollFloat>
            <motion.p variants={itemVariants} style={{ maxWidth: 500, fontSize: '1.2rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', marginBottom: '3rem' }}>
              {service.desc}
            </motion.p>
            <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <StarBorderBtn href="/contact" color={service.accent}>Inquire Now</StarBorderBtn>
            </motion.div>
          </div>
          
          <motion.div variants={itemVariants} style={{ position: 'relative' }}>
             <div style={{ 
               width: '100%', aspectRatio: '4/5', borderRadius: '40px', overflow: 'hidden', 
               border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 40px 100px rgba(0,0,0,0.5)'
             }}>
               <img src={service.image} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             </div>
             <div className="service-approach-badge" style={{ 
                padding: '2rem', 
                background: 'rgba(2,23,30,0.8)', backdropFilter: 'blur(20px)', borderRadius: '24px',
                border: `1px solid ${service.accent}30`, maxWidth: '250px'
             }}>
               <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5, marginBottom: '0.5rem' }}>Our Approach</p>
               <p style={{ fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.4 }}>{service.pill}</p>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section Example */}
      <section className="pad" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--glass-border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
            {[
              { t: 'Strategic Planning', d: 'We align your business goals with creative execution for maximum market impact.' },
              { t: 'Expert Execution', d: 'Our team of specialists ensures every pixel and frame is polished to perfection.' },
              { t: 'Proven Results', d: 'We track performance and iterate to ensure your brand consistently stays ahead.' }
            ].map((item, i) => (
              <BorderGlow 
                key={i} 
                className="acard" 
                glowColor={
                  service.accent === 'var(--green)' ? '160 84 62' :
                  service.accent === 'var(--cyan)' ? '190 80 60' :
                  service.accent === 'var(--purple)' ? '260 70 60' :
                  service.accent === 'var(--yellow)' ? '45 80 60' : '40 80 80'
                }
                colors={
                  service.accent === 'var(--green)' ? ['#1D9E75', '#0ae469'] :
                  service.accent === 'var(--cyan)' ? ['#28c1e5', '#38bdf8'] :
                  service.accent === 'var(--purple)' ? ['#7a43ff', '#c084fc'] :
                  service.accent === 'var(--yellow)' ? ['#f9cc3d', '#ffed4a'] : ['#c084fc', '#f472b6']
                }
                backgroundColor="#061014"
                borderRadius={32}
                fillOpacity={0.5}
              >
                <div style={{ padding: '3rem' }}>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: service.accent }}>{item.t}</h3>
                  <p style={{ opacity: 0.5, fontSize: '0.95rem', lineHeight: 1.6 }}>{item.d}</p>
                </div>
              </BorderGlow>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="pad" style={{ textAlign: 'center', minHeight: '50vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <ScrollFloat className="sec-title" tag="h2">
            Next <span style={{ color: service.accent }}>Level?</span>
          </ScrollFloat>
          <motion.p variants={itemVariants} style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '3rem' }}>Explore how we can transform your {service.name.toLowerCase()} journey.</motion.p>
          <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <StarBorderBtn href="/services" color="rgba(255,255,255,0.3)">VIEW ALL SERVICES</StarBorderBtn>
            <Magnet padding={80} disabled={false}>
              <StarBorderBtn href="/contact">Get Started</StarBorderBtn>
            </Magnet>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

function BrandingShowcase({ items, accent }) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 8;
  
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const rows = [];
  for (let i = 0; i < currentItems.length; i += 2) {
    rows.push(currentItems.slice(i, i + 2));
  }

  return (
    <section className="pad" style={{ background: '#000000', color: 'white', padding: '8rem 0', position: 'relative', zIndex: 10 }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Section title */}
        <div style={{ marginBottom: '5rem', textAlign: 'center' }}>
          <span style={{ 
            fontSize: '0.8rem', 
            fontFamily: 'monospace', 
            letterSpacing: '0.3em', 
            color: accent, 
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '1rem'
          }}>
            Showcase Gallery
          </span>
          <h2 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            fontWeight: 800, 
            margin: 0, 
            letterSpacing: '-0.03em',
            color: '#ffffff'
          }}>
            Brand <span style={{ color: accent }}>Deliverables</span>
          </h2>
        </div>

        {/* Grid and row list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
          {rows.map((row, rowIndex) => (
            <motion.div 
              key={rowIndex}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-120px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '4rem' 
              }}
            >
              {row.map((item, colIndex) => (
                <div 
                  key={colIndex} 
                  style={{ 
                    flex: colIndex === 0 && row.length > 1 ? 1.5 : 1,
                    position: 'relative',
                    aspectRatio: colIndex === 0 && row.length > 1 ? '16/9' : '4/5'
                  }}
                >
                  <ShowcaseHoverCard item={item} accent={accent} />
                </div>
              ))}
            </motion.div>
          ))}
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '6rem' }}>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentPage(i + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  width: '40px', height: '40px',
                  borderRadius: '50%',
                  border: `1px solid ${currentPage === i + 1 ? accent : 'rgba(255,255,255,0.1)'}`,
                  background: currentPage === i + 1 ? accent : 'transparent',
                  color: currentPage === i + 1 ? '#000' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: 'bold'
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

function ShowcaseHoverCard({ item }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Link 
      to={item.link}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        backgroundColor: '#111'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Main Image */}
      <img 
        src={item.image} 
        alt={item.title} 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          position: 'absolute',
          inset: 0,
          opacity: hovered && item.secondaryImage ? 0 : 1,
          transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: hovered ? 'scale(1.05)' : 'scale(1)'
        }} 
      />

      {/* Secondary Image */}
      {item.secondaryImage && (
        <img 
          src={item.secondaryImage} 
          alt={`${item.title} secondary`} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            position: 'absolute',
            inset: 0,
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: hovered ? 'scale(1.05)' : 'scale(1)'
          }} 
        />
      )}

      {/* Info Overlay */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        padding: '2rem',
        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
        color: 'white',
        opacity: hovered ? 1 : 0,
        transform: hovered ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 0.4s ease'
      }}>
        <h3 style={{ margin: 0, fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.title}</h3>
        <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem' }}>{item.description}</p>
      </div>
    </Link>
  );
}

function BrandingBentoGrid() {
  const deliverables = [
    {
      title: "1. Brand Identity Systems",
      desc: "We engineer fully responsive logo systems (primary, secondary, sub-marks, and favicons) along with precise usage guidelines for color, typography, grids, and alignment constraints.",
      spanClass: "span-2",
      accent: "#0ae469",
      glow: "rgba(10, 228, 105, 0.12)",
      illustration: (
        <svg width="100%" height="100%" viewBox="0 0 400 150" fill="none">
          <rect x="10" y="10" width="380" height="130" rx="12" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <circle cx="200" cy="75" r="50" stroke="#0ae469" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.8" />
          <line x1="50" y1="75" x2="350" y2="75" stroke="rgba(10, 228, 105, 0.2)" strokeWidth="0.75" />
          <line x1="200" y1="20" x2="200" y2="130" stroke="rgba(10, 228, 105, 0.2)" strokeWidth="0.75" />
          <path d="M 180 75 L 200 45 L 220 75 L 200 105 Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="200" cy="75" r="4" fill="#0ae469" />
          <text x="212" y="48" fill="rgba(255,255,255,0.3)" fontSize="9" letterSpacing="0.1em">TANGENT 1.0</text>
        </svg>
      )
    },
    {
      title: "2. Color Harmonies",
      desc: "Contrast-safe palettes mapped out for digital accessibility (WCAG), offset printing (Pantone matching), and variable screen display consistency.",
      spanClass: "",
      accent: "#28c1e5",
      glow: "rgba(40, 193, 229, 0.12)",
      illustration: (
        <svg width="100%" height="100%" viewBox="0 0 200 150" fill="none">
          <rect x="10" y="20" width="45" height="110" rx="8" fill="#010d12" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <rect x="25" y="32" width="18" height="18" rx="4" fill="#0ae469" />
          <text x="20" y="115" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace">#0AE469</text>

          <rect x="68" y="20" width="45" height="110" rx="8" fill="#010d12" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <rect x="83" y="32" width="18" height="18" rx="4" fill="#28c1e5" />
          <text x="78" y="115" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace">#28C1E5</text>

          <rect x="126" y="20" width="45" height="110" rx="8" fill="#010d12" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <rect x="141" y="32" width="18" height="18" rx="4" fill="#7a43ff" />
          <text x="136" y="115" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace">#7A43FF</text>
        </svg>
      )
    },
    {
      title: "3. Typographic Systems",
      desc: "Pairing scalable font hierarchies, variable type structures, and line spacing templates that establish readability and high visual voice impact.",
      spanClass: "",
      accent: "#f9cc3d",
      glow: "rgba(249, 204, 61, 0.12)",
      illustration: (
        <svg width="100%" height="100%" viewBox="0 0 200 150" fill="none">
          <text x="20" y="65" fill="white" fontSize="48" fontWeight="800" fontFamily="sans-serif">Aa</text>
          <text x="20" y="105" fill="#f9cc3d" fontSize="24" fontWeight="300" fontFamily="sans-serif">Clash Grotesk</text>
          <line x1="20" y1="120" x2="160" y2="120" stroke="rgba(249, 204, 61, 0.3)" strokeWidth="1" />
          <circle cx="160" cy="120" r="3" fill="#f9cc3d" />
        </svg>
      )
    },
    {
      title: "4. Physical & Digital Touchpoints",
      desc: "Creating packaging grids, corporate stationery, stationery papers, marketing collateral, social kits, and responsive design systems that live together as a unified ecosystem.",
      spanClass: "span-2",
      accent: "#7a43ff",
      glow: "rgba(122, 67, 255, 0.12)",
      illustration: (
        <svg width="100%" height="100%" viewBox="0 0 400 150" fill="none">
          {/* Laptop Mockup */}
          <rect x="50" y="30" width="140" height="85" rx="8" fill="#010d12" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
          <rect x="58" y="38" width="124" height="69" rx="4" fill="rgba(122, 67, 255, 0.05)" stroke="rgba(122, 67, 255, 0.2)" strokeWidth="1" />
          <line x1="40" y1="115" x2="200" y2="115" stroke="rgba(255,255,255,0.3)" strokeWidth="3" strokeLinecap="round" />
          
          {/* Phone Mockup */}
          <rect x="250" y="20" width="55" height="100" rx="10" fill="#010d12" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
          <rect x="255" y="28" width="45" height="84" rx="6" fill="rgba(122, 67, 255, 0.05)" stroke="rgba(122, 67, 255, 0.2)" strokeWidth="1" />
          <circle cx="277.5" cy="24" r="1.5" fill="rgba(255,255,255,0.3)" />

          {/* Connected branding vectors */}
          <path d="M 185 70 C 210 70, 220 50, 245 50" stroke="#7a43ff" strokeWidth="1" strokeDasharray="3 3" />
        </svg>
      )
    }
  ];

  return (
    <section className="pad" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--glass-border)' }}>
      <div className="container">
        
        {/* Section header */}
        <div style={{ marginBottom: '3.5rem' }}>
          <p className="sec-label" style={{ color: '#0ae469' }}>Visual Deliverables</p>
          <ScrollFloat className="sec-title" tag="h2">
            Core Identity <span style={{ color: '#0ae469' }}>Pillars</span>
          </ScrollFloat>
          <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '500px', marginTop: '0.8rem', fontSize: '0.95rem' }}>
            We design unified, flexible systems. Here is how we break down visual components to scale your brand identity into a massive brand ecosystem.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="bento-grid">
          {deliverables.map((d, i) => (
            <div 
              key={i} 
              className={`bento-box ${d.spanClass}`}
              style={{
                '--bento-accent': d.accent,
                '--bento-glow': d.glow
              }}
            >
              <div className="bento-illustration">
                {d.illustration}
              </div>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'white', marginBottom: '0.8rem', letterSpacing: '-0.01em' }}>
                  {d.title}
                </h3>
                <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0 }}>
                  {d.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}


const brandingSteps = [
  { num: "01", title: "Discovery & Strategy", desc: "We dive deep into your market, competitors, and audience to unearth the strategic positioning that will define your brand's core DNA." },
  { num: "02", title: "Concept & Ideation", desc: "Translating strategy into visual language. We develop multiple creative directions, exploring typography, color psychology, and structural form." },
  { num: "03", title: "Identity Systems", desc: "Refining the chosen concept into a robust system. This includes the primary logo, secondary marks, favicons, and scalable vector assets." },
  { num: "04", title: "Brand Guidelines", desc: "Documenting the rules of your brand. We deliver a comprehensive manual covering logo usage, color systems, typography hierarchies, and tone of voice." },
  { num: "05", title: "Rollout & Application", desc: "Applying your new identity across physical and digital touchpoints—from stationery and packaging to social media kits and website UI." }
];

const digitalMarketingSteps = [
  { num: "01", title: "Audit & Strategy", desc: "We analyze your current digital presence, identify gaps, and craft a bespoke performance marketing strategy tailored to your KPIs." },
  { num: "02", title: "Campaign Architecture", desc: "Setting up pixel tracking, custom audiences, and full-funnel conversion paths across Meta, Google, and TikTok ad ecosystems." },
  { num: "03", title: "Creative & Copywriting", desc: "Developing scroll-stopping ad creatives and compelling direct-response copy designed to maximize click-through and conversion rates." },
  { num: "04", title: "Launch & Optimization", desc: "Deploying campaigns with A/B testing frameworks in place. We monitor bidding strategies and allocate budget to the highest performing ad sets." },
  { num: "05", title: "Scaling & Reporting", desc: "Scaling the winners vertically and horizontally. We provide transparent, data-rich dashboards so you see exactly what your ROI looks like." }
];

const webDesignSteps = [
  { num: "01", title: "UX Discovery & Wireframing", desc: "Mapping out user journeys and architectural flow. We create low-fidelity wireframes to ensure the core structure drives conversions." },
  { num: "02", title: "UI & Visual Design", desc: "Breathing life into the wireframes. We design high-fidelity, pixel-perfect interfaces that align flawlessly with your brand identity." },
  { num: "03", title: "Front-End Development", desc: "Writing clean, modern React/Next.js code. We implement smooth micro-interactions, responsive layouts, and lightning-fast load times." },
  { num: "04", title: "Back-End & Integrations", desc: "Connecting the dots. Whether it's headless CMS integration, e-commerce payment gateways, or custom APIs, we build robust backend architectures." },
  { num: "05", title: "Testing & Deployment", desc: "Rigorous cross-browser and device testing, SEO optimization, and performance audits before a seamless launch to your production environment." }
];

function ServiceProcess({ service, steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <section className="pad" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--glass-border)', paddingBottom: '6rem' }}>
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <style>{`
          .process-grid { display: grid; grid-template-columns: auto 1fr; gap: 3rem; align-items: start; }
          @media (max-width: 600px) {
            .process-grid { grid-template-columns: 1fr; gap: 1.5rem; }
          }
        `}</style>

        <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.3em', color: service.accent, textTransform: 'uppercase' }}>Methodology</span>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#fff', marginTop: '1rem', letterSpacing: '-0.03em' }}>
            Our <span style={{ color: service.accent }}>Process</span>
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              style={{
                padding: 'clamp(2rem, 5vw, 3rem)',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '24px',
                position: 'relative',
                overflow: 'hidden'
              }}
              className="process-grid"
            >
              <div style={{
                position: 'absolute', top: '-50px', left: '-50px', width: '150px', height: '150px',
                background: `radial-gradient(circle, ${service.accent}15 0%, transparent 70%)`,
                borderRadius: '50%', filter: 'blur(40px)', zIndex: 0
              }} />

              <div style={{ 
                fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 800, color: service.accent, opacity: 0.3, lineHeight: 0.8,
                position: 'relative', zIndex: 1
              }}>
                {step.num}
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '1rem' }}>{step.title}</h3>
                <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
