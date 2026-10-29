/* =====================================================================
   WEEKS 2–3 — DENSITY: pycnometer & hydrometer, specific gravity, API gravity
   Petroleum temperature correction: API MPMS 11.1 / ASTM D1250 (1980 tables 6A/6B/6D form):
     VCF = exp(−α60·Δt·(1+0.8·α60·Δt)),  α60 = K0/ρ60² + K1/ρ60  (ρ60 in kg/m³, Δt in °F)
   Water density: Tanaka et al. (2001).  Other liquids: linear expansion coefficient.
   ===================================================================== */
const ASTMK={crude:[341.0957,0],gasoline:[192.4571,0.2438],jet:[330.3010,0],fuel:[103.8720,0.2701],lube:[0,0.34878]};
const T60=15.5556;
const api2sg=a=>141.5/(a+131.5),sg2api=s=>141.5/s-131.5;
const RHOW60=()=>rhoWater(T60);
const DSAMP=[
 {id:"h2o",ar:"ماء مقطر",en:"Distilled water",grp:"عامة",water:true,col:"#dff0fa"},
 {id:"etoh",ar:"إيثانول",en:"Ethanol",grp:"عامة",r20:0.7893,b:0.00109,col:"#eef6fa"},
 {id:"meoh",ar:"ميثانول",en:"Methanol",grp:"عامة",r20:0.7914,b:0.00120,col:"#eef6fa"},
 {id:"acet",ar:"أسيتون",en:"Acetone",grp:"عامة",r20:0.7899,b:0.00143,col:"#eef6fa"},
 {id:"hex",ar:"n-هكسان",en:"n-Hexane",grp:"عامة",r20:0.6594,b:0.00135,col:"#f2f7f8"},
 {id:"hep",ar:"n-هبتان",en:"n-Heptane",grp:"عامة",r20:0.6837,b:0.00124,col:"#f2f7f8"},
 {id:"tol",ar:"تولوين",en:"Toluene",grp:"عامة",r20:0.8669,b:0.00107,col:"#f6f6ee"},
 {id:"gly",ar:"غليسرين",en:"Glycerol",grp:"عامة",r20:1.2613,b:0.00050,col:"#f4f6ee"},
 {id:"meg",ar:"إيثيلين غلايكول (MEG)",en:"Ethylene glycol",grp:"عامة",r20:1.1135,b:0.00057,col:"#eef4f6"},
 {id:"olive",ar:"زيت زيتون",en:"Olive oil",grp:"عامة",r20:0.9130,b:0.00070,col:"#d9c85a"},
 {id:"brine",ar:"محلول ملحي NaCl 10%",en:"10% NaCl brine",grp:"عامة",r20:1.0707,b:0.00030,col:"#e6f2f7"},
 {id:"sea",ar:"ماء البحر (3.5%)",en:"Seawater",grp:"عامة",r20:1.0248,b:0.00021,col:"#cfe8f2"},
 {id:"cond",ar:"مكثفات غازية",en:"Gas condensate",grp:"نفطية",api:60,cls:"gasoline",col:"#f7f1d2"},
 {id:"gaso",ar:"بنزين السيارات",en:"Gasoline",grp:"نفطية",api:58,cls:"gasoline",col:"#f8f0c8"},
 {id:"kero",ar:"كيروسين / وقود الطائرات",en:"Kerosene / Jet A-1",grp:"نفطية",api:45,cls:"jet",col:"#f7f3e0"},
 {id:"dies",ar:"ديزل (زيت الغاز)",en:"Diesel",grp:"نفطية",api:36,cls:"fuel",col:"#efe2a8"},
 {id:"kirk",ar:"نفط خام خفيف (نمط كركوك)",en:"Light crude (Kirkuk type)",grp:"نفطية",api:35,cls:"crude",col:"#3b2a17",opq:true},
 {id:"basm",ar:"نفط خام متوسط (نمط البصرة المتوسط)",en:"Medium crude (Basrah Medium type)",grp:"نفطية",api:29,cls:"crude",col:"#2c1f12",opq:true},
 {id:"bash",ar:"نفط خام ثقيل (نمط البصرة الثقيل)",en:"Heavy crude (Basrah Heavy type)",grp:"نفطية",api:24,cls:"crude",col:"#1f160c",opq:true},
 {id:"xhvy",ar:"نفط ثقيل جداً",en:"Extra-heavy crude",grp:"نفطية",api:12,cls:"crude",col:"#120c06",opq:true},
 {id:"lube",ar:"زيت تزييت (محركات)",en:"Lubricating oil",grp:"نفطية",api:29.3,cls:"lube",col:"#b8862a"}];
const DSBY=Object.fromEntries(DSAMP.map(s=>[s.id,s]));
const alpha60=(cls,r60)=>{const k=ASTMK[cls];const r=r60*1000;return k[0]/(r*r)+k[1]/r};
const vcf=(cls,r60,T)=>{const a=alpha60(cls,r60);const dt=(T*1.8+32)-60;return Math.exp(-a*dt*(1+0.8*a*dt))};
function rho60Of(s){if(s.water)return RHOW60();if(s.api!=null)return api2sg(s.api)*RHOW60();return s.r20*(1+s.b*(20-T60))}
function rhoAt(s,T){if(s.water)return rhoWater(T);const r60=rho60Of(s);if(s.cls)return r60*vcf(s.cls,r60,T);return r60*(1-s.b*(T-T60))}
/* correct an observed density at T back to 60 °F */
function rho60From(s,rT,T){if(s.water)return rT*RHOW60()/rhoWater(T);if(s.cls){let r=rT;for(let i=0;i<30;i++)r=rT/vcf(s.cls,r,T);return r}return rT/(1-s.b*(T-T60))}
function apiClass(a){return a>31.1?["خفيف","Light"]:a>=22.3?["متوسط","Medium"]:a>=10?["ثقيل","Heavy"]:["ثقيل جداً (أثقل من الماء)","Extra heavy"]}
let D={mode:"pyc",ready:false};
function densInit(){if(D.ready)return;D.ready=true;
 const sel=DSAMP.reduce((h,s,i)=>{const g=s.grp;if(i===0||DSAMP[i-1].grp!==g)h+=(i?"</optgroup>":"")+`<optgroup label="${g==="عامة"?"سوائل عامة":"منتجات نفطية"}">`;return h+opt(s.id,s.ar,s.id==="dies")},"")+"</optgroup>";
 $("tab-dens").innerHTML=`<div class="panel"><div class="row" style="justify-content:space-between"><div><h2>الأسبوعان 2–3: قياس الكثافة والكثافة النوعية ودرجة API</h2><p class="muted" style="margin:0">الكثافة ρ = الكتلة ÷ الحجم. نقيسها بطريقتين: <b>البكنوميتر</b> (قنينة حجمها ثابت ودقيق نزنها) و<b>الهيدروميتر</b> (عوامة تطفو وتُقرأ مباشرة حسب قاعدة أرخميدس).</p></div><div class="seg" id="dMode"><button data-m="pyc" class="on">البكنوميتر</button><button data-m="hyd">الهيدروميتر</button></div></div></div>
 <div class="dgrid"><div class="panel dctl"><h3 style="margin-top:0">الإعدادات</h3><label>العينة<select id="dS">${sel}</select></label><label>درجة حرارة المختبر والعينة (°C)<input type="number" id="dT" value="25.0" step="0.5" min="10" max="40"></label>
   <div id="dPycCtl"><label>حجم البكنوميتر<select id="dV">${opt(10,"10 mL")}${opt(25,"25 mL",1)}${opt(50,"50 mL")}</select></label>
    <h3>أخطاء شائعة (فعّلها لترى أثرها)</h3><label class="chk"><input type="checkbox" id="eBub"> فقاعة هواء داخل البكنوميتر مع العينة</label><label class="chk"><input type="checkbox" id="eWet"> السطح الخارجي مبلل عند الوزن</label><label class="chk"><input type="checkbox" id="eRes"> لم يُجفف بعد الماء (بقايا ماء)</label><label class="chk"><input type="checkbox" id="eHot"> وُزن والعينة دافئة (+5°C عن المسجلة)</label>
    <h3>الخطوات</h3><div style="display:flex;flex-direction:column;gap:6px"><button class="stepbtn" id="st1"><span class="sn">1</span>زن البكنوميتر فارغاً وجافاً (m₀)</button><button class="stepbtn" id="st2"><span class="sn">2</span>املأه بالماء المقطر، امسح الخارج، وزنه (m₁)</button><button class="stepbtn" id="st3"><span class="sn">3</span>فرّغه، جففه، املأه بالعينة وزنه (m₂)</button></div>
    <div class="row"><button class="btn sm" id="dNext">محاولة جديدة</button><button class="btn sm" id="dClr">مسح الجدول</button></div></div>
   <div id="dHydCtl" hidden><label>نوع الهيدروميتر<select id="dH"></select></label><p class="muted" style="margin:0" id="dHnote"></p><label>قراءتك (اكتبها من النافذة المكبرة)<input type="number" id="dRead" step="0.0001"></label><button class="btn sm primary" id="dChk">تحقق من قراءتي</button></div></div>
  <div class="panel dstage"><div id="dSvg"></div><div class="lcd" id="dLcd" style="align-self:center;min-width:220px">0.0000 g</div><div class="explain" id="dObs"></div></div>
  <div class="panel" id="dRes"></div></div>`;
 document.querySelectorAll("#dMode button").forEach(b=>b.onclick=()=>{D.mode=b.dataset.m;document.querySelectorAll("#dMode button").forEach(x=>x.classList.toggle("on",x===b));$("dPycCtl").hidden=D.mode!=="pyc";$("dHydCtl").hidden=D.mode!=="hyd";$("dLcd").hidden=D.mode!=="pyc";dReset()});
 ["dS","dT","dV"].forEach(k=>$(k).onchange=dReset);["eBub","eWet","eRes","eHot"].forEach(k=>$(k).onchange=()=>{});
 $("st1").onclick=()=>dStep(1);$("st2").onclick=()=>dStep(2);$("st3").onclick=()=>dStep(3);$("dNext").onclick=()=>{D.cur={};dDraw();dRes()};$("dClr").onclick=()=>{D.trials=[];D.cur={};dDraw();dRes()};
 $("dH").onchange=()=>{D.hyd=$("dH").value;dDraw();dRes()};$("dChk").onclick=dCheckRead;$("dRead").onkeydown=e=>{if(e.key==="Enter")dCheckRead()};
 dReset()}
function dReset(){const s=DSBY[$("dS").value],T=+$("dT").value,V=+$("dV").value;D.s=s;D.T=T;
 D.V=V*(1+(Math.random()-.5)*0.004);D.mg={10:11.85,25:17.62,50:27.40}[V]+(Math.random()-.5)*0.8;D.trials=[];D.cur={};D.readOK=null;
 /* hydrometer list */const rT=rhoAt(s,T);const opts=[];for(let lo=0.6;lo<1.3-1e-9;lo+=0.1)opts.push(["d"+lo.toFixed(1),`كثافة ${lo.toFixed(3)} – ${(lo+0.1).toFixed(3)} g/cm³`]);for(let a=0;a<80;a+=10)opts.push(["a"+a,`API ${a} – ${a+10}`]);
 const best=s.api!=null?"a"+Math.max(0,Math.min(70,Math.floor(sg2api(rT/RHOW60())/10)*10)):"d"+Math.max(0.6,Math.min(1.2,Math.floor(rT*10)/10)).toFixed(1);
 $("dH").innerHTML=opts.map(o=>opt(o[0],o[1],o[0]===best)).join("");D.hyd=best;$("dRead").value="";dDraw();dRes()}
function weigh(true_g){return true_g+randn()*0.00015}
function dStep(n){const s=D.s,T=D.T;const c=D.cur;const Tw=$("eHot").checked?T+5:T;
 if(n===1){c.m0=weigh(D.mg+($("eWet").checked?0.031:0))}
 if(n===2){if(c.m0==null){flash("ابدأ بالخطوة 1");return}c.m1=weigh(D.mg+D.V*rhoWater(Tw)+($("eWet").checked?0.028:0))}
 if(n===3){if(c.m1==null){flash("أكمل الخطوة 2 أولاً");return}let Vs=D.V-($("eBub").checked?0.06:0);let m=D.mg+Vs*rhoAt(s,Tw);if($("eRes").checked)m+=0.09*(rhoWater(T)-rhoAt(s,T));if($("eWet").checked)m+=0.030;c.m2=weigh(m);D.trials.push({...c});D.cur={done:true,...c}}
 $("dLcd").textContent=(n===1?c.m0:n===2?c.m1:c.m2).toFixed(4)+" g";dDraw(n);dRes()}
function dCalc(t){const s=D.s,T=D.T;const ratio=(t.m2-t.m0)/(t.m1-t.m0);const rT=ratio*rhoWater(T);const r60=rho60From(s,rT,T);const SG=r60/RHOW60();return{ratio,rT,r60,SG,API:sg2api(SG)}}
function dRes(){const s=D.s,T=D.T;const rTt=rhoAt(s,T),r60t=rho60Of(s),SGt=r60t/RHOW60(),APIt=sg2api(SGt);let h="";
 if(D.mode==="pyc"){const tr=D.trials;
  h+=`<h2>النتائج والحسابات</h2>`+tbl(["المحاولة","m₀ (فارغ) g","m₁ (+ماء) g","m₂ (+عينة) g","ρ عند T (g/cm³)"],tr.map((t,i)=>[i+1,t.m0.toFixed(4),t.m1.toFixed(4),t.m2.toFixed(4),dCalc(t).rT.toFixed(4)]).concat(D.cur.m0!=null&&!D.cur.done?[["…",D.cur.m0.toFixed(4),D.cur.m1!=null?D.cur.m1.toFixed(4):"—","—","—"]]:[]));
  if(tr.length){const R=tr.map(dCalc);const avg=k=>R.reduce((a,r)=>a+r[k],0)/R.length;const rT=avg("rT"),r60=avg("r60"),SG=avg("SG"),API=avg("API");const sd=R.length>1?Math.sqrt(R.reduce((a,r)=>a+(r.rT-rT)**2,0)/(R.length-1)):null;const t=tr[tr.length-1];const e=pctErr(rT,rTt);
   h+=`<h3>الحساب خطوة بخطوة (المحاولة ${tr.length})</h3><div class="calcout">m(water) = m₁ − m₀ = ${t.m1.toFixed(4)} − ${t.m0.toFixed(4)} = ${(t.m1-t.m0).toFixed(4)} g<br>m(sample) = m₂ − m₀ = ${t.m2.toFixed(4)} − ${t.m0.toFixed(4)} = ${(t.m2-t.m0).toFixed(4)} g<br>V = m(water) / ρ(water, ${T}°C) = ${(t.m1-t.m0).toFixed(4)} / ${rhoWater(T).toFixed(5)} = ${((t.m1-t.m0)/rhoWater(T)).toFixed(3)} mL<br>ρ(sample) = m(sample) / V = <b>${dCalc(t).rT.toFixed(4)} g/cm³</b>${s.water?"":`<br>SG(${T}°C/${T}°C) = m(sample)/m(water) = ${dCalc(t).ratio.toFixed(4)}`}</div>
   <p class="muted" style="margin:0">لاحظ أننا لا نحتاج حجم البكنوميتر المكتوب عليه (${$("dV").value} mL): الماء يعطينا الحجم الحقيقي بدقة (هنا ${D.V.toFixed(3)} mL). هذه فكرة <b>المعايرة</b>.</p>`;
   h+=kvRes([["متوسط ρ عند "+T+"°C",rT.toFixed(4)],["الانحراف المعياري",sd==null?"— (محاولة واحدة)":sd.toFixed(4)],["القيمة الحقيقية",rTt.toFixed(4)],["نسبة الخطأ",e.toFixed(2)+"%",errClass(e)]]);
   if(!s.water)h+=dApiBlock(T,rT,r60,SG,API,APIt);
   h+=dDiag(e);h+=recordBtn("dRec");}
  else h+=`<p class="muted">نفّذ الخطوات الثلاث على اليسار. كل وزنة تظهر على الميزان بأربعة أرقام عشرية.</p>`}
 else{const H=D.hyd;const isApi=H[0]==="a";const lo=+H.slice(1);const hi=isApi?lo+10:lo+0.1;const read=isApi?sg2api(rTt/RHOW60()):rTt;const inR=read>=lo&&read<=hi;
  h+=`<h2>الهيدروميتر: القراءة والتصحيح</h2><div class="tip"><b>المبدأ (أرخميدس):</b> الجسم الطافي يُزيح من السائل وزناً يساوي وزنه. في سائل كثافته أقل يغطس الهيدروميتر أعمق، لذلك <b>الأرقام تزداد نحو الأسفل</b> على الساق في هيدروميتر الكثافة، وبالعكس في هيدروميتر API.</div>`;
  if(!inR)h+=`<div class="warnbox">${read<lo?(isApi?"الهيدروميتر يطفو عالياً جداً":"الهيدروميتر يغطس بالكامل حتى القاع"):(isApi?"الهيدروميتر يغطس بالكامل":"الهيدروميتر يطفو عالياً وتخرج كل الساق")}: القيمة الحقيقية (${isApi?read.toFixed(1)+" API":read.toFixed(4)}) خارج مدى هذا الهيدروميتر. اختر هيدروميتراً آخر.</div>`;
  else{h+=`<p style="margin:0">${D.s.opq?"العينة <b>معتمة</b>: لا يُرى السطح الحقيقي، لذلك نقرأ <b>أعلى التقعر</b> ثم نضيف تصحيح التقعر (+0.0007 g/cm³ أو −0.1 API تقريباً) حسب ASTM D1298.":"العينة شفافة: اقرأ عند <b>مستوى السطح الأفقي</b> للسائل (أسفل التقعر)."}</p>`;
   if(D.readOK!=null){const r=D.readOK;const obs=isApi?api2sg(r.v)*RHOW60():r.v;const r60=rho60From(D.s,obs,T);const SG=r60/RHOW60();const API=sg2api(SG);
    h+=`<p style="margin:0">القراءة بعد تصحيح التقعر عند <bdi class="ltr">${T}°C</bdi>: <b class="ltr mono">${isApi?r.v.toFixed(1)+" °API":r.v.toFixed(4)+" g/cm³"}</b>${isApi?" (API مشاهدة، تحوَّل إلى كثافة أولاً):":""}</p>${isApi?`<div class="calcout">ρ(T) = 141.5 / (API + 131.5) × ρw(60°F) = ${obs.toFixed(4)} g/cm³</div>`:""}`;
    h+=kvRes([["قراءتك",isApi?r.raw.toFixed(1)+" API":r.raw.toFixed(4)],["القراءة الصحيحة",isApi?read.toFixed(1):read.toFixed(4)],["الحكم",r.ok?"صحيحة ✓":"تحتاج مراجعة",r.ok?"good":"bad"]]);if(!r.ok)h+=`<div class="warnbox">${r.msg}</div>`;
    if(!D.s.water)h+=dApiBlock(T,obs,r60,SG,API,APIt);h+=recordBtn("dRec")}}}
 h+=`<h3>القوانين</h3><div class="calcout">ρ = m / V &nbsp;&nbsp;[g/cm³ = g/mL]<br>SG = ρ(sample) / ρ(water) &nbsp;&nbsp;[dimensionless, 60°F/60°F for petroleum]<br>°API = 141.5 / SG(60/60°F) − 131.5<br>ρ(T) = ρ(60°F) × VCF(T) &nbsp;&nbsp;[VCF: ASTM D1250 / API MPMS 11.1]</div>
 <p class="muted" style="margin:0">مرجع: ρ(ماء) = ${rhoWater(T).toFixed(5)} g/cm³ عند ${T}°C (معادلة Tanaka 2001). ${s.api!=null?"القيم لخامات «نمط كذا» تقريبية للتعليم؛ الخامات الحقيقية تتغير من شحنة لأخرى.":""}</p>`;
 $("dRes").innerHTML=h;if($("dRec"))$("dRec").onclick=dRecord}
function dApiBlock(T,rT,r60,SG,API,APIt){const c=apiClass(API);const e=API-APIt;
 return`<h3>التصحيح إلى <bdi class="ltr">60°F (15.56°C)</bdi> ودرجة API</h3><div class="calcout">ρ(60°F) = ρ(${T}°C) ÷ VCF = ${rT.toFixed(4)} ÷ ${(rT/r60).toFixed(5)} = ${r60.toFixed(4)} g/cm³<br>SG(60/60°F) = ${r60.toFixed(4)} ÷ ${RHOW60().toFixed(5)} = <b>${SG.toFixed(4)}</b><br>°API = 141.5 ÷ ${SG.toFixed(4)} − 131.5 = <b>${API.toFixed(1)}</b></div>
 ${kvRes([["°API المقاسة",API.toFixed(1)],["°API الحقيقية",APIt.toFixed(1)],["الفرق",(e>=0?"+":"")+e.toFixed(1),Math.abs(e)<=0.3?"good":Math.abs(e)<=1?"":"bad"],["التصنيف",c[0]]])}
 <p class="muted" style="margin:0">لماذا نصحح للحرارة؟ النفط يتمدد عند التسخين فتقل كثافته؛ لذلك تُباع الشحنات وتُقارن دائماً عند درجة قياسية (60°F). النفط الأخف (API أعلى) يعطي بنزيناً وديزلاً أكثر وسعره أعلى. التصنيف: خفيف > 31.1، متوسط 22.3–31.1، ثقيل 10–22.3، وأقل من 10 أثقل من الماء.</p>`}
function dDiag(e){const on=[["eBub","فقاعة الهواء تأخذ مكان جزء من العينة فتقل كتلتها ← الكثافة المحسوبة <b>أقل</b> من الحقيقية."],["eWet","الماء على السطح الخارجي يضاف للكتلة في الوزنات. أثره يقل لأنه يتكرر في m₀ وm₁ وm₂، لكنه لا يُلغى تماماً."],["eRes",`بقايا الماء تختلط بالعينة فتقترب كثافتها من كثافة الماء (${D.s&&rhoAt(D.s,D.T)<1?"ترتفع":"تنخفض"} قليلاً).`],["eHot","السائل الدافئ يتمدد ويخرج جزء منه من الأنبوبة الشعرية، فنزن كتلة أقل لنفس الحجم ← كثافة أقل. لذلك ننتظر حتى تتساوى الحرارة."]].filter(([k])=>$(k)&&$(k).checked);
 let h=`<h3>تحليل الخطأ</h3>`;if(on.length)h+=`<ul style="margin:0;padding-inline-start:20px;font-size:14px">${on.map(x=>`<li>${x[1]}</li>`).join("")}</ul>`;else h+=`<p style="margin:0;font-size:14px">${Math.abs(e)<0.05?"الخطأ ضئيل جداً ويرجع لعدم يقين الميزان (±0.0001 g) فقط.":"الخطأ صغير وناتج عن تذبذب الميزان العشوائي. كرر المحاولة 3 مرات وخذ المتوسط."}</p>`;
 return h+`<p class="muted" style="margin:0">في المناقشة اكتب: «الخطأ ${e>=0?"موجب":"سالب"} (${e.toFixed(2)}%)، ويُعزى إلى …» واذكر السبب الأقرب من القائمة أعلاه.</p>`}
function dCheckRead(){const v=+$("dRead").value;if(!$("dRead").value){flash("اكتب القراءة أولاً");return}const H=D.hyd,isApi=H[0]==="a";const rTt=rhoAt(D.s,D.T);const truth=isApi?sg2api(rTt/RHOW60()):rTt;const corr=D.s.opq?(isApi?-0.1:0.0007):0;const v2=v+corr;
 const tol=isApi?0.15:0.0006;const ok=Math.abs(v2-truth)<=tol;let msg="";
 if(!ok){if(D.s.opq&&Math.abs(v-truth)<=tol)msg="يبدو أنك أضفت تصحيح التقعر مرتين أو قرأت عند السطح الحقيقي. للمعتم اكتب قراءة أعلى التقعر كما تراها، والمختبر يضيف التصحيح.";else if(Math.abs(v2-truth)<(isApi?1.2:0.0105)&&Math.abs(v2-truth)>(isApi?0.8:0.0095))msg="الفرق قسمة كبيرة كاملة: راجع الرقم المكتوب قرب الخط، الأرقام "+(isApi?"تقل":"تزداد")+" نحو الأسفل.";else msg="عدّ التدريجات الصغيرة من أقرب رقم مكتوب. كل تدريجة صغيرة = "+(isApi?"0.1 API":"0.001 g/cm³")+"."}
 D.readOK={raw:v,v:ok?v2:truth,ok,msg};dRes()}
function dRecord(){const s=D.s,T=D.T;let run;
 if(D.mode==="pyc"){const R=D.trials.map(dCalc);const avg=k=>R.reduce((a,r)=>a+r[k],0)/R.length;run={exp:"dens",title:"الكثافة بالبكنوميتر — "+s.ar,method:"pycnometer",sample:s.ar,T,rows:D.trials.map((t,i)=>({n:i+1,m0:t.m0,m1:t.m1,m2:t.m2,rho:R[i].rT})),res:{rho:avg("rT"),SG:s.water?null:avg("SG"),API:s.water?null:avg("API")},ref:{rho:rhoAt(s,T),API:s.water?null:sg2api(rho60Of(s)/RHOW60())}}}
 else{const r=D.readOK;const isApi=D.hyd[0]==="a";const obs=isApi?api2sg(r.v)*RHOW60():r.v;const r60=rho60From(s,obs,T);run={exp:"dens",title:"الكثافة بالهيدروميتر — "+s.ar,method:"hydrometer",sample:s.ar,T,rows:[{reading:r.raw,unit:isApi?"API":"g/cm³"}],res:{rho:obs,SG:r60/RHOW60(),API:sg2api(r60/RHOW60())},ref:{rho:rhoAt(s,T),API:sg2api(rho60Of(s)/RHOW60())}}}
 NB.add(run)}
function dDraw(step){const s=D.s;let g="";
 if(D.mode==="pyc"){const c=D.cur;const fill=step===3||c.done?"s":step===2?"w":"e";const col=fill==="s"?s.col:fill==="w"?"#d6ecf8":"none";
  g=`<svg viewBox="0 0 420 330" role="img" aria-label="ميزان وبكنوميتر"><rect x="70" y="250" width="280" height="56" rx="10" fill="#cfd6db" stroke="#7b868e"/><rect x="150" y="262" width="120" height="30" rx="5" fill="#0f1f14"/><text x="210" y="283" text-anchor="middle" style="font:600 16px var(--f-mono);fill:#7dff9a">${(fill==="e"?(c.m0||0):fill==="w"?(c.m1||0):(c.m2||0)).toFixed(4)}</text><rect x="120" y="236" width="180" height="14" rx="4" fill="#aab4bb"/>
  <path d="M175 236 C150 236 150 180 168 160 L195 130 L195 70 L225 70 L225 130 L252 160 C270 180 270 236 245 236 Z" fill="rgba(160,205,235,.22)" stroke="#5b7f96" stroke-width="2.2"/>
  ${fill!=="e"?`<path d="M177 232 C156 232 156 182 172 163 L199 133 L199 74 L221 74 L221 133 L248 163 C264 182 264 232 243 232 Z" fill="${col}" opacity=".95"/>`:""}
  <rect x="203" y="40" width="14" height="38" rx="3" fill="rgba(160,205,235,.4)" stroke="#5b7f96" stroke-width="1.6"/><line x1="210" y1="40" x2="210" y2="78" stroke="${fill!=="e"?col:"#9fb8c8"}" stroke-width="3"/>
  ${fill!=="e"?`<circle cx="210" cy="36" r="3.5" fill="${col}" stroke="#5b7f96"/>`:""}${$("eBub")&&$("eBub").checked&&fill==="s"?`<circle cx="232" cy="190" r="7" fill="#fff" opacity=".85" stroke="#8aa"/>`:""}
  <text x="300" y="120" style="font:600 12px var(--f-body);fill:var(--muted)">السدادة بأنبوبة شعرية:</text><text x="300" y="136" style="font:500 11px var(--f-body);fill:var(--muted)">يخرج الزائد منها فيبقى</text><text x="300" y="150" style="font:500 11px var(--f-body);fill:var(--muted)">الحجم ثابتاً تماماً</text></svg>`;
  $("dObs").innerHTML=fill==="e"?"البكنوميتر فارغ وجاف. أمسكه بملقط أو منديل، فبصمات الأصابع تضيف كتلة.":fill==="w"?"مُلئ بالماء المقطر حتى خرج الزائد من الأنبوبة الشعرية. امسح الخارج جيداً قبل الوزن.":"مُلئ بالعينة بنفس الطريقة. الكتلة الجديدة ÷ كتلة الماء = الكثافة النسبية مباشرة."}
 else{const H=D.hyd,isApi=H[0]==="a";const lo=+H.slice(1),hi=isApi?lo+10:lo+0.1;const rT=rhoAt(s,D.T);const read=isApi?sg2api(rT/RHOW60()):rT;
  /* stem position: fraction along the scale from top */const f=isApi?(hi-read)/(hi-lo):(read-lo)/(hi-lo);const clampF=Math.max(-0.15,Math.min(1.15,f));
  const surfY=150;const stemTop=surfY-20-clampF*150+150*0.0;/* scale top (lo) at stemTop+10, bottom (hi) at +160 */
  const SL=120;const sT=surfY-clampF*SL;const yOf=v=>sT+(isApi?(hi-v)/(hi-lo):(v-lo)/(hi-lo))*SL;
  let ticks="";const step=isApi?1:0.01;for(let v=lo;v<=hi+1e-9;v+=step)ticks+=`<line x1="198" x2="${Math.abs((v-lo)/step%5)<1e-6?212:206}" y1="${yOf(v)}" y2="${yOf(v)}" stroke="#333" stroke-width=".8"/>`;
  const bulbTop=sT+SL+12;
  g=`<svg viewBox="0 0 420 330" role="img" aria-label="هيدروميتر في أسطوانة"><rect x="150" y="60" width="96" height="262" rx="6" fill="rgba(160,205,235,.15)" stroke="#5b7f96" stroke-width="2"/><rect x="152" y="${surfY}" width="92" height="${320-surfY}" fill="${s.col}" opacity="${s.opq?0.97:0.75}"/>
  <g><rect x="194" y="${sT-10}" width="22" height="${bulbTop-sT+10}" rx="4" fill="rgba(250,250,250,.9)" stroke="#555"/>${ticks}<path d="M184 ${bulbTop} h42 l6 18 v58 q-27 22 -54 0 v-58 Z" fill="rgba(250,250,250,.92)" stroke="#555"/><rect x="190" y="${bulbTop+60}" width="30" height="14" fill="#555"/></g>
  <rect x="152" y="${surfY}" width="92" height="${320-surfY}" fill="${s.col}" opacity="${s.opq?0.97:0.35}"/><path d="M188 ${surfY} q4 -6 6 -9 M222 ${surfY} q-4 -6 -6 -9" stroke="${s.opq?"#1a120a":"#5b7f96"}" stroke-width="2.5" fill="none"/>
  ${dMagnifier(read,lo,hi,isApi,s)}</svg>`;
  $("dObs").innerHTML=`نزّل الهيدروميتر برفق ودعه يطفو حراً دون أن يلمس الجدار، وانتظر حتى يستقر. ${s.opq?"السائل معتم فلا يُرى إلا أعلى التقعر.":"أنزل عينك لمستوى السطح."}`}
 $("dSvg").innerHTML=g}
function dMagnifier(read,lo,hi,isApi,s){const cx=345,cy=150,R=66;const px=10;/* pixels per small division */const div=isApi?0.1:0.001;
 const yOf=v=>cy+(isApi?(read-v):(v-read))/div*px;let t="";const n=Math.ceil(R/px)+2;
 for(let k=-n;k<=n;k++){const v=Math.round(read/div)*div+k*div;if(v<lo-1e-9||v>hi+1e-9)continue;const y=yOf(v);const idx=Math.round(v/div);const big=idx%5===0,mid=false;
  t+=`<line x1="${cx-14}" x2="${cx-14+(big?26:mid?18:10)}" y1="${y}" y2="${y}" stroke="#222" stroke-width="${big?1.6:1}"/>`;if(big)t+=`<text x="${cx+16}" y="${y+4}" style="font:600 11px var(--f-mono);fill:#222">${isApi?v.toFixed(1):v.toFixed(3)}</text>`}
 const men=s.opq?`<rect x="${cx-R}" y="${cy-5}" width="${2*R}" height="${R+10}" fill="${s.col}"/><path d="M${cx-28} ${cy-5} Q${cx-18} ${cy-5} ${cx-16} ${cy-7} L${cx+12} ${cy-7} Q${cx+14} ${cy-5} ${cx+28} ${cy-5}" fill="${s.col}"/>`:`<rect x="${cx-R}" y="${cy}" width="${2*R}" height="${R}" fill="${s.col}" opacity=".45"/><path d="M${cx-30} ${cy} Q${cx-18} ${cy} ${cx-16} ${cy-6} M${cx+12} ${cy-6} Q${cx+16} ${cy} ${cx+30} ${cy}" stroke="#5b7f96" stroke-width="1.6" fill="none"/><line x1="${cx-R}" x2="${cx+R}" y1="${cy}" y2="${cy}" stroke="#d33" stroke-width=".8" stroke-dasharray="3 3"/>`;
 return`<defs><clipPath id="magc"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath></defs><g clip-path="url(#magc)"><rect x="${cx-R}" y="${cy-R}" width="${2*R}" height="${2*R}" fill="#f8fbfd"/><rect x="${cx-16}" y="${cy-R}" width="32" height="${2*R}" fill="#fff" stroke="#999"/>${t}${men}</g><circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="var(--ink)" stroke-width="3"/><line x1="246" y1="${150}" x2="${cx-R}" y2="${cy}" stroke="var(--muted)" stroke-dasharray="4 3"/><text x="${cx}" y="${cy+R+16}" text-anchor="middle" style="font:600 11px var(--f-body);fill:var(--muted)">تكبير الساق عند السطح</text>`}
mkSec("dens","");
