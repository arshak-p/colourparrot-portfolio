import { memo } from 'react'
import { socialItems } from '../data'
import styles from './Footer.module.css'

const Footer = memo(function Footer() {
  const links = [
    { label: 'Home',     href: '#hero'     },
    { label: 'About',    href: '#about'    },
    { label: 'Services', href: '#services' },
    { label: 'Work',     href: '#work'     },
    { label: 'Contact',  href: '#contact'  },
  ]

  return (
    <footer className={styles.footer}>
      <div className={styles.left}>
        <p className={styles.copyright}>
          © 2025 Colour Parrot Branding &amp; Advertising · Kozhikode, Kerala
        </p>
        <div className={styles.socialRow}>
          {socialItems.map((s, i) => (
            <a
              key={i}
              href={s.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label={s.label}
            >
              {s.icon === 'instagram' && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              )}
              {s.icon === 'behance' && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12h-4"></path><path d="M9 16h-4"></path><path d="M5 8h4a2 2 0 1 1 0 4h-4v-4z"></path><path d="M5 12h4a2 2 0 1 1 0 4h-4v-4z"></path><path d="M13 12h7"></path><path d="M20 12c0-3-2-5-5-5s-5 2-5 5 2 5 5 5 5-2 5-5z"></path></svg>
              )}
              {s.icon === 'facebook' && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              )}
              {s.icon === 'linkedin' && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              )}
            </a>
          ))}
        </div>
      </div>

      <nav className={styles.nav}>
        {links.map(({ label, href }) => (
          <a key={label} href={href} className={styles.navLink}>
            {label}
          </a>
        ))}
      </nav>
    </footer>
  )
})

export default Footer
