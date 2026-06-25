import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ScrollFloat from '../components/ScrollFloat';
import MassiveVideoGrid from '../components/services/MassiveVideoGrid';

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

export default function VideoArchivePage() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-root" style={{ position: 'relative', zIndex: 10, background: '#000000', minHeight: '100vh' }}>
      
      {/* Header Section */}
      <section className="pad" style={{ paddingTop: '15vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingBottom: '2rem' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(100px)', zIndex: 0 }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial="hidden" animate="visible" variants={containerVariants} style={{ maxWidth: '800px' }}>
            <motion.div variants={itemVariants} className="sec-label" style={{ color: '#fff', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Link to="/services/video-production" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={(e)=>e.target.style.color='#fff'} onMouseOut={(e)=>e.target.style.color='rgba(255,255,255,0.5)'}>
                ← Back to Video Production
              </Link>
            </motion.div>
            
            <motion.h1 variants={itemVariants} style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1rem', letterSpacing: '-0.03em', color: '#fff' }}>
              The Complete <span style={{ color: 'var(--cyan)' }}>Archive</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, maxWidth: '600px' }}>
              Browse our entire vault of motion design, cinematic edits, content videos, and AI generated masterpieces.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Featured Video Archive Grid */}
      <MassiveVideoGrid accentColor="var(--cyan)" filterType="others" title="Featured Videos" subtitle="Highlights" />

      {/* Massive Motion Archive Grid */}
      <MassiveVideoGrid accentColor="var(--cyan)" filterType="motion" title="Motion Archive" subtitle="The Vault" />

      {/* Massive AI Video Archive Grid */}
      <MassiveVideoGrid accentColor="var(--cyan)" filterType="ai" title="AI Generated Video" subtitle="The Future" />

    </div>
  );
}
