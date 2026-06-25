import { Link } from 'react-router-dom'
import StarBorderBtn from '../components/StarBorderBtn'

export default function NotFoundPage() {
  return (
    <div className="pad" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      textAlign: 'center',
      position: 'relative',
      zIndex: 1
    }}>
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(122,67,255,0.1), transparent 70%)',
        filter: 'blur(100px)',
        zIndex: -1
      }} />

      <h1 style={{ 
        fontSize: 'clamp(8rem, 25vw, 15rem)', 
        fontWeight: 500, 
        lineHeight: 1, 
        margin: 0,
        background: 'linear-gradient(to bottom, var(--light), rgba(242,242,242,0.1))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '-0.05em'
      }}>
        404
      </h1>

      <h2 style={{ 
        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', 
        fontWeight: 500, 
        letterSpacing: '-0.02em', 
        marginTop: '-1rem',
        marginBottom: '1.5rem'
      }}>
        Lost in the <span className="p">Multiverse</span>
      </h2>

      <p style={{ 
        color: 'rgba(242,242,242,0.45)', 
        maxWidth: 500, 
        fontSize: '1rem', 
        lineHeight: 1.8, 
        fontWeight: 300,
        marginBottom: '3rem'
      }}>
        It seems you've drifted off course. The coordinates you entered don't exist in our known galaxy. Let's get you back to base.
      </p>

      <StarBorderBtn href="/" color="var(--purple)">
        Return Home
      </StarBorderBtn>
    </div>
  )
}
