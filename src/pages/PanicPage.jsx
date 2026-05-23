import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Starfield from '../components/Starfield';
import StarBorderBtn from '../components/StarBorderBtn';
import { Link } from 'react-router-dom';
import '../styles/PanicPage.css';

// Synthetic sound generator using Web Audio API
const playSynthSound = (type) => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    if (type === 'laser') {
      // Pew-pew laser effect
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.12);
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === 'explosion') {
      // White noise explosion with lowpass filter sweep
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.3);
      
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      
      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      source.start();
    } else if (type === 'siren') {
      // Wailing alarm tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(650, ctx.currentTime + 0.25);
      osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.5);
      osc.frequency.linearRampToValueAtTime(650, ctx.currentTime + 0.75);
      osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 1.0);
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.0);
    }
  } catch (err) {
    console.warn('Synth sound failed to play:', err);
  }
};

export default function PanicPage() {
  const [gameState, setGameState] = useState('idle'); // 'idle', 'starting', 'playing', 'gameover'
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  
  const canvasRef = useRef(null);
  const scoreRef = useRef(0);
  const wailingIntervalRef = useRef(null);

  // Sync ref for access inside requestAnimationFrame
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // Game countdown timer logic
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const intervalId = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          setGameState('gameover');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [gameState]);

  // Handle wailing sirens during starting and playing state
  useEffect(() => {
    if (gameState === 'starting') {
      playSynthSound('siren');
      wailingIntervalRef.current = setInterval(() => {
        playSynthSound('siren');
      }, 1000);
    } else if (gameState === 'gameover' || gameState === 'idle') {
      if (wailingIntervalRef.current) {
        clearInterval(wailingIntervalRef.current);
        wailingIntervalRef.current = null;
      }
    }
    return () => {
      if (wailingIntervalRef.current) {
        clearInterval(wailingIntervalRef.current);
      }
    };
  }, [gameState]);

  // Start transition wailing effect
  const handlePanicActivate = () => {
    setGameState('starting');
    setTimeout(() => {
      setScore(0);
      setTimer(30);
      setGameState('playing');
    }, 1500);
  };

  // HTML5 Canvas Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track mouse position
    let mouse = { x: width / 2, y: height / 2 };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Gun turret coordinates
    const leftGun = { x: 120, y: height };
    const rightGun = { x: width - 120, y: height };
    const muzzleFlash = { left: 0, right: 0 }; // frames of flash animation

    // Game elements arrays
    const stones = [];
    const comets = [];
    const lasers = [];
    const particles = [];

    // Helper: generate jagged outline path for wireframe space stones
    const generateStoneShape = (radius) => {
      const points = [];
      const numPoints = 8 + Math.floor(Math.random() * 5); // 8 to 12 vertices
      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        const dist = radius * (0.75 + Math.random() * 0.35); // jagged offset
        points.push({
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist
        });
      }
      return points;
    };

    // Spawn Space Stone (Asteroid)
    const spawnStone = () => {
      const radius = 25 + Math.random() * 35;
      const x = Math.random() * width;
      const y = -radius - 10;
      const speedY = 1.5 + Math.random() * 2.5;
      const speedX = (Math.random() - 0.5) * 1.5;
      stones.push({
        x,
        y,
        vx: speedX,
        vy: speedY,
        radius,
        shape: generateStoneShape(radius),
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        color: Math.random() > 0.5 ? '#0ae469' : '#28c1e5' // green or cyan outline
      });
    };

    // Spawn Comet
    const spawnComet = () => {
      const radius = 6;
      const fromLeft = Math.random() > 0.5;
      const x = fromLeft ? -50 : width + 50;
      const y = Math.random() * (height * 0.5);
      const speedX = fromLeft ? (8 + Math.random() * 6) : -(8 + Math.random() * 6);
      const speedY = 2 + Math.random() * 4;
      comets.push({
        x,
        y,
        vx: speedX,
        vy: speedY,
        radius,
        trail: [],
        color: '#28c1e5'
      });
    };

    // Firing function on click
    const handleShoot = (e) => {
      const targetX = e.clientX;
      const targetY = e.clientY;

      playSynthSound('laser');

      // Trigger muzzle flashes
      muzzleFlash.left = 8;
      muzzleFlash.right = 8;

      // Left nozzle nozzle tips location
      const leftAngle = Math.atan2(targetY - leftGun.y, targetX - leftGun.x);
      const leftTipX = leftGun.x + Math.cos(leftAngle) * 90;
      const leftTipY = leftGun.y + Math.sin(leftAngle) * 90;

      // Right nozzle nozzle tips location
      const rightAngle = Math.atan2(targetY - rightGun.y, targetX - rightGun.x);
      const rightTipX = rightGun.x + Math.cos(rightAngle) * 90;
      const rightTipY = rightGun.y + Math.sin(rightAngle) * 90;

      // Add lasers
      lasers.push({
        startX: leftTipX,
        startY: leftTipY,
        endX: targetX,
        endY: targetY,
        life: 1.0,
        color: '#0ae469'
      });

      lasers.push({
        startX: rightTipX,
        startY: rightTipY,
        endX: targetX,
        endY: targetY,
        life: 1.0,
        color: '#28c1e5'
      });

      // Spawn click-area spark particles
      for (let i = 0; i < 8; i++) {
        particles.push({
          x: targetX,
          y: targetY,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          size: 1 + Math.random() * 2,
          life: 1.0,
          decay: 0.05 + Math.random() * 0.05,
          color: '#ffffff'
        });
      }

      // Check hits on stones
      for (let sIdx = stones.length - 1; sIdx >= 0; sIdx--) {
        const s = stones[sIdx];
        const dist = Math.hypot(targetX - s.x, targetY - s.y);
        if (dist <= s.radius + 15) { // generous hitbox
          playSynthSound('explosion');
          setScore((prev) => prev + 10);
          
          // Generate glowing neon debris particles
          for (let p = 0; p < 24; p++) {
            particles.push({
              x: s.x,
              y: s.y,
              vx: (Math.random() - 0.5) * 8,
              vy: (Math.random() - 0.5) * 8,
              size: 2 + Math.random() * 3,
              life: 1.0,
              decay: 0.02 + Math.random() * 0.03,
              color: s.color
            });
          }
          stones.splice(sIdx, 1);
          return; // only hit one per click
        }
      }

      // Check hits on comets
      for (let cIdx = comets.length - 1; cIdx >= 0; cIdx--) {
        const c = comets[cIdx];
        const dist = Math.hypot(targetX - c.x, targetY - c.y);
        if (dist <= c.radius + 20) {
          playSynthSound('explosion');
          setScore((prev) => prev + 25); // Comets are harder to shoot
          
          // Explosion particles
          for (let p = 0; p < 20; p++) {
            particles.push({
              x: c.x,
              y: c.y,
              vx: (Math.random() - 0.5) * 10,
              vy: (Math.random() - 0.5) * 10,
              size: 2 + Math.random() * 2,
              life: 1.0,
              decay: 0.03 + Math.random() * 0.04,
              color: '#28c1e5'
            });
          }
          comets.splice(cIdx, 1);
          return;
        }
      }
    };

    window.addEventListener('click', handleShoot);

    // Spawning timers variables
    let stoneSpawnTimer = 0;
    let cometSpawnTimer = 0;

    // Render loop
    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      // Decrement muzzle flash frames
      if (muzzleFlash.left > 0) muzzleFlash.left--;
      if (muzzleFlash.right > 0) muzzleFlash.right--;

      // 1. Spawn logic
      stoneSpawnTimer++;
      cometSpawnTimer++;

      // Spawning speeds up over time
      const spawnInterval = Math.max(25, 60 - Math.floor(scoreRef.current * 0.2));
      if (stoneSpawnTimer >= spawnInterval) {
        spawnStone();
        stoneSpawnTimer = 0;
      }

      if (cometSpawnTimer >= 180) { // comet spawns every 3 seconds
        spawnComet();
        cometSpawnTimer = 0;
      }

      // 2. Update and draw comets
      for (let i = comets.length - 1; i >= 0; i--) {
        const c = comets[i];
        c.x += c.vx;
        c.y += c.vy;

        // Trail logic
        c.trail.push({ x: c.x, y: c.y });
        if (c.trail.length > 12) c.trail.shift();

        // Draw trail
        if (c.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(c.trail[0].x, c.trail[0].y);
          for (let j = 1; j < c.trail.length; j++) {
            ctx.lineTo(c.trail[j].x, c.trail[j].y);
          }
          ctx.strokeStyle = 'rgba(40, 193, 229, 0.4)';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        // Draw comet glow head
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#28c1e5';
        ctx.shadowColor = '#28c1e5';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0; // reset glow

        // Delete if out of viewport
        if (c.y > height + 20 || c.x < -50 || c.x > width + 50) {
          comets.splice(i, 1);
        }
      }

      // 3. Update and draw space stones
      for (let i = stones.length - 1; i >= 0; i--) {
        const s = stones[i];
        s.x += s.vx;
        s.y += s.vy;
        s.rotation += s.rotSpeed;

        // Draw wireframe outline rotating space stone
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        ctx.beginPath();
        ctx.moveTo(s.shape[0].x, s.shape[0].y);
        for (let j = 1; j < s.shape.length; j++) {
          ctx.lineTo(s.shape[j].x, s.shape[j].y);
        }
        ctx.closePath();
        
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 2.0;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.restore();
        ctx.shadowBlur = 0; // reset shadow

        // Delete if out of bounds
        if (s.y > height + s.radius + 20) {
          stones.splice(i, 1);
        }
      }

      // 4. Update and draw laser lines
      for (let i = lasers.length - 1; i >= 0; i--) {
        const l = lasers[i];
        l.life -= 0.14; // rapid fade

        if (l.life <= 0) {
          lasers.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.moveTo(l.startX, l.startY);
        ctx.lineTo(l.endX, l.endY);
        ctx.strokeStyle = l.color;
        ctx.lineWidth = 4 * l.life;
        ctx.shadowColor = l.color;
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // 5. Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 6. Draw gun nozzles in the corners
      const drawNozzle = (gun, color, isFlashActive) => {
        const angle = Math.atan2(mouse.y - gun.y, mouse.x - gun.x);
        
        ctx.save();
        ctx.translate(gun.x, gun.y);
        ctx.rotate(angle);

        // Base circle
        ctx.beginPath();
        ctx.arc(0, 0, 48, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(1, 13, 18, 0.75)';
        ctx.strokeStyle = color;
        ctx.lineWidth = 3.5;
        ctx.shadowColor = color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Rotating simple gun barrel nozzle
        ctx.beginPath();
        ctx.rect(-15, -12, 90, 24);
        ctx.fillStyle = 'rgba(2, 23, 30, 0.9)';
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.fill();
        ctx.stroke();

        // Tip outline
        ctx.beginPath();
        ctx.rect(75, -14, 8, 28);
        ctx.fillStyle = color;
        ctx.fill();

        // Muzzle fire flash ring
        if (isFlashActive) {
          ctx.beginPath();
          ctx.arc(88, 0, 15 + Math.random() * 8, -Math.PI / 3, Math.PI / 3);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 4;
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 20;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        ctx.restore();
      };

      drawNozzle(leftGun, '#0ae469', muzzleFlash.left > 0);
      drawNozzle(rightGun, '#28c1e5', muzzleFlash.right > 0);

      animationId = requestAnimationFrame(tick);
    };

    tick();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleShoot);
    };
  }, [gameState]);

  return (
    <div className="panic-page">
      <Starfield />

      {/* Exit Game Button */}
      <Link to="/" className="game-exit-btn">
        Exit to Site
      </Link>

      {/* Screen flash overlay during warning transition */}
      <div 
        className="warning-flash" 
        style={{
          opacity: gameState === 'starting' ? [0, 1, 0, 1, 0][Math.floor(Date.now() / 150) % 5] : 0,
          transition: 'opacity 0.1s ease'
        }}
      />

      {/* Screen shake layout */}
      <div 
        style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          transform: gameState === 'starting' ? `translate(${(Math.random() - 0.5) * 12}px, ${(Math.random() - 0.5) * 12}px)` : 'none'
        }}
      >
        {/* State 1: Idle - Blinking Panic Button */}
        {gameState === 'idle' && (
          <div className="panic-btn-container">
            <button className="panic-button" onClick={handlePanicActivate}>
              Panic
            </button>
            <p className="panic-hint">Press in case of emergency</p>
          </div>
        )}

        {/* State 2: Starting Transition */}
        {gameState === 'starting' && (
          <div className="warning-message">
            COLLISION DEBRIS INBOUND!
          </div>
        )}

        {/* State 3: Active Gameplay */}
        {gameState === 'playing' && (
          <>
            {/* Game HUD */}
            <div className="game-hud">
              <div className="hud-item hud-green">
                <span className="hud-label">Score</span>
                <span className="hud-value">{score}</span>
              </div>
              <div className={`hud-item ${timer <= 5 ? 'hud-red' : 'hud-cyan'}`}>
                <span className="hud-label">Time Remaining</span>
                <span className="hud-value">{timer}s</span>
              </div>
            </div>

            {/* Firing Game Canvas overlay */}
            <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 12, cursor: 'crosshair' }} />
          </>
        )}

        {/* State 4: Game Over Results */}
        {gameState === 'gameover' && (
          <div className="results-overlay">
            <div className="results-card">
              <h3 className="results-title">STABILITY RESTORED</h3>
              <p className="results-subtitle">Sector Cleared Successfully</p>
              
              <div className="results-score-wrap">
                <p className="results-score-label">Final Score</p>
                <h4 className="results-score-value">{score}</h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                <StarBorderBtn onClick={handlePanicActivate} size="lg">Play Again</StarBorderBtn>
                <Link to="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }} onMouseEnter={e => e.currentTarget.style.color='#0ae469'} onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.4)'}>Back to Homepage</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
