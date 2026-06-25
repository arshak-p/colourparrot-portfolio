import { motion } from 'framer-motion'
import CurvedLoop from '../components/CurvedLoop'
import ScrollFloat from '../components/ScrollFloat';

export default function BlogPage() {
  return (
    <motion.div 
      className="blog-page pad"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
    >
      <div className="container">
        <div className="sec-label y" style={{ justifyContent: 'center' }}>LATEST INSIGHTS</div>
        <ScrollFloat className="sec-title" tag="h1">
          BLOG UNDER <span className="y">CONSTRUCTION</span>
        </ScrollFloat>
        <p style={{ opacity: 0.6, maxWidth: '500px', margin: '0 auto' }}>
          We are currently gathering the latest insights and data. 
          Stay tuned for insights on branding, design, and modern advertising.
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

      {/* Interactive Curved Loop Banner - Full Width */}
      <CurvedLoop 
        marqueeText="Latest Insights ✦ Coming Soon ✦ Stay Tuned ✦"
        speed={2}
        curveAmount={100}
        direction="left"
        style={{ marginTop: '5rem' }}
      />
    </motion.div>
  )
}
