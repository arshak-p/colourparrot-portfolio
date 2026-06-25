import { creativesList } from './creativesData';
import { brandingItems } from './brandingData';

export const menuItems = [
  { label: 'Home',       ariaLabel: 'Go to home',       link: '/'          },
  { label: 'About',      ariaLabel: 'Learn about us',    link: '/about'     },
  { label: 'Services',   ariaLabel: 'Our services',      link: '/services'  },
  { label: 'Projects',   ariaLabel: 'View our projects', link: '/projects'  },
  { label: 'Contact Us', ariaLabel: 'Get in touch',      link: '/contact'   },
  { label: 'Blog',       ariaLabel: 'Read our blog',     link: '/blog'      }
]

export const socialItems = [
  { 
    label: 'Instagram', 
    link: 'https://www.instagram.com/colour.parrot/',
    icon: 'instagram'
  },
  { 
    label: 'Behance', 
    link: 'https://www.behance.net/colourparrotbranding',
    icon: 'behance'
  },
  { 
    label: 'Facebook',  
    link: 'https://www.facebook.com/share/1F9u1EHMhb/?mibextid=wwXIfr',
    icon: 'facebook'
  },
  { 
    label: 'LinkedIn',  
    link: 'https://www.linkedin.com/company/colour-parrot/',
    icon: 'linkedin'
  },
]

export const marqueeItems1 = [
  'Brand Identity', 'Motion Video', 'Content Creation',
  'Podcast Production', 'Video Production', 'AI Video',
  'Brand Strategy', 'Cinematic Video', 'Testimonials',
  'Digital Marketing', 'Video Presentation', 'UI / UX Design'
]

export const marqueeItems2 = [
  'Restaurants', 'Fashion & Apparel', 'Tech & AI',
  'Event Management', 'Retail & E-commerce',
  'Logistics', 'Hospitality', 'Real Estate',
]

export const services = [
  { slug: 'brand-identity',       name: 'Brand Identity',       desc: 'Logo systems, typography, colour palettes, brand guidelines — built to last across every touchpoint.',               pill: 'Strategy + Design',   accent: 'var(--green)',  image: brandingItems[0].image, images: [brandingItems[0].image, brandingItems[1].image, brandingItems[2].image] },
  { slug: 'video-production',     name: 'Video Production',     desc: 'Ad films, brand reels, motion graphics and storytelling content — from script to final frame.',                       pill: 'Motion + Story',      accent: 'var(--cyan)',   image: '/video_production_new.png' },
  { slug: 'digital-marketing',    name: 'Digital Marketing',    desc: 'Social campaigns, digital ads, performance creatives and full-funnel strategies that convert.',                        pill: 'Reach + Convert',     accent: 'var(--purple)', image: '/digital_marketing_new.png' },
  { slug: 'web-design',           name: 'Web & UI Design',      desc: 'Websites, UI/UX concepts and app interfaces as beautiful as they are functional.',                                   pill: 'Digital Experience',  accent: 'var(--yellow)', image: '/web_design_new.png' },
  { slug: 'content-creation',     name: 'Content Creation',     desc: 'Copywriting, social media content, and digital storytelling that resonates with your audience.',                      pill: 'Narrative + Impact',  accent: 'var(--red)',    image: '/content_creation_new.png' },
  { slug: 'creative-advertising', name: 'Creative Advertising', desc: 'Concept-driven campaigns and advertising narratives built on brand strategy and human insight.',                       pill: 'Ideas + Execution',   accent: 'var(--green)',  image: creativesList[0].image, images: [creativesList[0].image, creativesList[1].image, creativesList[2].image] },
]


export const workItems = [
  { text: 'Brand Identity',       image: 'https://picsum.photos/600/400?random=11', color: '#0ae469' },
  { text: 'Video Production',     image: 'https://picsum.photos/600/400?random=22', color: '#28c1e5' },
  { text: 'Digital Marketing',    image: 'https://picsum.photos/600/400?random=33', color: '#7a43ff' },
  { text: 'Web & UI Design',      image: 'https://picsum.photos/600/400?random=44', color: '#f9cc3d' },
  { text: 'Content Creation',     image: '/content_creation_cosmic.png', color: '#f45b42' },
  { text: 'Creative Advertising', image: creativesList[0].image, color: '#0ae469' },
]


export const industries = [
  'Restaurants & Cafés', 'Fashion & Apparel', 'Technology & AI',
  'Event Management', 'Retail & E-commerce', 'Logistics & Cargo',
  'Healthcare', 'Real Estate', 'Hospitality', 'Education',
]
