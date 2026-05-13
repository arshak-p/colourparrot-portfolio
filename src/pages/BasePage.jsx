export default function BasePage({ title }) {
  return (
    <div className="pad" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <h1 className="sec-title" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>{title}</h1>
      <p style={{ color: 'rgba(242,242,242,0.4)', maxWidth: 600, marginTop: '2rem' }}>
        This is a placeholder for the {title} page. We are currently building this section of our space station. Stay tuned for launch!
      </p>
      <div style={{ marginTop: '3rem' }}>
        <a href="/" style={{ color: 'var(--green)', textDecoration: 'none', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.8rem' }}>← Back to Base</a>
      </div>
    </div>
  )
}
