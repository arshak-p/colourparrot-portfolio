import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const creativesDir = path.join(__dirname, '../public/creatives');
const outputFile = path.join(__dirname, '../src/data/creativesData.js');

try {
  // 1. Read all files in public/creatives
  const files = fs.readdirSync(creativesDir).filter(f => f.match(/\.(webp|jpg|jpeg|png)$/i));

  // 2. Parse filenames to extract brand name
  // Expected format: "Nike,1.webp" -> Brand: "Nike"
  // Fallback: If no comma, use the whole filename minus extension
  const parsedData = files.map(filename => {
    let brandName = "Creative";
    if (filename.includes(',')) {
      brandName = filename.split(',')[0].trim();
    } else {
      brandName = path.parse(filename).name;
    }
    
    return {
      filename,
      brandName
    };
  });

  // 3. Generate JS Code
  const jsContent = `// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
// To update this file, add/rename images in public/creatives and run: npm run update-creatives

export const creativesList = ${JSON.stringify(parsedData, null, 2)};

// Exactly 10 per row for the HomePage as requested
export const row1Projects = creativesList.slice(0, 10).map((item, idx) => ({
  name: item.brandName,
  category: 'Creative Design',
  image: \`/creatives/\${item.filename}\`,
  ratio: idx % 2 === 0 ? 0.8 : 1.0
}));

export const row2Projects = creativesList.slice(10, 20).map((item, idx) => ({
  name: item.brandName,
  category: 'Creative Design',
  image: \`/creatives/\${item.filename}\`,
  ratio: idx % 2 === 0 ? 1.0 : 0.8
}));
`;

  // 4. Write to creativesData.js
  fs.writeFileSync(outputFile, jsContent, 'utf-8');
  console.log(`✅ Successfully generated creativesData.js with ${files.length} images!`);

} catch (error) {
  console.error('Error generating creatives data:', error);
}
