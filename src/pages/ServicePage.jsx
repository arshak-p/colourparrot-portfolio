import { motion } from 'framer-motion'
import { services } from '../data'
import StarBorderBtn from '../components/StarBorderBtn'
import PixelCard from '../components/PixelCard'

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
}

export default function ServicePage() {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="page-root"
      style={{ position: 'relative', zIndex: 10 }}
    >
      {/* Hero */}
      <section className="pad" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <motion.div variants={itemVariants} className="sec-label">Our Capabilities</motion.div>
          <motion.h1 variants={itemVariants} className="sec-title" style={{ fontSize: 'clamp(3.5rem, 9vw, 6.5rem)' }}>
            Full Spectrum <br/><span className="shiny-colour">Creativity</span>
          </motion.h1>
          <motion.p variants={itemVariants} style={{ maxWidth: 600, fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)', marginTop: '2.5rem' }}>
            We provide a 360° approach to branding and advertising. From initial strategy to final production, we ensure your brand remains in orbit.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pad" style={{ paddingTop: 0 }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          {services.map((svc, i) => {
            let variant = 'default'
            if (svc.accent === 'var(--green)') variant = 'green'
            if (svc.accent === 'var(--cyan)') variant = 'cyan'
            if (svc.accent === 'var(--purple)') variant = 'pink'
            if (svc.accent === 'var(--yellow)') variant = 'yellow'

            return (
              <motion.div 
                key={i} 
                variants={itemVariants} 
                style={{ height: '400px', position: 'relative' }}
              >
                <PixelCard variant={variant}>
                  <div className="service-card-inner" style={{ padding: '2.5rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
                    
                    {/* Animated Number Background */}
                    <div className="svc-num" style={{ 
                      position: 'absolute', top: '1rem', right: '2rem', fontSize: '8rem', 
                      fontWeight: 500, opacity: 0.03, pointerEvents: 'none', transition: 'all 0.6s ease'
                    }}>
                      0{i + 1}
                    </div>

                    <div style={{ position: 'relative', zIndex: 5 }}>
                      <h3 className="svc-title-animated" data-text={svc.name} style={{ 
                        fontSize: '2.2rem', marginBottom: '1.5rem', color: 'white', fontWeight: 500,
                        textTransform: 'uppercase', letterSpacing: '-0.02em', position: 'relative'
                      }}>
                        {svc.name}
                      </h3>
                      
                      <p className="svc-desc-faded" style={{ 
                        color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem', lineHeight: 1.7, 
                        maxWidth: '90%', transition: 'all 0.4s ease'
                      }}>
                        {svc.desc}
                      </p>
                    </div>

                    <div className="svc-pill-footer" style={{ 
                      marginTop: '2.5rem', fontSize: '0.6rem', letterSpacing: '0.15em', 
                      textTransform: 'uppercase', fontWeight: 500, padding: '0.6rem 1.4rem', 
                      borderRadius: 100, background: 'rgba(255,255,255,0.03)', 
                      border: '1px solid rgba(255,255,255,0.08)', width: 'fit-content', 
                      color: svc.accent, transition: 'all 0.4s ease'
                    }}>
                      {svc.pill}
                    </div>
                  </div>
                </PixelCard>
                <style>{`
                  .service-card-inner:hover .svc-num { opacity: 0.08; transform: translateY(-10px); color: ${svc.accent}; }
                  .service-card-inner:hover .svc-desc-faded { color: rgba(255,255,255,0.8); }
                  .service-card-inner:hover .svc-pill-footer { background: ${svc.accent}15; border-color: ${svc.accent}40; transform: scale(1.05); }
                  
                  /* Title Glitch/Glow Effect */
                  .svc-title-animated::after {
                    content: attr(data-text);
                    position: absolute;
                    left: 0; top: 0;
                    width: 100%;
                    color: ${svc.accent};
                    opacity: 0;
                    filter: blur(8px);
                    transition: all 0.4s ease;
                    z-index: -1;
                  }
                  .service-card-inner:hover .svc-title-animated::after {
                    opacity: 0.7;
                    transform: scale(1.05);
                  }
                  .service-card-inner:hover .svc-title-animated {
                    color: ${svc.accent};
                    text-shadow: 0 0 20px ${svc.accent}40;
                  }
                `}</style>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="pad" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--glass-border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="sec-title">Ready to <span className="g">Launch?</span></h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '3rem' }}>Let's discuss how we can take your brand beyond gravity.</p>
          <StarBorderBtn href="/contact" size="lg">Start a Project →</StarBorderBtn>
        </div>
      </section>
    </motion.div>
  )
}
