/* =====================================================================
   WEEK 5 — BOILING POINT (Siwoloboff micro method) and the effect of pressure
   Vapour pressure: Antoine equation log10 P(mmHg) = A − B/(C + T°C)  (Dean's Handbook / NIST)
   Atmospheric pressure vs altitude: ISA barometric formula. Boiling-point elevation: ΔTb = i·Kb·m
   ===================================================================== */
const BPL=[
 {id:"water",ar:"الماء",en:"Water",A:[[8.07131,1730.63,233.426,1,100],[8.14019,1810.94,244.485,99,374]],dh:40.65,col:"#dff0fa",salt:true},
 {id:"etoh",ar:"الإيثانول",en:"Ethanol",A:[[8.20417,1642.89,230.300,-57,80]],dh:38.56,col:"#eef6fa"},
 {id:"meoh",ar:"الميثانول",en:"Methanol",A:[[8.08097,1582.271,239.726,15,84]],dh:35.21,col:"#eef6fa"},
 {id:"acet",ar:"الأسيتون",en:"Acetone",A:[[7.11714,1210.595,229.664,-13,55]],dh:29.10,col:"#eef6fa"},
 {id:"hex",ar:"n-هكسان",en:"n-Hexane",A:[[6.87601,1171.17,224.408,-25,92]],dh:28.85,col:"#f2f7f8"},
 {id:"cyhex",ar:"الهكسان الحلقي",en:"Cyclohexane",A:[[6.84130,1201.53,222.65,20,81]],dh:29.97,col:"#f2f7f8"},
 {id:"benz",ar:"البنزين العطري",en:"Benzene",A:[[6.90565,1211.033,220.79,8,103]],dh:30.72,col:"#f6f6ee"},
 {id:"etac",ar:"أسيتات الإيثيل",en:"Ethyl acetate",A:[[7.10179,1244.95,217.88,15,76]],dh:31.94,col:"#f2f6f4"},
 {id:"hep",ar:"n-هبتان",en:"n-Heptane",A:[[6.89677,1264.90,216.544,-2,124]],dh:31.77,col:"#f2f7f8"},
 {id:"tol",ar:"التولوين",en:"Toluene",A:[[6.95464,1344.8,219.482,6,137]],dh:33.18,col:"#f6f6ee"},
 {id:"acoh",ar:"حامض الأسيتيك",en:"Acetic acid",A:[[7.38782,1533.313,222.309,29,126]],dh:23.70,col:"#f4f2ea",note:"حامض الأسيتيك يكوّن ثنائيات (dimers) في البخار، لذلك قيمة ΔH_vap الظاهرية صغيرة وتقدير كلاوزيوس–كلابيرون له ضعيف."},
 {id:"oct",ar:"n-أوكتان",en:"n-Octane",A:[[6.91868,1351.99,209.155,19,152]],dh:34.41,col:"#f8f0c8"}];
const BPBY=Object.fromEntries(BPL.map(s=>[s.id,s]));
const PLACES=[["sea","مستوى سطح البحر",0],["basra","البصرة",2],["bagh","بغداد",34],["mosul","الموصل",223],["erbil","أربيل",420],["sulai","السليمانية",880],["halg","قمة جبل هلكورد",3607],["ever","قمة إيفرست",8849],["cook","قدر الضغط (ضغط مضاعف)",-1]];
const pAlt=h=>760*Math.pow(1-2.25577e-5*h,5.25588);
function antP(s,T){const r=s.A.find(a=>T>=a[3]-1&&T<=a[4])||(T<s.A[0][3]?s.A[0]:s.A[s.A.length-1]);return Math.pow(10,r[0]-r[1]/(r[2]+T))}
function antT(s,P){/* invert Antoine piecewise */let lo=-80,hi=380;for(let i=0;i<80;i++){const m=(lo+hi)/2;if(antP(s,m)<P)lo=m;else hi=m}return(lo+hi)/2}
let BP={ready:false};
function bpInit(){if(BP.ready)return;BP.ready=true;
 $("tab-bp").innerHTML=`<div class="panel"><h2>الأسبوع 5: تعيين درجة الغليان وأثر الضغط الجوي</h2><p class="muted" style="margin:0">السائل يغلي عندما يصبح <b>ضغط بخاره = الضغط الجوي فوقه</b>. لذلك درجة الغليان ليست ثابتة: تقل في المرتفعات (ضغط أقل) وترتفع في قدر الضغط. نقيسها بطريقة <b>سيولوبوف</b>: أنبوبة صغيرة فيها السائل وأنبوبة شعرية مقلوبة.</p></div>
 <div class="dgrid"><div class="panel dctl"><h3 style="margin-top:0">الإعدادات</h3><label>السائل<select id="bpS">${BPL.map(s=>opt(s.id,s.ar,s.id==="water")).join("")}</select></label>
   <label>المكان (يحدد الضغط الجوي)<select id="bpP">${PLACES.map(p=>opt(p[0],p[1]+(p[2]>=0?` — ${p[2]} m`:""),p[0]==="bagh")).join("")}</select></label>
   <label>أو اكتب الضغط (mmHg)<input type="number" id="bpPm" step="1"></label>
   <div id="bpSaltBox"><label><span>ملح مذاب (NaCl) لكل 100 g ماء: <b id="bpSaltV" class="mono">0</b> g</span><input type="range" id="bpSalt" min="0" max="30" step="1" value="0"></label></div>
   <label><span>سرعة التسخين: <b id="bpRv" class="mono">3</b> °C/min</span><input type="range" id="bpR" min="1" max="10" step="0.5" value="3"></label>
   <div class="row"><button class="btn primary" id="bpGo">🔥 سخّن</button><button class="btn" id="bpCool" disabled>❄ أوقف التسخين ودعه يبرد</button><button class="btn sm" id="bpRst">إعادة</button></div>
   <button class="btn warn" id="bpMark" disabled>📍 السائل دخل الأنبوبة الشعرية الآن</button>
   <div class="tip"><b>متى نقرأ؟</b> عند التسخين يخرج تيار سريع من الفقاعات (هواء ثم بخار). نوقف التسخين، فتتباطأ الفقاعات، وفي اللحظة التي <b>تتوقف فيها ويُسحب السائل داخل الأنبوبة الشعرية</b> يكون ضغط البخار = الضغط الجوي بالضبط: هذه هي درجة الغليان.</div></div>
  <div class="panel dstage"><div id="bpSvg"></div><div class="res" id="bpLive"></div><div class="explain" id="bpObs"></div></div>
  <div class="panel" id="bpRes"></div></div>`;
 ["bpS","bpP"].forEach(k=>$(k).onchange=()=>{$("bpPm").value="";bpReset()});$("bpPm").onchange=bpReset;
 $("bpSalt").oninput=()=>{$("bpSaltV").textContent=$("bpSalt").value;bpReset()};$("bpR").oninput=()=>{$("bpRv").textContent=$("bpR").value};
 $("bpGo").onclick=()=>{BP.heat=true;BP.run=true;$("bpCool").disabled=false;bpLoop()};$("bpCool").onclick=()=>{BP.heat=false;$("bpMark").disabled=false};$("bpRst").onclick=bpReset;
 $("bpMark").onclick=()=>{BP.mark=BP.T;BP.run=false;bpRes()};bpReset()}
function bpP(){const v=+$("bpPm").value;if($("bpPm").value&&v>50)return v;const p=PLACES.find(x=>x[0]===$("bpP").value);return p[2]<0?1520:pAlt(p[2])}
function bpTrue(){const s=BPBY[$("bpS").value];const P=bpP();let T=antT(s,P);let dT=0;if(s.salt){const g=+$("bpSalt").value;const m=g/58.44/0.1;dT=2*0.512*m;T+=dT}return{T,dT,P,s}}
function bpReset(){BP.run=false;BP.heat=false;BP.mark=null;const s=BPBY[$("bpS").value];$("bpSaltBox").hidden=!s.salt;const t=bpTrue();BP.T=Math.max(20,t.T-25);BP.cap=1;BP.inLiq=false;BP.hist=[];BP.t=0;BP.peak=BP.T;
 if($("bpCool")){$("bpCool").disabled=true;$("bpMark").disabled=true}bpDraw();bpRes()}
function bpLoop(){if(!BP.run||$("tab-bp").hidden){BP.run=false;return}const t=bpTrue();const r=+$("bpR").value;const dt=1.2;
 if(BP.heat){BP.T+=r/60*dt*(BP.T<t.T+6?1:0.15)}else{BP.T-=0.9/60*dt*Math.max(0.3,(BP.T-20)/40)}
 BP.peak=Math.max(BP.peak,BP.T);BP.t+=dt;BP.hist.push([BP.t/60,BP.T]);
 /* capillary: once bubbling has expelled the air, cooling below bp sucks liquid in */
 if(BP.T>t.T+0.5)BP.cap=0;if(!BP.heat&&BP.peak>t.T+0.5&&BP.T<=t.T&&!BP.inLiq){BP.inLiq=true}
 bpDraw();if(Math.random()<0.2)bpRes();if(BP.T<20&&!BP.heat){BP.run=false}requestAnimationFrame(bpLoop)}
function bpDraw(){const t=bpTrue();const s=t.s;const over=BP.T-t.T;const rate=over>0?Math.min(1,over/4):Math.max(0,1+over/1.5)*(BP.peak>t.T?0.6:0)*(BP.inLiq?0:1);
 let bub="";const nb=Math.round(rate*9);for(let i=0;i<nb;i++){const y=250-((Date.now()/18+i*23)%90);bub+=`<circle cx="${212+Math.sin(i*2.1)*2}" cy="${y.toFixed(1)}" r="${1.6+(i%3)*0.6}" fill="#fff" stroke="#7a95a6" stroke-width=".6"/>`}
 const capFill=BP.inLiq?42:0;
 $("bpSvg").innerHTML=`<svg viewBox="0 0 420 320" role="img" aria-label="جهاز سيولوبوف"><path d="M70 300 l70 -130 v-110 h22 v110 l70 130 z" fill="rgba(220,170,90,.18)" stroke="#8a6d3b" stroke-width="2"/><text x="140" y="315" text-anchor="middle" style="font:600 11px var(--f-body);fill:var(--muted)">حمام زيت (أنبوبة ثيلي)</text>
  <rect x="190" y="70" width="44" height="200" rx="18" fill="rgba(200,230,250,.25)" stroke="#5b7f96" stroke-width="2"/><rect x="192" y="150" width="40" height="118" rx="16" fill="${s.col}" opacity=".9"/>
  <rect x="207" y="120" width="10" height="130" rx="3" fill="rgba(255,255,255,.6)" stroke="#5b7f96"/><rect x="208" y="${248-capFill}" width="8" height="${capFill}" fill="${s.col}" stroke="none"/><line x1="207" y1="120" x2="217" y2="120" stroke="#5b7f96" stroke-width="2.5"/>
  ${bub}<rect x="246" y="30" width="8" height="240" rx="4" fill="#eef3f6" stroke="#666"/><rect x="248" y="${262-Math.max(3,(BP.T-10)/120*220)}" width="4" height="${Math.max(3,(BP.T-10)/120*220)}" fill="#d22"/><circle cx="250" cy="266" r="7" fill="#d22"/>
  <text x="290" y="60" style="font:600 13px var(--f-body);fill:var(--ink)">${BP.inLiq?"دخل السائل الأنبوبة الشعرية!":rate>0.6?"تيار سريع من الفقاعات":rate>0?"فقاعات متقطعة":"لا فقاعات"}</text>
  <text x="290" y="82" style="font:500 11.5px var(--f-body);fill:var(--muted)">${BP.heat?"التسخين مستمر":"التسخين متوقف — يبرد"}</text>${!BP.heat&&BP.run?`<text x="290" y="104" style="font:500 11px var(--f-body);fill:var(--muted)">راقب لحظة دخول السائل</text>`:""}</svg>`;
 $("bpLive").innerHTML=`<div><span>المحرار</span><b>${BP.T.toFixed(1)} °C</b></div><div><span>الضغط الجوي</span><b>${t.P.toFixed(0)} mmHg</b></div><div><span>ضغط بخار السائل الآن</span><b>${antP(s,BP.T).toFixed(0)} mmHg</b></div>`;
 $("bpObs").innerHTML=`ضغط البخار ${antP(s,BP.T)>=t.P?"<b>أكبر من</b>":"<b>أقل من</b>"} الضغط الجوي ← ${antP(s,BP.T)>=t.P?"البخار يدفع السائل خارج الأنبوبة الشعرية فتخرج الفقاعات.":"الضغط الجوي يدفع السائل نحو الأنبوبة الشعرية."}`}
function bpRes(){const t=bpTrue();const s=t.s;let h=`<h2>النتيجة والقانون</h2>`;const T760=antT(s,760);
 if(BP.mark!=null){const e=BP.mark-t.T;h+=kvRes([["قراءتك",BP.mark.toFixed(1)+" °C"],["الحقيقية عند "+t.P.toFixed(0)+" mmHg",t.T.toFixed(1)+" °C"],["الفرق",(e>=0?"+":"")+e.toFixed(1)+" °C",Math.abs(e)<=0.5?"good":Math.abs(e)<=1.5?"":"bad"],["عند 760 mmHg",T760.toFixed(1)+" °C"]]);
  h+=`<p style="margin:0;font-size:14px">${Math.abs(e)<=0.5?"قراءة ممتازة.":e>0?"قرأت مبكراً قبل أن يدخل السائل فعلاً (الحرارة كانت أعلى).":"قرأت متأخراً بعد دخول السائل."}</p>`+recordBtn("bpRec")}
 else h+=`<p class="muted">سخّن حتى يخرج تيار سريع من الفقاعات، ثم أوقف التسخين واضغط الزر لحظة دخول السائل إلى الأنبوبة الشعرية.</p>`;
 h+=`<div class="calcout">log₁₀ P(mmHg) = A − B / (C + T)<br>A = ${s.A[0][0]}, B = ${s.A[0][1]}, C = ${s.A[0][2]}<br>P = ${t.P.toFixed(0)} mmHg → T_b = ${(t.T-t.dT).toFixed(1)} °C${t.dT?`<br>ΔT_b = i·K_b·m = 2 × 0.512 × ${(+$("bpSalt").value/58.44/0.1).toFixed(2)} = +${t.dT.toFixed(2)} °C`:""}</div>`;
 const P2=t.P,T1=T760+273.15;const Tcc=1/(1/T1-RGAS/(s.dh*1000)*Math.log(P2/760))-273.15;
 h+=`<h3>تقدير بمعادلة كلاوزيوس–كلابيرون</h3><div class="calcout">ln(P₂/P₁) = −(ΔH_vap / R)·(1/T₂ − 1/T₁)<br>P₁ = 760 mmHg, T₁ = ${T760.toFixed(1)} °C, ΔH_vap = ${s.dh} kJ/mol<br>P₂ = ${P2.toFixed(0)} mmHg → T₂ = ${Tcc.toFixed(1)} °C</div>${s.note?`<p class="muted" style="margin:0">${s.note}</p>`:""}`;
 const pts=[];for(let T=Math.max(-20,T760-60);T<=T760+40;T+=1)pts.push([T,antP(s,T)]);const ymax=Math.max(1600,t.P*1.2);
 h+=`<h3>منحنى ضغط البخار</h3><div class="chart">${svgChart([{pts,col:"var(--teal)",label:"ضغط البخار"}],{x0:pts[0][0],x1:pts[pts.length-1][0],y0:0,y1:ymax,xl:"°C",yl:"mmHg",hlines:[{y:t.P,label:"الضغط الجوي "+t.P.toFixed(0)}],marks:[{x:t.T-t.dT,y:t.P,label:(t.T-t.dT).toFixed(1)+"°C"}],id:"bp"})}</div>`;
 h+=`<h3>درجة غليان ${s.ar} في أماكن مختلفة</h3>`+tbl(["المكان","الارتفاع","الضغط (mmHg)","درجة الغليان °C"],PLACES.map(p=>{const P=p[2]<0?1520:pAlt(p[2]);return[p[1],p[2]<0?"—":p[2]+" m",P.toFixed(0),antT(s,P).toFixed(1)]}));
 h+=`<p class="muted" style="margin:0">لهذا يطبخ الأكل أبطأ في المرتفعات (الماء يغلي بأقل من 100°C)، ويطبخ أسرع في قدر الضغط (نحو 120°C). وفي المصافي يُقطَّر المتبقي الثقيل <b>تحت التفريغ</b> ليغلي بحرارة أقل فلا يتكسر.</p>`;
 $("bpRes").innerHTML=h;if($("bpRec"))$("bpRec").onclick=()=>NB.add({exp:"bp",title:"درجة الغليان — "+s.ar,sample:s.ar+(t.dT?` + ${$("bpSalt").value} g NaCl/100 g`:""),P:t.P,rows:[{T:BP.mark}],res:{bp:BP.mark},ref:{bp:t.T,bp760:T760}})}
mkSec("bp","");
