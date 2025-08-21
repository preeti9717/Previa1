const fs = require('fs');

// Replace in HTML
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/<svg[^>]*>[\s\S]*?<\/svg>/g, '<img src="play1.png" alt="play" />');
fs.writeFileSync('index.html', html);

// Replace in JS
let js = fs.readFileSync('script1.js', 'utf8');
js = js.replace(/<svg[^>]*>[\s\S]*?<\/svg>/g, '<img src="play1.png" alt="play" />');
fs.writeFileSync('script1.js', js);

console.log('Replaced all SVG play buttons with play1.png');