import styles from './MarqueeStrip.module.css'

export default function MarqueeStrip({ items = [], accent = 'green', reverse = false }) {
  const doubled = [...items, ...items]
  const accentColor = accent === 'cyan' ? 'var(--cyan)' : 'var(--green)'
  const borderColor = accent === 'cyan' ? 'rgba(40,193,229,0.1)' : 'rgba(10,228,105,0.1)'
  const bullet = accent === 'cyan' ? '◈' : '✦'

  return (
    <div className={styles.strip} style={{ borderColor }}>
      <div className={`${styles.track} ${reverse ? styles.rev : ''}`}>
        {doubled.map((item, i) => (
          <span key={i} style={{ color: 'rgba(242,242,242,0.3)' }}>
            {item} <em style={{ color: accentColor, fontStyle: 'normal' }}>{bullet}</em>
          </span>
        ))}
      </div>
    </div>
  )
}
