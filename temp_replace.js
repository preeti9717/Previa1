// Script to replace all #8B45FF with #00D4FF
const fs = require('fs');

// Update HTML file
let htmlContent = fs.readFileSync('index.html', 'utf8');
htmlContent = htmlContent.replace(/#8B45FF/g, '#00D4FF');
fs.writeFileSync('index.html', htmlContent);

// Update JS file
let jsContent = fs.readFileSync('script1.js', 'utf8');
jsContent = jsContent.replace(/#8B45FF/g, '#00D4FF');
fs.writeFileSync('script1.js', jsContent);

console.log('Updated all play button colors to cyan');