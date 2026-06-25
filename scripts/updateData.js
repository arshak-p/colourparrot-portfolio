const fs = require('fs');
const path = require('path');

const brandingDir = 'd:\\c p web\\colourparrot.com\\public\\branding';
const folders = fs.readdirSync(brandingDir).filter(f => fs.statSync(path.join(brandingDir, f)).isDirectory());

let items = [];

folders.forEach(folder => {
  const folderPath = path.join(brandingDir, folder);
  const files = fs.readdirSync(folderPath);
  
  const mainFile = files.find(f => f.toLowerCase().startsWith('main.'));
  const secondaryFile = files.find(f => f.toLowerCase().startsWith('secondary.'));
  
  // Grab all numbered files (1.jpg, 2.webp, etc) and sort them numerically
  const galleryFiles = files
    .filter(f => !f.toLowerCase().startsWith('main.') && !f.toLowerCase().startsWith('secondary.'))
    .sort((a, b) => {
      const numA = parseInt(a.split('.')[0]) || 0;
      const numB = parseInt(b.split('.')[0]) || 0;
      return numA - numB;
    })
    .map(f => `/branding/${folder}/${f}`);
  
  if (mainFile) {
    items.push({
      image: `/branding/${folder}/${mainFile}`,
      secondaryImage: secondaryFile ? `/branding/${folder}/${secondaryFile}` : null,
      gallery: galleryFiles,
      slug: folder.toLowerCase().replace(/ /g, '-'),
      link: `/brand/${folder.toLowerCase().replace(/ /g, '-')}`,
      title: folder.toUpperCase(),
      description: 'Brand identity and design guidelines.'
    });
  }
});

const fileContent = `export const brandingItems = ${JSON.stringify(items, null, 2)};`;
fs.writeFileSync('d:\\c p web\\colourparrot.com\\src\\data\\brandingData.js', fileContent);
console.log(`Successfully generated data for ${items.length} brands!`);
