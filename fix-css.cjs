const fs = require('fs');

let index = fs.readFileSync('src/index.css');
// Search for the end of the real CSS
let goodContents = index.toString('utf8');
let cutOff = goodContents.indexOf('. d a r k');
if (cutOff !== -1) {
  goodContents = goodContents.substring(0, cutOff);
  // Remove any trailing nulls or BOM
  goodContents = goodContents.replace(/\0/g, '').replace(/\uFFFD/g, '').trimEnd();
} else {
  // Let's just find the last clean `}` which is at the end of `@keyframes typing`
  let lastKeyframes = goodContents.lastIndexOf('@keyframes typing');
  let endBrace = goodContents.indexOf('}', lastKeyframes);
  if (endBrace !== -1) {
    goodContents = goodContents.substring(0, endBrace + 1);
  }
}

let darkCss = fs.readFileSync('src/dark.css', 'utf8').replace(/\0/g, '');

fs.writeFileSync('src/index.css', goodContents + '\n\n' + darkCss);
console.log("Fixed index.css");
