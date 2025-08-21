const fs = require('fs');

// Update HTML file
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 24 24">[\s\S]*?<\/svg>/g, '<img src="play1.png" alt="play" />');
fs.writeFileSync('index.html', html);

// Update JS file
let js = fs.readFileSync('script1.js', 'utf8');
js = js.replace(/<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 24 24">[\s\S]*?<\/svg>/g, '<img src="play1.png" alt="play" />');
fs.writeFileSync('script1.js', js);

console.log('Updated all play buttons to use play1.png');