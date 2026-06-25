import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState, lazy, Suspense } from 'react'
import Starfield from './components/Starfield'
import SpaceGrid from './components/SpaceGrid'
import CrosshairCursor from './components/CrosshairCursor'
import StaggeredMenu  from './components/StaggeredMenu'
import Footer         from './components/Footer'
import SmoothScroll, { lenis } from './components/SmoothScroll'
import Preloader      from './components/Preloader'
import FloatingActions from './components/FloatingActions'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const HomePage       = lazy(() => import('./pages/HomePage'))
const AboutPage      = lazy(() => import('./pages/AboutPage'))
const ServicePage    = lazy(() => import('./pages/ServicePage'))
const ProjectsPage   = lazy(() => import('./pages/ProjectsPage'))
const ContactPage    = lazy(() => import('./pages/ContactPage'))
const VideoArchivePage = lazy(() => import('./pages/VideoArchivePage'))
const BlogPage       = lazy(() => import('./pages/BlogPage'))
const NotFoundPage   = lazy(() => import('./pages/NotFoundPage'))
const HeroExperiment   = lazy(() => import('./components/HeroExperiment'))
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'))
const BrandDetailPage    = lazy(() => import('./pages/BrandDetailPage'))
const BrandingHeroDrop   = lazy(() => import('./pages/BrandingHeroDrop'))

import { menuItems, socialItems } from './data'
import './styles/globals.css'

export default function App() {
  const { pathname } = useLocation()
  const [loading, setLoading] = useState(true)
  const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches

  const handlePreloaderComplete = () => {
    setLoading(false)
    // Delay slightly to let body style update and DOM settle before calculations
    setTimeout(() => {
      if (lenis) {
        lenis.resize()
      }
      ScrollTrigger.refresh()
    }, 150)
  }

  return (
    <>
      {loading && <Preloader onComplete={handlePreloaderComplete} />}

      <SmoothScroll />
      <SpaceGrid />
      <Starfield />

      {!isTouchDevice && <CrosshairCursor />}

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
        <Suspense fallback={null}>
          <Routes>
            <Route path="/"         element={<HomePage />} />
            <Route path="/about"    element={<AboutPage />} />
            <Route path="/services"           element={<ServicePage />} />
            <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
            <Route path="/brand/:brandSlug"   element={<BrandDetailPage />} />
            <Route path="/projects"           element={<ProjectsPage />} />
            <Route path="/video-archive" element={<VideoArchivePage />} />
            <Route path="/contact"  element={<ContactPage />} />
            <Route path="/blog"     element={<BlogPage />} />
            <Route path="/experiment" element={<HeroExperiment />} />
            <Route path="/brand-hero-drop" element={<BrandingHeroDrop />} />
            <Route path="*"         element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      <FloatingActions />
      <Footer />
    </>
  )
}
