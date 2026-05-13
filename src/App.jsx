import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import SpaceGrid      from './components/SpaceGrid'
import Starfield      from './components/Starfield'
import CrosshairCursor from './components/CrosshairCursor'
import StaggeredMenu  from './components/StaggeredMenu'
import Footer         from './components/Footer'
import SmoothScroll   from './components/SmoothScroll'
import Preloader      from './components/Preloader'

import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ServicePage from './pages/ServicePage'
import ProjectsPage from './pages/ProjectsPage'
import ContactPage from './pages/ContactPage'
import BlogPage from './pages/BlogPage'
import NotFoundPage from './pages/NotFoundPage'
import HeroExperiment from './components/HeroExperiment'

import { menuItems, socialItems } from './data'
import './styles/globals.css'

export default function App() {
  const { pathname } = useLocation()
  const [loading, setLoading] = useState(true)

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}

      <SmoothScroll />
      <SpaceGrid />
      <Starfield />
      <CrosshairCursor />

      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials
        displayItemNumbering
        colors={['#0ae469', '#021f14']}
        accentColor="#0ae469"
        menuButtonColor="#f2f2f2"
        openMenuButtonColor="#f2f2f2"
        changeMenuColorOnOpen={false}
        closeOnClickAway
      />

      <main>
        <Routes>
          <Route path="/"         element={<HomePage />} />
          <Route path="/about"    element={<AboutPage />} />
          <Route path="/service"  element={<ServicePage />} />
          <Route path="/services" element={<ServicePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/contact"  element={<ContactPage />} />
          <Route path="/blog"     element={<BlogPage />} />
          <Route path="/experiment" element={<HeroExperiment />} />
          <Route path="*"         element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </>
  )
}
