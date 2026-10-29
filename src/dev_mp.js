/* =====================================================================
   WEEK 4 — MELTING POINT (capillary method)
   Physics: ideal binary eutectic (Schröder–van Laar): ln x_i = −ΔH_fus,i/R (1/T − 1/T_m,i)
   Melt fraction by the lever rule; sample temperature lags the block (τ ≈ 20 s), so fast
   heating makes the thermometer read high. Data: CRC Handbook (mp, ΔH_fus); * = approximate.
   ===================================================================== */
const MPS=[
 {id:"benzoic",ar:"حامض البنزويك",en:"Benzoic acid",mp:122.35,dh:18.02,M:122.12},
 {id:"naph",ar:"النفثالين",en:"Naphthalene",mp:80.26,dh:19.06,M:128.17},
 {id:"acetan",ar:"الأسيتانيليد",en:"Acetanilide",mp:114.3,dh:21.65,M:135.16},
 {id:"urea",ar:"اليوريا",en:"Urea",mp:133.0,dh:14.79,M:60.06},
 {id:"salic",ar:"حامض الساليسيليك",en:"Salicylic acid",mp:159.0,dh:27.1,M:138.12,ap:true},
 {id:"stearic",ar:"حامض الستياريك",en:"Stearic acid",mp:69.3,dh:61.2,M:284.48},
 {id:"pdcb",ar:"بارا-ثنائي كلوروبنزين",en:"p-Dichlorobenzene",mp:53.5,dh:18.19,M:147.00},
 {id:"vanil",ar:"الفانيلين",en:"Vanillin",mp:81.5,dh:22.4,M:152.15,ap:true},
 {id:"aspirin",ar:"الأسبرين",en:"Aspirin",mp:135.0,dh:29.8,M:180.16,ap:true},
 {id:"cinn",ar:"حامض السيناميك",en:"trans-Cinnamic acid",mp:133.0,dh:22.6,M:148.16,ap:true},
 {id:"phenol",ar:"الفينول",en:"Phenol",mp:40.9,dh:11.51,M:94.11}];
const MPBY=Object.fromEntries(MPS.map(s=>[s.id,s]));
const RGAS=8.314;
const xLiq=(s,T)=>Math.exp(-s.dh*1000/RGAS*(1/(T+273.15)-1/(s.mp+273.15)));
function eutectic(A,B){let lo=-100,hi=Math.min(A.mp,B.mp);for(let i=0;i<80;i++){const m=(lo+hi)/2;if(xLiq(A,m)+xLiq(B,m)>1)hi=m;else lo=m}return(lo+hi)/2}
/* liquid fraction at temperature T for overall impurity mole fraction z of B in A */
function meltFrac(A,B,z,T){if(!B||z<=0)return Math.max(0,Math.min(1,(T-(A.mp-0.4))/0.6));const Te=eutectic(A,B);if(T<Te)return 0;const xB=1-xLiq(A,T);if(xB<=z)return 1;return Math.min(1,z/xB)}
function liquidusT(A,B,z){if(!B||z<=0)return A.mp;let lo=eutectic(A,B),hi=A.mp;for(let i=0;i<80;i++){const m=(lo+hi)/2;if(1-xLiq(A,m)>z)lo=m;else hi=m}return(lo+hi)/2}
let MP={ready:false};
function mpInit(){if(MP.ready)return;MP.ready=true;
 const so=MPS.map(s=>opt(s.id,`${s.ar} (${s.mp}°C)`,s.id==="benzoic")).join("");
 $("tab-mp").innerHTML=`<div class="panel"><div class="row" style="justify-content:space-between"><div><h2>الأسبوع 4: تعيين درجة الانصهار بطريقة الأنبوبة الشعرية</h2><p class="muted" style="margin:0">درجة الانصهار = الحرارة التي يتحول عندها الصلب إلى سائل. نسجل <b>مداها</b>: من ظهور أول قطرة سائل إلى اختفاء آخر بلورة. المادة النقية تنصهر بمدى ضيق (≤ 1–2°C)، والشوائب <b>تخفض</b> الدرجة و<b>توسّع</b> المدى.</p></div><div class="seg" id="mpMode"><button data-m="pure" class="on">مادة نقية</button><button data-m="imp">مادة مع شوائب</button><button data-m="unk">مادة مجهولة</button></div></div></div>
 <div class="dgrid"><div class="panel dctl"><h3 style="margin-top:0">الإعدادات</h3>
   <label id="mpSL">المادة<select id="mpS">${so}</select></label>
   <div id="mpImp" hidden><label>نوع الشائبة<select id="mpB">${MPS.map(s=>opt(s.id,s.ar,s.id==="naph")).join("")}</select></label><label><span>نسبة الشائبة (% كتلة): <b id="mpZv" class="mono">5</b></span><input type="range" id="mpZ" min="0" max="25" step="0.5" value="5"></label></div>
   <div id="mpUnk" hidden><p style="margin:0;font-size:14px">اختار المختبر مادة مجهولة من القائمة. قس درجة انصهارها ثم استخدم <b>اختبار الانصهار المختلط</b>: اخلطها 1:1 مع مادة معروفة؛ إذا كانت نفس المادة لا تنخفض الدرجة.</p><label>اخلط المجهول مع<select id="mpMix"><option value="">— بدون خلط —</option>${MPS.map(s=>opt(s.id,s.ar)).join("")}</select></label><button class="btn sm" id="mpNewU">مادة مجهولة جديدة</button></div>
   <label><span>سرعة التسخين: <b id="mpRv" class="mono">2</b> °C/min</span><input type="range" id="mpR" min="0.5" max="20" step="0.5" value="2"></label>
   <label>تبدأ من (°C)<input type="number" id="mpT0" value="105" step="1"></label>
   <label>تسريع العرض<select id="mpX">${opt(10,"×10")}${opt(30,"×30",1)}${opt(60,"×60")}</select></label>
   <div class="row"><button class="btn primary" id="mpGo">▶ ابدأ التسخين</button><button class="btn sm" id="mpRst">إعادة</button></div>
   <div class="row"><button class="btn warn" id="mpOn" disabled>💧 أول قطرة (بداية)</button><button class="btn warn" id="mpOff" disabled>✓ انصهر كلياً (نهاية)</button></div>
   <div class="tip"><b>طريقة العمل:</b> سخّن بسرعة حتى نحو 15°C تحت الدرجة المتوقعة، ثم خفّض السرعة إلى 1–2°C/min. راقب الأنبوبة في النافذة المكبرة.</div></div>
  <div class="panel dstage"><div id="mpSvg"></div><div class="res" id="mpLive"></div><div class="explain" id="mpObs"></div></div>
  <div class="panel" id="mpRes"></div></div>`;
 document.querySelectorAll("#mpMode button").forEach(b=>b.onclick=()=>{MP.mode=b.dataset.m;document.querySelectorAll("#mpMode button").forEach(x=>x.classList.toggle("on",x===b));$("mpImp").hidden=MP.mode!=="imp";$("mpUnk").hidden=MP.mode!=="unk";$("mpSL").hidden=MP.mode==="unk";if(MP.mode==="unk")mpNewUnknown();mpReset()});
 $("mpZ").oninput=()=>{$("mpZv").textContent=$("mpZ").value;mpReset()};$("mpR").oninput=()=>{$("mpRv").textContent=$("mpR").value;MP.rate=+$("mpR").value};
 ["mpS","mpB","mpMix","mpT0"].forEach(k=>$(k).onchange=()=>{if(k==="mpS")$("mpT0").value=Math.floor(MPBY[$("mpS").value].mp-18);mpReset()});
 $("mpGo").onclick=()=>{if(MP.run){MP.run=false;$("mpGo").textContent="▶ تابع التسخين";return}MP.run=true;$("mpGo").textContent="⏸ إيقاف مؤقت";$("mpOn").disabled=$("mpOff").disabled=false;mpLoop()};
 $("mpRst").onclick=mpReset;$("mpNewU").onclick=()=>{mpNewUnknown();mpReset()};
 $("mpOn").onclick=()=>{if(MP.on==null){MP.on=MP.Tb;mpRes()}};$("mpOff").onclick=()=>{if(MP.on==null){flash("سجّل البداية أولاً");return}MP.off=MP.Tb;MP.run=false;$("mpGo").textContent="▶ ابدأ التسخين";mpRes()};
 MP.mode="pure";MP.rate=2;mpReset()}
function mpNewUnknown(){if($("mpT0"))$("mpT0").value=50;const c=MPS.filter(s=>s.mp>60&&s.mp<165);MP.unk=c[Math.floor(Math.random()*c.length)].id;MP.guess=null}
function mpSystem(){/* returns {A,B,z(mole fraction of B)} */
 if(MP.mode==="unk"){const A=MPBY[MP.unk];const mix=$("mpMix").value;if(!mix||mix===A.id)return{A,B:null,z:0,label:mix?"المجهول + "+MPBY[mix].ar+" (1:1)":"المادة المجهولة"};const B=MPBY[mix];/* 50:50 by mass → major component is the one with lower mole number? use the higher-melting as A for liquidus */const nA=0.5/A.M,nB=0.5/B.M;const [P,Q,np,nq]=A.mp>=B.mp?[A,B,nA,nB]:[B,A,nB,nA];return{A:P,B:Q,z:nq/(np+nq),label:"المجهول + "+B.ar+" (1:1)"}}
 const A=MPBY[$("mpS").value];if(MP.mode!=="imp")return{A,B:null,z:0,label:A.ar};const B=MPBY[$("mpB").value];const w=+$("mpZ").value/100;if(B.id===A.id||w===0)return{A,B:null,z:0,label:A.ar};const z=(w/B.M)/((w/B.M)+((1-w)/A.M));return{A,B,z,label:`${A.ar} + ${$("mpZ").value}% ${B.ar}`}}
function mpReset(){MP.run=false;MP.Tb=+$("mpT0").value;MP.Ts=MP.Tb;MP.t=0;MP.on=null;MP.off=null;MP.hist=[[0,MP.Tb]];MP.sys=mpSystem();if($("mpGo"))$("mpGo").textContent="▶ ابدأ التسخين";if($("mpOn"))$("mpOn").disabled=$("mpOff").disabled=true;mpDraw();mpRes()}
function mpLoop(){if(!MP.run||$("tab-mp").hidden){MP.run=false;return}const X=+$("mpX").value;const dt=X/30;/* seconds of lab time per frame */const tau=20;
 for(let k=0;k<4;k++){MP.Tb+=MP.rate/60*dt/4;MP.Ts+=(MP.Tb-MP.Ts)*(dt/4)/tau;MP.t+=dt/4}
 MP.hist.push([MP.t/60,MP.Tb]);if(MP.hist.length>4000)MP.hist.shift();
 const {A,B,z}=MP.sys;const top=Math.max(A.mp,B?A.mp:0)+12;if(MP.Tb>top+10){MP.run=false;$("mpGo").textContent="▶ ابدأ التسخين"}
 mpDraw();if(Math.random()<0.25)mpRes();requestAnimationFrame(mpLoop)}
function mpDraw(){const {A,B,z}=MP.sys;const f0=meltFrac(A,B,z,MP.Ts);/* eutectic liquid below ~10 % stays trapped between crystals and is not visible */const f=f0<0.1?0:Math.min(1,(f0-0.1)/0.9);MP.f=f;
 const stage=f0<0.05?"صلب (مسحوق أبيض)":f<=0.0?"انكماش وتلبّد المسحوق":f<0.12?"ظهور أول قطرات سائل":f<0.999?"سائل مع بلورات متبقية":"سائل صافٍ تماماً";
 const colH=60,base=262;const liqH=colH*(0.82)*f,solH=colH*(1-f)*(f>0.03?0.92:1);
 let grains="";for(let i=0;i<46*(1-f);i++){const gx=196+((i*37)%17)+Math.sin(i)*1.5,gy=base-liqH-2-((i*13)%Math.max(4,solH-3));grains+=`<circle cx="${gx.toFixed(1)}" cy="${gy.toFixed(1)}" r="1.6" fill="#f8f8f2" stroke="#bbb" stroke-width=".4"/>`}
 const g=`<svg viewBox="0 0 420 315" role="img" aria-label="جهاز درجة الانصهار"><rect x="30" y="120" width="120" height="150" rx="10" fill="#5d6d77"/><rect x="48" y="150" width="84" height="44" rx="6" fill="#1d262c"/><circle cx="90" cy="172" r="15" fill="${MP.run?"#ffb347":"#a55"}" opacity=".85"/><text x="90" y="232" text-anchor="middle" style="font:600 11px var(--f-body);fill:#fff">مسخن كهربائي</text><rect x="78" y="40" width="7" height="110" rx="3" fill="#eef3f6" stroke="#666"/><rect x="80" y="${150-Math.max(4,(MP.Tb-20)/200*100)}" width="3" height="${Math.max(4,(MP.Tb-20)/200*100)}" fill="#d22"/><rect x="96" y="70" width="4" height="82" fill="rgba(200,230,255,.6)" stroke="#888"/>
  <line x1="100" y1="140" x2="170" y2="150" stroke="var(--muted)" stroke-dasharray="4 3"/>
  <g><circle cx="205" cy="210" r="78" fill="#f2f6f8" stroke="var(--ink)" stroke-width="3"/><rect x="190" y="138" width="30" height="140" rx="4" fill="rgba(210,235,250,.55)" stroke="#7a95a6"/>
  <rect x="192" y="${base-liqH}" width="26" height="${liqH}" fill="rgba(235,245,250,.95)" stroke="#9bb" stroke-width=".6"/>${f>0.02&&f<1?`<path d="M192 ${base-liqH} q13 -6 26 0" stroke="#7a95a6" fill="none"/>`:""}${grains}
  <path d="M190 ${base+16} q15 10 30 0" fill="none" stroke="#7a95a6"/></g><text x="205" y="306" text-anchor="middle" style="font:600 11px var(--f-body);fill:var(--muted)">تكبير الأنبوبة الشعرية</text>
  <text x="300" y="60" style="font:600 13px var(--f-body);fill:var(--ink)">${stage}</text></svg>`;
 $("mpSvg").innerHTML=g;
 $("mpLive").innerHTML=`<div><span>قراءة المحرار</span><b>${MP.Tb.toFixed(1)} °C</b></div><div><span>حرارة العينة الفعلية</span><b>${MP.Ts.toFixed(1)} °C</b></div><div><span>الزمن</span><b>${(MP.t/60).toFixed(1)} min</b></div><div><span>المنصهر</span><b>${(100*f).toFixed(0)}%</b></div>`;
 $("mpObs").innerHTML=`<b>${stage}.</b> ${MP.rate>4?`<span style="color:var(--danger)">السرعة ${MP.rate}°C/min عالية: العينة متأخرة عن المحرار بنحو ${(MP.rate*20/60).toFixed(1)}°C، فستسجل قراءة أعلى من الحقيقية.</span>`:"السرعة مناسبة؛ العينة والمحرار متقاربان."}`}
function mpRes(){const {A,B,z,label}=MP.sys;const Te=B?eutectic(A,B):null;const TL=liquidusT(A,B,z);let h=`<h2>النتيجة والتحليل</h2><p style="margin:0">العينة: <b>${MP.mode==="unk"&&!MP.revealed?label:label}</b></p>`;
 const lit=MP.mode==="unk"?null:A;
 if(MP.on!=null){const range=MP.off!=null?MP.off-MP.on:null;h+=kvRes([["بداية الانصهار",MP.on.toFixed(1)+" °C"],["نهاية الانصهار",MP.off!=null?MP.off.toFixed(1)+" °C":"…"],["المدى",range!=null?range.toFixed(1)+" °C":"…",range==null?"":range<=2?"good":"bad"],...(lit?[["القيمة المرجعية (نقية)",lit.mp+" °C"]]:[])]);
  if(MP.off!=null){const mid=(MP.on+MP.off)/2;const msgs=[];
   if(range<=2)msgs.push("المدى ضيق (≤ 2°C) ← العينة <b>نقية</b> على الأغلب.");else msgs.push(`المدى واسع (${range.toFixed(1)}°C) ← دليل على <b>وجود شوائب</b> أو رطوبة.`);
   if(lit){const d=MP.off-lit.mp;if(d>1.5)msgs.push(`نهاية الانصهار أعلى من المرجع بـ ${d.toFixed(1)}°C: السبب الأرجح <b>التسخين السريع</b> (المحرار يسبق العينة).`);if(d<-1.5)msgs.push(`الانصهار أقل من المرجع بـ ${(-d).toFixed(1)}°C: <b>الشوائب تخفض درجة الانصهار</b> (مثل الملح الذي يخفض درجة تجمد الماء).`)}
   if(MP.mode==="unk"){const cand=MPS.filter(s=>Math.abs(s.mp-MP.off)<4).map(s=>s.ar);msgs.push(cand.length?`مواد مرشحة لها درجة انصهار قريبة: <b>${cand.join("، ")}</b>. إذا تقاربت أكثر من مادة، استخدم الانصهار المختلط للتمييز.`:"لا توجد مادة في الجدول قريبة؛ راجع سرعة التسخين.");if($("mpMix").value)msgs.push($("mpMix").value===MP.unk?"الخليط انصهر بنفس الدرجة وبمدى ضيق ← <b>المجهول هو نفس المادة المرجعية</b>.":"الخليط انصهر بدرجة أقل وبمدى أوسع ← المادتان <b>مختلفتان</b>.")}
   h+=`<ul style="margin:0;padding-inline-start:20px;font-size:14px">${msgs.map(m=>`<li>${m}</li>`).join("")}</ul>`+recordBtn("mpRec")}}
 else h+=`<p class="muted">ابدأ التسخين واضغط «أول قطرة» عند ظهور أول سائل، و«انصهر كلياً» عند اختفاء آخر بلورة.</p>`;
 if(MP.hist.length>2){const pts=MP.hist.filter((p,i)=>i%Math.ceil(MP.hist.length/300)===0);const y0=Math.min(...pts.map(p=>p[1]))-2,y1=Math.max(...pts.map(p=>p[1]),A.mp)+3;
  h+=`<h3>منحنى التسخين</h3><div class="chart">${svgChart([{pts,col:"var(--teal)"}],{x0:0,x1:Math.max(1,pts[pts.length-1][0]),y0,y1,xl:"الزمن (min)",yl:"°C",hlines:[...(lit?[{y:lit.mp,label:"المرجع "+lit.mp}]:[]),...(MP.on!=null?[{y:MP.on,label:"البداية",col:"var(--ok)"}]:[]),...(MP.off!=null?[{y:MP.off,label:"النهاية",col:"var(--danger)"}]:[])],id:"mp"})}</div>`}
 if(B)h+=`<h3>لماذا تخفض الشوائب درجة الانصهار؟</h3><p style="margin:0;font-size:14px">جزيئات الشائبة تُخلّ بانتظام الشبكة البلورية فتحتاج طاقة أقل لتفكيكها. حسب قانون رَؤول المثالي (معادلة شرودر–فان لار) يبدأ الانصهار عند <b>درجة الأيوتكتيك</b> <bdi class="ltr mono">≈ ${Te.toFixed(1)}°C</bdi> (بكمية ضئيلة قد لا تُرى) وينتهي عند <bdi class="ltr mono">≈ ${TL.toFixed(1)}°C</bdi> بدلاً من <bdi class="ltr mono">${A.mp}°C</bdi>.</p><div class="calcout">ln x(A) = −(ΔH_fus / R) · (1/T − 1/T_m)<br>x(${A.en}) = ${(1-z).toFixed(3)} , ΔH_fus = ${A.dh} kJ/mol${A.ap?" (approx.)":""}</div>`;
 if(MP.mode==="unk")h+=`<div class="row"><label class="muted row" style="gap:6px">تخمينك:<select id="mpGuess"><option value="">—</option>${MPS.map(s=>opt(s.id,s.ar)).join("")}</select></label><button class="btn sm primary" id="mpGB">تحقق</button></div><div id="mpGR"></div>`;
 h+=`<h3>المادة المرجعية</h3>${tbl(["المادة","درجة الانصهار °C","ΔH_fus kJ/mol","M g/mol"],MPS.map(s=>[s.ar,s.mp,s.dh+(s.ap?"*":""),s.M]))}<p class="muted" style="margin:0">المصدر: CRC Handbook of Chemistry and Physics. * قيمة تقريبية.</p>`;
 $("mpRes").innerHTML=h;if($("mpRec"))$("mpRec").onclick=()=>NB.add({exp:"mp",title:"درجة الانصهار — "+label,sample:MP.mode==="unk"?"مادة مجهولة":label,rate:MP.rate,rows:[{onset:MP.on,clear:MP.off}],res:{onset:MP.on,clear:MP.off,range:MP.off-MP.on},ref:{mp:MP.mode==="unk"?MPBY[MP.unk].mp:A.mp,name:MP.mode==="unk"?MPBY[MP.unk].ar:A.ar}});
 if($("mpGB"))$("mpGB").onclick=()=>{const g=$("mpGuess").value;$("mpGR").innerHTML=g===MP.unk?`<div class="tip">صحيح ✓ المادة هي <b>${MPBY[MP.unk].ar}</b> (${MPBY[MP.unk].mp}°C).</div>`:`<div class="warnbox">ليست ${g?MPBY[g].ar:"—"}. جرّب الانصهار المختلط مع المرشحين.</div>`}}
mkSec("mp","");
