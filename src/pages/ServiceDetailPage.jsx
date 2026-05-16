import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { services } from '../data'
import StarBorderBtn from '../components/StarBorderBtn'
import BorderGlow from '../components/BorderGlow'


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
      <div className="page-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 className="sec-title">Service Not Found</h1>
          <Link to="/services"><StarBorderBtn>Back to Services</StarBorderBtn></Link>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="page-root"
      style={{ position: 'relative', zIndex: 10 }}
    >
      {/* Hero */}
      <section className="pad" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background Decorative Element */}
        <div style={{ 
          position: 'absolute', top: '20%', right: '-10%', width: '60vw', height: '60vw', 
          background: `radial-gradient(circle, ${service.accent}15 0%, transparent 70%)`,
          borderRadius: '50%', filter: 'blur(80px)', zIndex: -1
        }} />

        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <div>
            <motion.div variants={itemVariants} className="sec-label" style={{ color: service.accent }}>
              Service Detail
            </motion.div>
            <motion.h1 variants={itemVariants} className="sec-title" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', marginBottom: '2rem' }}>
              {service.name.split(' ').map((word, i) => (
                <span key={i} style={{ display: 'block' }}>
                  {i === service.name.split(' ').length - 1 ? <span style={{ color: service.accent }}>{word}</span> : word}
                </span>
              ))}
            </motion.h1>
            <motion.p variants={itemVariants} style={{ maxWidth: 500, fontSize: '1.2rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', marginBottom: '3rem' }}>
              {service.desc}
            </motion.p>
            <motion.div variants={itemVariants}>
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
             <div style={{ 
               position: 'absolute', bottom: '-30px', left: '-30px', padding: '2rem', 
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
          <motion.h2 variants={itemVariants} className="sec-title">Next <span style={{ color: service.accent }}>Level?</span></motion.h2>
          <motion.p variants={itemVariants} style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '3rem' }}>Explore how we can transform your {service.name.toLowerCase()} journey.</motion.p>
          <motion.div variants={itemVariants}>
            <Link to="/services" style={{ color: 'white', textDecoration: 'none', marginRight: '2rem', opacity: 0.5 }}>View All Services</Link>
            <StarBorderBtn href="/contact">Get Started</StarBorderBtn>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
