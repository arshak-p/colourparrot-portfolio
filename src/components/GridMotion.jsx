import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const GridMotion = ({ items = [], gradientColor = 'black' }) => {
  const gridRef = useRef(null);
  const rowRefs = useRef([]);
  const mouseXRef = useRef(window.innerWidth / 2);

  const totalItems = 28;
  const defaultItems = Array.from({ length: totalItems }, (_, index) => `Item ${index + 1}`);
  const combinedItems = items.length > 0 ? items.slice(0, totalItems) : defaultItems;
  
  // Fill array up to 28 items if it's too short by repeating
  while (combinedItems.length < totalItems) {
      combinedItems.push(...items.slice(0, totalItems - combinedItems.length));
  }

  useEffect(() => {
    gsap.ticker.lagSmoothing(0);

    const handlePointerMove = e => {
      if (e.touches && e.touches.length > 0) {
        mouseXRef.current = e.touches[0].clientX;
      } else {
        mouseXRef.current = e.clientX;
      }
    };

    const updateMotion = () => {
      const maxMoveAmount = 300;
      const baseDuration = 0.8;
      const inertiaFactors = [0.6, 0.4, 0.3, 0.2];

      rowRefs.current.forEach((row, index) => {
        if (row) {
          const direction = index % 2 === 0 ? 1 : -1;
          const moveAmount = ((mouseXRef.current / window.innerWidth) * maxMoveAmount - maxMoveAmount / 2) * direction;

          gsap.to(row, {
            x: moveAmount,
            duration: baseDuration + inertiaFactors[index % inertiaFactors.length],
            ease: 'power3.out',
            overwrite: 'auto'
          });
        }
      });
    };

    const removeAnimationLoop = gsap.ticker.add(updateMotion);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      removeAnimationLoop();
    };
  }, []);

  return (
    <div ref={gridRef} style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      <section
        style={{
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `radial-gradient(circle, ${gradientColor} 0%, transparent 100%)`
        }}
      >
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, pointerEvents: 'none', zIndex: 4, backgroundSize: '250px' }}></div>
        <div style={{ 
          gap: '1rem', 
          flex: 'none', 
          position: 'relative', 
          width: '150vw', 
          height: '150vh', 
          display: 'grid', 
          gridTemplateRows: 'repeat(4, minmax(0, 1fr))', 
          gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', 
          transform: 'rotate(-15deg)', 
          transformOrigin: 'center', 
          zIndex: 2 
        }}>
          {[...Array(4)].map((_, rowIndex) => (
            <div
              key={rowIndex}
              style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', willChange: 'transform, filter' }}
              ref={el => (rowRefs.current[rowIndex] = el)}
            >
              {[...Array(7)].map((_, itemIndex) => {
                const content = combinedItems[rowIndex * 7 + itemIndex];
                const isImage = typeof content === 'string' && (content.startsWith('http') || content.startsWith('/') || content.startsWith('url'));
                
                return (
                  <div key={itemIndex} style={{ position: 'relative' }}>
                    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: '10px', backgroundColor: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 'clamp(0.5rem, 1.5vw, 1.5rem)', wordBreak: 'break-word', padding: '0.25rem', lineHeight: 1.1 }}>
                      {isImage ? (
                        <div
                          style={{ width: '100%', height: '100%', backgroundSize: 'cover', backgroundPosition: 'center', position: 'absolute', top: 0, left: 0, backgroundImage: `url(${content})` }}
                        ></div>
                      ) : (
                        <div style={{ padding: '1rem', textAlign: 'center', zIndex: 1 }}>{content}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{ position: 'relative', width: '100%', height: '100%', top: 0, left: 0, pointerEvents: 'none' }}></div>
      </section>
    </div>
  );
};

export default GridMotion;
