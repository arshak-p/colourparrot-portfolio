import React, { useEffect, useRef } from 'react';
import './HeroExperiment.css';

export default function HeroExperiment() {
  const videoCanvasRef = useRef(null);
  const videoFallbackRef = useRef(null);
  const particlesCanvasRef = useRef(null);
  const heroRef = useRef(null);
  const fixedCardsRef = useRef(null);
  const cardsGridRef = useRef(null);
  const cardsTriggerRef = useRef(null);
  const sectionThreeInnerRef = useRef(null);

  useEffect(() => {
    // Scroll Video Logic
    const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260616_212935_bbf608da-62d1-4f25-9be4-c346e4d09cc8.mp4';
    const canvas = videoCanvasRef.current;
    const videoEl = videoFallbackRef.current;
    if (!canvas || !videoEl) return;
    
    const ctx = canvas.getContext('2d');
    let frames = [];
    let framesReady = false;
    let lastFrameIndex = -1;
    let videoSeeking = false;
    let animationFrameId;

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      lastFrameIndex = -1;
    }

    let isMounted = true;

    async function extractFrames() {
      try {
        const response = await fetch(VIDEO_URL, { mode: 'cors' });
        const blob = await response.blob();
        if (!isMounted) return;
        const objectUrl = URL.createObjectURL(blob);

        const video = document.createElement('video');
        video.muted = true;
        video.playsInline = true;
        video.crossOrigin = 'anonymous';
        video.preload = 'auto';
        video.src = objectUrl;

        await new Promise((resolve, reject) => {
          video.onloadedmetadata = () => resolve();
          video.onerror = () => reject();
          setTimeout(() => reject(), 15000);
        });

        if (!isMounted) return;
        const scale = Math.min(1, 800 / video.videoWidth); // Reduced from 1280 to 800 for better performance
        const scaledWidth = Math.round(video.videoWidth * scale);
        const scaledHeight = Math.round(video.videoHeight * scale);
        const frameCount = Math.max(30, Math.min(120, Math.round(video.duration * 24)));

        for (let i = 0; i < frameCount; i++) {
          if (!isMounted) break;
          const time = (i / (frameCount - 1)) * (video.duration - 0.05);
          video.currentTime = time;
          await new Promise((resolve, reject) => {
            const onSeeked = () => { video.removeEventListener('seeked', onSeeked); resolve(); };
            video.addEventListener('seeked', onSeeked);
            setTimeout(() => { video.removeEventListener('seeked', onSeeked); reject(); }, 3000);
          });
          const bitmap = await window.createImageBitmap(video, { resizeWidth: scaledWidth, resizeHeight: scaledHeight });
          frames.push(bitmap);
        }

        if (frames.length > 0) {
          framesReady = true;
          canvas.style.visibility = 'visible';
          videoEl.style.display = 'none';
        }
        URL.revokeObjectURL(objectUrl);
      } catch(e) { /* fallback */ }
    }

    function getScrollBounds() {
      const vh = window.innerHeight;
      return { start: vh * 0.5, end: document.documentElement.scrollHeight - vh };
    }

    function getProgress() {
      const { start, end } = getScrollBounds();
      const range = end - start;
      if (range <= 0) return 0;
      return Math.max(0, Math.min(1, (window.scrollY - start) / range));
    }

    function drawFrame(frame) {
      const cw = canvas.width, ch = canvas.height;
      const s = Math.max(cw / frame.width, ch / frame.height);
      const dw = frame.width * s, dh = frame.height * s;
      ctx.drawImage(frame, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    }

    function videoTick() {
      const progress = getProgress();
      if (framesReady && frames.length > 0) {
        const idx = Math.round(progress * (frames.length - 1));
        if (idx !== lastFrameIndex) {
          lastFrameIndex = idx;
          if (frames[idx]) drawFrame(frames[idx]);
        }
      } else if (videoEl.duration && isFinite(videoEl.duration) && videoEl.readyState >= 1) {
        const target = progress * videoEl.duration;
        if (!videoSeeking && Math.abs(videoEl.currentTime - target) > 0.001) {
          videoSeeking = true;
          videoEl.currentTime = target;
        }
      }
      animationFrameId = requestAnimationFrame(videoTick);
    }

    const onSeeked = () => { videoSeeking = false; };
    const onStalled = () => { videoSeeking = false; };
    const onLoadedData = () => { videoEl.currentTime = 0; };

    videoEl.addEventListener('seeked', onSeeked);
    videoEl.addEventListener('stalled', onStalled);
    videoEl.addEventListener('loadeddata', onLoadedData);
    canvas.style.visibility = 'hidden';

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animationFrameId = requestAnimationFrame(videoTick);
    extractFrames();

    // Particles
    const pCanvas = particlesCanvasRef.current;
    const pCtx = pCanvas ? pCanvas.getContext('2d') : null;
    let particles = [];
    let pAnimationId;

    function resizeParticles() {
      if (!pCanvas) return;
      pCanvas.width = window.innerWidth;
      pCanvas.height = window.innerHeight;
      createParticles();
    }

    function createParticles() {
      if (!pCanvas) return;
      particles = [];
      const count = Math.floor((pCanvas.width * pCanvas.height) / 12000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * pCanvas.width,
          y: Math.random() * pCanvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.6 + 0.2
        });
      }
    }

    function animateParticles() {
      if (!pCtx || !pCanvas) return;
      pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = pCanvas.width;
        if (p.x > pCanvas.width) p.x = 0;
        if (p.y < 0) p.y = pCanvas.height;
        if (p.y > pCanvas.height) p.y = 0;
        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        pCtx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        pCtx.fill();
      }
      pAnimationId = requestAnimationFrame(animateParticles);
    }

    if (pCanvas) {
      resizeParticles();
      window.addEventListener('resize', resizeParticles);
      animateParticles();
    }

    // Hero Fade
    function updateHeroOpacity() {
      if (!heroRef.current) return;
      const fade = Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.3));
      heroRef.current.style.opacity = fade;
    }
    window.addEventListener('scroll', updateHeroOpacity, { passive: true });

    // Fixed Cards
    let cardsAnimationId;
    let cachedTriggerTop = 0;
    let cachedTriggerHeight = 0;

    function updateCardMeasurements() {
      const trigger = cardsTriggerRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      cachedTriggerTop = rect.top + window.scrollY;
      cachedTriggerHeight = rect.height;
    }

    // Initial measurement and attach to resize
    updateCardMeasurements();
    window.addEventListener('resize', updateCardMeasurements);

    function tickCards() {
      const fixedCards = fixedCardsRef.current;
      const cardsGrid = cardsGridRef.current;
      
      if (!fixedCards || !cardsGrid) {
        cardsAnimationId = requestAnimationFrame(tickCards);
        return;
      }

      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      const start = cachedTriggerTop - vh * 0.5;
      const end = cachedTriggerTop + cachedTriggerHeight - vh * 0.3;
      const range = end - start;

      let progress = range > 0 ? (scrollY - start) / range : 0;
      progress = Math.max(0, Math.min(1, progress));

      const isActive = scrollY >= start - vh * 0.2 && scrollY <= end + vh * 0.3;
      const fadeIn = Math.min(1, Math.max(0, (scrollY - (start - vh * 0.2)) / (vh * 0.2)));
      const fadeOut = Math.min(1, Math.max(0, (end + vh * 0.3 - scrollY) / (vh * 0.3)));
      const containerOpacity = isActive ? Math.min(fadeIn, fadeOut) : 0;

      fixedCards.style.opacity = containerOpacity;
      fixedCards.style.pointerEvents = containerOpacity > 0.1 ? 'auto' : 'none';

      const isMobile = window.innerWidth < 768;
      const revealPct = progress * 130;
      if (isMobile) {
        cardsGrid.style.maskImage = `linear-gradient(to bottom, black ${revealPct}%, transparent ${revealPct + 20}%)`;
        cardsGrid.style.WebkitMaskImage = `linear-gradient(to bottom, black ${revealPct}%, transparent ${revealPct + 20}%)`;
      } else {
        cardsGrid.style.maskImage = `linear-gradient(to right, black ${revealPct}%, transparent ${revealPct + 15}%)`;
        cardsGrid.style.WebkitMaskImage = `linear-gradient(to right, black ${revealPct}%, transparent ${revealPct + 15}%)`;
      }

      cardsAnimationId = requestAnimationFrame(tickCards);
    }
    cardsAnimationId = requestAnimationFrame(tickCards);

    // Section 3 Intersection
    const sectionThreeInner = sectionThreeInnerRef.current;
    let observer;
    if (sectionThreeInner) {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          sectionThreeInner.classList.add('visible');
          if (observer) observer.unobserve(sectionThreeInner);
        }
      }, { threshold: 0.15 });
      observer.observe(sectionThreeInner);
    }

    return () => {
      isMounted = false;
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('resize', resizeParticles);
      window.removeEventListener('resize', updateCardMeasurements);
      window.removeEventListener('scroll', updateHeroOpacity);
      cancelAnimationFrame(animationFrameId);
      cancelAnimationFrame(pAnimationId);
      cancelAnimationFrame(cardsAnimationId);
      videoEl.removeEventListener('seeked', onSeeked);
      videoEl.removeEventListener('stalled', onStalled);
      videoEl.removeEventListener('loadeddata', onLoadedData);
      if (observer && sectionThreeInner) observer.disconnect();
    };
  }, []);

  return (
    <div className="hero-experiment-wrapper">
      {/* Scroll Video Background */}
      <div id="scroll-video-container">
        <canvas id="video-canvas" ref={videoCanvasRef}></canvas>
        <video 
          id="video-fallback" 
          ref={videoFallbackRef}
          muted 
          playsInline 
          preload="auto" 
          crossOrigin="anonymous"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260616_212935_bbf608da-62d1-4f25-9be4-c346e4d09cc8.mp4"
        ></video>
        <div className="overlay"></div>
      </div>

      {/* Particles */}
      <canvas id="particles-canvas" ref={particlesCanvasRef}></canvas>

      {/* Fixed Cards */}
      <div id="fixed-cards" ref={fixedCardsRef}>
        <div className="grid" ref={cardsGridRef}>
          <div className="card">
            <h3>Explore Veldara</h3>
            <p>Veldara merges the elegance of Svelte 5 with the depth of Three.js within easy reach. It's crafted to be robust and adaptable while remaining intuitive and simple to grasp.</p>
          </div>
          <div className="card">
            <h3>Unlock Three.js</h3>
            <p>The web is growing increasingly dimensional. At its heart, Veldara offers a composable declarative API for building performant Three.js experiences on the web.</p>
          </div>
          <div className="card">
            <h3>Connect Everything</h3>
            <p>Veldara ships with tooling for physics, XR, animation, layouting, model loading, and extensive utilities to make building compelling 3D apps for the web effortless.</p>
          </div>
        </div>
      </div>

      {/* Navigation removed */}

      {/* Main Content */}
      <div id="content">
        {/* Section 1: Hero */}
        <section id="hero" ref={heroRef}>
          <div className="gradient-overlay"></div>
          <div className="content">
            <p className="subtitle">Our Purpose:</p>
            <h1>
              Instantly craft immersive
              <span className="underlined"><span className="line"></span><span>3D worlds</span></span>
              on the web.
            </h1>
            <div className="ctas">
              <div className="code-box">
                <span className="prompt">&gt;</span>
                <code>npm i @veldara/core</code>
              </div>
              <a href="#" className="cta-btn">Get Started <span>&rarr;</span></a>
            </div>
          </div>
          <div className="bounce-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
          </div>
        </section>

        {/* Spacer */}
        <div style={{ height: '150vh' }}></div>

        {/* Cards Trigger Zone */}
        <div id="cards-trigger" ref={cardsTriggerRef} style={{ height: '200vh' }}></div>

        {/* Spacer */}
        <div style={{ height: '100vh' }}></div>

        {/* Section 3 */}
        <section id="section-three">
          <div className="inner" id="section-three-inner" ref={sectionThreeInnerRef}>
            <p>Presenting</p>
            <h2>Veldara 8</h2>
          </div>
        </section>
      </div>
    </div>
  );
}
