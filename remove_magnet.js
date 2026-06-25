const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'src', 'components', 'services');
const pagesDir = path.join(__dirname, 'src', 'pages');

const targetStr = `<Magnet padding={80} disabled={false}>
              <StarBorderBtn href="/services" color="rgba(255,255,255,0.3)">VIEW ALL SERVICES</StarBorderBtn>
            </Magnet>`;
const replacementStr = `<StarBorderBtn href="/services" color="rgba(255,255,255,0.3)">VIEW ALL SERVICES</StarBorderBtn>`;

const targetStr2 = `<Magnet padding={80} disabled={false}>
            <StarBorderBtn href="/services" color="rgba(255,255,255,0.3)">VIEW ALL SERVICES</StarBorderBtn>
            </Magnet>`;

const targetStr3 = `<Magnet padding={80} disabled={false}>
            <StarBorderBtn href="/services" color="rgba(255,255,255,0.3)">VIEW ALL SERVICES</StarBorderBtn>
          </Magnet>`;

function updateFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    content = content.replaceAll(targetStr, replacementStr);
    content = content.replaceAll(targetStr2, replacementStr);
    content = content.replaceAll(targetStr3, replacementStr);

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Unwrapped ${filePath}`);
    }
}

// Update all components/services files
['WebDesignPage.jsx', 'DigitalMarketingPage.jsx', 'VideoProductionPage.jsx', 'ContentCreationPage.jsx', 'CreativeAdvertisingPage.jsx'].forEach(file => {
    updateFile(path.join(servicesDir, file));
});

// Update ServiceDetailPage.jsx
updateFile(path.join(pagesDir, 'ServiceDetailPage.jsx'));

console.log('Magnet unwrap complete.');
