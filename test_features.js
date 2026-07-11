const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*)<\/script>/);
if (!scriptMatch) { console.log('FALLO: no se encontro <script>'); process.exit(1); }

function makeDom() {
  const dom = new JSDOM('<!DOCTYPE html><html><body><div id="mc"></div><div id="dots"></div><div id="sov"><div class="sdr"><div id="prov-list"></div><div id="hlist"></div></div></div><div id="tcc"></div></body></html>', {
    runScripts: 'dangerously', url: 'https://verificamoto.pe/', pretendToBeVisual: true,
    beforeParse(w) {
      w.HTMLCanvasElement.prototype.getContext = () => ({clearRect(){},beginPath(){},arc(){},fill(){}});
      w.requestAnimationFrame = cb => setTimeout(() => cb(Date.now()), 16);
    }
  });
  dom.window.eval(scriptMatch[1]);
  return dom;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  let pass = 0, fail = 0;

  {
    const dom = makeDom(); const w = dom.window, d = w.document;
    w.rDots(); w.rWiz(); await sleep(400);
    const ans = ['ace','+25','+350','1','120','si'];
    for (let i = 0; i < ans.length; i++) {
      const o = d.querySelector('.sp[data-step="' + i + '"] .oc[onclick*="\'' + ans[i] + '\'"]');
      o.click(); await sleep(360);
    }
    d.getElementById('bn').click(); await sleep(800);
    const t = d.getElementById('mc').innerHTML;
    const checks = {
      'ckl': t.includes('CHECK-LIST ADITAMENTOS OBLIGATORIOS'),
      'e1': t.includes('E1') && t.includes('S/ 220'),
      'm43': t.includes('M43') && t.includes('S/ 660')
    };
    if (Object.values(checks).every(Boolean)) { pass++; console.log('✅ MOTORIZADO: checklist + E1/M43 OK'); }
    else { fail++; console.log('❌ MOTORIZADO:', JSON.stringify(checks)); }
    dom.window.close();
  }

  {
    const dom = makeDom(); const w = dom.window, d = w.document;
    w.rDots(); w.rWiz(); await sleep(400);
    const ans = ['ped','25','350','1','120','si'];
    for (let i = 0; i < ans.length; i++) {
      const o = d.querySelector('.sp[data-step="' + i + '"] .oc[onclick*="\'' + ans[i] + '\'"]');
      o.click(); await sleep(360);
    }
    d.getElementById('bn').click(); await sleep(800);
    const t = d.getElementById('mc').innerHTML;
    if (!t.includes('CHECK-LIST ADITAMENTOS OBLIGATORIOS') && t.includes('Kit de visibilidad')) { pass++; console.log('✅ SPA: sin checklist, kit visibilidad OK'); }
    else { fail++; console.log('❌ SPA: fallo'); }
    dom.window.close();
  }

  console.log('FEATURES:', pass + ' pasaron,', fail + ' fallaron');
  process.exit(fail ? 1 : 0);
})();
