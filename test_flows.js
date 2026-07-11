const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('index.html', 'utf8');
const errors = [];

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  resources: 'usable',
  pretendToBeVisual: true,
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

setTimeout(() => {
  const w = dom.window;
  if (typeof w.cl !== 'function') {
    console.log('FALLO: la funcion cl() no esta disponible en window');
    process.exit(1);
  }

  // Casos de prueba: cada uno evalua la logica real de la app
  const cases = [
    {
      name: 'FLUJO 1 - SPA (Pedaleo asistido)',
      a: { act:'ped', vel:'25', pot:'350', pas:'1', pes:'120', vis:'si' },
      expect: 'spa',
      desc: 'Bicicleta con pedaleo, <=350W, <=25km/h, 1 persona, <=120kg'
    },
    {
      name: 'FLUJO 2 - VMP (Acelerador manual)',
      a: { act:'ace', vel:'25', pot:'350', pas:'1', pes:'120', vis:'si' },
      expect: 'vmp',
      desc: 'Acelerador, 12-25km/h, 1 persona, <=120kg'
    },
    {
      name: 'FLUJO 3 - MOTORIZADO (Cat. L)',
      a: { act:'ace', vel:'+25', pot:'+350', pas:'1', pes:'120', vis:'si' },
      expect: 'motorizado',
      desc: 'Acelerador, >25km/h, >350W'
    },
    // Casos limite adicionales
    { name: 'SPA variante vel=12', a:{ act:'ped', vel:'12', pot:'350', pas:'1', pes:'120', vis:'no' }, expect:'spa' },
    { name: 'Motorizado por pedaleo >350W', a:{ act:'ped', vel:'25', pot:'+350', pas:'1', pes:'120', vis:'no' }, expect:'motorizado' },
    { name: 'Motorizado por 2+ pasajeros', a:{ act:'ace', vel:'25', pot:'350', pas:'+1', pes:'120', vis:'no' }, expect:'motorizado' },
    { name: 'Motorizado por peso >120kg (VMP)', a:{ act:'ace', vel:'25', pot:'350', pas:'1', pes:'+120', vis:'no' }, expect:'motorizado' },
    { name: 'Motorizado por peso >120kg (SPA)', a:{ act:'ped', vel:'25', pot:'350', pas:'1', pes:'+120', vis:'no' }, expect:'motorizado' },
    { name: 'No clasificado (acel, <=12km/h)', a:{ act:'ace', vel:'12', pot:'350', pas:'1', pes:'120', vis:'no' }, expect:'noclasif' },
  ];

  let pass = 0, fail = 0;
  console.log('==================== RESULTADOS ====================');
  for (const c of cases) {
    try {
      const r = w.cl(c.a);
      const t = r && r.t;
      const ok = t === c.expect;
      const plReq = r && r.pl === (c.expect === 'motorizado');
      const circOk = r && Array.isArray(r.ci) && r.ci.length === 3;
      const okAll = ok && plReq && circOk;
      if (okAll) { pass++; console.log(`✅ ${c.name}\n   -> ${r.cls} (Placa/SOAT/Brevete: ${r.pl?'REQ':'exento'}, circulacion: ${r.ci.length} reglas)`); }
      else { fail++; console.log(`❌ ${c.name}\n   esperado=${c.expect} | obtenido=${t} | plReq=${plReq} | circOk=${circOk}`); }
    } catch (e) {
      fail++; console.log(`❌ ${c.name} -> ERROR: ${e.message}`);
    }
  }
  console.log('---------------------------------------------------');
  console.log(`TOTALES: ${pass} pasaron, ${fail} fallaron de ${cases.length} casos`);
  if (errors.length) { console.log('--- ERRORES JS CAPTURADOS ---'); errors.forEach(e => console.log(e)); }
  else console.log('Sin errores de JS en la carga de la app.');
  process.exit(fail ? 1 : 0);
}, 1500);
