import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function PosterCard({ item, shouldLoad = true }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()

  return (
    <Link 
      to={item.link} 
      className="poster-card-link"
      style={{ 
        position: 'relative',
        display: 'flex', 
        flexDirection: 'column', 
        borderRadius: '24px',
        overflow: 'hidden', 
        textDecoration: 'none',
        backgroundColor: '#111',
        width: '100%',
        height: '100%'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <style>{`
        .hovered-scale { transform: scale(1.08) translateZ(0); }
        .poster-card-link { aspect-ratio: 2/1; }
        @media (max-width: 768px) {
          .poster-card-link { aspect-ratio: 1 / 1; }
        }
      `}</style>

      {/* ── IMAGE LAYER ── */}
      <div className="pc-img-wrap" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {shouldLoad ? (
          <>
            <img 
              src={item.image} 
              alt={item.title} 
              loading="lazy"
              fetchpriority="low"
              decoding="async"
              width="600"
              height="400"
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
              className={hovered ? 'hovered-scale' : ''}
            />
            {item.secondaryImage && window.innerWidth > 768 && (
              <img 
                src={item.secondaryImage} 
                alt={item.title + ' secondary'} 
                loading="lazy"
                fetchpriority="low"
                decoding="async"
                style={{ 
                  position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', 
                  transition: 'opacity 0.4s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  opacity: hovered ? 1 : 0
                }}
                className={hovered ? 'hovered-scale' : ''}
              />
            )}
          </>
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#111' }}></div>
        )}
      </div>

      {/* ── GRADIENT OVERLAY ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 100%)',
        pointerEvents: 'none',
        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease',
        transform: hovered ? 'translateY(0)' : 'translateY(10%)',
        opacity: hovered ? 1 : 0.8,
        zIndex: 2
      }} />

      {/* ── TEXT CONTENT LAYER ── */}
      <div className="pc-text-wrap" style={{ 
        position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem 1.5rem',
        display: 'flex', flexDirection: 'column', gap: '0.8rem', zIndex: 4,
        transition: 'transform 0.4s ease', transform: hovered ? 'translateY(-5px)' : 'translateY(0)'
      }}>
        <h3 style={{ fontSize: 'clamp(1rem, 1.5vw, 1.6rem)', fontWeight: 600, color: '#ffffff', margin: 0, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>{item.title}</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(item.tags || ['Creative Advertising', 'Brand Identity']).map((tag, idx) => (
            <span 
              key={idx} 
              className="poster-tag"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                let path = '/services';
                switch(tag) {
                  case 'Web & UI Design': path = '/services/web-design'; break;
                  case 'Creative Advertising': path = '/services/creative-advertising'; break;
                  case 'Brand Identity': path = '/services/brand-identity'; break;
                  case 'Video Production': path = '/services/video-production'; break;
                  case 'Digital Marketing': path = '/services/digital-marketing'; break;
                  case 'Content Creation': path = '/services/content-creation'; break;
                }
                navigate(path);
              }}
            >
              {tag.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
