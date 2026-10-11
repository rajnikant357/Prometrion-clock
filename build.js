/**
 * Production Build Script for Online clock (Prometrion)
 * Generates the clean, deployable `dist/` directory for Vercel, Netlify, Cloudflare Pages, or static hosting.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const DIST_PUBLIC_DIR = path.join(DIST_DIR, 'public');

console.log('🚀 Building Online clock for Vercel deployment...');

// 1. Clean and prepare dist directory
if (fs.existsSync(DIST_DIR)) {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DIST_DIR, { recursive: true });
fs.mkdirSync(DIST_PUBLIC_DIR, { recursive: true });

// 2. Define root files to copy to dist
const rootFiles = [
  'index.html',
  'styles.css',
  'app.js',
  'app-info.js',
  'manifest.json',
  'robots.txt',
  'sitemap.xml',
  'vercel.json',
  'prometrion-logo.png',
  'prometrion-logo.svg'
];

let copiedCount = 0;

for (const file of rootFiles) {
  const srcPath = path.join(ROOT_DIR, file);
  if (fs.existsSync(srcPath)) {
    const destPath = path.join(DIST_DIR, file);
    fs.copyFileSync(srcPath, destPath);
    copiedCount++;
  } else {
    console.warn(`⚠️ Warning: Source file ${file} not found.`);
  }
}

// 3. Ensure favicon.ico exists in dist root for direct browser requests
const logoPngSrc = path.join(ROOT_DIR, 'prometrion-logo.png');
if (fs.existsSync(logoPngSrc)) {
  fs.copyFileSync(logoPngSrc, path.join(DIST_DIR, 'favicon.ico'));
}

// 4. Copy all assets from public/ into dist/public/
if (fs.existsSync(PUBLIC_DIR)) {
  const publicFiles = fs.readdirSync(PUBLIC_DIR);
  for (const file of publicFiles) {
    const src = path.join(PUBLIC_DIR, file);
    const dest = path.join(DIST_PUBLIC_DIR, file);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dest);
      copiedCount++;

      // If filename has spaces, also provide URL-encoded alias for strict Linux HTTP servers
      if (file.includes(' ')) {
        const encodedName = encodeURIComponent(file);
        fs.copyFileSync(src, path.join(DIST_PUBLIC_DIR, encodedName));
      }
    }
  }
}

// Also ensure prometrion logos are accessible in dist/public/
if (fs.existsSync(logoPngSrc)) {
  fs.copyFileSync(logoPngSrc, path.join(DIST_PUBLIC_DIR, 'prometrion-logo.png'));
}
const logoSvgSrc = path.join(ROOT_DIR, 'prometrion-logo.svg');
if (fs.existsSync(logoSvgSrc)) {
  fs.copyFileSync(logoSvgSrc, path.join(DIST_PUBLIC_DIR, 'prometrion-logo.svg'));
}

// 5. Verification & Summary
console.log('\n📦 Verifying build artifacts in dist/:');
const distFiles = fs.readdirSync(DIST_DIR);
let totalBytes = 0;

for (const f of distFiles) {
  const fullPath = path.join(DIST_DIR, f);
  const stat = fs.statSync(fullPath);
  if (stat.isFile()) {
    totalBytes += stat.size;
    const kb = (stat.size / 1024).toFixed(2);
    console.log(`  ✓ dist/${f} (${kb} KB)`);
  } else if (stat.isDirectory()) {
    const subFiles = fs.readdirSync(fullPath);
    for (const sf of subFiles) {
      const subStat = fs.statSync(path.join(fullPath, sf));
      totalBytes += subStat.size;
      const kb = (subStat.size / 1024).toFixed(2);
      console.log(`  ✓ dist/${f}/${sf} (${kb} KB)`);
    }
  }
}

const totalKb = (totalBytes / 1024).toFixed(2);
console.log(`\n✨ Build complete! Total size: ${totalKb} KB. Ready for Vercel deployment.`);
