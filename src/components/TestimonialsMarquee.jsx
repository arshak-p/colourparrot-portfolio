import React, { useRef, useEffect, useState } from 'react';
import './TestimonialsMarquee.css';

export function TestimonialsMarquee({ items }) {
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Duplicate items for infinite scroll effect
  const marqueeItems = [...items, ...items, ...items, ...items, ...items];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animationId;
    let intervalId;

    const checkIsMobile = () => window.innerWidth <= 768;
    let isMobile = checkIsMobile();

    const handleResize = () => {
      isMobile = checkIsMobile();
    };
    window.addEventListener('resize', handleResize);

    // Desktop continuous scroll
    const scrollStep = () => {
      if (!isMobile && !isDragging && !isHovered) {
        track.scrollLeft += 1;
        // Infinite loop logic
        if (track.scrollLeft >= (track.scrollWidth - track.clientWidth) / 2) {
           track.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scrollStep);
    };
    animationId = requestAnimationFrame(scrollStep);

    // Mobile discrete auto-slide (Carousel style)
    intervalId = setInterval(() => {
      if (isMobile && !isDragging && !isHovered) {
        const card = track.querySelector('.tm-card');
        const cardWidth = card ? card.offsetWidth + 32 : window.innerWidth * 0.85; // 32px is 2rem gap
        
        // If nearing the end of the duplicated set, silently reset to 0
        if (track.scrollLeft >= (track.scrollWidth - track.clientWidth) / 2) {
           track.scrollLeft = 0;
        } else {
           track.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
      }
    }, 3000); // Swipe every 3 seconds

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(intervalId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDragging, isHovered]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - trackRef.current.offsetLeft);
    setScrollLeft(trackRef.current.scrollLeft);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll-fast multiplier
    trackRef.current.scrollLeft = scrollLeft - walk;
  };

  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (trackRef.current) {
      const card = trackRef.current.querySelector('.tm-card');
      const cardWidth = card ? card.offsetWidth + 32 : window.innerWidth * 0.85; // 32px gap
      
      const index = Math.round(trackRef.current.scrollLeft / cardWidth);
      setActiveIndex(index % items.length);
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="tm-container">
      <div 
        className={`tm-track ${isDragging ? 'dragging' : ''}`}
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onScroll={handleScroll}
      >
        {marqueeItems.map((item, i) => (
          <div key={`${item.id}-${i}`} className="tm-card" style={{ borderTopColor: item.color || 'var(--green)' }}>
            {item.image && (
              <img src={item.image} alt="" className="tm-bg-logo" />
            )}
            <p className="tm-desc">"{item.description}"</p>
            <div className="tm-footer">
              <div className="tm-initial" style={{ color: item.color || 'var(--green)' }}>
                {item.initial}
              </div>
              <h4 className="tm-title">{item.title}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dots (Mobile Only) */}
      <div className="tm-dots">
        {items.map((_, idx) => (
          <div 
            key={idx} 
            className={`tm-dot ${activeIndex === idx ? 'active' : ''}`} 
          />
        ))}
      </div>
    </div>
  );
}
