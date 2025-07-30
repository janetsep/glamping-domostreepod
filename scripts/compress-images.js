#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOVABLE_UPLOADS_DIR = path.join(__dirname, '..', 'public', 'lovable-uploads');
const MAX_SIZE_KB = 200;

// Lista de las 10 imágenes más pesadas (>1MB)
const HEAVY_IMAGES = [
  '0aba3582-f7e0-478e-b316-3893d4cebacc.png', // 3031KB
  '15e939f8-681c-4a2e-a19a-8cace70e9e38.png', // 2958KB
  '8c94b429-4fba-49f4-a9e1-9d5970782bba.png', // 2284KB
  '81cdaf67-2cb9-460d-a5ca-e57298d3d700.png', // 2264KB
  '7202eec3-bd82-4939-90a9-0a6509fa2af0.png', // 2054KB
  '9e606128-1db3-42ce-b1ca-0474a875279f.png', // 1788KB
  'f0a226af-4b5a-47f8-9a16-71ebc00d5039.png', // 1603KB
  '3f3be815-8b79-44fa-89b0-d3d4f795e9a7.png', // 1528KB
  '53b31073-a4c8-4648-acc3-ba3fcd021375.png', // 1528KB
  'a12a8e24-f99f-48c6-9bc2-eea9e8df4ef5.png'  // 1483KB
];

function analyzeHeavyImages() {
  console.log('🔍 Analizando las 10 imágenes más pesadas...\n');
  
  let totalSize = 0;
  const existingImages = [];
  
  HEAVY_IMAGES.forEach(filename => {
    const filePath = path.join(LOVABLE_UPLOADS_DIR, filename);
    
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const sizeKB = Math.round(stats.size / 1024);
      totalSize += sizeKB;
      existingImages.push({ filename, sizeKB });
      
      console.log(`📄 ${filename}: ${sizeKB}KB`);
    } else {
      console.log(`❌ ${filename}: No encontrada`);
    }
  });
  
  console.log(`\n📈 Tamaño total de las 10 más pesadas: ${Math.round(totalSize / 1024)}MB`);
  console.log(`📈 Reducción potencial si comprimimos a ${MAX_SIZE_KB}KB: ${Math.round((totalSize - (existingImages.length * MAX_SIZE_KB)) / 1024)}MB\n`);
  
  generateOptimizationScript(existingImages);
}

function generateOptimizationScript(images) {
  const compressionCommands = images.map(({ filename }) => {
    const inputPath = path.join(LOVABLE_UPLOADS_DIR, filename);
    const outputPath = path.join(LOVABLE_UPLOADS_DIR, filename.replace('.png', '_optimized.png'));
    
    // Comandos para diferentes herramientas de compresión
    return {
      filename,
      // ImageMagick (si está instalado)
      imageMagick: `magick "${inputPath}" -quality 80 -resize 1200x1200> "${outputPath}"`,
      // pngquant (herramienta especializada en PNG)
      pngquant: `pngquant --quality=65-80 --output "${outputPath}" "${inputPath}"`,
      // Online service equivalente
      online: `# Para ${filename}: usar https://tinypng.com o https://squoosh.app`
    };
  });
  
  console.log('💡 Scripts de optimización generados:\n');
  console.log('=== OPCIÓN 1: ImageMagick (si está instalado) ===');
  compressionCommands.forEach(cmd => {
    console.log(cmd.imageMagick);
  });
  
  console.log('\n=== OPCIÓN 2: pngquant (herramienta especializada) ===');
  compressionCommands.forEach(cmd => {
    console.log(cmd.pngquant);
  });
  
  console.log('\n=== OPCIÓN 3: Servicios online ===');
  compressionCommands.forEach(cmd => {
    console.log(cmd.online);
  });
  
  console.log('\n📋 Instrucciones:');
  console.log('1. Instala ImageMagick: brew install imagemagick (Mac) o apt-get install imagemagick (Linux)');
  console.log('2. O instala pngquant: brew install pngquant (Mac) o apt-get install pngquant (Linux)');
  console.log('3. O usa servicios online como TinyPNG.com para comprimir manualmente');
  console.log('4. Reemplaza los archivos originales con las versiones optimizadas');
  console.log('5. Ejecuta npm run build para verificar que todo funciona');
  
  // Generar archivo de comandos
  const scriptContent = compressionCommands.map(cmd => cmd.imageMagick).join('\n');
  const scriptPath = path.join(__dirname, 'optimize-heavy-images.sh');
  
  fs.writeFileSync(scriptPath, `#!/bin/bash\n\n# Script para optimizar las 10 imágenes más pesadas\n\n${scriptContent}\n\necho "✅ Optimización completada. Verifica los archivos *_optimized.png"\n`);
  
  console.log(`\n📝 Script bash generado: ${scriptPath}`);
  console.log('   Ejecuta: chmod +x scripts/optimize-heavy-images.sh && ./scripts/optimize-heavy-images.sh');
}

// Ejecutar análisis
analyzeHeavyImages();