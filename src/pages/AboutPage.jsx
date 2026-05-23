import { motion } from 'framer-motion'
import ParrotWidget from '../components/ParrotWidget'
import BorderGlow from '../components/BorderGlow'


const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
}

export default function AboutPage() {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="page-root"
      style={{ position: 'relative', zIndex: 10 }}
    >
      {/* Hero */}
      <section className="pad" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', position: 'relative' }}>
        <div className="container">
          <motion.div variants={itemVariants} className="sec-label">Who we are</motion.div>
          <motion.h1 variants={itemVariants} className="sec-title" style={{ fontSize: 'clamp(3.5rem, 9vw, 6.5rem)', maxWidth: '15ch' }}>
            Squawking the <span className="shiny-colour">Future</span> into existence
          </motion.h1>
          <motion.p variants={itemVariants} style={{ maxWidth: 600, fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)', marginTop: '2.5rem', lineHeight: 1.8 }}>
            Colour Parrot is Calicut's premier creative laboratory. We don't just advertise; we craft cosmic identities that resonate across every digital and physical dimension.
          </motion.p>
        </div>
        
        {/* Decorative backdrop */}
        <div style={{ position: 'absolute', top: '10%', right: '0', width: '50%', height: '80%', background: 'radial-gradient(circle, var(--green) 0%, transparent 70%)', opacity: 0.05, filter: 'blur(100px)', zIndex: -1 }} />
      </section>

      {/* Story */}
      <section className="pad" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '5rem', alignItems: 'center' }}>
          <motion.div variants={itemVariants}>
            <div className="sec-label c">Our Genesis</div>
            <h2 className="sec-title">Intelligence & <span className="g">Beauty</span></h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '1.8rem' }}>
              Our journey began with a simple idea: to bring the same intelligence and vibrancy found in the parrot into the world of branding. We combine technical precision with artistic soul.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>
              From our base in Calicut, we've launched brands into national and global markets, proving that great ideas have no gravitational limits.
            </p>
          </motion.div>
          
          <BorderGlow 
            className="acard" 
            glowColor="160 84 62" 
            colors={['#1D9E75', '#0ae469']} 
            backgroundColor="#061014" 
            borderRadius={32}
            style={{ height: 'clamp(300px, 50vh, 500px)' }}
          >
            <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
              <img src="https://picsum.photos/1200/800?random=about" alt="Studio" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
            </div>
          </BorderGlow>

        </div>
      </section>

      {/* Vision */}
      <section className="pad">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
            <motion.div variants={itemVariants} className="sec-label p" style={{ justifyContent: 'center' }}>Our Process</motion.div>
            <motion.h2 variants={itemVariants} className="sec-title">Built for <span className="p">Impact</span></motion.h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '4rem' }}>
            {[
              { t: 'Strategy', d: 'Deep-dive analysis of your market orbit.' },
              { t: 'Creation', d: 'Atomic-level design and content production.' },
              { t: 'Launch',   d: 'Global delivery across all channels.' }
            ].map((step, i) => (
              <BorderGlow 
                key={i} 
                glowColor="40 80 80" 
                colors={['#1D9E75', '#28c1e5']} 
                backgroundColor="#061014" 
                borderRadius={28}
              >
                <div style={{ padding: '2.5rem' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 500, color: 'var(--green)', marginBottom: '1.5rem', opacity: 0.8 }}>0{i+1}</div>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>{step.t}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}>{step.d}</p>
                </div>
              </BorderGlow>
            ))}

          </div>
        </div>
      </section>

      <ParrotWidget />
    </motion.div>
  )
}
