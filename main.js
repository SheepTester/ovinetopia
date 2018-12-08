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

let freedSheep = 0;
let frame = 0;
function paint(actuallyPaint) {
  frame++;
  if (actuallyPaint) c.clearRect(-cwidth / 2, -cheight / 2, cwidth, cheight);
  moveSheep();
  if (actuallyPaint) {
    drawSheep();
    animateRipples();
  }
}
function tick() {
  new Sheep(0, 0, sheep.length);
  if (elems.freeSheep.classList.contains('hidden'))
    elems.freeSheep.classList.remove('hidden');
  const actualSheep = sheep.filter(s => !s.floating);
  document.title = actualSheep.length + ' sheep - Ovinetopia';
  elems.sheepCount.textContent = actualSheep.length + ' sheep';
  elems.freeSheep.disabled = !actualSheep.length;
}
setInterval(tick, 1000);

const elems = {};
function initElems() {
  elems.canvas = document.getElementById('sheep');
  elems.sheepCount = document.getElementById('sheep-count');
  elems.freeSheep = document.getElementById('free-sheep');
  elems.freedSheepCount = document.getElementById('freed-sheep');

  elems.freeSheep.addEventListener('click', e => {
    const actualSheep = sheep.filter(s => !s.floating);
    actualSheep.forEach(s => s.free());
    freedSheep += actualSheep.length;
    elems.freedSheepCount.textContent = `${freedSheep} sheep freed.`;
  });
}

let pause;
function init() {
  initElems();
  initCanvas();
  initInput();
  initRipples();

  let paused = false;
  let animID = null;
  function callPaint() {
    animID = window.requestAnimationFrame(callPaint);
    paint(true);
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
