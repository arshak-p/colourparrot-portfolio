const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, 'public');
const dirsToScan = ['logos', 'creatives', 'branding'];

async function processDirectory(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
            await processDirectory(itemPath);
        } else if (stat.isFile() && item.match(/\.(png|jpe?g)$/i)) {
            const ext = path.extname(item);
            const baseName = path.basename(item, ext);
            const webpPath = path.join(dir, `${baseName}.webp`);

            try {
                await sharp(itemPath)
                    .webp({ quality: 80, effort: 4 })
                    .toFile(webpPath);
                
                // Delete original file
                fs.unlinkSync(itemPath);
                console.log(`Converted and deleted: ${itemPath} -> ${webpPath}`);
            } catch (err) {
                console.error(`Error processing ${itemPath}:`, err);
            }
        }
    }
}

async function run() {
    for (const d of dirsToScan) {
        const fullPath = path.join(publicDir, d);
        if (fs.existsSync(fullPath)) {
            console.log(`Processing directory: ${fullPath}`);
            await processDirectory(fullPath);
        }
    }

    // Update data files to change .png/.jpg to .webp
    const dataFiles = [
        path.join(__dirname, 'src', 'data', 'logosData.js'),
        path.join(__dirname, 'src', 'data', 'creativesData.js'),
        path.join(__dirname, 'src', 'data', 'brandingData.js')
    ];

    for (const file of dataFiles) {
        if (fs.existsSync(file)) {
            let content = fs.readFileSync(file, 'utf8');
            // This regex ensures we only target known image extensions inside the strings.
            content = content.replace(/\.(png|jpg|jpeg)(['"`])/gi, '.webp$2');
            fs.writeFileSync(file, content);
            console.log(`Updated extensions in ${file}`);
        }
    }
    
    console.log("All conversions complete!");
}

run().catch(console.error);
