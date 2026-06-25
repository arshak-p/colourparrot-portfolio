const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../public/branding');
const SLUGS = ['aptitude', 'healthicart', 'liara', 'nuvana', 'taiwo', 'topnotch', 'aidenx', 'fobas', 'alfawz'];

function getAllFiles(d) {
  let res = [];
  const list = fs.readdirSync(d, { withFileTypes: true });
  for (const entry of list) {
    const full = path.join(d, entry.name);
    if (entry.isDirectory()) res = res.concat(getAllFiles(full));
    else res.push(full);
  }
  return res;
}

async function run() {
  const allFiles = getAllFiles(dir).filter(f => /\.webp$/i.test(f));
  const targetFiles = allFiles.filter(f => SLUGS.some(slug => f.toLowerCase().includes(slug)));
  
  console.log(`Found ${targetFiles.length} files to resize`);
  
  for (const filePath of targetFiles) {
    const buffer = fs.readFileSync(filePath);
    const metadata = await sharp(buffer).metadata();
    console.log(`${path.basename(filePath)}: ${metadata.width}x${metadata.height}`);
    
    if (metadata.width > 900) {
      const resized = await sharp(buffer)
        .resize({ width: 900, withoutEnlargement: true })
        .webp({ quality: 70 })
        .toBuffer();
      fs.writeFileSync(filePath, resized);
      const newSizeKB = Math.round(resized.length / 1024);
      console.log(`  -> resized to 900px wide, new size: ${newSizeKB}KB`);
    } else {
      console.log(`  -> already small enough, skipping`);
    }
  }
  console.log('Done!');
}

run();
