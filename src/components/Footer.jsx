import { memo } from 'react'
import { InstagramIcon, BehanceIcon, FacebookIcon, LinkedInIcon } from './SocialIcons'
import { Link } from 'react-router-dom'
import { socialItems } from '../data'
import styles from './Footer.module.css'

const Footer = memo(function Footer() {
  const links = [
    { label: 'Home',     to: '/'         },
    { label: 'About',    to: '/about'    },
    { label: 'Services', to: '/services' },
    { label: 'Work',     to: '/projects' },
    { label: 'Contact',  to: '/contact'  },
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
                <InstagramIcon width="16" height="16" />
              )}
              {s.icon === 'behance' && (
                <BehanceIcon width="16" height="16" />
              )}
              {s.icon === 'facebook' && (
                <FacebookIcon width="16" height="16" />
              )}
              {s.icon === 'linkedin' && (
                <LinkedInIcon width="16" height="16" />
              )}
            </a>
          ))}
        </div>
      </div>

      <nav className={styles.nav}>
        {links.map(({ label, to }) => (
          <Link key={label} to={to} className={styles.navLink} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {label}
          </Link>
        ))}
      </nav>
    </footer>
  )
})

export default Footer
