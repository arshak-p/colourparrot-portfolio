import React, { useState, useRef, useEffect } from 'react';
import aiVideos from '../../data/ai_videos.json';
import originalMotionVideos from '../../data/motion_videos.json';
import otherVideos from '../../data/other_videos.json';
import videoMeta from '../../data/video_meta.json';
import podcastVideos from '../../data/podcast_videos.json';
import presentationVideos from '../../data/presentation_videos.json';

const LazyVideo = ({ src }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { rootMargin: '300px' }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`video-item-wrapper ${isLandscape ? 'landscape-vid' : 'portrait-vid'}`}
      style={{ 
        background: '#0a0a0a', 
        overflow: 'hidden', 
        position: 'relative'
      }}
    >
      {isVisible && (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <video 
            ref={videoRef}
            src={`${src}#t=5.1`}
            loop 
            muted={false}
            playsInline 
            onLoadedMetadata={(e) => {
              setIsLandscape(e.target.videoWidth > e.target.videoHeight);
            }}
            onMouseEnter={() => {
              if (videoRef.current) {
                videoRef.current.muted = false; // Ensure it attempts to play with sound
                videoRef.current.play().catch(() => {
                  // Browsers may block unmuted autoplay if the user hasn't clicked on the page yet.
                  // If blocked, fallback to playing muted so the visual still works.
                  videoRef.current.muted = true;
                  videoRef.current.play().catch(() => {});
                });
              }
            }}
            onMouseLeave={() => {
              if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
              }
            }}
            style={{ 
              width: '100%', 
              height: 'auto', 
              display: 'block',
              opacity: 0.7,
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.target.style.opacity = 1;
              e.target.style.transform = 'scale(1.02)';
            }}
            onMouseOut={(e) => {
              e.target.style.opacity = 0.7;
              e.target.style.transform = 'scale(1)';
            }}
          />
        </div>
      )}
    </div>
  );
};

export default function MassiveVideoGrid({ accentColor, filterType, title = "Complete Motion Archive", subtitle = "The Vault", limit }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter out the 5 videos already shown in the Reel Gallery above to prevent duplicates
  const alreadyShown = [
    '/compressed_motion/kalqy/kalqy logo outro.mp4',
    '/compressed_motion/railrolls/railrolls outro railway.mp4',
    '/compressed_motion/railrolls/railrolls railway 6 place.mp4',
    '/compressed_motion/railrolls/railrolls railway 1.mp4',
    '/compressed_motion/ays/ays motion.mp4'
  ];
  
  let allVideos = [];
  
  if (filterType === 'ai') {
    allVideos = Array.isArray(aiVideos) ? aiVideos : [];
  } else if (filterType === 'motion') {
    allVideos = Array.isArray(originalMotionVideos) ? originalMotionVideos : [];
  } else if (filterType === 'others') {
    allVideos = Array.isArray(otherVideos) ? otherVideos : [];
  } else if (filterType === 'podcast') {
    allVideos = Array.isArray(podcastVideos) ? podcastVideos : [];
  } else if (filterType === 'presentation') {
    allVideos = Array.isArray(presentationVideos) ? presentationVideos : [];
  }

  // Also filter by filename to catch compressed versions of the same file
  let videosToRender = allVideos.filter(vid => !alreadyShown.some(shown => vid.includes(shown.split('/').pop())));

  if (videosToRender.length === 0) return null;

  const activeLimit = isMobile ? 3 : limit;
  const hasMore = activeLimit && videosToRender.length > activeLimit;
  
  if (activeLimit && !isExpanded) {
    videosToRender = videosToRender.slice(0, activeLimit);
  }

  const isAI = filterType === 'ai';

  return (
    <section className="pad" style={{ background: '#000', borderTop: '1px solid rgba(255,255,255,0.05)', paddingBottom: (hasMore && !isExpanded) ? '0' : '4rem' }}>
      <div className="container">
        <div style={{ marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.3em', color: accentColor, textTransform: 'uppercase' }}>{subtitle}</span>
          <h2 style={{ fontSize: '3rem', color: '#fff', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {title}
            {isAI && <span style={{ fontSize: '1rem', padding: '0.3rem 0.8rem', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', color: '#fff' }}>BETA</span>}
          </h2>
        </div>
      </div>

      <div className="masonry-container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="video-dense-masonry">
          {videosToRender.map((vid, i) => (
            <LazyVideo key={i} src={vid} />
          ))}
        </div>
      </div>

      {hasMore && !isExpanded && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem', paddingBottom: '3rem' }}>
          <button onClick={() => setIsExpanded(true)} style={{
            display: 'inline-block', padding: '1rem 3rem', borderRadius: '100px',
            border: `1px solid ${accentColor}`, color: '#fff', textDecoration: 'none',
            fontSize: '1rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
            transition: 'all 0.3s ease', background: 'rgba(255,255,255,0.03)', cursor: 'pointer'
          }}
          onMouseEnter={(e) => { e.target.style.background = accentColor; e.target.style.color = '#000'; }}
          onMouseLeave={(e) => { e.target.style.background = 'rgba(255,255,255,0.03)'; e.target.style.color = '#fff'; }}
          >
            View More
          </button>
        </div>
      )}
    </section>
  );
}
