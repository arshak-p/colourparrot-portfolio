import React from 'react';
import { motion } from 'framer-motion';

export const digitalMarketingSteps = [
  { num: "01", title: "Audit & Strategy", desc: "We analyze your current digital presence, identify gaps, and craft a bespoke performance marketing strategy tailored to your KPIs." },
  { num: "02", title: "Campaign Architecture", desc: "Setting up pixel tracking, custom audiences, and full-funnel conversion paths across Meta, Google, and TikTok ad ecosystems." },
  { num: "03", title: "Creative & Copywriting", desc: "Developing scroll-stopping ad creatives and compelling direct-response copy designed to maximize click-through and conversion rates." },
  { num: "04", title: "Launch & Optimization", desc: "Deploying campaigns with A/B testing frameworks in place. We monitor bidding strategies and allocate budget to the highest performing ad sets." },
  { num: "05", title: "Scaling & Reporting", desc: "Scaling the winners vertically and horizontally. We provide transparent, data-rich dashboards so you see exactly what your ROI looks like." }
];

export const webDesignSteps = [
  { num: "01", title: "UX Discovery & Wireframing", desc: "Mapping out user journeys and architectural flow. We create low-fidelity wireframes to ensure the core structure drives conversions." },
  { num: "02", title: "UI & Visual Design", desc: "Breathing life into the wireframes. We design high-fidelity, pixel-perfect interfaces that align flawlessly with your brand identity." },
  { num: "03", title: "Front-End Development", desc: "Writing clean, modern React/Next.js code. We implement smooth micro-interactions, responsive layouts, and lightning-fast load times." },
  { num: "04", title: "Back-End & Integrations", desc: "Connecting the dots. Whether it's headless CMS integration, e-commerce payment gateways, or custom APIs, we build robust backend architectures." },
  { num: "05", title: "Testing & Deployment", desc: "Rigorous cross-browser and device testing, SEO optimization, and performance audits before a seamless launch to your production environment." }
];

export const brandingSteps = [
  { num: "01", title: "Discovery & Strategy", desc: "We dive deep into your market, competitors, and audience to unearth the strategic positioning that will define your brand's core DNA." },
  { num: "02", title: "Concept & Ideation", desc: "Translating strategy into visual language. We develop multiple creative directions, exploring typography, color psychology, and structural form." },
  { num: "03", title: "Identity Systems", desc: "Refining the chosen concept into a robust system. This includes the primary logo, secondary marks, favicons, and scalable vector assets." },
  { num: "04", title: "Brand Guidelines", desc: "Documenting the rules of your brand. We deliver a comprehensive manual covering logo usage, color systems, typography hierarchies, and tone of voice." },
  { num: "05", title: "Rollout & Application", desc: "Applying your new identity across physical and digital touchpoints—from stationery and packaging to social media kits and website UI." }
];

export function ServiceProcess({ accent, steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <section className="pad" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--glass-border)', paddingBottom: '6rem' }}>
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <style>{`
          .process-grid { display: grid; grid-template-columns: auto 1fr; gap: 3rem; align-items: start; }
          @media (max-width: 600px) {
            .process-grid { grid-template-columns: 1fr; gap: 1.5rem; }
          }
        `}</style>

        <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.3em', color: accent, textTransform: 'uppercase' }}>Methodology</span>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#fff', marginTop: '1rem', letterSpacing: '-0.03em' }}>
            Our <span style={{ color: accent }}>Process</span>
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
                background: `radial-gradient(circle, ${accent}15 0%, transparent 70%)`,
                borderRadius: '50%', filter: 'blur(40px)', zIndex: 0
              }} />

              <div style={{ 
                fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 800, color: accent, opacity: 0.3, lineHeight: 0.8,
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
