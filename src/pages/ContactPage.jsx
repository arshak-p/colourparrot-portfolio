import { motion } from 'framer-motion'
import { useState } from 'react'
import StarBorderBtn from '../components/StarBorderBtn'
import CurvedLoop from '../components/CurvedLoop'
import ScrollFloat from '../components/ScrollFloat';

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
}

export default function ContactPage() {
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    const formData = new FormData(e.target);
    // Replace this key with your Web3Forms access key
    formData.append("access_key", "dd36d479-f98a-4f9b-8ad3-2fd4184c54f7"); 
    
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      
      const data = await response.json();
      if (data.success) {
        setStatus('Message sent successfully!');
        e.target.reset();
      } else {
        setStatus('Failed to send message. Please try again.');
      }
    } catch (error) {
      setStatus('An error occurred. Please try again later.');
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="page-root"
      style={{ position: 'relative', zIndex: 10 }}
    >
      {/* Hero */}
      <section className="pad" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <motion.div variants={itemVariants} className="sec-label">Connect with us</motion.div>
          <ScrollFloat className="sec-title" tag="h1" style={{ fontSize: 'clamp(3.5rem, 9vw, 6.5rem)' }}>
            Let's Start Your <br/><span className="shiny-colour">Journey</span>
          </ScrollFloat>
          <motion.p variants={itemVariants} style={{ maxWidth: 600, fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)', marginTop: '2.5rem' }}>
            We're always looking for ambitious brands to partner with. Drop us a line and let's explore what's possible.
          </motion.p>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="pad" style={{ paddingTop: 0 }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '4rem', alignItems: 'start' }}>
          {/* Form */}
          <motion.div variants={itemVariants} className="glass-card" style={{ padding: 'clamp(1.5rem, 5vw, 3rem)' }}>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Send a Message</h3>
            {status && (
              <div style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: '8px', background: status.includes('success') ? 'rgba(10,228,105,0.1)' : 'rgba(255,255,255,0.05)', color: status.includes('success') ? 'var(--green)' : 'white', fontSize: '0.9rem' }}>
                {status}
              </div>
            )}
            <form style={{ display: 'grid', gap: '2rem' }} onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '0.8rem' }}>
                <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 500, opacity: 0.6 }}>Full Name</label>
                <input name="name" required type="text" placeholder="John Doe" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: '1rem 1.5rem', borderRadius: '12px', color: 'white', outline: 'none', transition: 'border-color 0.3s' }} onFocus={e=>e.target.style.borderColor='var(--green)'} onBlur={e=>e.target.style.borderColor='var(--glass-border)'} />
              </div>
              <div style={{ display: 'grid', gap: '0.8rem' }}>
                <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 500, opacity: 0.6 }}>Email Address</label>
                <input name="email" required type="email" placeholder="john@example.com" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: '1rem 1.5rem', borderRadius: '12px', color: 'white', outline: 'none', transition: 'border-color 0.3s' }} onFocus={e=>e.target.style.borderColor='var(--green)'} onBlur={e=>e.target.style.borderColor='var(--glass-border)'} />
              </div>
              <div style={{ display: 'grid', gap: '0.8rem' }}>
                <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 500, opacity: 0.6 }}>Message</label>
                <textarea name="message" required rows="4" placeholder="How can we help?" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: '1rem 1.5rem', borderRadius: '12px', color: 'white', outline: 'none', transition: 'border-color 0.3s', resize: 'none' }} onFocus={e=>e.target.style.borderColor='var(--green)'} onBlur={e=>e.target.style.borderColor='var(--glass-border)'}></textarea>
              </div>
              <StarBorderBtn as="button" type="submit" style={{ width: '100%' }} disabled={status === 'Sending...'}>
                {status === 'Sending...' ? 'Sending...' : 'Send Message →'}
              </StarBorderBtn>
            </form>
          </motion.div>

          {/* Info */}
          <motion.div variants={itemVariants}>
            <div style={{ marginBottom: '4rem' }}>
              <p className="sec-label g">Contact Info</p>
              <div style={{ display: 'grid', gap: '2rem', marginTop: '2rem' }}>
                <div>
                  <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '0.5rem' }}>Email</p>
                  <a href="mailto:info@colourparrot.com" style={{ fontSize: '1.2rem', fontWeight: 500, color: 'var(--light)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={e=>e.target.style.color='var(--green)'} onMouseLeave={e=>e.target.style.color='var(--light)'}>info@colourparrot.com</a>
                </div>
                <div>
                  <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '0.5rem' }}>Phone</p>
                  <a href="tel:+919633865774" style={{ fontSize: '1.2rem', fontWeight: 500, color: 'var(--light)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={e=>e.target.style.color='var(--green)'} onMouseLeave={e=>e.target.style.color='var(--light)'}>+91 96338 65774</a>
                </div>
                <div>
                  <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '0.5rem' }}>WhatsApp</p>
                  <a href="https://wa.me/919633865774" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.2rem', fontWeight: 500, color: 'var(--light)', textDecoration: 'none', transition: 'color 0.3s', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseEnter={e=>e.target.style.color='#25D366'} onMouseLeave={e=>e.target.style.color='var(--light)'}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    Chat with us
                  </a>
                </div>
                <div>
                  <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '0.5rem' }}>Location</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--light)', lineHeight: 1.5 }}>
                    Omra's Building, Mini Bypass Rd,<br/>Thiruvannur, Kozhikode, Kerala 673029
                  </p>
                </div>
              </div>
            </div>

            {/* Map Preview */}
            <div className="glass-card" style={{ padding: '0', height: '300px', overflow: 'hidden' }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6277.856447745043!2d75.79854311168889!3d11.225695361399202!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba659d721eb6aeb%3A0x972a68879fe6780!2sColour%20Parrot%20Branding%20%26%20Advertising!5e0!3m2!1sen!2sin!4v1760282951078!5m2!1sen!2sin" 
                width="100%" height="100%" style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)' }} 
                allowFullScreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Curved Loop Banner */}
      <CurvedLoop 
        marqueeText="Say Hello ✦ Start Your Journey Today ✦ Get In Touch ✦"
        speed={1.5}
        curveAmount={150}
        direction="right"
        style={{ marginTop: '2rem', marginBottom: '3rem' }}
      />
    </motion.div>
  )
}
