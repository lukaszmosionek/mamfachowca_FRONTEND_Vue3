const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');
const htaccessSrc = path.join(__dirname, 'public', '.htaccess');
const htaccessDest = path.join(distDir, '.htaccess');

// Usuń atrybuty crossorigin z index.html
if (fs.existsSync(indexHtmlPath)) {
  let html = fs.readFileSync(indexHtmlPath, 'utf8');
  html = html.replace(/\s+crossorigin/g, '');
  fs.writeFileSync(indexHtmlPath, html);
  console.log('Removed crossorigin from index.html');
}

// Skopiuj .htaccess do dist
if (fs.existsSync(htaccessSrc)) {
  fs.copyFileSync(htaccessSrc, htaccessDest);
  console.log('Copied .htaccess to dist/');
}