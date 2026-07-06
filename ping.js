const https = require('https');

const URL = 'https://opaquepixel-api.onrender.com/api/health';
const INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

console.log(`[${new Date().toISOString()}] Root OpaquePixel Keep-Alive monitor started.`);
console.log(`Target: ${URL}`);
console.log(`Interval: every 10 minutes`);

function pingBackend() {
  https.get(URL, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log(`[${new Date().toISOString()}] Ping Succeeded! Status Code: ${res.statusCode} | Response: ${data.trim()}`);
    });
  }).on('error', (err) => {
    console.error(`[${new Date().toISOString()}] Ping Failed:`, err.message);
  });
}

// Ping immediately on start
pingBackend();

// Set interval to ping periodically
setInterval(pingBackend, INTERVAL_MS);
