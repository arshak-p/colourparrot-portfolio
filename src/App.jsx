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

  useEffect(() => {
    let title = 'Colour Parrot | Branding, Motion & Digital Agency in Kozhikode';
    let desc = 'Colour Parrot is a full-service creative agency helping businesses build brands that are clear, consistent, and unforgettable.';
    
    switch (true) {
      case pathname === '/':
        title = 'Colour Parrot | Brand Strategy & Digital Marketing Agency';
        break;
      case pathname === '/about':
        title = 'About Us | Colour Parrot';
        desc = 'Learn about our creative team, our approach to branding, and how we deliver stunning digital experiences.';
        break;
      case pathname === '/services':
        title = 'Our Services | Colour Parrot';
        desc = 'Explore our end-to-end creative solutions including brand identity, video production, web design, and digital marketing.';
        break;
      case pathname.startsWith('/services/'):
        const serviceName = pathname.split('/')[2];
        title = `${serviceName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Services | Colour Parrot`;
        desc = `Professional ${serviceName.replace(/-/g, ' ')} solutions to elevate your business.`;
        break;
      case pathname === '/projects':
        title = 'Our Work & Case Studies | Colour Parrot';
        desc = 'Browse our portfolio of brand identities, video campaigns, and digital marketing success stories.';
        break;
      case pathname.startsWith('/brand/'):
        const brandName = pathname.split('/')[2];
        title = `${brandName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Branding Case Study | Colour Parrot`;
        desc = `Discover how we transformed ${brandName.replace(/-/g, ' ')} through strategic design and creative execution.`;
        break;
      case pathname === '/video-archive':
        title = 'Video Archive | Colour Parrot';
        desc = 'Watch our collection of motion graphics, cinematic ads, and brand films.';
        break;
      case pathname === '/blog':
        title = 'Insights & Blog | Colour Parrot';
        desc = 'Read the latest thoughts on branding, marketing trends, and creative strategies from our experts.';
        break;
      case pathname === '/contact':
        title = 'Contact Us | Colour Parrot';
        desc = 'Ready to start a project? Get in touch with Colour Parrot today.';
        break;
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = desc;
  }, [pathname]);

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
            {import.meta.env.DEV && (
              <>
                <Route path="/experiment" element={<HeroExperiment />} />
                <Route path="/brand-hero-drop" element={<BrandingHeroDrop />} />
              </>
            )}
            <Route path="*"         element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      <FloatingActions />
      <Footer />
    </>
  )
}
