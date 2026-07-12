const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*)<\/script>/);
if (!scriptMatch) { console.log('FALLO: no se encontro <script>'); process.exit(1); }

function makeDom() {
  const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="mc"></div><div id="dots"></div><canvas id="pc"></canvas><div id="sov"><div class="sdr"><div id="prov-list"></div><div id="hlist"></div></div></div><div id="tcc"></div></body></html>`, {
    runScripts: 'dangerously', url: 'https://verificamoto.pe/', pretendToBeVisual: true,
    beforeParse(window) {
      window.HTMLCanvasElement.prototype.getContext = function () {
        return { clearRect(){}, beginPath(){}, arc(){}, fill(){}, fillStyle:'', fillRect(){}, save(){}, restore(){}, translate(){}, rotate(){}, scale(){} };
      };
      window.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16);
    }
  });
  dom.window.eval(scriptMatch[1]);
  return dom;
}
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const flows = [
  { name:'SPA',        ans:['ped','25','350','1','120','si','sco'],  badge:'SPA',        exento:true },
  { name:'VMP',        ans:['ace','25','350','1','120','si','sco'],  badge:'VMP',        exento:true },
  { name:'MOTORIZADO', ans:['ace','+25','+350','1','120','si','mot'],badge:'AUTOMOTOR', exento:false },
];

(async () => {
  let pass = 0, fail = 0;
  for (const f of flows) {
    const dom = makeDom();
    const w = dom.window, doc = w.document;
    w.rDots(); w.rWiz();
    await sleep(400);

    for (let i = 0; i < f.ans.length; i++) {
      const sel = `.sp[data-step="${i}"] .oc[onclick*="'${f.ans[i]}'"]`;
      const opt = doc.querySelector(sel);
      if (!opt) { fail++; console.log(`❌ ${f.name}: opcion paso ${i} no encontrada`); break; }
      opt.click();
      await sleep(360);
    }
    const bn = doc.getElementById('bn');
    if (bn) bn.click();
    await sleep(800);

    const mc = doc.getElementById('mc');
    const txt = mc ? mc.innerHTML : '';
    const okBadge = txt.toUpperCase().includes(f.badge);
    const okExento = f.exento ? txt.includes('No requerido') : txt.includes('Requerido');
    const okCirc = txt.includes('DONDE PUEDES CIRCULAR');
    const okLegal = txt.includes('EXPLICACION LEGAL');
    const ok = okBadge && okExento && okCirc && okLegal;
    if (ok) { pass++; console.log(`✅ UI ${f.name}: badge=${f.badge}, exento=${f.exento}, render completo OK`); }
    else { fail++; console.log(`❌ UI ${f.name}: badge=${okBadge} exento=${okExento} circ=${okCirc} legal=${okLegal}`); }
    dom.window.close();
  }
  console.log(`TOTALES UI: ${pass} pasaron, ${fail} fallaron de ${flows.length}`);
  process.exit(fail ? 1 : 0);
})();
