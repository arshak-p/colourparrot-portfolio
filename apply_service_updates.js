const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'ServiceDetailPage.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Inject ServiceProcess component at the bottom
const serviceProcessCode = `

const brandingSteps = [
  { num: "01", title: "Discovery & Strategy", desc: "We dive deep into your market, competitors, and audience to unearth the strategic positioning that will define your brand's core DNA." },
  { num: "02", title: "Concept & Ideation", desc: "Translating strategy into visual language. We develop multiple creative directions, exploring typography, color psychology, and structural form." },
  { num: "03", title: "Identity Systems", desc: "Refining the chosen concept into a robust system. This includes the primary logo, secondary marks, favicons, and scalable vector assets." },
  { num: "04", title: "Brand Guidelines", desc: "Documenting the rules of your brand. We deliver a comprehensive manual covering logo usage, color systems, typography hierarchies, and tone of voice." },
  { num: "05", title: "Rollout & Application", desc: "Applying your new identity across physical and digital touchpoints—from stationery and packaging to social media kits and website UI." }
];

const digitalMarketingSteps = [
  { num: "01", title: "Audit & Strategy", desc: "We analyze your current digital presence, identify gaps, and craft a bespoke performance marketing strategy tailored to your KPIs." },
  { num: "02", title: "Campaign Architecture", desc: "Setting up pixel tracking, custom audiences, and full-funnel conversion paths across Meta, Google, and TikTok ad ecosystems." },
  { num: "03", title: "Creative & Copywriting", desc: "Developing scroll-stopping ad creatives and compelling direct-response copy designed to maximize click-through and conversion rates." },
  { num: "04", title: "Launch & Optimization", desc: "Deploying campaigns with A/B testing frameworks in place. We monitor bidding strategies and allocate budget to the highest performing ad sets." },
  { num: "05", title: "Scaling & Reporting", desc: "Scaling the winners vertically and horizontally. We provide transparent, data-rich dashboards so you see exactly what your ROI looks like." }
];

const webDesignSteps = [
  { num: "01", title: "UX Discovery & Wireframing", desc: "Mapping out user journeys and architectural flow. We create low-fidelity wireframes to ensure the core structure drives conversions." },
  { num: "02", title: "UI & Visual Design", desc: "Breathing life into the wireframes. We design high-fidelity, pixel-perfect interfaces that align flawlessly with your brand identity." },
  { num: "03", title: "Front-End Development", desc: "Writing clean, modern React/Next.js code. We implement smooth micro-interactions, responsive layouts, and lightning-fast load times." },
  { num: "04", title: "Back-End & Integrations", desc: "Connecting the dots. Whether it's headless CMS integration, e-commerce payment gateways, or custom APIs, we build robust backend architectures." },
  { num: "05", title: "Testing & Deployment", desc: "Rigorous cross-browser and device testing, SEO optimization, and performance audits before a seamless launch to your production environment." }
];

function ServiceProcess({ service, steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <section className="pad" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--glass-border)', paddingBottom: '6rem' }}>
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <style>{\`
          .process-grid { display: grid; grid-template-columns: auto 1fr; gap: 3rem; align-items: start; }
          @media (max-width: 600px) {
            .process-grid { grid-template-columns: 1fr; gap: 1.5rem; }
          }
        \`}</style>

        <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.3em', color: service.accent, textTransform: 'uppercase' }}>Methodology</span>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#fff', marginTop: '1rem', letterSpacing: '-0.03em' }}>
            Our <span style={{ color: service.accent }}>Process</span>
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              style={{
                padding: 'clamp(2rem, 5vw, 3rem)',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '24px',
                position: 'relative',
                overflow: 'hidden'
              }}
              className="process-grid"
            >
              <div style={{
                position: 'absolute', top: '-50px', left: '-50px', width: '150px', height: '150px',
                background: \`radial-gradient(circle, \${service.accent}15 0%, transparent 70%)\`,
                borderRadius: '50%', filter: 'blur(40px)', zIndex: 0
              }} />

              <div style={{ 
                fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 800, color: service.accent, opacity: 0.3, lineHeight: 0.8,
                position: 'relative', zIndex: 1
              }}>
                {step.num}
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '1rem' }}>{step.title}</h3>
                <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
`;

content += serviceProcessCode;

// 2. Call ServiceProcess in BrandIdentityPage
content = content.replace(
  '{/* Scrollable Gallery Section */}',
  '{/* Step-by-step Process Section */}\n      <ServiceProcess service={service} steps={brandingSteps} />\n\n      {/* Scrollable Gallery Section */}'
);

// 3. Call ServiceProcess in GenericServicePage
content = content.replace(
  '<ScrollFloat className="sec-title" tag="h2">',
  `{/* Process Section */}
          <ServiceProcess service={service} steps={
            service.slug === 'digital-marketing' ? digitalMarketingSteps :
            service.slug === 'web-design' ? webDesignSteps : null
          } />\n\n          <ScrollFloat className="sec-title" tag="h2" style={{ marginTop: '6rem' }}>`
);

// 4. Update the View All Services button everywhere in the file
const badButton = `<Link to="/services" style={{ color: 'white', textDecoration: 'none', marginRight: '2rem', opacity: 0.5 }}>View All Services</Link>`;
const goodButton = `<Link to="/services" style={{ 
              color: 'rgba(255,255,255,0.7)', 
              textDecoration: 'none', 
              padding: '0.9rem 2rem', 
              borderRadius: '100px', 
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.02)',
              transition: 'all 0.3s ease',
              fontSize: '0.9rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.1)';
              e.target.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.02)';
              e.target.style.color = 'rgba(255,255,255,0.7)';
            }}
            >View All Services</Link>`;

content = content.replaceAll(badButton, goodButton);
content = content.replaceAll(
  `<motion.div initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:0.2}}>`,
  `<motion.div initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:0.2}} style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>`
);
content = content.replaceAll(
  `<motion.div variants={itemVariants}>`,
  `<motion.div variants={itemVariants} style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>`
);

// 5. Apply the AURORA client content to BrandingBentoGrid
content = content.replace(
  `title: "1. Brand Identity Systems",
      desc: "We engineer fully responsive logo systems (primary, secondary, sub-marks, and favicons) along with precise usage guidelines for color, typography, grids, and alignment constraints.",
      spanClass: "span-2",
      accent: "#0ae469",
      glow: "rgba(10, 228, 105, 0.12)",
      illustration: (
        <svg width="100%" height="100%" viewBox="0 0 400 150" fill="none">
          <rect x="10" y="10" width="380" height="130" rx="12" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <circle cx="200" cy="75" r="50" stroke="#0ae469" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.8" />
          <line x1="50" y1="75" x2="350" y2="75" stroke="rgba(10, 228, 105, 0.2)" strokeWidth="0.75" />
          <line x1="200" y1="20" x2="200" y2="130" stroke="rgba(10, 228, 105, 0.2)" strokeWidth="0.75" />
          <path d="M 180 75 L 200 45 L 220 75 L 200 105 Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="200" cy="75" r="4" fill="#0ae469" />
          <text x="212" y="48" fill="rgba(255,255,255,0.3)" fontSize="9" letterSpacing="0.1em">TANGENT 1.0</text>
        </svg>
      )`,
  `title: "1. Brand Identity Systems",
      desc: "We engineer fully responsive logo systems (primary, secondary, sub-marks, and favicons) along with precise usage guidelines for color, typography, grids, and alignment constraints.",
      spanClass: "span-2",
      accent: "#D4AF37",
      glow: "rgba(212, 175, 55, 0.12)",
      illustration: (
        <svg width="100%" height="100%" viewBox="0 0 400 150" fill="none">
          <rect x="10" y="10" width="380" height="130" rx="12" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <circle cx="200" cy="75" r="50" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.8" />
          <line x1="50" y1="75" x2="350" y2="75" stroke="rgba(212, 175, 55, 0.2)" strokeWidth="0.75" />
          <line x1="200" y1="20" x2="200" y2="130" stroke="rgba(212, 175, 55, 0.2)" strokeWidth="0.75" />
          <path d="M 180 75 L 200 45 L 220 75 L 200 105 Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="200" cy="75" r="4" fill="#D4AF37" />
          <text x="215" y="48" fill="rgba(255,255,255,0.6)" fontSize="10" letterSpacing="0.2em" fontWeight="bold">AURORA</text>
        </svg>
      )`
);

content = content.replace(
  `title: "2. Color Harmonies",
      desc: "Contrast-safe palettes mapped out for digital accessibility (WCAG), offset printing (Pantone matching), and variable screen display consistency.",
      spanClass: "",
      accent: "#28c1e5",
      glow: "rgba(40, 193, 229, 0.12)",
      illustration: (
        <svg width="100%" height="100%" viewBox="0 0 200 150" fill="none">
          <rect x="10" y="20" width="45" height="110" rx="8" fill="#010d12" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <rect x="25" y="32" width="18" height="18" rx="4" fill="#FF4B4B" />
          <text x="20" y="115" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace">#FF4B4B</text>

          <rect x="68" y="20" width="45" height="110" rx="8" fill="#010d12" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <rect x="83" y="32" width="18" height="18" rx="4" fill="#4B83FF" />
          <text x="78" y="115" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace">#4B83FF</text>

          <rect x="126" y="20" width="45" height="110" rx="8" fill="#010d12" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <rect x="141" y="32" width="18" height="18" rx="4" fill="#FFB04B" />
          <text x="136" y="115" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace">#FFB04B</text>
        </svg>
      )`,
  `title: "2. Color Harmonies",
      desc: "Contrast-safe palettes mapped out for digital accessibility (WCAG), offset printing (Pantone matching), and variable screen display consistency.",
      spanClass: "",
      accent: "#2C3E50",
      glow: "rgba(44, 62, 80, 0.3)",
      illustration: (
        <svg width="100%" height="100%" viewBox="0 0 200 150" fill="none">
          <rect x="10" y="20" width="45" height="110" rx="8" fill="#010d12" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <rect x="25" y="32" width="18" height="18" rx="4" fill="#D4AF37" />
          <text x="20" y="115" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace">#D4AF37</text>

          <rect x="68" y="20" width="45" height="110" rx="8" fill="#010d12" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <rect x="83" y="32" width="18" height="18" rx="4" fill="#2C3E50" />
          <text x="78" y="115" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace">#2C3E50</text>

          <rect x="126" y="20" width="45" height="110" rx="8" fill="#010d12" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <rect x="141" y="32" width="18" height="18" rx="4" fill="#ECF0F1" />
          <text x="136" y="115" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace">#ECF0F1</text>
        </svg>
      )`
);

content = content.replace(
  `title: "3. Typographic Systems",
      desc: "Pairing scalable font hierarchies, variable type structures, and line spacing templates that establish readability and high visual voice impact.",
      spanClass: "",
      accent: "#f9cc3d",
      glow: "rgba(249, 204, 61, 0.12)",
      illustration: (
        <svg width="100%" height="100%" viewBox="0 0 200 150" fill="none">
          <text x="20" y="65" fill="white" fontSize="48" fontWeight="800" fontFamily="sans-serif">Aa</text>
          <text x="20" y="105" fill="#f9cc3d" fontSize="24" fontWeight="300" fontFamily="sans-serif">Neue Grotesk</text>
          <line x1="20" y1="120" x2="160" y2="120" stroke="rgba(249, 204, 61, 0.3)" strokeWidth="1" />
          <circle cx="160" cy="120" r="3" fill="#f9cc3d" />
        </svg>
      )`,
  `title: "3. Typographic Systems",
      desc: "Pairing scalable font hierarchies, variable type structures, and line spacing templates that establish readability and high visual voice impact.",
      spanClass: "",
      accent: "#ECF0F1",
      glow: "rgba(236, 240, 241, 0.12)",
      illustration: (
        <svg width="100%" height="100%" viewBox="0 0 200 150" fill="none">
          <text x="20" y="65" fill="white" fontSize="42" fontWeight="400" fontFamily="serif" fontStyle="italic">Aa</text>
          <text x="20" y="105" fill="#D4AF37" fontSize="20" fontWeight="400" fontFamily="serif" letterSpacing="0.05em">Playfair Display</text>
          <line x1="20" y1="120" x2="160" y2="120" stroke="rgba(212, 175, 55, 0.3)" strokeWidth="1" />
          <circle cx="160" cy="120" r="3" fill="#D4AF37" />
        </svg>
      )`
);

content = content.replace(
  `title: "4. Physical & Digital Touchpoints",
      desc: "Creating packaging grids, corporate stationery, stationery papers, marketing collateral, social kits, and responsive design systems that live together as a unified ecosystem.",
      spanClass: "span-2",
      accent: "#7a43ff",
      glow: "rgba(122, 67, 255, 0.12)",
      illustration: (
        <svg width="100%" height="100%" viewBox="0 0 400 150" fill="none">
          {/* Laptop Mockup */}
          <rect x="50" y="30" width="140" height="85" rx="8" fill="#010d12" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
          <rect x="58" y="38" width="124" height="69" rx="4" fill="rgba(122, 67, 255, 0.05)" stroke="rgba(122, 67, 255, 0.2)" strokeWidth="1" />
          <line x1="40" y1="115" x2="200" y2="115" stroke="rgba(255,255,255,0.3)" strokeWidth="3" strokeLinecap="round" />
          
          {/* Phone Mockup */}
          <rect x="250" y="20" width="55" height="100" rx="10" fill="#010d12" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
          <rect x="255" y="28" width="45" height="84" rx="6" fill="rgba(122, 67, 255, 0.05)" stroke="rgba(122, 67, 255, 0.2)" strokeWidth="1" />
          <circle cx="277.5" cy="24" r="1.5" fill="rgba(255,255,255,0.3)" />

          {/* Connected branding vectors */}
          <path d="M 185 70 C 210 70, 220 50, 245 50" stroke="#7a43ff" strokeWidth="1" strokeDasharray="3 3" />
        </svg>
      )`,
  `title: "4. Physical & Digital Touchpoints",
      desc: "Creating packaging grids, corporate stationery, stationery papers, marketing collateral, social kits, and responsive design systems that live together as a unified ecosystem.",
      spanClass: "span-2",
      accent: "#D4AF37",
      glow: "rgba(212, 175, 55, 0.12)",
      illustration: (
        <svg width="100%" height="100%" viewBox="0 0 400 150" fill="none">
          {/* Laptop Mockup */}
          <rect x="50" y="30" width="140" height="85" rx="8" fill="#010d12" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
          <rect x="58" y="38" width="124" height="69" rx="4" fill="rgba(212, 175, 55, 0.05)" stroke="rgba(212, 175, 55, 0.2)" strokeWidth="1" />
          <line x1="40" y1="115" x2="200" y2="115" stroke="rgba(255,255,255,0.3)" strokeWidth="3" strokeLinecap="round" />
          
          {/* Phone Mockup */}
          <rect x="250" y="20" width="55" height="100" rx="10" fill="#010d12" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
          <rect x="255" y="28" width="45" height="84" rx="6" fill="rgba(44, 62, 80, 0.2)" stroke="rgba(44, 62, 80, 0.5)" strokeWidth="1" />
          <circle cx="277.5" cy="24" r="1.5" fill="rgba(255,255,255,0.3)" />

          {/* Connected branding vectors */}
          <path d="M 185 70 C 210 70, 220 50, 245 50" stroke="#D4AF37" strokeWidth="1" strokeDasharray="3 3" />
        </svg>
      )`
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Update complete.');
