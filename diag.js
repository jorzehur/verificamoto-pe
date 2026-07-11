const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('index.html', 'utf8');
const errors = [];

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  resources: 'usable',
  pretendToBeVisual: true,
  beforeParse(window) {
    // Stub canvas 2d context (jsdom no lo implementa)
    window.HTMLCanvasElement.prototype.getContext = function () {
      return {
        clearRect() {}, beginPath() {}, arc() {}, fill() {},
        fillStyle: '', fillRect() {}, save() {}, restore() {},
        translate() {}, rotate() {}, scale() {},
      };
    };
    window.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16);
    window.addEventListener('error', (e) => errors.push('window.error: ' + (e.error ? e.error.stack : e.message)));
    window.console.error = (...a) => errors.push('console.error: ' + a.join(' '));
    window.console.warn = (...a) => {};
  }
});

// Esperar a que carguen recursos y se ejecute DOMContentLoaded
setTimeout(() => {
  const doc = dom.window.document;
  const mc = doc.getElementById('mc');
  const header = doc.querySelector('header');
  const footer = doc.querySelector('footer');
  console.log('--- DIAGNOSTICO ---');
  console.log('header presente:', !!header);
  console.log('footer presente:', !!footer);
  console.log('#mc existe:', !!mc);
  console.log('#mc innerHTML length:', mc ? mc.innerHTML.length : 'N/A');
  console.log('html en #mc (primeros 200):', mc ? mc.innerHTML.substring(0, 200) : '');
  console.log('--- ERRORES JS (' + errors.length + ') ---');
  errors.forEach(e => console.log(e));
  if (errors.length === 0) console.log('Sin errores de JS capturados.');
}, 1500);
