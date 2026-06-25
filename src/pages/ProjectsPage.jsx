import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import CurvedLoop from '../components/CurvedLoop'
import ScrollFloat from '../components/ScrollFloat';
import PosterCard from '../components/PosterCard'
import { brandingItems } from '../data/brandingData'
import { creativesList } from '../data/creativesData'

import { useState } from 'react'

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState('branding'); // 'branding' | 'creatives'
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const itemsPerPage = 12;
  const totalPages = Math.ceil(brandingItems.length / itemsPerPage);
  const paginatedProjects = brandingItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
      <div className="container projects-container-relative">

        <motion.div variants={itemVariants} className="sec-label g">OUR EXPEDITIONS</motion.div>
        <ScrollFloat className="sec-title projects-hero-title" tag="h1">
          MAPPING THE <span className="shiny-colour">GALAXY</span> OF WORK
        </ScrollFloat>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '2rem', marginBottom: '3rem', justifyContent: 'center' }}>
          <button 
            onClick={() => { setActiveTab('branding'); setCurrentPage(1); }}
            style={{
              padding: '0.8rem 2rem', borderRadius: '100px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s ease',
              background: activeTab === 'branding' ? 'var(--cyan)' : 'transparent',
              color: activeTab === 'branding' ? '#000' : 'rgba(255,255,255,0.6)',
              border: `1px solid ${activeTab === 'branding' ? 'var(--cyan)' : 'rgba(255,255,255,0.2)'}`
            }}
          >
            Brandings
          </button>
          <button 
            onClick={() => setActiveTab('creatives')}
            style={{
              padding: '0.8rem 2rem', borderRadius: '100px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s ease',
              background: activeTab === 'creatives' ? 'var(--cyan)' : 'transparent',
              color: activeTab === 'creatives' ? '#000' : 'rgba(255,255,255,0.6)',
              border: `1px solid ${activeTab === 'creatives' ? 'var(--cyan)' : 'rgba(255,255,255,0.2)'}`
            }}
          >
            Creatives
          </button>
        </div>

        {activeTab === 'branding' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Branding Grid */}
            <div className="posters-grid-layer">
              <style>{`
                .posters-grid-layer {
                  display: grid;
                  grid-template-columns: repeat(2, 1fr);
                  gap: 1rem;
                  width: 100%;
                }
                @media (max-width: 768px) {
                  .posters-grid-layer { grid-template-columns: 1fr !important; }
                }
              `}</style>
              {paginatedProjects.map((p, i) => (
                <PosterCard key={i} item={p} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="projects-pagination">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentPage(i + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'creatives' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="masonry-container">
              <div className="creatives-grid">
              {creativesList.map((item, i) => (
                <div 
                  key={i} 
                  className="ad-card" 
                  onClick={() => setSelectedImage(item.image)}
                  style={{ overflow: 'hidden', background: '#111', cursor: 'pointer', display: 'block', width: '100%' }}
                >
                  <img src={item.image} alt={item.caption} style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
              ))}
              </div>
            </div>
          </motion.div>
        )}

      </div>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.9)', zIndex: 9999,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '2rem', cursor: 'zoom-out'
            }}
          >
            <motion.img 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={selectedImage} 
              alt="Creative Fullscreen" 
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '12px' }} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Curved Loop Banner - Moved out of .container for full width */}
      <div className="projects-curved-loop" style={{ width: '100%', overflow: 'hidden', marginTop: '6rem' }}>
        <CurvedLoop 
          marqueeText="Mapping the Galaxy of Work ✦ Branding ✦ Advertising ✦ Motion ✦ Design ✦"
          speed={2}
          curveAmount={130}
          direction="left"
        />
      </div>
    </motion.div>
  )
}
