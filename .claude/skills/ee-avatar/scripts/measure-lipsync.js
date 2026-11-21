// measure-lipsync.sh 가 cdp-run.mjs 에 넘기는 점검 식 (페이지 안에서 실행)
(async()=>{ if(performance.now()<8000) return null; if(window.__running) return window.__res||null; window.__running=1; try{
const f=document.getElementById("f"), sleep=ms=>new Promise(r=>setTimeout(r,ms));
let ready=false; for(let i=0;i<240&&!ready;i++){const w=f.contentWindow; ready=!!(w&&w.EEAvatarEngine&&w.EESpeech&&w.__eeAvatar&&w.__eeAvatar.debug()); if(!ready) await sleep(250);}
if(!ready){ const w=f.contentWindow; window.__res="ERR not ready: "+JSON.stringify({engine:!!(w&&w.EEAvatarEngine), avatar:!!(w&&w.__eeAvatar), err:w&&w.EEAvatar&&w.EEAvatar.lastError, hash:w&&w.location.hash, t:Math.round(performance.now()), href:w&&w.location.href, top:location.href}); return window.__res; }
const w=f.contentWindow, A=w.__eeAvatar; w.EESpeech.stopSpeaking(); await sleep(800); w.EEAvatarEngine.unlockAudio(); await sleep(300);
const open=s=>s.mouth.aa+s.mouth.ee+s.mouth.ou+s.mouth.oh+s.mouth.ih; const rows=[];
for (const t of ["Good morning! What can I get for you?","Sure. What size would you like?","You can tap your card right here.","Do you need a receipt?"]) { let on=true; w.EESpeech.speak(t,{who:"partner"}).then(()=>on=false); const t0=performance.now(); while(on&&performance.now()-t0<6000){rows.push(A.debug()); await sleep(30);} await sleep(400); }
const own=[]; { let on=true; w.EESpeech.speak("Can I get an iced latte?").then(()=>on=false); while(on){own.push(A.debug()); await sleep(40);} }
const o=rows.map(open); const dom=rows.filter(s=>open(s)>0.25).map(s=>["aa","ee","ou"].reduce((m,k)=>s.mouth[k]>s.mouth[m]?k:m,"aa")); const cnt={}; dom.forEach(k=>cnt[k]=(cnt[k]||0)+1);
window.__res=JSON.stringify({mode:[...new Set(rows.map(s=>s.speaking))].join(","), meanOpen:+(o.reduce((a,b)=>a+b,0)/o.length).toFixed(2), maxOpen:+Math.max(...o).toFixed(2), closedShare:+(o.filter(x=>x<0.25).length/o.length).toFixed(2), shapes:cnt, ownAnswerMaxOpen:+Math.max(0,...own.map(open)).toFixed(2)});
}catch(e){window.__res="ERR "+e.message} return window.__res||null; })()
