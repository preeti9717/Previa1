const fs = require('fs');

// Update HTML file
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/play1\.png/g, 'playB.png');
fs.writeFileSync('index.html', html);

// Update JS file
let js = fs.readFileSync('script1.js', 'utf8');
js = js.replace(/play1\.png/g, 'playB.png');
fs.writeFileSync('script1.js', js);

console.log('Replaced play1.png with playB.png');