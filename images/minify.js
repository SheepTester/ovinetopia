const {read, write} = require('../fs-helper.js');

const [, , file, newFile] = process.argv;
// node images/minify.js sheepboy.svg sheepboy.min.svg

const deleteRegex = /<\?xml version="1\.0" standalone="no"\?><!-- Generator: Gravit\.io -->| style="isolation:isolate"|<defs><clipPath id="_clipPath_\w+"><rect( x="\d+" y="\d+")? width="\d+" height="\d+"\/><\/clipPath><\/defs><g clip-path="url\(#_clipPath_\w+\)">|<\/g>/g;
const simplifyPathRegex = / ([MLZ]) /g;
const rgbRegex = /fill="rgb\(((\d+),(\d+),(\d+))\)"/g;

// https://gist.github.com/mjackson/5311256
function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}

(async () => {
  const colours = [];
  const svg = await read(`./images/${file}`);
  await write(`./images/${newFile}`, svg
    .replace(deleteRegex, '')
    .replace(simplifyPathRegex, '$1')
    .replace(rgbRegex, (m, colour, r, g, b) => {
      if (!colours.includes(colour)) colours.push(colour);
      const index = colours.indexOf(colour);
      const [h, s, l] = rgbToHsl(+r, +g, +b).map(Math.floor);
      return `fill="hsl(${h},${s}%,${l}%)" class="colour-${index}"`;
    }));
  console.log('ok');
})();
