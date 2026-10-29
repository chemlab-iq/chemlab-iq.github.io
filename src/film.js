/* =====================================================================
   EXPERIMENT FILM — the whole practical lab played automatically like a video: every step is a live
   animated scene of the bench with a caption (what is done, what is read, what is calculated), built
   from a real sample with the correct actions. Play / pause / step / speed and optional voice narration.
   ===================================================================== */
const FILM={w:0,frames:[],i:0,play:false,t:null,speed:1,voice:false};
function filmHTML(w){return SIM[w]?`<div id="filmBox" data-w="${w}"></div>`:""}
const FILM_PICK={1:5,2:3,3:0,4:2,5:1,6:0,7:1,8:0,9:6,10:2,11:4,12:5,13:0};
function filmBuild(w){let keep=null;try{keep=localStorage.getItem("freelab-rc-batch")}catch(e){}try{return filmBuild0(w)}finally{try{if(keep==null)localStorage.removeItem("freelab-rc-batch");else localStorage.setItem("freelab-rc-batch",keep)}catch(e){}}}
function filmBuild0(w){const S=SIM[w];const list=S.pick();const o=list[Math.min(FILM_PICK[w]||0,list.length-1)];
 const P={w,S,samp:o,ctx:S.setup(o.d),i:0,rec:{},flags:[],log:[],cache:{},tries:0};
 const steps=typeof S.steps==="function"?S.steps(P):S.steps;const fr=[];const strip=h=>String(h||"").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
 fr.push({intro:1,title:S.title,sub:`${L("العينة","Sample")}: ${o.label}`,n:steps.length});
 steps.forEach((s,i)=>{P.i=i;let act="",val="";
  if(s.k==="choice"){const op=s.opts(P);P.cache[i]=op;const ok=op.find(x=>x.ok)||op[0];if(ok.fx)ok.fx(P);act=strip(ok.l);val=strip(ok.why)}
  else if(s.k==="read"){const I=s.inst(P);P.cache[i]=I;P.rec[s.key]=+I.value;act=strip(s.d(P));val=`${L("القراءة","Reading")}: ${I.value} ${s.unit||I.unit||""}`}
  else if(s.k==="calc"){const e=s.exp(P);act=strip(s.d(P));val=`${s.f}  =  ${+(+e).toPrecision(5)} ${s.unit||""}`;P.rec[s.key]=e}
  else if(s.k==="info"){act=strip(s.d(P));val=strip(s.obs(P)).slice(0,260)}
  P.log.push({t:s.t,ok:true});
  let scene="";try{scene=benchScene(P,s,s.k!=="read")}catch(e){scene=""}
  fr.push({n:i+1,k:s.k,t:s.t,act,val,scene})});
 let res="";try{const R=S.result(P);res=R.student!=null?`${R.lbl}: ${R.unit==="%"?pF(R.student,1):asSig(R.student,4)} ${R.unit}`:strip(R.txt)}catch(e){}
 fr.push({end:1,title:L("انتهت التجربة","Experiment complete"),sub:res});return fr}
function filmMount(){const box=$("filmBox");if(!box)return;const w=+box.dataset.w;filmStop();FILM.w=w;FILM.frames=filmBuild(w);FILM.i=0;
 box.innerHTML=`<div class="film"><div class="filmscreen" id="filmScr"></div>
 <div class="filmbar"><button class="btn sm" id="fmPrev" title="${L("السابق","Previous")}">⏮</button><button class="btn primary" id="fmPlay">▶ ${L("تشغيل","Play")}</button><button class="btn sm" id="fmNext" title="${L("التالي","Next")}">⏭</button>
 <div class="filmprog" id="fmProg">${FILM.frames.map((f,j)=>`<i data-j="${j}" title="${f.t||f.title}"></i>`).join("")}</div>
 <select id="fmSpd"><option value="1.6">0.6×</option><option value="1" selected>1×</option><option value="0.65">1.5×</option></select><label class="row muted" style="gap:4px;font-size:13px"><input type="checkbox" id="fmVoice"> 🔊 ${L("تعليق صوتي","Narration")}</label></div></div>`;
 $("fmPlay").onclick=()=>FILM.play?filmStop():filmGo();$("fmPrev").onclick=()=>{filmStop();filmShow(FILM.i-1)};$("fmNext").onclick=()=>{filmStop();filmShow(FILM.i+1)};
 $("fmSpd").onchange=()=>{FILM.speed=+$("fmSpd").value};$("fmVoice").onchange=()=>{FILM.voice=$("fmVoice").checked;if(!FILM.voice&&window.speechSynthesis)speechSynthesis.cancel()};
 box.querySelectorAll("#fmProg i").forEach(x=>x.onclick=()=>{filmStop();filmShow(+x.dataset.j)});filmShow(0)}
function filmShow(j){const F=FILM.frames;if(!F.length||!$("filmScr"))return;FILM.i=Math.max(0,Math.min(F.length-1,j));const f=F[FILM.i];
 $("filmScr").innerHTML=f.intro||f.end?`<div class="filmcard ${f.end?"end":""}"><div class="fmico">${f.end?"✅":"🎬"}</div><h3>${f.title}</h3><p>${f.sub}</p>${f.intro?`<p class="muted">${f.n} ${L("خطوة · شاهد التجربة كاملة قبل أن تنفذها بنفسك","steps · watch the whole experiment before doing it yourself")}</p>`:`<button class="btn primary" data-fmgo="1">${L("نفّذها بنفسك الآن ←","Now do it yourself →")}</button>`}</div>`
  :`<div class="filmframe">${f.scene}<div class="filmsub"><span class="fmstep">${L("الخطوة","Step")} ${f.n}</span><b>${f.t}</b><span>${f.act}</span>${f.val?`<em>${f.val}</em>`:""}</div></div>`;
 document.querySelectorAll("#fmProg i").forEach((x,k)=>{x.className=k<FILM.i?"done":k===FILM.i?"cur":""});
 const go=$("filmScr").querySelector("[data-fmgo]");if(go)go.onclick=()=>{filmStop();location.hash=`#/ac/w/${FILM.w}/lab/exp`};
 if(FILM.voice&&window.speechSynthesis){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance([f.t||f.title,f.act||f.sub,f.val||""].filter(Boolean).join(". ").replace(/<[^>]+>/g," ").replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉]/g,""));u.lang=isEN()?"en-US":"ar-SA";u.rate=1/FILM.speed;speechSynthesis.speak(u)}catch(e){}}}
function filmGo(){FILM.play=true;$("fmPlay").innerHTML=`⏸ ${L("إيقاف","Pause")}`;if(FILM.i>=FILM.frames.length-1)filmShow(0);const tick=()=>{if(!FILM.play||!$("filmScr"))return filmStop();if(FILM.i>=FILM.frames.length-1)return filmStop();filmShow(FILM.i+1);const f=FILM.frames[FILM.i];FILM.t=setTimeout(tick,(4200+Math.min(4000,((f.act||"")+(f.val||"")).length*28))*FILM.speed)};FILM.t=setTimeout(tick,3000*FILM.speed)}
function filmStop(){FILM.play=false;clearTimeout(FILM.t);if($("fmPlay"))$("fmPlay").innerHTML=`▶ ${L("تشغيل","Play")}`;if(window.speechSynthesis)try{speechSynthesis.cancel()}catch(e){}}
