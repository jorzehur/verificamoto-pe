const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('index.html', 'utf8');
const allErrors = [];

function makeDom() {
  const errors = [];
  const dom = new JSDOM(html, {
    runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true,
    url: 'https://jorzehur.github.io/verificamoto-pe/',
    beforeParse(window) {
      window.HTMLCanvasElement.prototype.getContext = function () {
        return { clearRect(){}, beginPath(){}, arc(){}, fill(){}, fillStyle:'', fillRect(){}, save(){}, restore(){}, translate(){}, rotate(){}, scale(){} };
      };
      window.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16);
      window.addEventListener('error', (e) => errors.push('window.error: ' + (e.error ? e.error.stack : e.message)));
      window.console.error = (...a) => errors.push('console.error: ' + a.join(' '));
    }
  });
  return { dom, errors };
}
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const flows = [
  { name:'SPA',        ans:['ped','25','350','1','120','si'],  badge:'SPA',        exento:true },
  { name:'VMP',        ans:['ace','25','350','1','120','si'],  badge:'VMP',        exento:true },
  { name:'MOTORIZADO', ans:['ace','+25','+350','1','120','si'],badge:'MOTORIZADO', exento:false },
];

(async () => {
  let pass = 0, fail = 0;

  for (const f of flows) {
    const { dom, errors } = makeDom();
    const w = dom.window, doc = w.document;
    await sleep(1200);

    for (let i = 0; i < f.ans.length; i++) {
      const sel = `.sp[data-step="${i}"] .oc[onclick*="'${f.ans[i]}'"]`;
      const opt = doc.querySelector(sel);
      if (!opt) { fail++; console.log(`❌ ${f.name}: opcion paso ${i} valor '${f.ans[i]}' no encontrada`); break; }
      opt.click();
      await sleep(360); // esperar a que selO dispare nxt() (280ms) y re-renderice
    }
    // Ultimo paso: pulsar boton "Verificar" (#bn) para disparar submit -> cv -> rRes
    const bn = doc.getElementById('bn');
    if (bn) bn.click();
    await sleep(800); // sub() es async (spinner + render)

    const mc = doc.getElementById('mc');
    const txt = mc ? mc.innerHTML : '';
    const okBadge = txt.toUpperCase().includes(f.badge);
    const okExento = f.exento ? txt.includes('No requerido') : txt.includes('Requerido');
    const okCirc = txt.includes('DONDE PUEDES CIRCULAR');
    const okLegal = txt.includes('EXPLICACION LEGAL');
    const ok = okBadge && okExento && okCirc && okLegal;
    if (ok) { pass++; console.log(`✅ UI ${f.name}: badge=${f.badge}, exento=${f.exento}, render completo OK`); }
    else { fail++; console.log(`❌ UI ${f.name}: badge=${okBadge} exento=${okExento} circ=${okCirc} legal=${okLegal}`); }
    if (errors.length) { console.log(`   Errores JS en ${f.name}:`); errors.forEach(e => console.log('   ' + e)); }
    allErrors.push(...errors);
    dom.window.close();
  }

  console.log(`TOTALES UI: ${pass} pasaron, ${fail} fallaron de ${flows.length}`);
  if (allErrors.length === 0) console.log('Sin errores JS durante la navegacion y render de los 3 flujos.');
  process.exit(fail ? 1 : 0);
})();
