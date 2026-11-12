const https = require('https');

https.get('https://af5f6f49f46e4d.lhr.life/', { timeout: 10000 }, (res) => {
  console.log('Tunnel Status Code:', res.statusCode);
  process.exit(0);
}).on('error', (err) => {
  console.error('Tunnel Error:', err.message);
  process.exit(1);
});
