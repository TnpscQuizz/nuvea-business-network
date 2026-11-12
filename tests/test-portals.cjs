const http = require('http');
const fs = require('fs');
const path = require('path');

const distAssets = fs.existsSync(path.join(__dirname, '../dist/assets')) 
  ? fs.readdirSync(path.join(__dirname, '../dist/assets'))
  : [];

const jsAsset = distAssets.find(f => f.endsWith('.js'));
const cssAsset = distAssets.find(f => f.endsWith('.css'));

const urls = [
  'http://localhost:3000/',
  jsAsset ? `http://localhost:3000/assets/${jsAsset}` : null,
  cssAsset ? `http://localhost:3000/assets/${cssAsset}` : null,
  'http://localhost:3000/admin/',
  'http://localhost:3000/business/',
  'http://localhost:3000/user/',
  'http://localhost:3000/api/state'
].filter(Boolean);

console.log('Testing React & Portals HTTP Responses:');

function testUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const pass = res.statusCode === 200;
        console.log(`[${pass ? 'PASS' : 'FAIL'}] ${url.padEnd(52)} -> HTTP ${res.statusCode} (${data.length} bytes)`);
        resolve(pass);
      });
    }).on('error', (err) => {
      console.log(`[ERR ] ${url} -> ${err.message}`);
      resolve(false);
    });
  });
}

(async () => {
  let allPass = true;
  for (const u of urls) {
    const ok = await testUrl(u);
    if (!ok) allPass = false;
  }
  process.exit(allPass ? 0 : 1);
})();
