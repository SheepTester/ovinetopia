const {read, write} = require('../fs-helper.js');

const svgPath = process.argv[2];
const range = process.argv.slice(3).map(Number);
// node images/shade.js sheepboy.min.svg 5 5 5

const colourRegex = /fill="hsl\((\d+),(\d+)%,(\d+)%\)" class="colour-(\d+)"/g;

(async () => {
  const svg = await read(`./images/${svgPath}`);
  await write(`./images/${svgPath}`, svg.replace(colourRegex, (m, h, s, l, n) => {
    let val = Math.floor(Math.random() * (range[n] * 2 + 1) - range[n]);
    return `fill="hsl(${h},${Math.max(Math.min(+s + val, 100), 0)}%,${Math.max(Math.min(+l + val, 100), 0)}%)"`;
  }));
  console.log('ok');
})();
