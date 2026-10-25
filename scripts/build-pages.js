// AgentShield AI — GitHub Pages Static Packaging Script
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const CLIENT_DIR = path.join(ROOT_DIR, 'src', 'client');
const ASSETS_DIR = path.join(ROOT_DIR, 'assets');
const OUTPUT_DIR = path.join(ROOT_DIR, 'dist-pages');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('📦 Starting GitHub Pages static asset bundling...');

// 1. Prepare output directory
if (fs.existsSync(OUTPUT_DIR)) {
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
}
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// 2. Copy client frontend files
console.log('🚚 Copying src/client/ files to dist-pages/...');
copyRecursive(CLIENT_DIR, OUTPUT_DIR);

// 3. Copy assets directory
console.log('🎨 Copying assets/ to dist-pages/assets/...');
const destAssetsDir = path.join(OUTPUT_DIR, 'assets');
copyRecursive(ASSETS_DIR, destAssetsDir);

// 4. Create .nojekyll file to prevent Jekyll from ignoring underscore or dot files
fs.writeFileSync(path.join(OUTPUT_DIR, '.nojekyll'), '');
console.log('⚙️ Created .nojekyll flag file.');

// 5. Verification
const generatedFiles = [];
function listFiles(dir, prefix = '') {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relPath = path.join(prefix, item);
    if (fs.statSync(fullPath).isDirectory()) {
      listFiles(fullPath, relPath);
    } else {
      generatedFiles.push(relPath);
    }
  }
}
listFiles(OUTPUT_DIR);

console.log('✅ GitHub Pages build complete!');
console.log(`📁 Total packaged files: ${generatedFiles.length}`);
console.log('----------------------------------------------------');
generatedFiles.forEach(f => console.log(`  • ${f}`));
console.log('----------------------------------------------------');
