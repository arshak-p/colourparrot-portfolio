import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 224;
const getFramePath = (n) =>
  `/frames/ezgif-frame-${String(n).padStart(3, "0")}.jpg`;

export default function HeroExperiment() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const imagesRef = useRef([]);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const rafRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [showScroll, setShowScroll] = useState(false);

  const drawFrame = (index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const images = imagesRef.current;
    const img = images[index];
    if (!img || !img.complete || !img.naturalWidth) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    const dw = canvas.width;
    const dh = canvas.height;
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = dw / dh;

    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

    if (imgAspect > canvasAspect) {
      sw = Math.round(img.naturalHeight * canvasAspect);
      sx = Math.round((img.naturalWidth - sw) / 2);
    } else {
      sh = Math.round(img.naturalWidth / canvasAspect);
      sy = Math.round((img.naturalHeight - sh) / 2);
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh);
  };

  const startAnimationLoop = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const loop = () => {
      const current = currentFrameRef.current;
      const target = targetFrameRef.current;

      if (current !== target) {
        const diff = target - current;
        const step = Math.sign(diff) * Math.min(Math.abs(diff), 2);
        const next = Math.round(current + step);
        currentFrameRef.current = next;
        drawFrame(next);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    const images = new Array(TOTAL_FRAMES);
    let loadedCount = 0;

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    const onLoad = () => {
      loadedCount++;
      setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
      if (loadedCount === TOTAL_FRAMES) {
        imagesRef.current = images;
        setLoaded(true);
        drawFrame(0);
        startAnimationLoop();
        setTimeout(() => setShowScroll(true), 600);
      }
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = getFramePath(i + 1);
      img.onload = onLoad;
      images[i] = img;
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      isAnimatingRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      onUpdate: (self) => {
        const frameIndex = Math.min(
          Math.floor(self.progress * (TOTAL_FRAMES - 1)),
          TOTAL_FRAMES - 1
        );
        targetFrameRef.current = frameIndex;
        if (self.progress > 0.02) setShowScroll(false);
      },
    });

    return () => trigger.kill();
  }, [loaded]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(currentFrameRef.current);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <style>{`
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: rotate(45deg) translateY(0); }
          50% { transform: rotate(45deg) translateY(5px); }
        }
        @keyframes loadPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>

      <div ref={containerRef} style={{ position: "relative", height: "600vh" }}>
        <div
          style={{
            position: "sticky",
            top: 0,
            width: "100%",
            height: "100vh",
            overflow: "hidden",
            background: "#010d12",
          }}
        >
          {!loaded && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#010d12",
                zIndex: 20,
                gap: "1rem",
              }}
            >
              <p
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  margin: 0,
                  animation: "loadPulse 1.5s ease infinite",
                }}
              >
                Colour Parrot
              </p>
              <div
                style={{
                  width: "160px",
                  height: "1px",
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${loadProgress}%`,
                    background: "#1D9E75",
                    borderRadius: "2px",
                    transition: "width 0.1s linear",
                  }}
                />
              </div>
              <p
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.15)",
                  margin: 0,
                }}
              >
                {loadProgress}%
              </p>
            </div>
          )}

          <canvas
            ref={canvasRef}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.5s ease",
            }}
          />

          {showScroll && (
            <div
              style={{
                position: "absolute",
                bottom: "2rem",
                left: "50%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                animation: "heroFadeIn 0.8s ease forwards",
                pointerEvents: "none",
              }}
            >
              <p
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                Scroll
              </p>
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRight: "1.5px solid rgba(255,255,255,0.25)",
                  borderBottom: "1.5px solid rgba(255,255,255,0.25)",
                  transform: "rotate(45deg)",
                  animation: "scrollBounce 1.2s ease infinite",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
