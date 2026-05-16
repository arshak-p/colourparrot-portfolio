import { motion } from 'framer-motion'
import { useState } from 'react'
import styles from './ParrotWidget.module.css'

export default function ParrotWidget() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div 
      className={styles.widget}
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => window.open('https://wa.me/919400890105?text=Hello! your parrot sent me here.', '_blank')}
    >
      <motion.div
        className={styles.bubble}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? -10 : 10 }}
      >
        LET'S TALK!
      </motion.div>

      <div className={styles.container}>
        <svg viewBox="0 0 250 300" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="ip-bellyGradient">
              <stop offset="0%" stopColor="#e74c3c" />
              <stop offset="100%" stopColor="#c0392b" />
            </radialGradient>
            <linearGradient id="ip-wingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9b59b6" />
              <stop offset="100%" stopColor="#8e44ad" />
            </linearGradient>
            <linearGradient id="ip-bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3498db" />
              <stop offset="100%" stopColor="#2980b9" />
            </linearGradient>
            <radialGradient id="ip-headGradient">
              <stop offset="0%" stopColor="#34495e" />
              <stop offset="100%" stopColor="#2c3e50" />
            </radialGradient>
          </defs>
          <ellipse cx="125" cy="285" rx="50" ry="10" fill="#000" opacity="0.1" />
          <line x1="40" y1="250" x2="210" y2="250" stroke="#795548" strokeWidth="12" strokeLinecap="round" />
          <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            <g>
              <path d="M105 245 C 105 255, 115 255, 115 245" stroke="#4b3e39" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M135 245 C 135 255, 145 255, 145 245" stroke="#4b3e39" strokeWidth="4" fill="none" strokeLinecap="round" />
            </g>
            <path d="M125 210 Q 125 260 105 270 L 125 260 L 145 270 Q 125 260 125 210" fill="#8e44ad" />
            <ellipse cx="125" cy="180" rx="40" ry="60" fill="url(#ip-bodyGradient)" />
            <ellipse cx="125" cy="190" rx="30" ry="45" fill="url(#ip-bellyGradient)" />
            
            <motion.path 
              d="M100 90 C 50 110, 50 180, 95 190 Q 100 185, 105 192 Q 110 182, 115 185 C 120 160, 115 120, 110 110 Z" 
              fill="url(#ip-wingGradient)" 
              animate={{ rotate: isHovered ? -20 : 0 }}
              className={styles.wingLeft}
            />
            <motion.path 
              d="M150 90 C 200 110, 200 180, 155 190 Q 150 185, 145 192 Q 140 182, 135 185 C 130 160, 135 120, 140 110 Z" 
              fill="url(#ip-wingGradient)" 
              animate={{ rotate: isHovered ? 20 : 0 }}
              className={styles.wingRight}
            />

            <motion.g 
              animate={{ rotate: [0, 5, -5, 0] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} 
              className={styles.head}
            >
              <ellipse cx="125" cy="120" rx="35" ry="35" fill="url(#ip-headGradient)" />
              <path d="M160 118 C172 122, 172 135, 160 138 C155 135, 152 130, 154 124 Z" fill="#f39c12" />
              <g>
                <circle cx="145" cy="110" r="10" fill="white" />
                <motion.circle 
                  cx="148" cy="110" r="6" fill="#000" 
                  animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                  transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.95, 1] }}
                />
                <circle cx="150" cy="108" r="2" fill="white" />
              </g>
            </motion.g>
          </motion.g>
        </svg>
      </div>
    </motion.div>
  )
}
