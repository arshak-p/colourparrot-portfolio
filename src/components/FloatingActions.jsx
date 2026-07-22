import { useEffect, useState } from 'react';
import { lenis } from './SmoothScroll';
import './FloatingActions.css';

export default function FloatingActions() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress percentage
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? winScroll / height : 0;
      setScrollProgress(scrolled);

      if (winScroll > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount to get initial position
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Circumference for r=23 is 2 * PI * 23 = 144.51
  const dashOffset = 144.51 - (144.51 * scrollProgress);

  return (
    <div className="floating-actions">
      {/* WhatsApp Button */}
      <a 
        href="https://wa.me/919633865774" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="float-btn whatsapp-btn"
        aria-label="Chat with us on WhatsApp"
        style={{ position: 'relative' }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50px',
          border: '2px solid #25D366',
          animation: 'pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite'
        }} />
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'relative', zIndex: 2 }}>
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      </a>

      <style>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(0.9);
            opacity: 1;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
      `}</style>

      {/* Scroll To Top Button with Progress Indicator */}
      <button 
        onClick={scrollToTop} 
        className={`float-btn scroll-top-btn ${isVisible ? 'visible' : ''}`}
        aria-label="Scroll to top"
        style={{ position: 'relative', overflow: 'visible', border: 'none' }}
      >
        <svg 
          viewBox="0 0 50 50" 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%',
            height: '100%',
            transform: 'rotate(-90deg)',
            pointerEvents: 'none'
          }}
        >
          {/* Background circle track */}
          <circle 
            cx="25" 
            cy="25" 
            r="24" 
            fill="none" 
            stroke="rgba(255,255,255,0.05)" 
            strokeWidth="2" 
          />
          {/* Progress circle */}
          <circle 
            cx="25" 
            cy="25" 
            r="24" 
            fill="none" 
            stroke="var(--green)" 
            strokeWidth="2" 
            strokeDasharray="150.8" 
            strokeDashoffset={150.8 - (150.8 * scrollProgress)}
            strokeLinecap="round"
          />
        </svg>

        {/* Up Arrow Icon */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'relative', zIndex: 2 }}>
          <line x1="12" y1="19" x2="12" y2="5"></line>
          <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
      </button>
    </div>
  );
}
