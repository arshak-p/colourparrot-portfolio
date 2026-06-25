const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'src', 'components', 'services');

const badButton1 = `<Link to="/services" style={{ color: 'white', textDecoration: 'none', marginRight: '2rem', opacity: 0.5 }}>View All Services</Link>`;
const badButton2 = `<Link to="/services" style={{ color: 'white', textDecoration: 'none', opacity: 0.5 }}>View All Services</Link>`;

const goodButton = `<Link to="/services" style={{ 
              color: 'rgba(255,255,255,0.7)', 
              textDecoration: 'none', 
              padding: '0.9rem 2rem', 
              borderRadius: '100px', 
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.02)',
              transition: 'all 0.3s ease',
              fontSize: '0.9rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.1)';
              e.target.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.02)';
              e.target.style.color = 'rgba(255,255,255,0.7)';
            }}
            >View All Services</Link>`;

function updateFile(filename, importStatement, targetComment, injectionTag) {
    const filePath = path.join(servicesDir, filename);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf-8');

    // Fix CTA Button styles
    content = content.replaceAll(badButton1, goodButton);
    content = content.replaceAll(badButton2, goodButton);
    content = content.replaceAll(
      `<motion.div initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:0.2}} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>`,
      `<motion.div initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:0.2}} style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>`
    );
    content = content.replaceAll(
      `<motion.div initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:0.2}}>`,
      `<motion.div initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:0.2}} style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>`
    );

    // Inject Process
    if (importStatement && !content.includes('ServiceProcess')) {
        content = content.replace(
            `import { Link } from 'react-router-dom';`,
            `import { Link } from 'react-router-dom';\n${importStatement}`
        );

        content = content.replace(
            targetComment,
            `{/* Step-by-step Process Section */}\n      ${injectionTag}\n\n      ${targetComment}`
        );
    }

    fs.writeFileSync(filePath, content, 'utf-8');
}

updateFile('WebDesignPage.jsx', `import { ServiceProcess, webDesignSteps } from '../ServiceProcess';`, `{/* Features Grid */}`, `<ServiceProcess accent={service.accent} steps={webDesignSteps} />`);
updateFile('DigitalMarketingPage.jsx', `import { ServiceProcess, digitalMarketingSteps } from '../ServiceProcess';`, `{/* Metrics Grid */}`, `<ServiceProcess accent={service.accent} steps={digitalMarketingSteps} />`);

console.log('Pages perfectly updated!');
