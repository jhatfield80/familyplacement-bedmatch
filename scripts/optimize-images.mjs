#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const sourceDir = join(rootDir, 'source-images');
const outDir = join(rootDir, 'site/assets/images');

// Photos to optimize with their output sizes
const PHOTOS = [
  { input: 'hero.webp', outputs: [{ width: 1200, name: 'hero-1200' }, { width: 600, name: 'hero-600' }] },
  { input: 'logo.webp', outputs: [{ width: 600, name: 'logo-600' }] },
  { input: 'og-image.webp', outputs: [{ width: 1200, name: 'og-image' }] },
  { input: 'testimonial1.webp', outputs: [{ width: 400, name: 'testimonial1-400' }] },
  { input: 'testimonial2.webp', outputs: [{ width: 400, name: 'testimonial2-400' }] },
  { input: 'testimonial3.webp', outputs: [{ width: 400, name: 'testimonial3-400' }] }
];

async function optimizeImages() {
  try {
    const sharp = (await import('sharp')).default;
    
    console.log('🖼️  Optimizing images...\n');
    
    for (const photo of PHOTOS) {
      const inputPath = join(sourceDir, photo.input);
      
      if (!existsSync(inputPath)) {
        console.log(`⚠️  Skipping ${photo.input} (not found in source-images/)`);
        continue;
      }
      
      console.log(`📸 Processing ${photo.input}...`);
      
      for (const output of photo.outputs) {
        // AVIF format (best compression)
        const avifPath = join(outDir, `${output.name}.avif`);
        await sharp(inputPath)
          .resize(output.width, null, { withoutEnlargement: true })
          .avif({ quality: 80 })
          .toFile(avifPath);
        console.log(`   ✓ ${output.name}.avif (${output.width}px)`);
        
        // WebP format (fallback)
        const webpPath = join(outDir, `${output.name}.webp`);
        await sharp(inputPath)
          .resize(output.width, null, { withoutEnlargement: true })
          .webp({ quality: 82 })
          .toFile(webpPath);
        console.log(`   ✓ ${output.name}.webp (${output.width}px)`);
        
        // JPG format (final fallback, only for og-image)
        if (output.name === 'og-image') {
          const jpgPath = join(outDir, `${output.name}.jpg`);
          await sharp(inputPath)
            .resize(output.width, null, { withoutEnlargement: true })
            .jpeg({ quality: 85 })
            .toFile(jpgPath);
          console.log(`   ✓ ${output.name}.jpg (${output.width}px)`);
        }
      }
      console.log('');
    }
    
    // Generate favicons from logo
    const logoPath = join(sourceDir, 'logo.webp');
    if (existsSync(logoPath)) {
      console.log('🎨 Generating favicons...\n');
      
      // favicon.ico (32x32)
      await sharp(logoPath)
        .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .toFile(join(rootDir, 'site/favicon.ico'));
      console.log('   ✓ favicon.ico (32x32)');
      
      // favicon-32.png
      await sharp(logoPath)
        .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png()
        .toFile(join(rootDir, 'site/favicon-32.png'));
      console.log('   ✓ favicon-32.png');
      
      // apple-touch-icon.png (180x180)
      await sharp(logoPath)
        .resize(180, 180, { fit: 'contain', background: { r: 0, g: 102, b: 204, alpha: 1 } })
        .png()
        .toFile(join(rootDir, 'site/apple-touch-icon.png'));
      console.log('   ✓ apple-touch-icon.png (180x180)\n');
    }
    
    console.log('✅ Image optimization complete!\n');
    console.log('📁 Output: site/assets/images/');
    console.log('💡 Tip: Update HTML <picture> elements if you added new images\n');
    
  } catch (error) {
    console.error('❌ Error optimizing images:', error.message);
    console.log('\n💡 Make sure sharp is installed: npm i --no-save sharp\n');
    process.exit(1);
  }
}

optimizeImages();
