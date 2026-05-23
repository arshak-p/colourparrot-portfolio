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
  const shakeRef = useRef(0);
  const wrapperRef = useRef(null);

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

    // Gun turret coordinates
    const leftGun = { x: 120, y: height };
    const rightGun = { x: width - 120, y: height };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      leftGun.y = height;
      rightGun.x = width - 120;
      rightGun.y = height;
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const muzzleFlash = { left: 0, right: 0 }; // intensity value [0.0, 1.0]

    // Load cartoon asteroid sprites
    const imgGreen = new Image();
    imgGreen.src = '/asteroid_green.png';
    const imgCyan = new Image();
    imgCyan.src = '/asteroid_cyan.png';

    let spriteGreenKeyed = null;
    let spriteCyanKeyed = null;

    // Helper to chroma-key out bright green (#00ff00) background
    const keyGreenScreen = (img, callback) => {
      const process = () => {
        try {
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = img.naturalWidth;
          tempCanvas.height = img.naturalHeight;
          const tempCtx = tempCanvas.getContext('2d');
          tempCtx.drawImage(img, 0, 0);
          
          const imgData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
          const data = imgData.data;
          
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Chroma key filter for green screen background
            if (g > 140 && r < 130 && b < 130) {
              data[i + 3] = 0; // set alpha to 0 (transparent)
            }
          }
          
          tempCtx.putImageData(imgData, 0, 0);
          const keyedImg = new Image();
          keyedImg.src = tempCanvas.toDataURL('image/png');
          keyedImg.onload = () => {
            callback(keyedImg);
          };
        } catch (e) {
          console.error("Chroma-key failed:", e);
          callback(img); // fallback to original
        }
      };

      if (img.complete && img.naturalWidth !== 0) {
        process();
      } else {
        img.onload = process;
      }
    };

    keyGreenScreen(imgGreen, (keyed) => {
      spriteGreenKeyed = keyed;
    });

    keyGreenScreen(imgCyan, (keyed) => {
      spriteCyanKeyed = keyed;
    });

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

    // Helper: generate crater details for stones
    const generateStoneCraters = (radius) => {
      const craters = [];
      const numCraters = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < numCraters; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = radius * (0.2 + Math.random() * 0.4);
        craters.push({
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          r: radius * (0.12 + Math.random() * 0.1)
        });
      }
      return craters;
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
        craters: generateStoneCraters(radius),
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
      const y = Math.random() * (height * 0.4);
      const speedX = fromLeft ? (9 + Math.random() * 5) : -(9 + Math.random() * 5);
      const speedY = 1.5 + Math.random() * 3.5;
      comets.push({
        x,
        y,
        vx: speedX,
        vy: speedY,
        radius,
        color: Math.random() > 0.5 ? '#28c1e5' : '#0ae469'
      });
    };

    // Firing function on click
    const handleShoot = (e) => {
      const targetX = e.clientX;
      const targetY = e.clientY;

      playSynthSound('laser');

      // Trigger muzzle flashes
      muzzleFlash.left = 1.0;
      muzzleFlash.right = 1.0;

      // Recoil screen shake
      shakeRef.current = 5.5;

      // Left nozzle nozzle tips location (positioned at the rim of the 60px node)
      const leftAngle = Math.atan2(targetY - leftGun.y, targetX - leftGun.x);
      const leftTipX = leftGun.x + Math.cos(leftAngle) * 60;
      const leftTipY = leftGun.y + Math.sin(leftAngle) * 60;

      // Right nozzle nozzle tips location
      const rightAngle = Math.atan2(targetY - rightGun.y, targetX - rightGun.x);
      const rightTipX = rightGun.x + Math.cos(rightAngle) * 60;
      const rightTipY = rightGun.y + Math.sin(rightAngle) * 60;

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

      // Apply screen shake
      let shakeX = 0;
      let shakeY = 0;
      if (shakeRef.current > 0) {
        shakeX = (Math.random() - 0.5) * shakeRef.current;
        shakeY = (Math.random() - 0.5) * shakeRef.current;
        shakeRef.current *= 0.88; // decay
        if (shakeRef.current < 0.1) shakeRef.current = 0;
      }
      if (wrapperRef.current && gameState === 'playing') {
        wrapperRef.current.style.transform = `translate(${shakeX}px, ${shakeY}px)`;
      }

      // Decrement muzzle flash intensity values
      if (muzzleFlash.left > 0) {
        muzzleFlash.left -= 0.08;
        if (muzzleFlash.left < 0) muzzleFlash.left = 0;
      }
      if (muzzleFlash.right > 0) {
        muzzleFlash.right -= 0.08;
        if (muzzleFlash.right < 0) muzzleFlash.right = 0;
      }

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

        // Emit tail dust/spark particles
        if (Math.random() < 0.35) {
          particles.push({
            x: c.x + (Math.random() - 0.5) * 4,
            y: c.y + (Math.random() - 0.5) * 4,
            vx: -c.vx * 0.15 + (Math.random() - 0.5) * 1.0,
            vy: -c.vy * 0.15 + (Math.random() - 0.5) * 1.0,
            size: 1 + Math.random() * 1.5,
            life: 0.8,
            decay: 0.04 + Math.random() * 0.04,
            color: c.color
          });
        }

        // Draw gradient vector comet tail
        const tailFactor = 4.0;
        const x1 = c.x;
        const y1 = c.y;
        const x2 = c.x - c.vx * tailFactor;
        const y2 = c.y - c.vy * tailFactor;

        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, c.color);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Draw comet glow head
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = c.color;
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.shadowBlur = 0; // reset glow

        // Delete if out of viewport
        if (c.y > height + 20 || c.x < -100 || c.x > width + 100) {
          comets.splice(i, 1);
        }
      }

      // 3. Update and draw space stones
      for (let i = stones.length - 1; i >= 0; i--) {
        const s = stones[i];
        s.x += s.vx;
        s.y += s.vy;
        s.rotation += s.rotSpeed;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);

        // Select cartoon sprite based on color
        const sprite = s.color === '#0ae469' ? spriteGreenKeyed : spriteCyanKeyed;

        if (sprite && sprite.complete && sprite.naturalWidth !== 0) {
          // Draw cartoon space stone sprite
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 15;
          ctx.drawImage(sprite, -s.radius, -s.radius, s.radius * 2, s.radius * 2);
        } else {
          // Fallback to stylized vector drawing if loading
          ctx.beginPath();
          ctx.moveTo(s.shape[0].x, s.shape[0].y);
          for (let j = 1; j < s.shape.length; j++) {
            ctx.lineTo(s.shape[j].x, s.shape[j].y);
          }
          ctx.closePath();
          
          ctx.fillStyle = 'rgba(2, 23, 30, 0.65)';
          ctx.fill();
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 2.0;
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 10;
          ctx.stroke();

          // Draw crater details
          if (s.craters) {
            s.craters.forEach(crater => {
              ctx.beginPath();
              ctx.arc(crater.x, crater.y, crater.r, 0, Math.PI * 2);
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
              ctx.lineWidth = 1.2;
              ctx.stroke();
            });
          }
        }

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

        // Draw dual-core laser: Outer glowing neon aura
        ctx.beginPath();
        ctx.moveTo(l.startX, l.startY);
        ctx.lineTo(l.endX, l.endY);
        ctx.strokeStyle = l.color;
        ctx.lineWidth = 7 * l.life;
        ctx.shadowColor = l.color;
        ctx.shadowBlur = 25;
        ctx.stroke();

        // Draw dual-core laser: Inner hyper-intense white core
        ctx.beginPath();
        ctx.moveTo(l.startX, l.startY);
        ctx.lineTo(l.endX, l.endY);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2 * l.life;
        ctx.shadowBlur = 0;
        ctx.stroke();
      }

      // 5. Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Apply stardust physics (drag and drift)
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.vy += 0.08; // gravity drift

        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        // Draw sparking tail segment lines for realistic explosion feel
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 1.5, p.y - p.vy * 1.5);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size * p.life;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Futuristic target lock-on reticle
      const drawTargetLock = () => {
        let targetStone = null;
        let minD = 130; // lock range
        for (const s of stones) {
          const d = Math.hypot(mouse.x - s.x, mouse.y - s.y);
          if (d < s.radius + 35 && d < minD) {
            minD = d;
            targetStone = s;
          }
        }

        ctx.save();
        let cx = mouse.x;
        let cy = mouse.y;
        let r = 20;
        let isLocked = false;
        let color = '#28c1e5';

        if (targetStone) {
          cx = targetStone.x;
          cy = targetStone.y;
          r = targetStone.radius + 12;
          isLocked = true;
          color = '#ff4444'; // locked neon red reticle!
        }

        ctx.translate(cx, cy);
        const spinAngle = (Date.now() / 450) % (Math.PI * 2);
        ctx.rotate(spinAngle);

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;

        // Draw 4 corner brackets
        for (let a = 0; a < 4; a++) {
          ctx.beginPath();
          ctx.arc(0, 0, r, a * Math.PI / 2 + 0.15, (a + 1) * Math.PI / 2 - 0.15);
          ctx.stroke();
        }

        // Target indicators
        if (isLocked) {
          ctx.beginPath();
          ctx.arc(0, 0, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#ff4444';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(0, 0, r + 6, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 68, 68, 0.4)';
          ctx.setLineDash([4, 4]);
          ctx.lineWidth = 1.0;
          ctx.stroke();
          ctx.setLineDash([]);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#28c1e5';
          ctx.fill();
        }

        ctx.restore();
        ctx.shadowBlur = 0;
      };

      drawTargetLock();

      // 6. Draw glowing energy nozzles (nodes) in the corners
      const drawNozzle = (gun, color, flashVal) => {
        const angle = Math.atan2(mouse.y - gun.y, mouse.x - gun.x);
        
        ctx.save();
        ctx.translate(gun.x, gun.y);

        // A. Draw expanding shockwave ring on fire
        if (flashVal > 0) {
          ctx.beginPath();
          ctx.arc(0, 0, 60 + (1.0 - flashVal) * 90, 0, Math.PI * 2);
          ctx.strokeStyle = color;
          ctx.lineWidth = 3 * flashVal;
          ctx.globalAlpha = flashVal;
          ctx.shadowColor = color;
          ctx.shadowBlur = 15;
          ctx.stroke();
          ctx.globalAlpha = 1.0;
          ctx.shadowBlur = 0;
        }

        // B. Draw base glowing nozzle node (large outer ring)
        ctx.beginPath();
        ctx.arc(0, 0, 60, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(1, 13, 18, 0.85)';
        ctx.strokeStyle = color;
        ctx.lineWidth = 4.0;
        ctx.shadowColor = color;
        ctx.shadowBlur = 15 + flashVal * 25; // intensify glow during fire!
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // C. Draw inner rotating aiming ring
        ctx.save();
        ctx.rotate(angle);
        
        // Aiming dashed ring to represent rotational tracking
        ctx.beginPath();
        ctx.arc(0, 0, 42, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([8, 8]);
        ctx.stroke();
        ctx.setLineDash([]); // reset dashes

        // Aiming nozzle barrel - clean modern indicator (sleek thin capsule)
        ctx.beginPath();
        ctx.rect(35, -7, 25, 14);
        ctx.fillStyle = color;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.0;
        ctx.fill();
        ctx.stroke();

        ctx.restore();

        // D. Center energy core (pulsing sphere)
        ctx.beginPath();
        ctx.arc(0, 0, 18 + flashVal * 8, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, 18 + flashVal * 8);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.restore();
      };

      drawNozzle(leftGun, '#0ae469', muzzleFlash.left);
      drawNozzle(rightGun, '#28c1e5', muzzleFlash.right);

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
        ref={wrapperRef}
        style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          transform: gameState === 'starting' ? `translate(${(Math.random() - 0.5) * 12}px, ${(Math.random() - 0.5) * 12}px)` : undefined
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
