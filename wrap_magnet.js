const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'src', 'components', 'services');
const pagesDir = path.join(__dirname, 'src', 'pages');

const oldStr = `<StarBorderBtn href="/services" color="rgba(255,255,255,0.3)">VIEW ALL SERVICES</StarBorderBtn>`;
const newStr = `<Magnet padding={80} disabled={false}>
              <StarBorderBtn href="/services" color="rgba(255,255,255,0.3)">VIEW ALL SERVICES</StarBorderBtn>
            </Magnet>`;

function updateFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf-8');

    if (content.includes(oldStr)) {
        // If it's already wrapped in Magnet, skip it
        if (content.includes(`<Magnet padding={80} disabled={false}>\n              <StarBorderBtn href="/services"`)) {
            return;
        }

        content = content.replaceAll(oldStr, newStr);
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Wrapped ${filePath}`);
    }
}

// Update all components/services files
['WebDesignPage.jsx', 'DigitalMarketingPage.jsx', 'VideoProductionPage.jsx', 'ContentCreationPage.jsx', 'CreativeAdvertisingPage.jsx'].forEach(file => {
    updateFile(path.join(servicesDir, file));
});

// Update ServiceDetailPage.jsx
updateFile(path.join(pagesDir, 'ServiceDetailPage.jsx'));

console.log('Magnet wrap complete.');
