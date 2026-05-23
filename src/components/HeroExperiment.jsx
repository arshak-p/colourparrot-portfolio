import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ShapeBlur from "./ShapeBlur";

export default function HeroExperiment() {
  // Layer visibility state
  const [layers, setLayers] = useState({
    axisX: true,
    axisY: true,
    arcTR: true,
    arcBL: true,
    circleTL: true,
  });

  // Layer hover state
  const [hoveredLayer, setHoveredLayer] = useState(null);

  // WebGL Shader controls
  const [glowColor, setGlowColor] = useState("#0ae469");
  const [shapeSize, setShapeSize] = useState(0.75);
  const [circleSize, setCircleSize] = useState(0.35);
  const [circleEdge, setCircleEdge] = useState(0.4);
  const [baseOpacity, setBaseOpacity] = useState(0.12);
  const [cssBlur, setCssBlur] = useState(0);

  // SVG coordinate tracker
  const [mouseGridPos, setMouseGridPos] = useState({ x: 50, y: 50 });
  const [mouseInside, setMouseInside] = useState(false);
  const svgRef = useRef(null);

  // Colors preset
  const colorPresets = [
    { name: "Parrot Emerald", hex: "#0ae469" },
    { name: "Cyber Cyan", hex: "#28c1e5" },
    { name: "Neon Violet", hex: "#7a43ff" },
    { name: "Solar Yellow", hex: "#f9cc3d" },
    { name: "Sunset Red", hex: "#f45b42" },
    { name: "Classic Slate", hex: "#a8c2b3" },
  ];

  const handleSvgMouseMove = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    // SVG viewBox runs from -2 to 102 (width = 104, height = 104)
    const x = -2 + ((e.clientX - rect.left) / rect.width) * 104;
    const y = -2 + ((e.clientY - rect.top) / rect.height) * 104;
    setMouseGridPos({
      x: Math.round(Math.max(-2, Math.min(102, x))),
      y: Math.round(Math.max(-2, Math.min(102, y))),
    });
  };

  // Toggle single layer
  const toggleLayer = (layerName) => {
    setLayers((prev) => ({ ...prev, [layerName]: !prev[layerName] }));
  };

  // Reset all layers to true
  const resetLayers = () => {
    setLayers({
      axisX: true,
      axisY: true,
      arcTR: true,
      arcBL: true,
      circleTL: true,
    });
  };

  // Get SVG Code snippet based on hover/select
  const getSelectedCodeText = () => {
    if (hoveredLayer === "axisX") {
      return `<line x1="0" y1="50" x2="100" y2="50" stroke="${glowColor}" stroke-width="2" />`;
    }
    if (hoveredLayer === "axisY") {
      return `<line x1="50" y1="0" x2="50" y2="100" stroke="${glowColor}" stroke-width="2" />`;
    }
    if (hoveredLayer === "arcTR") {
      return `<path d="M 50 0 A 50 50 0 0 1 100 50" stroke="${glowColor}" stroke-width="2" />`;
    }
    if (hoveredLayer === "arcBL") {
      return `<path d="M 0 50 A 50 50 0 0 0 50 100" stroke="${glowColor}" stroke-width="2" />`;
    }
    if (hoveredLayer === "circleTL") {
      return `<circle cx="25" cy="25" r="10" stroke="${glowColor}" stroke-width="2" />`;
    }
    return `<!-- Full SVG Viewport Grid Model -->
<svg viewBox="-2 -2 104 104" width="250" height="250" fill="none">
  <!-- Grid Lines active -->
  <line x1="0" y1="50" x2="100" y2="50" />
  <line x1="50" y1="0" x2="50" y2="100" />
  <path d="M 50 0 A 50 50 0 0 1 100 50" />
  <path d="M 0 50 A 50 50 0 0 0 50 100" />
  <circle cx="25" cy="25" r="10" />
</svg>`;
  };

  // GLSL Math snippet
  const getGLSLSnippet = () => {
    if (hoveredLayer === "axisX") {
      return `float d_horiz = max(abs(p.y), abs(p.x) - R);`;
    }
    if (hoveredLayer === "axisY") {
      return `float d_vert = max(abs(p.x), abs(p.y) - R);`;
    }
    if (hoveredLayer === "arcTR") {
      return `float d_arc1 = max(max(abs(length(p) - R), -p.x), -p.y); // Top-Right (+x, +y)`;
    }
    if (hoveredLayer === "arcBL") {
      return `float d_arc2 = max(max(abs(length(-p) - R), p.x), p.y); // Bottom-Left (-x, -y)`;
    }
    if (hoveredLayer === "circleTL") {
      return `float d_circle = abs(length(p - vec2(-0.5*R, 0.5*R)) - r);`;
    }
    return `// GLSL Logo SDF Combinator (Flat-capped)
float getLogoSDF(in vec2 p, in float R, in float r) {
    float d_horiz  = max(abs(p.y), abs(p.x) - R);
    float d_vert   = max(abs(p.x), abs(p.y) - R);
    float d_arc1   = max(max(abs(length(p) - R), -p.x), -p.y);
    float d_arc2   = max(max(abs(length(-p) - R), p.x), p.y);
    float d_circle = abs(length(p - vec2(-0.5 * R, 0.5 * R)) - r);
    
    return min(d_horiz, min(d_vert, min(d_arc1, min(d_arc2, d_circle))));
}`;
  };

  return (
    <>
      <style>{`
        .lab-container {
          min-height: 100vh;
          background: #010a0e;
          background-image: 
            radial-gradient(circle at 10% 20%, rgba(10, 228, 105, 0.03) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(40, 193, 229, 0.03) 0%, transparent 40%);
          padding: 80px 24px 60px 24px;
          font-family: var(--font-secondary);
          color: var(--light);
          position: relative;
        }

        .lab-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1300px;
          margin: 0 auto 40px auto;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 20px;
        }

        .btn-back {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.3s var(--ease-out);
        }
        .btn-back:hover {
          color: var(--green);
          border-color: rgba(10, 228, 105, 0.4);
          background: rgba(10, 228, 105, 0.05);
          transform: translateX(-4px);
        }

        .header-title-block {
          text-align: right;
        }

        .lab-tag {
          font-size: 10px;
          letter-spacing: 0.25em;
          color: var(--green);
          text-transform: uppercase;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          margin-bottom: 4px;
        }
        .pulse-dot {
          width: 6px;
          height: 6px;
          background: var(--green);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--green);
          animation: dotPulse 2s infinite;
        }

        @keyframes dotPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .lab-title {
          font-family: var(--font-primary);
          font-size: 24px;
          letter-spacing: -0.02em;
          color: #ffffff;
        }

        .grid-workbench {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          max-width: 1300px;
          margin: 0 auto;
        }

        @media (max-width: 968px) {
          .grid-workbench {
            grid-template-columns: 1fr;
          }
        }

        .workbench-card {
          background: rgba(2, 23, 30, 0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .card-label {
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 20px;
          font-weight: 500;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-label span.tech-coord {
          font-family: var(--font-mono);
          color: var(--cyan);
          font-size: 10px;
        }

        .viewport-container {
          background: #010e13;
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          aspect-ratio: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: hidden;
          box-shadow: inset 0 4px 30px rgba(0,0,0,0.5);
        }

        .viewport-svg-blueprint {
          width: 80%;
          height: 80%;
          cursor: crosshair;
          z-index: 5;
          position: relative;
          overflow: visible;
        }

        /* Technical Blueprint Grid overlay */
        .blueprint-grid-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.15;
          z-index: 1;
        }

        .blueprint-grid-overlay-major {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.35;
          z-index: 2;
        }

        .svg-element-group {
          transition: all 0.3s var(--ease-out);
        }

        .svg-shape-line {
          stroke-width: 1.5;
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawStroke 2s ease forwards;
          transition: stroke 0.3s, stroke-width 0.3s, opacity 0.3s;
        }

        @keyframes drawStroke {
          to { stroke-dashoffset: 0; }
        }

        /* SVG layer highlighting */
        .layer-active {
          opacity: 1 !important;
        }
        .layer-inactive {
          opacity: 0.15 !important;
          stroke-dasharray: 4 4 !important;
        }
        .layer-hovered {
          stroke-width: 3.5 !important;
          filter: drop-shadow(0 0 6px var(--glow-color));
        }

        /* Interactive controls styling */
        .controls-wrapper {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .control-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .control-header {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          letter-spacing: 0.05em;
          color: rgba(255,255,255,0.7);
          text-transform: uppercase;
        }

        .control-val {
          color: var(--green);
          font-family: var(--font-mono);
        }

        /* Custom Range Slider styling */
        .slider-input {
          -webkit-appearance: none;
          width: 100%;
          height: 4px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.08);
          outline: none;
        }
        .slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--green);
          cursor: pointer;
          box-shadow: 0 0 6px var(--green);
          transition: transform 0.2s;
        }
        .slider-input::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        /* Preset color selection */
        .color-preset-group {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .color-preset-btn {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.2);
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
        }
        .color-preset-btn.active {
          border-color: #ffffff;
          transform: scale(1.15);
        }
        .color-preset-btn::after {
          content: '';
          position: absolute;
          inset: -4px;
          border: 1px solid currentColor;
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .color-preset-btn.active::after {
          opacity: 0.4;
        }

        /* Toggle Layer Grid */
        .layer-toggle-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 10px;
          margin-top: 15px;
        }

        .layer-toggle-btn {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
          padding: 10px;
          font-size: 11px;
          text-align: left;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: all 0.3s var(--ease-out);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .layer-toggle-btn:hover {
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.15);
          color: #ffffff;
        }
        .layer-toggle-btn.active {
          background: rgba(10, 228, 105, 0.04);
          border-color: rgba(10, 228, 105, 0.3);
          color: #ffffff;
        }
        .layer-toggle-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
        }
        .layer-toggle-btn.active .layer-toggle-indicator {
          background: var(--green);
          box-shadow: 0 0 6px var(--green);
        }

        /* Code Inspection Terminal */
        .terminal-block {
          background: #00080a;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 14px;
          margin-top: 15px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: rgba(255, 255, 255, 0.85);
          overflow-x: auto;
          white-space: pre-wrap;
          line-height: 1.5;
          position: relative;
        }
        .terminal-block::before {
          content: 'TERMINAL INSPECTOR';
          position: absolute;
          top: 4px;
          right: 8px;
          font-size: 8px;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.1em;
        }

        /* Math section comparison */
        .math-breakdown {
          max-width: 1300px;
          margin: 40px auto 0 auto;
          background: rgba(2, 23, 30, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 16px;
          padding: 30px;
        }

        .math-title {
          font-family: var(--font-primary);
          font-size: 18px;
          margin-bottom: 20px;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .math-title::before {
          content: '';
          width: 4px;
          height: 16px;
          background: var(--cyan);
          border-radius: 2px;
        }

        .math-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        @media (max-width: 768px) {
          .math-grid {
            grid-template-columns: 1fr;
          }
        }

        .math-column {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .math-card {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          padding: 16px;
        }

        .math-card-header {
          font-weight: 600;
          font-size: 12px;
          color: var(--cyan);
          margin-bottom: 8px;
          font-family: var(--font-mono);
        }

        .math-card-body {
          font-size: 12.5px;
          color: rgba(255,255,255,0.65);
          line-height: 1.6;
        }

        .tech-crosshair-line {
          stroke: rgba(40, 193, 229, 0.25);
          stroke-width: 0.5;
          stroke-dasharray: 2 2;
        }
      `}</style>

      <div className="lab-container">
        {/* Lab Page Header */}
        <header className="lab-header">
          <Link to="/" className="btn-back">
            <span>← Back to Home</span>
          </Link>
          <div className="header-title-block">
            <div className="lab-tag">
              <span className="pulse-dot"></span>
              Colour Parrot Labs // Exp #04
            </div>
            <h1 className="lab-title">Procedural Shape Lab</h1>
          </div>
        </header>

        {/* Workbench Grid */}
        <main className="grid-workbench">
          
          {/* Panel A: Vector Blueprint Workbench */}
          <section className="workbench-card">
            <div className="card-label">
              <span>Vector Blueprint (SVG)</span>
              {mouseInside && (
                <span className="tech-coord">
                  X: {mouseGridPos.x.toString().padStart(3, "0")} // Y: {mouseGridPos.y.toString().padStart(3, "0")}
                </span>
              )}
            </div>

            <div className="viewport-container">
              {/* Technical background Grid */}
              <svg className="blueprint-grid-overlay" width="100%" height="100%">
                <defs>
                  <pattern id="minorGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
                  </pattern>
                  <pattern id="majorGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <rect width="50" height="50" fill="url(#minorGrid)" />
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#majorGrid)" />
              </svg>

              {/* The Interactive SVG Viewport */}
              <svg
                ref={svgRef}
                viewBox="-2 -2 104 104"
                className="viewport-svg-blueprint"
                stroke={glowColor}
                fill="none"
                onMouseMove={handleSvgMouseMove}
                onMouseEnter={() => setMouseInside(true)}
                onMouseLeave={() => setMouseInside(false)}
                style={{ "--glow-color": glowColor }}
              >
                {/* Custom Hover Interactive Crosshairs */}
                {mouseInside && (
                  <>
                    <line className="tech-crosshair-line" x1="-2" y1={mouseGridPos.y} x2="102" y2={mouseGridPos.y} />
                    <line className="tech-crosshair-line" x1={mouseGridPos.x} y1="-2" x2={mouseGridPos.x} y2="102" />
                    <circle cx={mouseGridPos.x} cy={mouseGridPos.y} r="1.5" fill={glowColor} stroke="none" />
                  </>
                )}

                {/* Layer 1: Horizontal Axis */}
                <line
                  x1="0"
                  y1="50"
                  x2="100"
                  y2="50"
                  className={`svg-shape-line svg-element-group ${
                    layers.axisX ? "layer-active" : "layer-inactive"
                  } ${hoveredLayer === "axisX" ? "layer-hovered" : ""}`}
                  onMouseEnter={() => setHoveredLayer("axisX")}
                  onMouseLeave={() => setHoveredLayer(null)}
                />

                {/* Layer 2: Vertical Axis */}
                <line
                  x1="50"
                  y1="0"
                  x2="50"
                  y2="100"
                  className={`svg-shape-line svg-element-group ${
                    layers.axisY ? "layer-active" : "layer-inactive"
                  } ${hoveredLayer === "axisY" ? "layer-hovered" : ""}`}
                  onMouseEnter={() => setHoveredLayer("axisY")}
                  onMouseLeave={() => setHoveredLayer(null)}
                />

                {/* Layer 3: Top-Right Quarter Circle Arc */}
                <path
                  d="M 50 0 A 50 50 0 0 1 100 50"
                  className={`svg-shape-line svg-element-group ${
                    layers.arcTR ? "layer-active" : "layer-inactive"
                  } ${hoveredLayer === "arcTR" ? "layer-hovered" : ""}`}
                  onMouseEnter={() => setHoveredLayer("arcTR")}
                  onMouseLeave={() => setHoveredLayer(null)}
                />

                {/* Layer 4: Bottom-Left Quarter Circle Arc */}
                <path
                  d="M 0 50 A 50 50 0 0 0 50 100"
                  className={`svg-shape-line svg-element-group ${
                    layers.arcBL ? "layer-active" : "layer-inactive"
                  } ${hoveredLayer === "arcBL" ? "layer-hovered" : ""}`}
                  onMouseEnter={() => setHoveredLayer("arcBL")}
                  onMouseLeave={() => setHoveredLayer(null)}
                />

                {/* Layer 5: Accent Circle (Top-Left) */}
                <circle
                  cx="25"
                  cy="25"
                  r="10"
                  className={`svg-shape-line svg-element-group ${
                    layers.circleTL ? "layer-active" : "layer-inactive"
                  } ${hoveredLayer === "circleTL" ? "layer-hovered" : ""}`}
                  onMouseEnter={() => setHoveredLayer("circleTL")}
                  onMouseLeave={() => setHoveredLayer(null)}
                />
              </svg>
            </div>

            {/* Blueprint Layer Visibility Toggles */}
            <div style={{ marginTop: "24px" }}>
              <div className="control-header">
                <span>Vector Layer Elements</span>
                <span className="control-val" onClick={resetLayers} style={{ cursor: "pointer", textDecoration: "underline" }}>
                  Reset Layers
                </span>
              </div>
              <div className="layer-toggle-grid">
                <button
                  className={`layer-toggle-btn ${layers.axisX ? "active" : ""}`}
                  onClick={() => toggleLayer("axisX")}
                  onMouseEnter={() => setHoveredLayer("axisX")}
                  onMouseLeave={() => setHoveredLayer(null)}
                >
                  <span>1. X-Axis Segment</span>
                  <span className="layer-toggle-indicator" />
                </button>
                <button
                  className={`layer-toggle-btn ${layers.axisY ? "active" : ""}`}
                  onClick={() => toggleLayer("axisY")}
                  onMouseEnter={() => setHoveredLayer("axisY")}
                  onMouseLeave={() => setHoveredLayer(null)}
                >
                  <span>2. Y-Axis Segment</span>
                  <span className="layer-toggle-indicator" />
                </button>
                <button
                  className={`layer-toggle-btn ${layers.arcTR ? "active" : ""}`}
                  onClick={() => toggleLayer("arcTR")}
                  onMouseEnter={() => setHoveredLayer("arcTR")}
                  onMouseLeave={() => setHoveredLayer(null)}
                >
                  <span>3. Top-Right Arc</span>
                  <span className="layer-toggle-indicator" />
                </button>
                <button
                  className={`layer-toggle-btn ${layers.arcBL ? "active" : ""}`}
                  onClick={() => toggleLayer("arcBL")}
                  onMouseEnter={() => setHoveredLayer("arcBL")}
                  onMouseLeave={() => setHoveredLayer(null)}
                >
                  <span>4. Bottom-Left Arc</span>
                  <span className="layer-toggle-indicator" />
                </button>
                <button
                  className={`layer-toggle-btn ${layers.circleTL ? "active" : ""}`}
                  onClick={() => toggleLayer("circleTL")}
                  onMouseEnter={() => setHoveredLayer("circleTL")}
                  onMouseLeave={() => setHoveredLayer(null)}
                >
                  <span>5. Accent Circle</span>
                  <span className="layer-toggle-indicator" />
                </button>
              </div>
            </div>

            {/* XML Inspector */}
            <div className="terminal-block">
              <span style={{ color: "#779" }}>{getSelectedCodeText()}</span>
            </div>
          </section>

          {/* Panel B: GLSL Shader Workspace */}
          <section className="workbench-card">
            <div className="card-label">
              <span>GLSL Shader (WebGL SDF Mode)</span>
              <span className="tech-coord" style={{ color: varPresets => glowColor }}>
                ACTIVE // REALTIME MOUSE TRAIL
              </span>
            </div>

            {/* WebGL Rendering Viewport */}
            <div className="viewport-container" style={{ background: "#00080a" }}>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* Pass logoSrc as a truthy string to trigger SDF rendering */}
                <ShapeBlur
                  logoSrc="logo_outline"
                  variation={0}
                  shapeSize={shapeSize}
                  circleSize={circleSize}
                  circleEdge={circleEdge}
                  glowColor={glowColor}
                  baseOpacity={baseOpacity}
                  blur={cssBlur}
                  pixelRatioProp={window.devicePixelRatio || 2}
                />
              </div>
            </div>

            {/* Parameters Control Dashboard */}
            <div className="controls-wrapper">
              
              {/* Preset Neon Colors */}
              <div className="control-row">
                <span className="control-header">Neon Glow Color</span>
                <div className="color-preset-group">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      className={`color-preset-btn ${glowColor === preset.hex ? "active" : ""}`}
                      style={{ backgroundColor: preset.hex, color: preset.hex }}
                      onClick={() => setGlowColor(preset.hex)}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>

              {/* Shape Size Slider */}
              <div className="control-row">
                <div className="control-header">
                  <span>Shape Size</span>
                  <span className="control-val">{shapeSize.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="1.2"
                  step="0.05"
                  value={shapeSize}
                  onChange={(e) => setShapeSize(parseFloat(e.target.value))}
                  className="slider-input"
                  style={{ "--green": glowColor }}
                />
              </div>

              {/* Cursor Interaction Glow Circle Radius */}
              <div className="control-row">
                <div className="control-header">
                  <span>Hover Glow Radius</span>
                  <span className="control-val">{circleSize.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.05"
                  value={circleSize}
                  onChange={(e) => setCircleSize(parseFloat(e.target.value))}
                  className="slider-input"
                  style={{ "--green": glowColor }}
                />
              </div>

              {/* Hover Glow Edge Softness */}
              <div className="control-row">
                <div className="control-header">
                  <span>Hover Edge Softness</span>
                  <span className="control-val">{circleEdge.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.8"
                  step="0.05"
                  value={circleEdge}
                  onChange={(e) => setCircleEdge(parseFloat(e.target.value))}
                  className="slider-input"
                  style={{ "--green": glowColor }}
                />
              </div>

              {/* Shape Base Opacity (when mouse not close) */}
              <div className="control-row">
                <div className="control-header">
                  <span>Base Idle Opacity</span>
                  <span className="control-val">{baseOpacity.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.4"
                  step="0.02"
                  value={baseOpacity}
                  onChange={(e) => setBaseOpacity(parseFloat(e.target.value))}
                  className="slider-input"
                  style={{ "--green": glowColor }}
                />
              </div>

              {/* CSS Glow Bleed Blur */}
              <div className="control-row">
                <div className="control-header">
                  <span>Heavy Neon Blur Bleed</span>
                  <span className="control-val">{cssBlur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="1"
                  value={cssBlur}
                  onChange={(e) => setCssBlur(parseInt(e.target.value))}
                  className="slider-input"
                  style={{ "--green": glowColor }}
                />
              </div>

            </div>

            {/* GLSL Inspector */}
            <div className="terminal-block">
              <span style={{ color: "#8b9" }}>{getGLSLSnippet()}</span>
            </div>
          </section>
        </main>

        {/* Bottom Panel: Mathematical Blueprint Breakdown */}
        <section className="math-breakdown">
          <h2 className="math-title">Vector-to-SDF Math Breakdown</h2>
          <div className="math-grid">
            
            <div className="math-column">
              <div className="math-card">
                <div className="math-card-header">1. Coordinate Grid System Mapping</div>
                <div className="math-card-body">
                  The SVG vector logo operates in <strong>X/Y Screen Space [0 to 100]</strong> where the center is <code>(50, 50)</code> and <code>y</code> points downwards.
                  The GLSL Shader operates in <strong>Normalized Space [-0.5 to 0.5]</strong> where the center is <code>(0.0, 0.0)</code> and <code>y</code> points upwards.
                  Our ThreeJS shader automatically maps coordinates between the two systems perfectly.
                </div>
              </div>
              
              <div className="math-card">
                <div className="math-card-header">2. The Axis Segment Elements</div>
                <div className="math-card-body">
                  <strong>SVG elements:</strong> <code>&lt;line x1="0" y1="50" x2="100" y2="50"&gt;</code> & <code>&lt;line x1="50" y1="0" x2="50" y2="100"&gt;</code>.
                  <br /><br />
                  <strong>Shader SDF equivalent:</strong> <code>max(abs(p.y), abs(p.x) - R)</code>. Calculates the flat-capped distance from normalized position <code>p</code> to the axis segments of length <code>2*R</code> (radius <code>R = 0.45</code>), ensuring sharp vertical/horizontal ends.
                </div>
              </div>
            </div>

            <div className="math-column">
              <div className="math-card">
                <div className="math-card-header">3. Quarter Arc Elements</div>
                <div className="math-card-body">
                  <strong>SVG elements:</strong> Top-right arc (from <code>50,0</code> to <code>100,50</code>) and bottom-left arc (from <code>0,50</code> to <code>50,100</code>).
                  <br /><br />
                  <strong>Shader SDF equivalent:</strong> <code>max(max(abs(length(p) - R), -p.x), -p.y)</code>. Calculates the distance to a quarter circle of radius <code>R = 0.45</code> in Quadrant 1, cut flat at the axes by bounding the coordinate signs.
                </div>
              </div>
              
              <div className="math-card">
                <div className="math-card-header">4. Sub-Circle Accent Element</div>
                <div className="math-card-body">
                  <strong>SVG element:</strong> <code>&lt;circle cx="25" cy="25" r="10" /&gt;</code>.
                  <br /><br />
                  <strong>Shader SDF equivalent:</strong> <code>abs(length(p - vec2(-0.5*R, 0.5*R)) - r)</code>.
                  Calculates the distance from coordinate <code>p</code> to a circle center located in Quadrant 2 (top-left, <code>x = -0.5*R</code>, <code>y = 0.5*R</code>) with radius <code>r = 0.08</code>.
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>
    </>
  );
}
