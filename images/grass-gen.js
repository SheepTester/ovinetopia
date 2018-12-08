const {read, write} = require('../fs-helper.js');

const greenRegex = /hsl\(\d+,\d+%,\d+%\)/g;

(async () => {
  const svg = await read('./images/grass.svg');
  await write('./images/grass.svg', svg.replace(greenRegex, m => {
    let val = 58 + Math.floor(Math.random() * 11 - 5);
    return `hsl(91,${val}%,${val}%)`;
  }));
  console.log('ok');
})();
