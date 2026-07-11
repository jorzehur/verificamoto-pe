const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*)<\/script>/);
if (!scriptMatch) { console.log('FALLO: no se encontro <script> en index.html'); process.exit(1); }

const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="mc"></div><div id="dots"></div><div id="sov"></div><div id="prov-list"></div><div id="tcc"></div><div id="hlist"></div></body></html>`, {
  runScripts: 'dangerously', url: 'https://verificamoto.pe/', pretendToBeVisual: true
});
try {
  dom.window.eval(scriptMatch[1]);
} catch (e) {
  console.log('FALLO: error al evaluar script:', e.message);
  process.exit(1);
}
const w = dom.window;
if (typeof w.cl !== 'function') { console.log('FALLO: la funcion cl() no esta disponible en window'); process.exit(1); }

const cases = [
  { name:'FLUJO 1 - SPA (Pedaleo asistido)', a:{ act:'ped', vel:'25', pot:'350', pas:'1', pes:'120', vis:'si' }, expect:'spa' },
  { name:'FLUJO 2 - VMP (Acelerador manual)', a:{ act:'ace', vel:'25', pot:'350', pas:'1', pes:'120', vis:'si' }, expect:'vmp' },
  { name:'FLUJO 3 - MOTORIZADO (Cat. L)', a:{ act:'ace', vel:'+25', pot:'+350', pas:'1', pes:'120', vis:'si' }, expect:'motorizado' },
  { name:'SPA variante vel=12', a:{ act:'ped', vel:'12', pot:'350', pas:'1', pes:'120', vis:'no' }, expect:'spa' },
  { name:'Motorizado por pedaleo >350W', a:{ act:'ped', vel:'25', pot:'+350', pas:'1', pes:'120', vis:'no' }, expect:'motorizado' },
  { name:'Motorizado por 2+ pasajeros', a:{ act:'ace', vel:'25', pot:'350', pas:'+1', pes:'120', vis:'no' }, expect:'motorizado' },
  { name:'Motorizado por peso >120kg (VMP)', a:{ act:'ace', vel:'25', pot:'350', pas:'1', pes:'+120', vis:'no' }, expect:'motorizado' },
  { name:'Motorizado por peso >120kg (SPA)', a:{ act:'ped', vel:'25', pot:'350', pas:'1', pes:'+120', vis:'no' }, expect:'motorizado' },
  { name:'No clasificado (acel, <=12km/h)', a:{ act:'ace', vel:'12', pot:'350', pas:'1', pes:'120', vis:'no' }, expect:'noclasif' },
];

let pass = 0, fail = 0;
for (const c of cases) {
  try {
    const r = w.cl(c.a);
    const t = r && r.t;
    const ok = t === c.expect;
    const plReq = r && r.pl === (c.expect === 'motorizado');
    const circOk = r && Array.isArray(r.ci) && r.ci.length === 3;
    const okAll = ok && plReq && circOk;
    if (okAll) { pass++; console.log(`✅ ${c.name}\n   -> ${r.cls}`); }
    else { fail++; console.log(`❌ ${c.name}: esperado=${c.expect} obtenido=${t} plReq=${plReq} circOk=${circOk}`); }
  } catch(e) { fail++; console.log(`❌ ${c.name}: ERROR ${e.message}`); }
}
console.log(`TOTALES: ${pass} pasaron, ${fail} fallaron de ${cases.length}`);
process.exit(fail ? 1 : 0);
