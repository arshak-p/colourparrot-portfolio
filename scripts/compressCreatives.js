const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const FOLDERS = [
  path.join(__dirname, '../public/creatives'),
  path.join(__dirname, '../public/branding'),
];
const MAX_KB = 150;

async function compressFolder(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      await compressFolder(filePath);
      continue;
    }
    if (!/\.(webp|jpg|jpeg|png)$/i.test(file.name)) continue;
    const sizeKB = fs.statSync(filePath).size / 1024;
    if (sizeKB <= MAX_KB) continue;
    console.log(`Compressing ${file.name} (${Math.round(sizeKB)}KB)...`);
    const tempPath = filePath + '.tmp';
    try {
      const buffer = fs.readFileSync(filePath);
      await sharp(buffer)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 55 })
        .toFile(tempPath);
      fs.renameSync(tempPath, filePath);
      const newKB = Math.round(fs.statSync(filePath).size / 1024);
      console.log(`  Done: ${newKB}KB`);
    } catch (e) {
      console.error(`  Error: ${file.name}`, e.message);
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
  }
}

async function run() {
  for (const folder of FOLDERS) {
    console.log(`\nProcessing: ${folder}`);
    await compressFolder(folder);
  }
  console.log('\nAll done!');
}

run();
