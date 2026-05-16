import { motion } from 'framer-motion'
import BorderGlow from '../components/BorderGlow'


const projects = [
  { title: 'BRANDING IDENTITY', category: 'Strategy + Design', accent: 'var(--green)' },
  { title: 'Astron Eyecare', category: 'Identity + Web', accent: 'var(--cyan)' },
  { title: 'Jadwa', category: 'Brand Guidelines', accent: 'var(--purple)' },
  { title: 'Sapphire Resto Cafe', category: 'Concept Branding', accent: 'var(--yellow)' },
  { title: 'Aptitude Learning', category: 'Digital Presence', accent: 'var(--red)' },
  { title: 'Maasi International', category: 'Global Campaign', accent: 'var(--green)' },
  { title: 'Al Fawz Academy', category: 'Brand Narrative', accent: 'var(--cyan)' },
  { title: 'Digistore Pay', category: 'Fintech Identity', accent: 'var(--purple)' },
  { title: 'Daymount', category: 'Corporate Branding', accent: 'var(--yellow)' },
  { title: 'Sakiriti', category: 'Creative Execution', accent: 'var(--red)' }
]

export default function ProjectsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  return (
    <motion.div 
      className="projects-page pad"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container">
        <motion.div variants={itemVariants} className="sec-label g">OUR EXPEDITIONS</motion.div>
        <motion.h1 variants={itemVariants} className="sec-title" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: '4rem' }}>
          MAPPING THE <span className="shiny-colour">GALAXY</span> OF WORK
        </motion.h1>

        <div className="projects-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem' 
        }}>
          {projects.map((p, i) => (
            <BorderGlow
              key={p.title}
              className="acard"
              glowColor={
                p.accent === 'var(--green)' ? '160 84 62' :
                p.accent === 'var(--cyan)' ? '190 80 60' :
                p.accent === 'var(--purple)' ? '260 70 60' :
                p.accent === 'var(--yellow)' ? '45 80 60' : '0 80 60'
              }
              colors={
                p.accent === 'var(--green)' ? ['#1D9E75', '#0ae469'] :
                p.accent === 'var(--cyan)' ? ['#28c1e5', '#38bdf8'] :
                p.accent === 'var(--purple)' ? ['#7a43ff', '#c084fc'] :
                p.accent === 'var(--yellow)' ? ['#f9cc3d', '#ffed4a'] : ['#f45b42', '#ff8a75']
              }
              backgroundColor="#061014"
              borderRadius={28}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ padding: '2.5rem', position: 'relative' }}>
                <div style={{ fontSize: '0.7rem', opacity: 0.5, letterSpacing: '0.2em', marginBottom: '0.5rem' }}>{p.category}</div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '500', lineHeight: '1.2' }}>{p.title}</h3>
                
                <div style={{ 
                  position: 'absolute', top: '1rem', right: '1.5rem', 
                  fontSize: '2rem', opacity: 0.05, fontWeight: '500' 
                }}>
                  0{i + 1}
                </div>

                <div 
                  className="project-accent"
                  style={{ 
                    position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px',
                    background: p.accent, opacity: 0.3, transition: 'all 0.3s ease'
                  }}
                />
              </div>
            </BorderGlow>
          ))}

        </div>
      </div>
    </motion.div>
  )
}
