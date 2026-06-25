import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { brandingItems } from '../data/brandingData'
import StarBorderBtn from '../components/StarBorderBtn'
import { useState, useMemo } from 'react'
import ScrollFloat from '../components/ScrollFloat';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
}

export default function BrandDetailPage() {
  const { brandSlug } = useParams()
  const brand = brandingItems.find(b => b.slug === brandSlug)

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const paginatedGallery = useMemo(() => {
    if (!brand || !brand.gallery) return [];
    return brand.gallery.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [brand, currentPage]);

  const totalPages = brand && brand.gallery ? Math.ceil(brand.gallery.length / itemsPerPage) : 0;

  if (!brand) {
    return (
      <section className="pad" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <ScrollFloat className="sec-title" tag="h1" style={{ color: 'white' }}>Brand Not Found</ScrollFloat>
          <Link to="/projects"><StarBorderBtn>Back to Portfolio</StarBorderBtn></Link>
        </div>
      </section>
    )
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="page-root"
      style={{ position: 'relative', zIndex: 10, background: '#000', color: 'white', minHeight: '100vh' }}
    >
      <section className="pad" style={{ paddingTop: '15vh', paddingBottom: '5rem', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative background glow */}
        <div style={{ 
          position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: '80vw', height: '80vw', 
          background: `radial-gradient(circle, rgba(10, 228, 105, 0.15) 0%, transparent 60%)`,
          borderRadius: '50%', filter: 'blur(100px)', zIndex: 0
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
            <Link to="/services/brand-identity" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              &larr; Back to Showcase
            </Link>
          </motion.div>
          
          <motion.h1 variants={itemVariants} style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            {brand.title}
          </motion.h1>
          
          <motion.p variants={itemVariants} style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto 4rem auto' }}>
            {brand.description}
          </motion.p>
          
          <motion.div variants={itemVariants} style={{ position: 'relative', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <img 
              src={brand.image} 
              alt={brand.title} 
              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover', maxHeight: '80vh' }} 
            />
          </motion.div>
        </div>
      </section>

      {/* Dynamic Full Gallery */}
      {brand.gallery && brand.gallery.length > 0 && (
        <section className="pad" style={{ background: '#000', paddingBottom: '6rem' }}>
          <div className="container" style={{ maxWidth: '1400px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
              gap: '2rem',
              alignItems: 'center'
            }}>
              {paginatedGallery.map((imgUrl, idx) => (
                <div 
                  key={imgUrl}
                  style={{ 
                    borderRadius: '24px', 
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.05)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    background: '#111'
                  }}
                >
                  <img src={imgUrl} alt={`${brand.title} showcase gallery`} style={{ width: '100%', height: 'auto', display: 'block' }} loading="lazy" />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '6rem' }}>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentPage(i + 1);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    style={{
                      width: '40px', height: '40px',
                      borderRadius: '50%',
                      border: `1px solid ${currentPage === i + 1 ? '#0ae469' : 'rgba(255,255,255,0.1)'}`,
                      background: currentPage === i + 1 ? '#0ae469' : 'transparent',
                      color: currentPage === i + 1 ? '#000' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontWeight: 'bold'
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Additional details section placeholder */}
      <section className="pad" style={{ background: '#050505', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
          <motion.div variants={itemVariants}>
            <h3 style={{ color: '#0ae469', fontSize: '1.5rem', marginBottom: '1rem' }}>The Challenge</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
              Crafting a distinctive visual identity that captures the essence of {brand.title} while establishing a highly scalable and robust design system across all touchpoints.
            </p>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h3 style={{ color: '#0ae469', fontSize: '1.5rem', marginBottom: '1rem' }}>The Solution</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
              We developed comprehensive brand guidelines detailing typography, color harmonies, logo constraints, and layout grids to ensure consistent brand representation everywhere.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="pad" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <ScrollFloat className="sec-title" tag="h2">
            Like what you <span className="c">see?</span>
          </ScrollFloat>
          <motion.p initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:0.1}} style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '3rem', fontSize: '1.1rem' }}>
            <StarBorderBtn href="/contact">Start Your Project</StarBorderBtn>
          </motion.p>
        </div>
      </section>
    </motion.div>
  )
}
