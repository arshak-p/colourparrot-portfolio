const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'src', 'components', 'services');
const pagesDir = path.join(__dirname, 'src', 'pages');

const oldButton = `<Link to="/services" style={{ 
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

const newButton = `<StarBorderBtn href="/services" color="rgba(255,255,255,0.3)">VIEW ALL SERVICES</StarBorderBtn>`;

function updateFile(filePath, isPage) {
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf-8');

    if (content.includes(oldButton)) {
        content = content.replaceAll(oldButton, newButton);
        
        // ensure StarBorderBtn is imported
        if (!content.includes('StarBorderBtn')) {
            const importPath = isPage ? `import StarBorderBtn from '../components/StarBorderBtn';` : `import StarBorderBtn from '../StarBorderBtn';`;
            content = content.replace(`import { Link }`, `import { Link }\n${importPath}`);
            // if no import { Link }, try just adding it at top
            if (!content.includes(`import { Link }`)) {
                content = `${importPath}\n` + content;
            }
        }
        
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated ${filePath}`);
    }
}

// Update all components/services files
['WebDesignPage.jsx', 'DigitalMarketingPage.jsx', 'VideoProductionPage.jsx', 'ContentCreationPage.jsx', 'CreativeAdvertisingPage.jsx'].forEach(file => {
    updateFile(path.join(servicesDir, file), false);
});

// Update ServiceDetailPage.jsx
updateFile(path.join(pagesDir, 'ServiceDetailPage.jsx'), true);

console.log('Button update complete.');
