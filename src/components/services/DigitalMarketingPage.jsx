import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ServiceProcess, digitalMarketingSteps } from '../ServiceProcess';
import StarBorderBtn from '../StarBorderBtn';
import Magnet from '../Magnet';
import BorderGlow from '../BorderGlow';
import ScrollFloat from '../ScrollFloat';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function DigitalMarketingPage({ service }) {
  const metricsRef = React.useRef(null);
  
  useGSAP(() => {
    gsap.from('.metric-card', {
      scrollTrigger: {
        trigger: metricsRef.current,
        start: 'top 85%',
      },
      y: 50,
      opacity: 0,
      stagger: 0.15,
      duration: 1,
      ease: 'back.out(1.7)'
    });
  }, []);

  return (
    <div className="page-root" style={{ position: 'relative', zIndex: 10, background: '#000000' }}>
      
      {/* Hero Section */}
      <section className="pad" style={{ minHeight: '80vh', paddingTop: '15vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ 
          position: 'absolute', top: '20%', left: '40%', width: '60vw', height: '60vw', 
          background: `radial-gradient(circle, ${service.accent}20 0%, transparent 70%)`,
          borderRadius: '50%', filter: 'blur(120px)', zIndex: 0
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial="hidden" animate="visible" variants={containerVariants} style={{ maxWidth: '800px' }}>
            <motion.div variants={itemVariants} className="sec-label" style={{ color: service.accent, marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Home</Link> 
              <span style={{ opacity: 0.3 }}>/</span> 
              <Link to="/services" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Services</Link> 
              <span style={{ opacity: 0.3 }}>/</span> 
              <span>{service.name}</span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '2rem', letterSpacing: '-0.03em', color: '#fff' }}>
              Data-Driven <span style={{ color: service.accent }}>Growth</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '3rem', maxWidth: '600px' }}>
              {service.desc} We engineer full-funnel strategies, precise targeting, and relentless optimization to maximize your ROI.
            </motion.p>
            
            <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1rem' }}>
              <StarBorderBtn href="/contact" color={service.accent}>Scale Now</StarBorderBtn>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Orbit Image Section */}
      <section className="pad" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--glass-border)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
           <div style={{ position: 'relative', aspectRatio: '1/1' }}>
             <img src={service.image} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
           </div>
           <div>
             <h2 style={{ fontSize: '3rem', color: '#fff', marginBottom: '2rem' }}>Precision meets <span style={{ color: service.accent }}>Scale.</span></h2>
             <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
               We don't just run ads. We build comprehensive ecosystems that capture attention, nurture intent, and drive conversions systematically.
             </p>
             <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
               {['Performance Marketing', 'SEO & SEM Strategy', 'Conversion Rate Optimization', 'Data Analytics'].map((item, i) => (
                 <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: 'rgba(255,255,255,0.8)' }}>
                   <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: service.accent }} />
                   {item}
                 </li>
               ))}
             </ul>
           </div>
        </div>
      </section>

      {/* Step-by-step Process Section */}
      <ServiceProcess accent={service.accent} steps={digitalMarketingSteps} />

      {/* Metrics Grid */}
      <section className="pad" ref={metricsRef} style={{ background: '#000' }}>
        <div className="container">
          <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.3em', color: service.accent, textTransform: 'uppercase' }}>The Formula</span>
            <h2 style={{ fontSize: '3rem', color: '#fff', marginTop: '1rem' }}>Metrics that Matter</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {[
              { m: '300%', l: 'Average ROAS Increase' },
              { m: '2.5M+', l: 'Monthly Ad Spend Managed' },
              { m: '50%', l: 'Lower CPA' },
              { m: '10x', l: 'Traffic Growth' }
            ].map((stat, i) => (
              <BorderGlow 
                key={i} 
                className="metric-card"
                glowColor="122 67 255"
                colors={['#7a43ff', '#c084fc']}
                backgroundColor="#060606"
                borderRadius={32}
              >
                <div style={{ padding: '3rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '4rem', fontWeight: 800, color: service.accent, marginBottom: '1rem', letterSpacing: '-0.05em' }}>
                    {stat.m}
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {stat.l}
                  </p>
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
            Ready to <span style={{ color: service.accent }}>Scale?</span>
          </ScrollFloat>
          <motion.p initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:0.1}} style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '3rem' }}>
            Let's build your growth engine.
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
