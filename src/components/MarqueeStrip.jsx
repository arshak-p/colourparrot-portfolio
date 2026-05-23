import { memo } from 'react'
import styles from './MarqueeStrip.module.css'

const MarqueeStrip = memo(function MarqueeStrip({ items = [], accent = 'green', reverse = false }) {
  // Multiply items to ensure seamless infinite looping on 4K screens
  const doubled = [...items, ...items, ...items, ...items]
  const accentColor = accent === 'cyan' ? 'var(--cyan)' : 'var(--green)'

  return (
    <div className={styles.strip}>
      <div className={`${styles.track} ${reverse ? styles.rev : ''}`}>
        {doubled.map((item, i) => {
          const isOutline = i % 2 === 1
          return (
            <span
              key={i}
              className={`${styles.item} ${isOutline ? styles.outline : styles.solid}`}
              style={{ '--accent-color': accentColor }}
            >
              {item}
            </span>
          )
        })}
      </div>
    </div>
  )
})

export default MarqueeStrip
