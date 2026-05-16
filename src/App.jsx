import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState, lazy, Suspense } from 'react'
import SpaceGrid      from './components/SpaceGrid'
import Starfield      from './components/Starfield'
import CrosshairCursor from './components/CrosshairCursor'
import StaggeredMenu  from './components/StaggeredMenu'
import Footer         from './components/Footer'
import SmoothScroll   from './components/SmoothScroll'
import Preloader      from './components/Preloader'

const HomePage       = lazy(() => import('./pages/HomePage'))
const AboutPage      = lazy(() => import('./pages/AboutPage'))
const ServicePage    = lazy(() => import('./pages/ServicePage'))
const ProjectsPage   = lazy(() => import('./pages/ProjectsPage'))
const ContactPage    = lazy(() => import('./pages/ContactPage'))
const BlogPage       = lazy(() => import('./pages/BlogPage'))
const NotFoundPage   = lazy(() => import('./pages/NotFoundPage'))
const HeroExperiment   = lazy(() => import('./components/HeroExperiment'))
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'))


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
        <Suspense fallback={null}>
          <Routes>
            <Route path="/"         element={<HomePage />} />
            <Route path="/about"    element={<AboutPage />} />
            <Route path="/service"  element={<ServicePage />} />
            <Route path="/services"           element={<ServicePage />} />
            <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
            <Route path="/projects"           element={<ProjectsPage />} />

            <Route path="/contact"  element={<ContactPage />} />
            <Route path="/blog"     element={<BlogPage />} />
            <Route path="/experiment" element={<HeroExperiment />} />
            <Route path="*"         element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </>
  )
}
