import { motion } from 'framer-motion'

export default function BlogPage() {
  return (
    <motion.div 
      className="blog-page pad"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
    >
      <div className="container">
        <div className="sec-label y" style={{ justifyContent: 'center' }}>INTERGALACTIC JOURNALS</div>
        <h1 className="sec-title">BLOG UNDER <span className="y">CONSTRUCTION</span></h1>
        <p style={{ opacity: 0.6, maxWidth: '500px', margin: '0 auto' }}>
          We are currently gathering data from across the universe. 
          Stay tuned for insights on branding, design, and galactic advertising.
        </p>
        
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{ 
            marginTop: '4rem', fontSize: '4rem', opacity: 0.2
          }}
        >
          🛰️
        </motion.div>
      </div>
    </motion.div>
  )
}
