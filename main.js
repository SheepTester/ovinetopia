// URL PARAMETERS
// quality       - canvas quality
const params = {};
if (window.location.search) {
  window.location.search.slice(1).split('&').forEach(entry => {
    const equalSignLoc = entry.indexOf('=');
    if (~equalSignLoc) {
      params[entry.slice(0, equalSignLoc)] = entry.slice(equalSignLoc + 1);
    } else {
      params[entry] = true;
    }
  });
}

const FULL_CIRCLE = 2 * Math.PI;

let spawnSheep = true;

let frame = 0;
function paint() {
  if (frame % 10 === 0 && spawnSheep) new Sheep(0, 0, sheep.length);
  frame++;
  c.clearRect(-cwidth / 2, -cheight / 2, cwidth, cheight);
  moveSheep();
  drawSheep();
}

let pause;
function init() {
  initCanvas();
  initInput();

  let paused = false;
  let animID = null;
  function callPaint() {
    animID = window.requestAnimationFrame(callPaint);
    paint();
  }
  callPaint();
  pause = () => {
    paused = !paused;
    if (paused) {
      window.cancelAnimationFrame(animID);
    } else {
      callPaint();
    }
  };
}

document.addEventListener('DOMContentLoaded', init, {once: true});
