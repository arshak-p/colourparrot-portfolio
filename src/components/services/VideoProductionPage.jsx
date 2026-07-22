import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import StarBorderBtn from '../StarBorderBtn';
import Magnet from '../Magnet';
import ScrollFloat from '../ScrollFloat';
import GridMotion from '../GridMotion';
import MassiveVideoGrid from './MassiveVideoGrid';
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

const VideoThumb = ({ src }) => {
  const videoRef = React.useRef(null);
  return (
    <video 
      ref={videoRef}
      src={`${src}#t=5.1`}
      loop 
      muted 
      playsInline 
      onMouseEnter={() => videoRef.current?.play()}
      onMouseLeave={() => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0; // Optional: resets video on mouse leave
        }
      }}
      style={{ 
        width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', 
        top: 0, left: 0, zIndex: 0, borderRadius: '10px', opacity: 0.8,
        transition: 'opacity 0.3s ease', cursor: 'pointer'
      }} 
      onMouseOver={(e) => e.target.style.opacity = 1}
      onMouseOut={(e) => e.target.style.opacity = 0.8}
    />
  );
};

import motionVideos from '../../data/motion_videos.json';
import aiVideos from '../../data/ai_videos.json';
import podcastVideos from '../../data/podcast_videos.json';
import presentationVideos from '../../data/presentation_videos.json';
import otherVideos from '../../data/other_videos.json';

const allHeroVideos = [...motionVideos, ...aiVideos, ...podcastVideos, ...presentationVideos, ...otherVideos].sort(() => Math.random() - 0.5);

const gridItems = allHeroVideos.slice(0, 28).map((vid, i) => (
  <VideoThumb key={i} src={vid} />
));

export default function VideoProductionPage({ service }) {
  const sectionRef = React.useRef(null);

  React.useEffect(() => {
    if (window.location.hash) {
      setTimeout(() => {
        const id = window.location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500); // Wait for the page to render and Lenis to initialize
    }
  }, []);
  
  useGSAP(() => {
    gsap.from('.vid-reel', {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'bottom center',
        scrub: 1,
      },
      scale: 0.8,
      opacity: 0,
      y: 100,
      stagger: 0.1,
      ease: 'power2.out'
    });
  }, []);

  return (
    <div className="page-root" style={{ position: 'relative', zIndex: 10, background: '#000000' }}>
      
      {/* Hero Section */}
      <section className="pad" style={{ minHeight: '80vh', paddingTop: '15vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.4 }}>
          <GridMotion items={service.images || gridItems} gradientColor="transparent" />
        </div>
        <div style={{ 
          position: 'absolute', top: '-10%', right: '-10%', width: '50vw', height: '50vw', 
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
              <span>{service.name}</span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '2rem', letterSpacing: '-0.03em', color: '#fff' }}>
              Cinematic <span style={{ color: service.accent }}>Storytelling</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '3rem', maxWidth: '600px' }}>
              {service.desc} We create high-impact visual narratives that captivate audiences and elevate your brand's presence across all screens.
            </motion.p>
            
            <motion.div variants={itemVariants}>
              <StarBorderBtn href="/contact" color={service.accent}>Start a Production</StarBorderBtn>
            </motion.div>
          </motion.div>
        </div>
      </section>



      {/* Reel Gallery */}
      <section className="pad" ref={sectionRef} style={{ background: '#000' }}>
        <div className="container">
          <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.3em', color: service.accent, textTransform: 'uppercase' }}>Our Capabilities</span>
            <h2 style={{ fontSize: '3rem', color: '#fff', marginTop: '1rem' }}>Visual Masterpieces</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '2rem' }}>
            {[
              { src: '/compressed_other_video/RR concept video.mp4', t: 'Cinematic Video', d: 'High-end cinematography, grading, and directing for breathtaking visuals.', targetId: 'section-featured' },
              { src: '/compressed_other_video/love.mp4', t: 'Content Video', d: 'Engaging short-form content designed for social media and digital platforms.', targetId: 'section-featured' },
              { src: '/compressed_motion/kalqy/kalqy logo outro.mp4', t: 'Motion Video', d: 'Dynamic 2D/3D motion graphics and animations that bring your brand to life.', targetId: 'section-motion' },
              { src: '/compressed_ai_video/RailRoll_Aluva_Ai_V2.mp4', t: 'AI Video & More', d: 'Cutting-edge AI-generated visuals and cutting-edge media.', targetId: 'section-ai' },
              { src: '/compressed_podcasts/capitus edited.mp4', t: 'Podcast Productions', d: 'Deep, engaging conversations captured with high-end audio and multi-cam video.', targetId: 'section-podcast' },
              { src: '/compressed_presetation/Fobas Presentation.mp4', t: 'Video Presentation', d: 'Professional corporate presentations, documentaries, and case studies.', targetId: 'section-presentation' }
            ].map((item, i) => (
              <div 
                key={i} 
                className="vid-reel" 
                onClick={() => document.getElementById(item.targetId)?.scrollIntoView({ behavior: 'smooth' })}
                style={{ 
                  aspectRatio: '4/5', background: '#111', borderRadius: '24px', padding: '2rem',
                  border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                  position: 'relative', overflow: 'hidden', cursor: 'pointer'
                }}>
                <video src={`${item.src}#t=5.1`} autoPlay loop muted playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(0,0,0,0.9), transparent)`, zIndex: 1 }} />
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ fontSize: '3rem', color: service.accent, opacity: 0.5, marginBottom: '1rem' }}>0{i+1}</div>
                  <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem' }}>{item.t}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.5 }}>{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comprehensive Capabilities List */}
      <section className="pad" style={{ background: '#050505', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', color: '#fff' }}>Everything We Shoot & Edit</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '1rem auto 0', lineHeight: 1.6 }}>
              Whether it's a massive cinematic campaign or daily social content, we have the tools, talent, and vision to bring it to life.
            </p>
          </div>
          <style>{`
            .skills-desktop { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; max-width: 1000px; margin: 0 auto; }
            .skills-mobile { display: none; overflow: hidden; width: 100%; position: relative; }
            
            @media (max-width: 768px) {
              .skills-desktop { display: none; }
              .skills-mobile { display: block; }
            }
            
            @keyframes skillMarquee {
              0% { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(-50%, 0, 0); }
            }
            @keyframes skillMarqueeRev {
              0% { transform: translate3d(-50%, 0, 0); }
              100% { transform: translate3d(0, 0, 0); }
            }
            
            .skill-row-wrap { overflow: hidden; padding: 6px 0; }
            .skill-row { display: flex; width: max-content; gap: 1rem; padding-right: 1rem; will-change: transform; }
            .skill-row.fwd { animation: skillMarquee 25s linear infinite; }
            .skill-row.rev { animation: skillMarqueeRev 25s linear infinite; }
            
            .skill-pill {
              padding: 0.8rem 1.5rem;
              background: rgba(255,255,255,0.03);
              border: 1px solid rgba(255,255,255,0.1);
              border-radius: 100px;
              color: rgba(255,255,255,0.8);
              font-size: 0.85rem;
              letter-spacing: 0.05em;
              text-transform: uppercase;
              transition: all 0.3s ease;
              cursor: default;
              white-space: nowrap;
            }
            .skill-pill:hover {
              background: rgba(255,255,255,0.1) !important;
              border-color: ${service.accent} !important;
              color: #fff !important;
            }
          `}</style>
          
          <div className="skills-desktop">
            {[
              'Brand Anthems', 'Corporate Documentaries', 'TV Commercials (TVC)', 'Social Media Reels', 
              'Explainer Videos', 'Product Demos', 'Podcast Production', 'AI Video Generation', 
              'Testimonials & Case Studies', 'Event Coverage', '2D / 3D Animation', 'Motion Graphics', 
              'Drone & Aerial Cinematography', 'Music Videos', 'VFX & Compositing', 'Color Grading',
              'Storyboarding', 'Scriptwriting', 'Sound Design & Foley'
            ].map((skill, i) => (
              <span key={i} className="skill-pill">{skill}</span>
            ))}
          </div>

          <div className="skills-mobile">
            {[
              ['Brand Anthems', 'Corporate Documentaries', 'TV Commercials (TVC)'],
              ['Social Media Reels', 'Explainer Videos', 'Product Demos'],
              ['Podcast Production', 'AI Video Generation', 'Testimonials & Case Studies'],
              ['Event Coverage', '2D / 3D Animation', 'Motion Graphics'],
              ['Drone & Aerial Cinematography', 'Music Videos', 'VFX & Compositing'],
              ['Color Grading', 'Storyboarding', 'Scriptwriting', 'Sound Design & Foley']
            ].map((row, rowIndex) => {
              const duplicated = [...row, ...row, ...row, ...row];
              return (
                <div key={rowIndex} className="skill-row-wrap">
                  <div className={`skill-row ${rowIndex % 2 === 0 ? 'fwd' : 'rev'}`}>
                    {duplicated.map((skill, i) => (
                      <span key={i} className="skill-pill">{skill}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Video Archive Grid */}
      <div id="section-featured">
        <MassiveVideoGrid accentColor={service.accent} filterType="others" title="Featured Videos" subtitle="Highlights" limit={3} />
      </div>

      {/* Massive Motion Archive Grid */}
      <div id="section-motion">
        <MassiveVideoGrid accentColor={service.accent} filterType="motion" title="Motion Archive" subtitle="The Vault" limit={6} />
      </div>

      {/* Massive AI Video Archive Grid */}
      <div id="section-ai">
        <MassiveVideoGrid accentColor={service.accent} filterType="ai" title="AI Generated Video" subtitle="The Future" limit={6} />
      </div>

      {/* Podcast Video Archive Grid */}
      <div id="section-podcast">
        <MassiveVideoGrid accentColor={service.accent} filterType="podcast" title="Podcast Productions" subtitle="Deep Conversations" limit={4} viewMoreLink="/video-archive" />
      </div>

      {/* Presentation Video Archive Grid */}
      <div id="section-presentation">
        <MassiveVideoGrid accentColor={service.accent} filterType="presentation" title="Corporate Presentations" subtitle="Professional Impact" limit={4} viewMoreLink="/video-archive" />
      </div>

      {/* Footer CTA */}
      <section className="pad" style={{ textAlign: 'center', minHeight: '50vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <ScrollFloat className="sec-title" tag="h2">
            Ready to <span style={{ color: service.accent }}>Action?</span>
          </ScrollFloat>
          <motion.p initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:0.1}} style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '3rem' }}>
            Let's script the next chapter of your brand's story.
          </motion.p>
          <motion.div initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:0.2}} style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <Magnet padding={80} disabled={false}>
              <StarBorderBtn href="/services" color="rgba(255,255,255,0.3)">VIEW ALL SERVICES</StarBorderBtn>
            </Magnet>
            <Magnet padding={80} disabled={false}>
              <StarBorderBtn href="/contact">Get Started</StarBorderBtn>
            </Magnet>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
