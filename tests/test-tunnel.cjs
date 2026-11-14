const https = require('https');

https.get('https://685e05ea6882c1.lhr.life', (res) => {
  console.log('Tunnel Status Code:', res.statusCode);
  process.exit(res.statusCode === 200 ? 0 : 1);
}).on('error', (err) => {
  console.error('Tunnel Error:', err.message);
  process.exit(1);
});
