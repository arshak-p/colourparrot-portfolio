import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ServiceProcess, webDesignSteps } from '../ServiceProcess';
import StarBorderBtn from '../StarBorderBtn';
import Magnet from '../Magnet';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollFloat from '../ScrollFloat';
import Masonry from '../Masonry';

const masonryItems = [
  { id: 1, img: '/mockups/website_mockup_1_1781606889777.png', height: 650 },
  { id: 2, img: '/mockups/website_mockup_2_1781606903018.png', height: 450 },
  { id: 3, img: '/mockups/website_mockup_3_1781606920775.png', height: 580 },
  { id: 4, img: '/mockups/website_mockup_4_1781606934296.png', height: 750 },
  { id: 5, img: '/mockups/website_mockup_2_1781606903018.png', height: 500 },
  { id: 6, img: '/mockups/website_mockup_1_1781606889777.png', height: 400 },
  { id: 7, img: '/mockups/website_mockup_4_1781606934296.png', height: 550 },
  { id: 8, img: '/mockups/website_mockup_3_1781606920775.png', height: 600 },
  { id: 9, img: '/mockups/website_mockup_1_1781606889777.png', height: 480 },
  { id: 10, img: '/mockups/website_mockup_4_1781606934296.png', height: 620 },
  { id: 11, img: '/mockups/website_mockup_2_1781606903018.png', height: 530 },
  { id: 12, img: '/mockups/website_mockup_3_1781606920775.png', height: 700 },
  { id: 13, img: '/mockups/website_mockup_1_1781606889777.png', height: 510 },
  { id: 14, img: '/mockups/website_mockup_2_1781606903018.png', height: 660 },
  { id: 15, img: '/mockups/website_mockup_4_1781606934296.png', height: 470 },
  { id: 16, img: '/mockups/website_mockup_3_1781606920775.png', height: 590 },
  { id: 17, img: '/mockups/website_mockup_1_1781606889777.png', height: 720 },
  { id: 18, img: '/mockups/website_mockup_2_1781606903018.png', height: 440 },
  { id: 19, img: '/mockups/website_mockup_4_1781606934296.png', height: 560 },
  { id: 20, img: '/mockups/website_mockup_3_1781606920775.png', height: 680 },
  { id: 21, img: '/mockups/website_mockup_1_1781606889777.png', height: 490 },
  { id: 22, img: '/mockups/website_mockup_4_1781606934296.png', height: 610 },
  { id: 23, img: '/mockups/website_mockup_2_1781606903018.png', height: 540 },
  { id: 24, img: '/mockups/website_mockup_3_1781606920775.png', height: 710 },
];

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

export default function WebDesignPage({ service }) {
  const uiRef = React.useRef(null);
  
  useGSAP(() => {
    gsap.from('.ui-layer', {
      scrollTrigger: {
        trigger: uiRef.current,
        start: 'top 70%',
      },
      y: 100,
      opacity: 0,
      rotateX: 45,
      stagger: 0.2,
      duration: 1.5,
      ease: 'power3.out'
    });
  }, []);

  return (
    <div className="page-root" style={{ position: 'relative', zIndex: 10, background: '#000000' }}>
      
      {/* Hero Section */}
      <section className="pad" style={{ minHeight: '90vh', paddingTop: '15vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        
        {/* Masonry Background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.4 }}>
          <Masonry items={masonryItems} blurToFocus={true} colorShiftOnHover={false} animateFrom="bottom" />
          <div style={{ 
            position: 'absolute', inset: 0, 
            background: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%)',
            pointerEvents: 'none'
          }} />
        </div>

        <div style={{ 
          position: 'absolute', top: '10%', right: '10%', width: '50vw', height: '50vw', 
          background: `radial-gradient(circle, ${service.accent}20 0%, transparent 70%)`,
          borderRadius: '50%', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none'
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
              Digital <span style={{ color: service.accent }}>Experiences</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '3rem', maxWidth: '600px' }}>
              {service.desc} We build blazing fast, highly interactive web applications that convert visitors into loyal customers.
            </motion.p>
            
            <motion.div variants={itemVariants}>
              <StarBorderBtn href="/contact" color={service.accent}>Start a Project</StarBorderBtn>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Code vs UI Section */}
      <section className="pad" ref={uiRef} style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--glass-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 style={{ fontSize: '3rem', color: '#fff' }}>Beautiful inside and out.</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '1rem auto' }}>We combine stunning visual design with robust, modern web architecture (React, GSAP, Framer Motion).</p>
          </div>

          <div style={{ position: 'relative', perspective: '1000px', padding: '4rem 0' }}>
            <div className="ui-layer" style={{ 
              width: '80%', margin: '0 auto', background: '#111', borderRadius: '24px', padding: '2rem',
              border: `1px solid ${service.accent}40`, boxShadow: `0 30px 60px rgba(0,0,0,0.5)`,
              transform: 'translateZ(-100px) translateY(-50px) rotateX(10deg)', opacity: 0.5
            }}>
              <pre style={{ color: service.accent, fontSize: '0.8rem', opacity: 0.8 }}>
                <code>{`function Application() {
  return (
    <ThemeProvider>
      <Layout>
        <InteractiveCanvas />
      </Layout>
    </ThemeProvider>
  )
}`}</code>
              </pre>
            </div>

            <div className="ui-layer" style={{ 
              width: '90%', margin: '0 auto', background: '#0a0a0a', borderRadius: '32px', overflow: 'hidden',
              border: `1px solid rgba(255,255,255,0.1)`, boxShadow: `0 40px 80px rgba(0,0,0,0.8)`,
              position: 'relative', zIndex: 10, marginTop: '-100px'
            }}>
              <div style={{ padding: '1rem 2rem', background: 'rgba(255,255,255,0.05)', display: 'flex', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
              </div>
              <img src={service.image} alt="Web UI" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Masonry UI Gallery was moved to Hero background */}

      {/* Step-by-step Process Section */}
      <ServiceProcess accent={service.accent} steps={webDesignSteps} />

      {/* Features Grid */}
      <section className="pad" style={{ background: '#000' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          {[
            { t: 'UI/UX Design', d: 'User-centric interfaces that feel intuitive and look premium.', i: 'layout' },
            { t: 'Web Development', d: 'Modern tech stacks for blazing fast performance.', i: 'code' },
            { t: 'Interaction Design', d: 'Micro-interactions and scroll animations that delight users.', i: 'mouse-pointer' }
          ].map((item, i) => (
            <div key={i} style={{ padding: '3rem', background: '#050505', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: `${service.accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                <div style={{ width: '20px', height: '20px', background: service.accent, borderRadius: '4px' }} />
              </div>
              <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1rem' }}>{item.t}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="pad" style={{ textAlign: 'center', minHeight: '50vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <ScrollFloat className="sec-title" tag="h2">
            Ready to <span style={{ color: service.accent }}>Build?</span>
          </ScrollFloat>
          <motion.p initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:0.1}} style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '3rem' }}>
            Let's create your digital flagship.
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
