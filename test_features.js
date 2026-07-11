const fs = require('fs');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync('index.html', 'utf8');

function makeDom() {
  const errors = [];
  const dom = new JSDOM(html, { runScripts:'dangerously', resources:'usable', pretendToBeVisual:true,
    url:'https://jorzehur.github.io/verificamoto-pe/',
    beforeParse(window){
      window.HTMLCanvasElement.prototype.getContext=()=>({clearRect(){},beginPath(){},arc(){},fill(){},fillStyle:'',fillRect(){},save(){},restore(){},translate(){},rotate(){},scale(){}});
      window.requestAnimationFrame=cb=>setTimeout(()=>cb(Date.now()),16);
      window.addEventListener('error',e=>errors.push('err: '+(e.error?e.error.stack:e.message)));
    }});
  return { dom, errors };
}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

(async()=>{
  let pass=0,fail=0;
  // MOTORIZADO: debe mostrar checklist Cat.L + multas E1/M43
  {
    const {dom,errors}=makeDom();const w=dom.window,d=w.document;await sleep(1200);
    const ans=['ace','+25','+350','1','120','si'];
    for(let i=0;i<ans.length;i++){const o=d.querySelector(`.sp[data-step="${i}"] .oc[onclick*="'${ans[i]}'"]`);o.click();await sleep(360);}
    d.getElementById('bn').click();await sleep(800);
    const t=d.getElementById('mc').innerHTML;
    const checks={
      'Check-list Cat.L':t.includes('CHECK-LIST ADITAMENTOS OBLIGATORIOS'),
      'Casco homologado en checklist':t.includes('Casco de seguridad homologado'),
      'Espejos retrovisores':t.includes('espejos retrovisores'),
      'Multa E1 (S/220)':t.includes('E1')&&t.includes('S/ 220'),
      'Multa M43 (S/660)':t.includes('M43')&&t.includes('S/ 660'),
      'Kit visibilidad en criterios':t.includes('Kit de visibilidad')
    };
    const ok=Object.values(checks).every(Boolean)&&errors.length===0;
    if(ok){pass++;console.log('✅ MOTORIZADO: checklist + E1/M43 presentes, sin errores JS');}
    else{fail++;console.log('❌ MOTORIZADO:',JSON.stringify(checks),'err='+errors.length);}
    dom.window.close();
  }
  // SPA: NO debe mostrar checklist Cat.L (solo para motorizado)
  {
    const {dom,errors}=makeDom();const w=dom.window,d=w.document;await sleep(1200);
    const ans=['ped','25','350','1','120','si'];
    for(let i=0;i<ans.length;i++){const o=d.querySelector(`.sp[data-step="${i}"] .oc[onclick*="'${ans[i]}'"]`);o.click();await sleep(360);}
    d.getElementById('bn').click();await sleep(800);
    const t=d.getElementById('mc').innerHTML;
    const noChecklist=!t.includes('CHECK-LIST ADITAMENTOS OBLIGATORIOS');
    const hasKitCrit=t.includes('Kit de visibilidad');
    const ok=noChecklist&&hasKitCrit&&errors.length===0;
    if(ok){pass++;console.log('✅ SPA: sin checklist Cat.L (correcto), criterio kit visibilidad presente');}
    else{fail++;console.log('❌ SPA: noChecklist='+noChecklist+' kitCrit='+hasKitCrit+' err='+errors.length);}
    dom.window.close();
  }
  console.log(`FEATURES: ${pass} pasaron, ${fail} fallaron`);
  process.exit(fail?1:0);
})();
