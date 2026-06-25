import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import StarBorderBtn from '../StarBorderBtn';
import Magnet from '../Magnet';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollFloat from '../ScrollFloat';

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

export default function ContentCreationPage({ service }) {
  const wordsRef = React.useRef(null);
  
  useGSAP(() => {
    gsap.from('.word-reveal', {
      scrollTrigger: {
        trigger: wordsRef.current,
        start: 'top 80%',
      },
      y: 50,
      opacity: 0,
      rotationX: -90,
      stagger: 0.1,
      duration: 1,
      ease: 'back.out(1.5)',
      transformOrigin: '50% 50% -50px'
    });
  }, []);

  return (
    <div className="page-root" style={{ position: 'relative', zIndex: 10, background: '#000000' }}>
      
      {/* Hero Section */}
      <section className="pad" style={{ minHeight: '80vh', paddingTop: '15vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ 
          position: 'absolute', top: '10%', right: '40%', width: '60vw', height: '60vw', 
          background: `radial-gradient(circle, ${service.accent}20 0%, transparent 70%)`,
          borderRadius: '50%', filter: 'blur(100px)', zIndex: 0
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial="hidden" animate="visible" variants={containerVariants} style={{ maxWidth: '900px' }}>
            <motion.div variants={itemVariants} className="sec-label" style={{ color: service.accent, marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Home</Link> 
              <span style={{ opacity: 0.3 }}>/</span> 
              <Link to="/services" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Services</Link> 
              <span style={{ opacity: 0.3 }}>/</span> 
              <span>{service.name}</span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} style={{ fontSize: 'clamp(3.5rem, 8vw, 8rem)', fontWeight: 800, lineHeight: 1.0, marginBottom: '2rem', letterSpacing: '-0.04em', color: '#fff' }}>
              Words that <span style={{ color: service.accent, fontStyle: 'italic' }}>Work.</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '3rem', maxWidth: '600px' }}>
              {service.desc} We craft narratives that stick. From punchy social copy to long-form editorial, we make your brand's voice unignorable.
            </motion.p>
            
            <motion.div variants={itemVariants}>
              <StarBorderBtn href="/contact" color={service.accent}>Start Writing</StarBorderBtn>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Image */}
      <section className="pad" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--glass-border)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '1000px', borderRadius: '40px', overflow: 'hidden', border: `1px solid ${service.accent}30` }}>
            <img src={service.image} alt={service.name} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* Typography / Copywriting Section */}
      <section className="pad" ref={wordsRef} style={{ background: '#000' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
           <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 1.2, color: 'rgba(255,255,255,0.4)', perspective: '1000px' }}>
             {['Great', 'design', 'catches', 'the', 'eye.', 'Great', 'copy', 'captures', 'the', 'mind.'].map((word, i) => (
               <span key={i} className="word-reveal" style={{ display: 'inline-block', marginRight: '0.3em', color: i > 4 ? '#fff' : 'inherit' }}>
                 {word}
               </span>
             ))}
           </h2>

           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginTop: '6rem' }}>
             {[
               { t: 'Copywriting', d: 'Persuasive text designed for conversions and clarity.' },
               { t: 'Social Content', d: 'Engaging, platform-native formats.' },
               { t: 'Editorial', d: 'Long-form storytelling that builds deep brand equity.' }
             ].map((item, i) => (
               <div key={i} style={{ borderLeft: `2px solid ${service.accent}`, paddingLeft: '2rem' }}>
                 <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1rem' }}>{item.t}</h3>
                 <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{item.d}</p>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="pad" style={{ textAlign: 'center', minHeight: '50vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <ScrollFloat className="sec-title" tag="h2">
            Ready to <span style={{ color: service.accent }}>Speak?</span>
          </ScrollFloat>
          <motion.p initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:0.1}} style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '3rem' }}>
            Find your voice with us.
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
