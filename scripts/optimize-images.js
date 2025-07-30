#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Script para optimizar imágenes
// Este script debe ejecutarse manualmente para optimizar las imágenes

const LOVABLE_UPLOADS_DIR = path.join(__dirname, '..', 'public', 'lovable-uploads');
const MAX_SIZE_KB = 200; // 200KB máximo por imagen

function analyzeImages() {
  if (!fs.existsSync(LOVABLE_UPLOADS_DIR)) {
    console.log('❌ Directorio lovable-uploads no encontrado');
    return;
  }

  const files = fs.readdirSync(LOVABLE_UPLOADS_DIR);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|webp)$/i.test(file)
  );

  console.log(`📊 Análisis de ${imageFiles.length} imágenes:\n`);

  let totalSize = 0;
  let oversizedImages = [];

  imageFiles.forEach(file => {
    const filePath = path.join(LOVABLE_UPLOADS_DIR, file);
    const stats = fs.statSync(filePath);
    const sizeKB = Math.round(stats.size / 1024);
    totalSize += sizeKB;

    console.log(`📄 ${file}: ${sizeKB}KB`);

    if (sizeKB > MAX_SIZE_KB) {
      oversizedImages.push({ file, size: sizeKB });
    }
  });

  console.log(`\n📈 Tamaño total: ${Math.round(totalSize / 1024)}MB`);
  console.log(`📈 Tamaño promedio: ${Math.round(totalSize / imageFiles.length)}KB`);

  if (oversizedImages.length > 0) {
    console.log(`\n⚠️  ${oversizedImages.length} imágenes exceden ${MAX_SIZE_KB}KB:`);
    oversizedImages.forEach(({ file, size }) => {
      console.log(`   - ${file}: ${size}KB`);
    });
  } else {
    console.log(`\n✅ Todas las imágenes están dentro del límite de ${MAX_SIZE_KB}KB`);
  }

  // Recomendaciones
  console.log('\n💡 Recomendaciones de optimización:');
  console.log('   1. Convertir JPEGs grandes a WebP');
  console.log('   2. Comprimir imágenes sin perder calidad visual');
  console.log('   3. Redimensionar imágenes a resoluciones apropiadas');
  console.log('   4. Implementar responsive images con srcset');
  
  // Generar configuración de imágenes responsivas
  generateResponsiveConfig(imageFiles);
}

function generateResponsiveConfig(imageFiles) {
  const config = {
    images: imageFiles.map(file => ({
      src: `/lovable-uploads/${file}`,
      sizes: {
        mobile: '375w',
        tablet: '768w',
        desktop: '1200w'
      },
      formats: ['webp', 'jpg'],
      quality: 80
    }))
  };

  const configPath = path.join(__dirname, '..', 'src', 'config', 'images.json');
  const configDir = path.dirname(configPath);
  
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`\n📝 Configuración de imágenes generada en: ${configPath}`);
}

// Ejecutar análisis
analyzeImages();