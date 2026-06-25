const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

// 1. Logos
const logosDir = path.join(publicDir, 'logos');
if (fs.existsSync(logosDir)) {
    const files = fs.readdirSync(logosDir);
    files.forEach(file => {
        if (!file.match(/\.(png|jpg|webp|jpeg)$/i)) return;
        let baseName = file.replace(/\.(png|jpg|webp|jpeg)$/i, '');
        if (!baseName.endsWith('-logo')) {
            const ext = path.extname(file);
            const newName = `${baseName}-logo${ext}`;
            fs.renameSync(path.join(logosDir, file), path.join(logosDir, newName));
        }
    });

    const newLogos = fs.readdirSync(logosDir).filter(f => f.match(/\.(png|jpg|webp|jpeg)$/i));
    const logosContent = `export const clientLogosList = ${JSON.stringify(newLogos, null, 2)}.map((filename, index) => {
  let cleanName = filename.replace(/\\.[^/.]+$/, '').replace(/-/g, ' ').replace(' logo', '');
  cleanName = cleanName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return {
    id: index + 1,
    src: \`/logos/\${filename}\`,
    alt: cleanName
  }
});
`;
    fs.writeFileSync(path.join(__dirname, 'src', 'data', 'logosData.js'), logosContent);
}

// 2. Creatives
const creativesDir = path.join(publicDir, 'creatives');
if (fs.existsSync(creativesDir)) {
    const files = fs.readdirSync(creativesDir);
    files.forEach(file => {
        if (!file.match(/\.(png|jpg|webp|jpeg)$/i)) return;
        let baseName = file.replace(/\.(png|jpg|webp|jpeg)$/i, '');
        if (baseName.includes('-creative')) return;
        
        let newName = '';
        if (baseName.includes(',')) {
            const parts = baseName.split(',');
            const brand = parts[0].trim();
            const num = parts[1].trim();
            newName = `${brand}-creative-${num}${path.extname(file)}`;
        } else {
            newName = `${baseName}-creative${path.extname(file)}`;
        }
        fs.renameSync(path.join(creativesDir, file), path.join(creativesDir, newName));
    });

    const newCreatives = fs.readdirSync(creativesDir).filter(f => f.match(/\.(png|jpg|webp|jpeg)$/i));
    const creativesContent = `export const creativesList = ${JSON.stringify(newCreatives, null, 2)}.map((filename, i) => {
  let cleanName = filename.replace(/\\.[^/.]+$/, '').replace(/-/g, ' ').replace(' creative', '');
  return {
    image: \`/creatives/\${filename}\`,
    caption: cleanName,
    tags: ['Creative Advertising']
  };
});
`;
    fs.writeFileSync(path.join(__dirname, 'src', 'data', 'creativesData.js'), creativesContent);
}

// 3. Branding
const brandingDir = path.join(publicDir, 'branding');
if (fs.existsSync(brandingDir)) {
    const folders = fs.readdirSync(brandingDir);
    folders.forEach(folder => {
        const folderPath = path.join(brandingDir, folder);
        if (fs.statSync(folderPath).isDirectory()) {
            const files = fs.readdirSync(folderPath);
            files.forEach(file => {
                if (!file.match(/\.(png|jpg|webp|jpeg)$/i)) return;
                let baseName = file.replace(/\.(png|jpg|webp|jpeg)$/i, '');
                if (baseName.includes('-brand')) return;
                
                const newName = `${folder}-brand-${baseName}${path.extname(file)}`;
                fs.renameSync(path.join(folderPath, file), path.join(folderPath, newName));
            });
        }
    });

    let brandingDataPath = path.join(__dirname, 'src', 'data', 'brandingData.js');
    if (fs.existsSync(brandingDataPath)) {
        let brandingData = fs.readFileSync(brandingDataPath, 'utf-8');
        brandingData = brandingData.replace(/\/branding\/([^/]+)\/([^/]+)\.(webp|jpg|png|jpeg)/gi, (match, folder, file, ext) => {
            if (file.includes('-brand-')) return match;
            return `/branding/${folder}/${folder}-brand-${file}.${ext}`;
        });
        fs.writeFileSync(brandingDataPath, brandingData);
    }
}

console.log("Renaming complete and data files updated.");
