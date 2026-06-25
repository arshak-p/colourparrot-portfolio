const fs = require('fs');
const path = require('path');

const brandingDir = 'd:\\c p web\\colourparrot.com\\public\\branding';
const folders = fs.readdirSync(brandingDir).filter(f => fs.statSync(path.join(brandingDir, f)).isDirectory());

let totalRenamed = 0;

folders.forEach(folder => {
  const folderPath = path.join(brandingDir, folder);
  const files = fs.readdirSync(folderPath).filter(f => fs.statSync(path.join(folderPath, f)).isFile());
  
  // Filter out main and secondary
  const filesToRename = files.filter(f => {
    const lower = f.toLowerCase();
    return !lower.startsWith('main.') && !lower.startsWith('secondary.');
  });
  
  // Sort them alphabetically to keep order consistent
  filesToRename.sort();

  // First pass: rename to temporary names to avoid any naming collisions (e.g. if 1.jpg already exists)
  let counter = 1;
  filesToRename.forEach(file => {
    const ext = path.extname(file);
    const oldPath = path.join(folderPath, file);
    const tempPath = path.join(folderPath, `__temp_${counter}${ext}`);
    fs.renameSync(oldPath, tempPath);
    counter++;
  });
});

// Second pass: remove the __temp_ prefix
folders.forEach(folder => {
  const folderPath = path.join(brandingDir, folder);
  const files = fs.readdirSync(folderPath);
  
  files.forEach(file => {
    if (file.startsWith('__temp_')) {
      const finalName = file.replace('__temp_', '');
      fs.renameSync(path.join(folderPath, file), path.join(folderPath, finalName));
      totalRenamed++;
    }
  });
});

console.log(`Successfully renamed ${totalRenamed} files!`);
