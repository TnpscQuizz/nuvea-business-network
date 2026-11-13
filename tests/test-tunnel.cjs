const https = require('https');

https.get('https://f8233ca0a46f56.lhr.life', (res) => {
  console.log('Tunnel Status Code:', res.statusCode);
  process.exit(res.statusCode === 200 ? 0 : 1);
}).on('error', (err) => {
  console.error('Tunnel Error:', err.message);
  process.exit(1);
});
