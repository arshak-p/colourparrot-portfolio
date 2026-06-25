const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const FOLDERS = [
  { dir: path.join(__dirname, '../public/branding'), maxWidth: 900, quality: 70 },
  { dir: path.join(__dirname, '../public/logos'), maxWidth: 300, quality: 75 },
];

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

async function processFolder(dir, maxWidth, quality) {
  if (!fs.existsSync(dir)) {
    console.log(`Skipping missing folder: ${dir}`);
    return;
  }
  const files = getAllFiles(dir).filter(f => /\.(webp|png|jpg|jpeg)$/i.test(f));
  console.log(`\nProcessing ${files.length} files in ${dir}`);

  for (const filePath of files) {
    try {
      const buffer = fs.readFileSync(filePath);
      const metadata = await sharp(buffer).metadata();
      const sizeKB = Math.round(buffer.length / 1024);

      if (metadata.width <= maxWidth && sizeKB <= 150) {
        continue;
      }

      const ext = path.extname(filePath).toLowerCase();
      let pipeline = sharp(buffer).resize({ width: maxWidth, withoutEnlargement: true });

      if (ext === '.png') {
        pipeline = pipeline.png({ quality, compressionLevel: 9 });
      } else {
        pipeline = pipeline.webp({ quality });
      }

      const output = await pipeline.toBuffer();
      fs.writeFileSync(filePath, output);
      const newKB = Math.round(output.length / 1024);
      console.log(`${path.basename(filePath)}: ${sizeKB}KB (${metadata.width}px) -> ${newKB}KB`);
    } catch (e) {
      console.error(`Error processing ${filePath}:`, e.message);
    }
  }
}

async function run() {
  for (const folder of FOLDERS) {
    await processFolder(folder.dir, folder.maxWidth, folder.quality);
  }
  console.log('\nAll done!');
}

run();
