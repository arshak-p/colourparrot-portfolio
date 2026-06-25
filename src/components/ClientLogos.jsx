import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollFloat from './ScrollFloat';
import { clientLogosList } from '../data/logosData';

gsap.registerPlugin(ScrollTrigger);

const styles = `
.cp-section {
  width: 100%;
  padding: clamp(48px, 8vh, 80px) 0;
  overflow: hidden;
  position: relative;
  background: transparent;
}

/* Header Restored to Global Styles */
.cp-header { 
  text-align: center; 
  margin-bottom: 5rem; 
  display: flex;
  flex-direction: column;
  align-items: center;
}



/* Fade edges */
.cp-rows { position: relative; }


/* Row */
.cp-row-wrap { overflow: hidden; padding: 12px 0; }
.cp-row { display: flex; width: max-content; will-change: transform; transform: translateZ(0); backface-visibility: hidden; }
.cp-row:hover { animation-play-state: paused; }
.cp-fwd { animation: cpFwd linear infinite; }
.cp-rev { animation: cpRev linear infinite; }
@keyframes cpFwd { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(-50%, 0, 0); } }
@keyframes cpRev { from { transform: translate3d(-50%, 0, 0); } to { transform: translate3d(0, 0, 0); } }

/* Circle */
.cp-circle {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  margin: 0 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.35s ease, border-color 0.3s, background 0.3s;
  cursor: pointer;
  padding: 0;
  outline: none;
  contain: content;
}
.cp-circle:hover {
  transform: scale(1.1);
  border-color: rgba(10, 228, 105, 0.5);
  background: rgba(255, 255, 255, 0.08);
}

/* Orbit rings removed for performance */
.cp-ring, .cp-ring2 { display: none; }

/* Glow removed */
.cp-glow { display: none; }

/* Logo image */
.cp-circle img {
  width: 90px;
  height: 90px;
  object-fit: contain;
  opacity: 1;
  transition: opacity 0.3s, transform 0.3s;
  position: relative;
  z-index: 1;
}
.cp-circle:hover img { transform: scale(1.05); }



/* Counters */
.cp-counters {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(24px, 6vw, 64px);
  margin-top: clamp(32px, 6vh, 64px);
  padding: clamp(24px, 4vh, 40px) 20px 0;
  border-top: 0.5px solid rgba(255,255,255,0.06);
  flex-wrap: wrap;
}
.cp-counter { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.cp-num {
  font-family: 'Poppins', sans-serif;
  font-size: clamp(20px, 3vw, 28px);
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
}
.cp-lbl {
  font-family: 'Poppins', sans-serif;
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.25);
}

.cp-num em { color: #1D9E75; font-style: normal; }

@media (max-width: 1024px) {
  .cp-circle { width: 110px; height: 110px; margin: 0 18px; }
  .cp-circle img { width: 75px; height: 75px; }
}

@media (max-width: 768px) {
  .cp-circle { width: 85px; height: 85px; margin: 0 12px; }
  .cp-circle img { width: 55px; height: 55px; }
  .cp-num { font-size: 28px; }
  .cp-counter-row { flex-direction: column; }
  .cp-counter-box { padding: 1.5rem; }
}


@media (max-width: 480px) {
  .cp-circle { width: 70px; height: 70px; margin: 0 8px; }
  .cp-circle img { width: 45px; height: 45px; }
  .cp-tag { font-size: 8px; }
  .cp-counters { gap: 20px 32px; }
}
`;

const LOGOS = clientLogosList;

const ROW1 = LOGOS.slice(0, 15);
const ROW2 = LOGOS.slice(15, 30);
const ROW3 = LOGOS.slice(30, 45);

function LogoRow({ logos, direction = "fwd", speed = "30s", isVisible }) {
  const doubled = [...logos, ...logos];
  return (
    <div className="cp-row-wrap">
      <div className={`cp-row cp-${direction}`} style={{ animationDuration: speed, animationPlayState: isVisible ? 'running' : 'paused' }}>
        {doubled.map((logo, i) => (
          <div className="cp-circle" key={i}>
            <img src={logo.src} alt={logo.alt} loading="lazy" decoding="async" width="90" height="90" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ClientLogos() {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{styles}</style>
      <section id="clients" ref={sectionRef} className="cp-section">
        <div className="cp-header">
          <p className="sec-label" style={{ color: 'var(--yellow)', justifyContent: 'center', marginBottom: '1.2rem' }}>Our Network</p>
          <ScrollFloat className="sec-title" tag="h2" style={{ textAlign: 'center' }}>
          Trusted by <span className="y">Brands</span>
        </ScrollFloat>
        </div>


        <div className="cp-rows">

          <LogoRow logos={ROW1} direction="fwd" speed="32s" isVisible={isVisible} />
          <LogoRow logos={ROW2} direction="rev" speed="40s" isVisible={isVisible} />
          <LogoRow logos={ROW3} direction="fwd" speed="26s" isVisible={isVisible} />
        </div>

        <div className="cp-counters">
          <div className="cp-counter"><span className="cp-num">50<em>+</em></span><span className="cp-lbl">Happy Clients</span></div>
          <div className="cp-counter"><span className="cp-num">120<em>+</em></span><span className="cp-lbl">Projects Done</span></div>
          <div className="cp-counter"><span className="cp-num">4<em>+</em></span><span className="cp-lbl">Years Active</span></div>
          <div className="cp-counter"><span className="cp-num">95<em>%</em></span><span className="cp-lbl">Client Retention</span></div>
        </div>


      </section>
    </>
  );
}
