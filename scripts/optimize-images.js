const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function optimizeImages() {
  const imageDir = './public/assets/images';
  const extensions = ['.jpg', '.jpeg', '.png'];
  
  console.log('Starting image optimization...');
  
  try {
    const files = await getImageFiles(imageDir, extensions);
    let optimizedCount = 0;
    
    for (const file of files) {
      try {
        const inputPath = file;
        const ext = path.extname(file).toLowerCase();
        const outputPath = file.replace(new RegExp(`${ext}$`), '.webp');
        
        // Skip if WebP already exists and is newer
        try {
          const inputStat = await fs.stat(inputPath);
          const outputStat = await fs.stat(outputPath);
          if (outputStat.mtime > inputStat.mtime) {
            continue;
          }
        } catch {
          // Output doesn't exist, proceed with optimization
        }
        
        await sharp(inputPath)
          .webp({ 
            quality: 80,
            effort: 6
          })
          .toFile(outputPath);
          
        // Also create optimized original format
        const optimizedOriginal = file.replace(new RegExp(`${ext}$`), `-opt${ext}`);
        await sharp(inputPath)
          .jpeg({ quality: 85, progressive: true })
          .png({ compressionLevel: 9, progressive: true })
          .toFile(optimizedOriginal);
        
        optimizedCount++;
        console.log(`✓ Optimized: ${path.relative(imageDir, file)}`);
      } catch (error) {
        console.error(`✗ Failed to optimize ${file}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Optimization complete! Processed ${optimizedCount} images.`);
    
    // Generate image manifest for lazy loading
    await generateImageManifest(imageDir);
    
  } catch (error) {
    console.error('Error during image optimization:', error);
    process.exit(1);
  }
}

async function getImageFiles(dir, extensions, fileList = []) {
  const files = await fs.readdir(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);
    
    if (stat.isDirectory()) {
      await getImageFiles(filePath, extensions, fileList);
    } else if (extensions.includes(path.extname(file).toLowerCase())) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

async function generateImageManifest(imageDir) {
  const files = await getImageFiles(imageDir, ['.webp', '.jpg', '.jpeg', '.png']);
  const manifest = {};
  
  for (const file of files) {
    const relativePath = path.relative('./public', file);
    const key = relativePath.replace(/\\/g, '/');
    
    try {
      const metadata = await sharp(file).metadata();
      manifest[key] = {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: (await fs.stat(file)).size
      };
    } catch (error) {
      console.warn(`Could not read metadata for ${file}`);
    }
  }
  
  await fs.writeFile('./public/assets/image-manifest.json', JSON.stringify(manifest, null, 2));
  console.log('✓ Generated image manifest');
}

// Run if called directly
if (require.main === module) {
  optimizeImages().catch(console.error);
}

module.exports = { optimizeImages };
