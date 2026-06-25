const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT_FOLDERS = [
  path.join(__dirname, '../public'),
  path.join(__dirname, '../src/assets'),
];

const SKIP_FOLDERS = ['experiment-frames'];
const SKIP_EXTENSIONS = ['.webp', '.svg', '.gif'];

function getAllFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    if (SKIP_FOLDERS.includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

async function convertFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (SKIP_EXTENSIONS.includes(ext)) return null;
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return null;

  const webpPath = filePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  if (fs.existsSync(webpPath)) return null;

  try {
    const buffer = fs.readFileSync(filePath);
    const oldSizeKB = Math.round(buffer.length / 1024);
    const output = await sharp(buffer).webp({ quality: 80 }).toBuffer();
    fs.writeFileSync(webpPath, output);
    const newSizeKB = Math.round(output.length / 1024);
    console.log(`${path.basename(filePath)}: ${oldSizeKB}KB -> ${path.basename(webpPath)}: ${newSizeKB}KB`);
    return { original: filePath, webp: webpPath };
  } catch (e) {
    console.error(`Failed: ${filePath}`, e.message);
    return null;
  }
}

async function run() {
  let allFiles = [];
  for (const folder of ROOT_FOLDERS) {
    allFiles = allFiles.concat(getAllFiles(folder));
  }

  console.log(`Found ${allFiles.length} total files to check\n`);
  const converted = [];

  for (const file of allFiles) {
    const result = await convertFile(file);
    if (result) converted.push(result);
  }

  console.log(`\nConverted ${converted.length} files to WebP.`);
  console.log('Original PNG/JPG files were kept as backup — not deleted.');
  fs.writeFileSync(
    path.join(__dirname, 'converted-files-log.json'),
    JSON.stringify(converted, null, 2)
  );
  console.log('Saved a log of all converted files to scripts/converted-files-log.json');
}

run();
