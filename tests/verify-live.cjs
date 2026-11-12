const http = require('http');

http.get('http://localhost:3000', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Includes 🏠 Home:', data.includes('<span>🏠 Home</span>'));
    console.log('tab-meeting removed:', !data.includes('tab-meeting'));
    console.log('Inter font included:', data.includes('family=Inter'));
    console.log('Category Exclusivity in Nav:', data.includes('Category Exclusivity'));
    console.log('Chapters & Seats in Nav:', data.includes('Chapters & Seats'));
  });
});
