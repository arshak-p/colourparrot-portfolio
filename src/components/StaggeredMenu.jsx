import { useCallback, useLayoutEffect, useRef, useState, memo } from 'react'
import { gsap } from 'gsap'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import './StaggeredMenu.css'

const StaggeredMenu = memo(function StaggeredMenu({
  position = 'right',
  colors   = ['#0ae469', '#021f14'],
  items    = [],
  socialItems       = [],
  displaySocials    = true,
  displayItemNumbering = true,
  accentColor       = '#0ae469',
  menuButtonColor   = '#f2f2f2',
  openMenuButtonColor = '#f2f2f2',
  changeMenuColorOnOpen = false,
  closeOnClickAway  = true,
  onMenuOpen,
  onMenuClose,
}) {
  const [open, setOpen]           = useState(false)
  const [textLines, setTextLines] = useState(['Menu'])
  const openRef          = useRef(false)
  const busyRef          = useRef(false)
  const panelRef         = useRef(null)
  const prelayersRef     = useRef(null)
  const prelayerElsRef   = useRef([])
  const iconRef          = useRef(null)
  const iconHRef         = useRef(null)
  const iconVRef         = useRef(null)
  const textInnerRef     = useRef(null)
  const toggleBtnRef     = useRef(null)
  const openTlRef        = useRef(null)
  const closeTwRef       = useRef(null)
  const spinTwRef        = useRef(null)
  const textAnimRef      = useRef(null)
  const colorTwRef       = useRef(null)

  /* ── init positions ── */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current
      if (!panel) return
      const layers = prelayersRef.current
        ? Array.from(prelayersRef.current.querySelectorAll('.sm-prelayer'))
        : []
      prelayerElsRef.current = layers
      const offX = position === 'left' ? -100 : 100
      gsap.set([panel, ...layers], { xPercent: offX, opacity: 1 })
      gsap.set(iconRef.current,  { rotate: 0, transformOrigin: '50% 50%' })
      gsap.set(iconHRef.current, { transformOrigin: '50% 50%', rotate: 0 })
      gsap.set(iconVRef.current, { transformOrigin: '50% 50%', rotate: 90 })
      gsap.set(textInnerRef.current, { yPercent: 0 })
      gsap.set(toggleBtnRef.current, { color: menuButtonColor })
    })
    return () => ctx.revert()
  }, [menuButtonColor, position])

  /* ── text cycle ── */
  const animateText = useCallback((opening) => {
    const inner = textInnerRef.current
    if (!inner) return
    textAnimRef.current?.kill()
    const from = opening ? 'Menu' : 'Close'
    const to   = opening ? 'Close' : 'Menu'
    const seq  = [from]
    let last   = from
    for (let i = 0; i < 3; i++) { last = last === 'Menu' ? 'Close' : 'Menu'; seq.push(last) }
    if (last !== to) seq.push(to)
    seq.push(to)
    setTextLines(seq)
    gsap.set(inner, { yPercent: 0 })
    const n = seq.length
    textAnimRef.current = gsap.to(inner, {
      yPercent: -(((n - 1) / n) * 100),
      duration: 0.5 + n * 0.07,
      ease: 'power4.out',
    })
  }, [])

  /* ── open animation ── */
  const buildOpen = useCallback(() => {
    const panel  = panelRef.current
    const layers = prelayerElsRef.current
    if (!panel) return null
    openTlRef.current?.kill()
    closeTwRef.current?.kill()
    closeTwRef.current = null

    const itemLabels  = [...panel.querySelectorAll('.sm-panel-itemLabel')]
    const itemEls     = [...panel.querySelectorAll('.sm-panel-item')]
    const socialTitle = panel.querySelector('.sm-socials-title')
    const socialLinks = [...panel.querySelectorAll('.sm-socials-link')]
    const offX = position === 'left' ? -100 : 100

    gsap.set(itemLabels, { yPercent: 140, rotate: 10 })
    itemEls.forEach(el => gsap.set(el, { '--sm-num-opacity': 0 }))
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 })
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 })

    const tl = gsap.timeline({ paused: true })
    layers.forEach((l, i) =>
      tl.fromTo(l, { xPercent: offX }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07)
    )
    const pt = layers.length ? layers.length * 0.07 + 0.08 : 0
    tl.fromTo(panel, { xPercent: offX }, { xPercent: 0, duration: 0.65, ease: 'power4.out' }, pt)
    tl.to(itemLabels, { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: 0.1 }, pt + 0.1)
    tl.to(itemEls, { '--sm-num-opacity': 1, duration: 0.6, ease: 'power2.out', stagger: 0.08 }, pt + 0.2)
    if (socialTitle) tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, pt + 0.26)
    if (socialLinks.length) tl.to(socialLinks, { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', stagger: 0.08 }, pt + 0.3)
    return tl
  }, [position])

  const playOpen = useCallback(() => {
    if (busyRef.current) return
    busyRef.current = true
    const tl = buildOpen()
    if (tl) {
      tl.eventCallback('onComplete', () => { busyRef.current = false })
      openTlRef.current = tl
      tl.play(0)
    } else { busyRef.current = false }
  }, [buildOpen])

  /* ── close animation ── */
  const playClose = useCallback(() => {
    openTlRef.current?.kill()
    openTlRef.current = null
    const panel  = panelRef.current
    const layers = prelayerElsRef.current
    if (!panel) return
    closeTwRef.current?.kill()
    const offX = position === 'left' ? -100 : 100
    closeTwRef.current = gsap.to([...layers, panel], {
      xPercent: offX, duration: 0.32, ease: 'power3.in', overwrite: 'auto',
      onComplete: () => {
        const ils = [...panel.querySelectorAll('.sm-panel-itemLabel')]
        if (ils.length) gsap.set(ils, { yPercent: 140, rotate: 10 })
        const st = panel.querySelector('.sm-socials-title')
        const sl = [...panel.querySelectorAll('.sm-socials-link')]
        if (st) gsap.set(st, { opacity: 0 })
        if (sl.length) gsap.set(sl, { y: 25, opacity: 0 })
        busyRef.current = false
      },
    })
  }, [position])

  /* ── icon ── */
  const animateIcon = useCallback((opening) => {
    spinTwRef.current?.kill()
    spinTwRef.current = gsap.to(iconRef.current, {
      rotate: opening ? 225 : 0,
      duration: opening ? 0.8 : 0.35,
      ease: opening ? 'power4.out' : 'power3.inOut',
      overwrite: 'auto',
    })
  }, [])

  /* ── color ── */
  const animateColor = useCallback((opening) => {
    colorTwRef.current?.kill()
    if (changeMenuColorOnOpen) {
      colorTwRef.current = gsap.to(toggleBtnRef.current, {
        color: opening ? openMenuButtonColor : menuButtonColor,
        delay: 0.18, duration: 0.3, ease: 'power2.out',
      })
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor])

  /* ── toggle ── */
  const toggleMenu = useCallback(() => {
    const next = !openRef.current
    openRef.current = next
    setOpen(next)
    animateText(next)
    animateIcon(next)
    animateColor(next)
    if (next) { onMenuOpen?.(); playOpen() }
    else       { onMenuClose?.(); playClose() }
  }, [animateText, animateIcon, animateColor, playOpen, playClose, onMenuOpen, onMenuClose])

  const closeMenu = useCallback(() => {
    if (!openRef.current) return
    openRef.current = false
    setOpen(false)
    animateText(false)
    animateIcon(false)
    animateColor(false)
    onMenuClose?.()
    playClose()
  }, [animateText, animateIcon, animateColor, playClose, onMenuClose])

  /* ── click away ── */
  useLayoutEffect(() => {
    if (!closeOnClickAway || !open) return
    const handler = (e) => {
      if (panelRef.current?.contains(e.target)) return
      if (toggleBtnRef.current?.contains(e.target)) return
      closeMenu()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [closeOnClickAway, open, closeMenu])

  /* ── prelayer colors ── */
  const prelayerColors = (() => {
    const raw = colors.slice(0, 4)
    const arr = [...raw]
    if (arr.length >= 3) arr.splice(Math.floor(arr.length / 2), 1)
    return arr
  })()

  return (
    <div
      className="sm-wrapper"
      style={{ '--sm-accent': accentColor }}
      data-position={position}
      data-open={open || undefined}
    >
      {/* Prelayers */}
      <div ref={prelayersRef} className="sm-prelayers" aria-hidden="true">
        {prelayerColors.map((c, i) => (
          <div key={i} className="sm-prelayer" style={{ background: c }} />
        ))}
      </div>

      {/* Panel */}
      <aside ref={panelRef} id="sm-panel" className="sm-panel" aria-hidden={!open}>
        <div className="sm-panel-inner" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <ul
            className="sm-panel-list"
            role="list"
            {...(displayItemNumbering ? { 'data-numbering': true } : {})}
            style={{ marginBottom: 'auto' }}
          >
            {items.map((item, idx) => (
              <li key={idx} className="sm-panel-itemWrap">
                <Link
                  className="sm-panel-item"
                  to={item.link}
                  aria-label={item.ariaLabel}
                  onClick={closeMenu}
                >
                  <span className="sm-panel-itemLabel">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {displaySocials && socialItems.length > 0 && (
            <div className="sm-socials" aria-label="Social links">
              <h3 className="sm-socials-title">Socials</h3>
              <ul className="sm-socials-list" role="list" style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                {socialItems.map((s, i) => (
                  <li key={i}>
                    <a href={s.link} target="_blank" rel="noopener noreferrer" className="sm-socials-link" aria-label={s.label}>
                      {s.icon === 'instagram' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                      )}
                      {s.icon === 'behance' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12h-4"></path><path d="M9 16h-4"></path><path d="M5 8h4a2 2 0 1 1 0 4h-4v-4z"></path><path d="M5 12h4a2 2 0 1 1 0 4h-4v-4z"></path><path d="M13 12h7"></path><path d="M20 12c0-3-2-5-5-5s-5 2-5 5 2 5 5 5 5-2 5-5z"></path></svg>
                      )}
                      {s.icon === 'facebook' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                      )}
                      {s.icon === 'linkedin' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>

      {/* Header */}
      <header className="sm-header" aria-label="Main navigation">
        <Link to="/" className="sm-logo-wrap" onClick={closeMenu}>
          <img src={logo} alt="Colour Parrot" className="sm-logo-img" draggable={false} />
          <span className="sm-logo-text">
            <span className="shiny-colour">Colour</span>
            <span className="sm-logo-parrot">&nbsp;Parrot</span>
          </span>
        </Link>

        <button
          ref={toggleBtnRef}
          className="sm-toggle"
          onClick={toggleMenu}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="sm-panel"
          type="button"
        >
          <span className="sm-toggle-textWrap" aria-hidden="true">
            <span ref={textInnerRef} className="sm-toggle-textInner">
              {textLines.map((line, i) => (
                <span key={i} className="sm-toggle-line">{line}</span>
              ))}
            </span>
          </span>
          <span ref={iconRef} className="sm-icon" aria-hidden="true">
            <span ref={iconHRef} className="sm-icon-line" />
            <span ref={iconVRef} className="sm-icon-line sm-icon-line-v" />
          </span>
        </button>
      </header>
    </div>
  )
})

export default StaggeredMenu
