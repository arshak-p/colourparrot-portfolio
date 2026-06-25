import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import StarBorderBtn from '../StarBorderBtn';
import Magnet from '../Magnet';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollFloat from '../ScrollFloat';
import ImageTrail from '../ImageTrail';
import { creativesList } from '../../data/creativesData';

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

export default function CreativeAdvertisingPage({ service }) {
  const cardsRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  
  useGSAP(() => {
    gsap.from('.ad-card', {
      y: 20,
      opacity: 0,
      stagger: 0.03,
      duration: 0.4,
      ease: 'power1.out',
      delay: 0.1
    });
  }, []);

  return (
    <div className="page-root" style={{ position: 'relative', zIndex: 10, background: '#000000' }}>
      
      {/* Hero Section */}
      <section className="pad" style={{ minHeight: '80vh', paddingTop: '15vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <ImageTrail items={creativesList.map(c => c.image)} variant={4} />
        </div>
        <div style={{ 
          position: 'absolute', top: '30%', left: '20%', width: '70vw', height: '70vw', 
          background: `radial-gradient(circle, ${service.accent}15 0%, transparent 60%)`,
          borderRadius: '50%', filter: 'blur(120px)', zIndex: 0
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial="hidden" animate="visible" variants={containerVariants} style={{ maxWidth: '900px', textAlign: 'center', margin: '0 auto' }}>
            <motion.div variants={itemVariants} className="sec-label" style={{ color: service.accent, marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center' }}>
              <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Home</Link> 
              <span style={{ opacity: 0.3 }}>/</span> 
              <Link to="/services" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Services</Link> 
              <span style={{ opacity: 0.3 }}>/</span> 
              <span>{service.name}</span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} style={{ fontSize: 'clamp(4rem, 10vw, 9rem)', fontWeight: 900, lineHeight: 0.9, marginBottom: '2rem', letterSpacing: '-0.05em', color: '#fff', textTransform: 'uppercase' }}>
              BREAK<br />
              <span style={{ color: service.accent }}>THE NOISE.</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
              {service.desc} We build disruptive, concept-driven campaigns that embed your brand into culture and drive mass awareness.
            </motion.p>
            
            <motion.div variants={itemVariants}>
              <StarBorderBtn href="/contact" color={service.accent}>Launch a Campaign</StarBorderBtn>
            </motion.div>
          </motion.div>
        </div>
      </section>



      {/* Additional Creative Assets */}
      <section className="pad" ref={cardsRef} style={{ background: '#000', paddingTop: '4rem' }}>
        <div className="masonry-container">
          <div className="creatives-grid">
            {creativesList.map((item, i) => (
              <div 
                key={i} 
                className="ad-card" 
                onClick={() => setSelectedImage(item.image)}
                style={{ overflow: 'hidden', background: '#111', cursor: 'pointer', display: 'block', width: '100%' }}
              >
                <img src={item.image} alt={item.caption} style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.9)', zIndex: 9999,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '2rem', cursor: 'zoom-out'
            }}
          >
            <motion.img 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={selectedImage} 
              alt="Creative Fullscreen" 
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '12px' }} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer CTA */}
      <section className="pad" style={{ textAlign: 'center', minHeight: '50vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <ScrollFloat className="sec-title" tag="h2">
            Ready to <span style={{ color: service.accent }}>Disrupt?</span>
          </ScrollFloat>
          <motion.p initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:0.1}} style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '3rem' }}>
            Let's make something they can't ignore.
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
