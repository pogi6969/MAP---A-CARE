/* Screenshots of the app for the website. Serve the repository root, then:
   node src/tools/screens.js http://localhost:8766/ assets/screens
   Needs Playwright with Chromium. Shots are PNG; src/tools/screens_webp.py converts them. */
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
const BASE=process.argv[2], OUT=process.argv[3];
(async()=>{
  const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});
  await p.goto(BASE+'app/',{waitUntil:'load'});
  await p.waitForTimeout(7500);
  await p.evaluate(()=>{ const f=document.getElementById('firstrun'); if(f) f.hidden=true; });
  const shot=async n=>{ await p.waitForTimeout(500); await p.screenshot({path:OUT+'/'+n+'.png'}); };
  const top=async()=>p.evaluate(()=>{ document.getElementById('sheetBody').scrollTop=0; });
  const scrollTo=async sel=>p.evaluate(s=>{ const e=document.querySelector(s); if(e) e.scrollIntoView({block:'start'}); },sel);
  await top(); await shot('home');
  await p.evaluate(()=>{ hmOrigin={id:'tabaco'}; hmMode='amb'; hmAcuity=3; hmPay=1; hmNeeds=['HRP']; renderHospitalPanel(); });
  await scrollTo('.cr-needs'); await p.evaluate(()=>{ document.getElementById('sheetBody').scrollTop-=60; }); await shot('needs');
  await p.evaluate(()=>{ hmNeeds=[]; hmAcuity=3; hmPay=1; hmMode='amb'; hmOrigin={id:'tabaco'}; renderHospitalPanel(); runHospitalSearch(); });
  await scrollTo('#hmResult'); await shot('result');
  await p.evaluate(()=>{ hmOrigin={id:'oas'}; hmMode='pt'; hmMob='slow'; hmNeeds=['DIA']; hmAcuity=3; hmPay=1; renderHospitalPanel(); runHospitalSearch(); });
  await scrollTo('#hmResult .hm-h'); await shot('gaps');
  await p.evaluate(()=>{ document.getElementById('hmAlt').click(); }); await top(); await shot('why');
  await p.evaluate(()=>{ PLAN.kappa=2; showCatchments(); }); await p.waitForTimeout(2500); await shot('catchment');
  await p.evaluate(()=>{ showSurge(); document.getElementById('sgGo').click(); }); await p.waitForTimeout(2500);
  await p.evaluate(()=>{ openSheet('half'); }); await scrollTo('#sgOut'); await shot('surge');
  await p.evaluate(()=>{ PLAN.kappa=2; showCriticalRoads(); }); await p.waitForTimeout(3000); await shot('roads');
  await b.close();
})();
