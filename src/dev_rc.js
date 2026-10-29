/* =====================================================================
   WEEKS 6–7 — RECRYSTALLIZATION (benzoic acid from water / KNO3 from water)
   Solubility tables (CRC Handbook; benzoic acid in g/L water, salts in g/100 g water)
   ===================================================================== */
const SOLDAT={
 benzoic:{ar:"حامض البنزويك",en:"Benzoic acid",unit:"gL",tab:[[0,1.7],[18,2.7],[25,3.44],[40,5.51],[75,21.45],[100,56.31]],mp:122.4,crys:"إبر وصفائح بيضاء لامعة"},
 KNO3:{ar:"نترات البوتاسيوم",en:"Potassium nitrate",f:"KNO3",unit:"g100",tab:[[0,13.3],[10,20.9],[20,31.6],[30,45.8],[40,63.9],[50,85.5],[60,110],[70,138],[80,169],[90,202],[100,246]],crys:"بلورات منشورية عديمة اللون"},
 NaCl:{ar:"كلوريد الصوديوم",en:"Sodium chloride",f:"NaCl",unit:"g100",tab:[[0,35.7],[10,35.8],[20,36.0],[30,36.3],[40,36.6],[50,37.0],[60,37.3],[70,37.8],[80,38.4],[90,39.0],[100,39.8]],crys:"مكعبات"},
 KCl:{ar:"كلوريد البوتاسيوم",en:"Potassium chloride",f:"KCl",unit:"g100",tab:[[0,28.0],[10,31.2],[20,34.2],[30,37.2],[40,40.1],[50,42.6],[60,45.8],[70,48.3],[80,51.3],[90,54.0],[100,56.3]],crys:"مكعبات"},
 NaNO3:{ar:"نترات الصوديوم",en:"Sodium nitrate",f:"NaNO3",unit:"g100",tab:[[0,73],[10,80.8],[20,87.6],[30,94.9],[40,102],[60,122],[80,148],[100,180]],crys:"معينات"},
 NH4Cl:{ar:"كلوريد الأمونيوم",en:"Ammonium chloride",f:"NH4Cl",unit:"g100",tab:[[0,29.4],[10,33.3],[20,37.2],[30,41.4],[40,45.8],[50,50.4],[60,55.3],[70,60.2],[80,65.6],[90,71.2],[100,77.3]],crys:"بلورات ريشية"},
 CuSO4:{ar:"كبريتات النحاس (II)",en:"Copper(II) sulfate (as anhydrous)",f:"CuSO4",unit:"g100",tab:[[0,14.3],[10,17.4],[20,20.7],[30,25.0],[40,28.5],[50,33.3],[60,40.0],[80,55.0],[100,75.4]],crys:"بلورات زرقاء (CuSO₄·5H₂O)"},
 KClO3:{ar:"كلورات البوتاسيوم",en:"Potassium chlorate",f:"KClO3",unit:"g100",tab:[[0,3.3],[10,5.2],[20,7.3],[30,10.1],[40,13.9],[60,23.8],[80,37.5],[100,56.3]],crys:"صفائح"},
 Li2CO3:{ar:"كربونات الليثيوم",en:"Lithium carbonate",f:"Li2CO3",unit:"g100",tab:[[0,1.54],[20,1.33],[40,1.17],[60,1.01],[80,0.85],[100,0.72]],crys:"مسحوق أبيض",inverse:true},
 CaOH2:{ar:"هيدروكسيد الكالسيوم",en:"Calcium hydroxide",f:"Ca(OH)2",unit:"g100",tab:[[0,0.189],[20,0.173],[40,0.141],[60,0.121],[80,0.094],[100,0.076]],crys:"مسحوق أبيض",inverse:true}};
const solAt=(k,T)=>interp(SOLDAT[k].tab,T,true);
let RC={ready:false};
function rcInit(){if(RC.ready)return;RC.ready=true;
 $("tab-rc").innerHTML=`<div class="panel"><h2>الأسبوعان 6–7: تنقية مادة صلبة بإعادة التبلور</h2><p class="muted" style="margin:0">الفكرة: المادة تذوب كثيراً في الماء الساخن وقليلاً في البارد. نذيبها في <b>أقل كمية</b> من الماء الساخن، نرشّح الشوائب غير الذائبة وهو ساخن، ثم نبرّد فتتبلور المادة النقية وتبقى الشوائب الذائبة في المحلول (الراشح الأم).</p></div>
 <div class="dgrid"><div class="panel dctl"><h3 style="margin-top:0">العينة غير النقية</h3><label>المادة<select id="rcS">${opt("benzoic","حامض البنزويك في الماء",1)}${opt("KNO3","نترات البوتاسيوم في الماء")}</select></label>
  <label>كتلة المادة المطلوب تنقيتها (g)<input type="number" id="rcM" value="2.00" step="0.05"></label>
  <p class="muted" style="margin:0" id="rcImp"></p>
  <h3>قراراتك</h3><label>حجم الماء المضاف (mL)<input type="number" id="rcV" value="50" step="1"></label><p class="muted" style="margin:0" id="rcVmin"></p>
  <label class="chk"><input type="checkbox" id="rcC" checked> أضف فحماً نشطاً لإزالة اللون</label>
  <label class="chk"><input type="checkbox" id="rcF" checked> سخّن القمع وورق الترشيح قبل الترشيح الساخن</label>
  <label>طريقة التبريد<select id="rcCool">${opt("slow","ببطء إلى حرارة الغرفة ثم حمام ثلج",1)}${opt("room","ببطء إلى حرارة الغرفة فقط")}${opt("fast","مباشرة في حمام الثلج (سريع)")}</select></label>
  <label>ماء الغسيل<select id="rcW">${opt("ice5","5 mL ماء مثلج",1)}${opt("room5","5 mL ماء بحرارة الغرفة")}${opt("ice20","20 mL ماء مثلج")}</select></label>
  <label class="chk"><input type="checkbox" id="rcD" checked> جفّف البلورات جيداً قبل الوزن</label>
  <button class="btn primary" id="rcGo">▶ نفّذ إعادة التبلور خطوة بخطوة</button></div>
 <div class="panel dstage"><div id="rcSvg"></div><div class="row" id="rcSteps"></div><div class="explain" id="rcObs"></div></div>
 <div class="panel" id="rcRes"></div></div>`;
 ["rcS","rcM","rcV","rcC","rcF","rcCool","rcW","rcD"].forEach(k=>$(k).onchange=()=>{if(k==="rcS"){$("rcM").value=$("rcS").value==="KNO3"?"20.0":"2.00";$("rcV").value=$("rcS").value==="KNO3"?"10":"50"}rcPlan()});
 $("rcGo").onclick=()=>{RC.step=0;rcAnim()};rcPlan()}
function rcPlan(){const k=$("rcS").value,S=SOLDAT[k];const m=+$("rcM").value;const V=+$("rcV").value;const Th=k==="KNO3"?90:95;
 const conc=T=>S.unit==="gL"?solAt(k,T)*V/1000:solAt(k,T)*V/100;/* grams that V mL water can hold */
 const vmin=S.unit==="gL"?m/solAt(k,Th)*1000:m/solAt(k,Th)*100;
 const imp=k==="benzoic"?{sol:0.10,ins:0.08,col:true,solN:"كلوريد الصوديوم",insN:"رمل"}:{sol:0.50,ins:0.20,col:false,solN:"كلوريد الصوديوم",insN:"رمل وأتربة"};
 $("rcImp").innerHTML=`تحتوي أيضاً: ${imp.sol} g ${imp.solN} (شائبة ذائبة) و${imp.ins} g ${imp.insN} (غير ذائبة)${imp.col?" وصبغة ملونة بكمية ضئيلة":""}.`;
 $("rcVmin").innerHTML=`أقل حجم يذيب ${m} g عند ${Th}°C ≈ <b class="mono">${vmin.toFixed(0)} mL</b> (من الذوبانية ${solAt(k,Th).toFixed(1)} ${S.unit==="gL"?"g/L":"g/100 g"}). يُضاف عادة 5–10% زيادة.`;
 const cool=$("rcCool").value,Tf=cool==="room"?25:3;const L=[];let dis=Math.min(m,conc(Th));const undis=m-dis;L.push(["إذابة بالتسخين إلى "+Th+"°C",undis>0.005?`لم يذب ${undis.toFixed(2)} g لأن الماء قليل؛ هذا الجزء سيُحجز مع الرمل في الترشيح الساخن ويضيع.`:`ذابت كل المادة (${m.toFixed(2)} g).`]);
 let lossC=0;if($("rcC").checked){lossC=0.02*dis;dis-=lossC;L.push(["إضافة الفحم النشط","يمتص الصبغة الملونة، ويمتص أيضاً قليلاً من المادة ("+lossC.toFixed(3)+" g).  لا تضفه للمحلول وهو يغلي حتى لا يفور."])}else if(imp.col)L.push(["بدون فحم نشط","ستبقى البلورات مصفرة قليلاً بسبب الصبغة."]);
 let lossF=0;if(!$("rcF").checked){const Tfun=Th-35;const capF=conc(Tfun);lossF=Math.max(0,Math.min(dis,(dis-capF)*0.25));dis-=lossF;L.push(["ترشيح ساخن بقمع بارد","المحلول برد في القمع فتبلورت المادة داخل ورق الترشيح وضاع "+lossF.toFixed(3)+" g."])}else L.push(["ترشيح ساخن بقمع مسخّن","حُجز الرمل"+($("rcC").checked?" والفحم":"")+" على ورق الترشيح دون خسارة تذكر."]);
 const left=conc(Tf);let crys=Math.max(0,dis-left);L.push(["التبريد إلى "+Tf+"°C",cool==="fast"?"التبريد السريع يكوّن بلورات صغيرة كثيرة قد تحبس بعض الشوائب داخلها.":"التبريد البطيء يكوّن بلورات كبيرة نقية."+(cool==="slow"?" ثم حمام الثلج يزيد الكمية المتبلورة.":"")]);
 L.push(["ما بقي ذائباً في الراشح الأم",`${Math.min(dis,left).toFixed(3)} g لا يتبلور أبداً عند ${Tf}°C — هذه خسارة لا يمكن تجنبها.`]);
 const w=$("rcW").value;const wV=w==="ice20"?20:5,wT=w==="room5"?25:2;const lossW=Math.min(crys,(S.unit==="gL"?solAt(k,wT)*wV/1000:solAt(k,wT)*wV/100)*0.6);crys-=lossW;L.push(["الترشيح بالتفريغ والغسل",`الغسل بـ ${wV} mL ماء ${wT<10?"مثلج":"بحرارة الغرفة"} أذاب ${lossW.toFixed(3)} g من البلورات.`]);const lossT=0.02*crys;crys-=lossT;
 const trapped=cool==="fast"?0.015*crys:0.002*crys;const wet=$("rcD").checked?0:0.06*crys;const mFinal=crys+trapped+wet;
 L.push(["التجفيف والوزن",$("rcD").checked?"البلورات جافة.":"البلورات ما زالت رطبة: الوزن يتضمن ماء فتظهر نسبة استرجاع أعلى من الحقيقية."]);
 const theo=Math.max(0,m-left);RC.plan={lossT,k,m,V,Th,Tf,dis0:Math.min(m,conc(Th)),crys,mFinal,trapped,wet,left,theo,undis,lossC,lossF,lossW,L,vmin,imp,cool};rcDraw(L.length);rcRes()}
function rcAnim(){const n=RC.plan.L.length;RC.step=(RC.step||0)+1;rcDraw(RC.step);if(RC.step<n)setTimeout(rcAnim,900)}
function rcDraw(step){const P=RC.plan;step=step??RC.plan.L.length;const k=P.k;const crysVis=step>=4;const T=step<=2?P.Th:step===3?P.Th-5:P.Tf;
 let needles="";const nC=crysVis?Math.min(60,Math.round(10+P.crys/P.m*50)):0;for(let i=0;i<nC;i++){const x=140+((i*53)%140),y=262-((i*29)%(P.cool==="fast"?14:26));const l=P.cool==="fast"?4:10;const a=(i*47%180)*Math.PI/180;needles+=`<line x1="${x}" y1="${y}" x2="${(x+l*Math.cos(a)).toFixed(1)}" y2="${(y-l*Math.abs(Math.sin(a))).toFixed(1)}" stroke="#8aa3b8" stroke-width="${P.cool==="fast"?2.6:3.6}" stroke-linecap="round"/><line x1="${x}" y1="${y}" x2="${(x+l*Math.cos(a)).toFixed(1)}" y2="${(y-l*Math.abs(Math.sin(a))).toFixed(1)}" stroke="${!$("rcC").checked&&P.imp.col?"#f1e3a0":"#ffffff"}" stroke-width="${P.cool==="fast"?1.6:2.4}" stroke-linecap="round"/>`}
 const liq=step<=1?"#f3ead2":step<=2?($("rcC").checked?"#3b3b3b":"#f3ead2"):"#f6f3e6";
 $("rcSvg").innerHTML=`<svg viewBox="0 0 420 300" role="img" aria-label="إعادة التبلور"><path d="M130 110 L130 270 Q130 282 142 282 L278 282 Q290 282 290 270 L290 110" fill="rgba(200,230,250,.18)" stroke="var(--ink)" stroke-width="2.5"/><rect x="132" y="150" width="156" height="130" fill="${liq}" opacity=".85"/>${step<=1&&P.undis>0?`<ellipse cx="210" cy="276" rx="40" ry="5" fill="#fff" stroke="#ccc"/>`:""}${step<=2?`<g fill="#c9a66b">${[0,1,2,3,4,5].map(i=>`<circle cx="${180+i*12}" cy="277" r="2.2"/>`).join("")}</g>`:""}${needles}
  ${step<=2?`<path d="M150 300 q10 -16 20 0 q10 -16 20 0 q10 -16 20 0 q10 -16 20 0 q10 -16 20 0 q10 -16 20 0" fill="none" stroke="#e67e22" stroke-width="3"/>`:step>=4&&P.cool!=="room"?`<rect x="110" y="200" width="200" height="90" rx="10" fill="rgba(150,200,240,.25)" stroke="#7fb3d5" stroke-dasharray="5 4"/>`:""}
  <rect x="330" y="40" width="10" height="220" rx="5" fill="#eef3f6" stroke="#666"/><rect x="332" y="${252-T/100*200}" width="6" height="${T/100*200+6}" fill="#d22"/><text x="345" y="${255-T/100*200}" style="font:600 12px var(--f-mono);fill:var(--ink)">${T}°C</text>
  <text x="20" y="40" style="font:700 13px var(--f-body);fill:var(--ink)">${(P.L[Math.max(0,Math.min(step,P.L.length)-1)]||[""])[0]}</text></svg>`;
 $("rcSteps").innerHTML=P.L.map((l,i)=>`<span class="pill" style="background:${i<step?"var(--ok-soft)":"var(--surface-2)"};color:${i<step?"var(--ok)":"var(--muted)"}">${i+1}. ${l[0]}</span>`).join("");
 const cur=P.L[Math.max(0,Math.min(step,P.L.length)-1)];$("rcObs").innerHTML=cur?`<b>${cur[0]}:</b> ${cur[1]}`:""}
function rcRes(){const P=RC.plan;const S=SOLDAT[P.k];const rec=100*P.mFinal/P.m;const recTrue=100*P.crys/P.m;const theo=100*P.theo/P.m;
 let h=`<h2>النتيجة</h2>`+kvRes([["الكتلة الأصلية (نقية)",P.m.toFixed(2)+" g"],["البلورات الموزونة",P.mFinal.toFixed(3)+" g"],["نسبة الاسترجاع",rec.toFixed(1)+"%",rec>theo+0.5?"bad":rec>0.8*theo?"good":""],["الحد الأقصى النظري",theo.toFixed(1)+"%"]]);
 h+=`<div class="calcout">% recovery = m(crystals) / m(original) × 100 = ${P.mFinal.toFixed(3)} / ${P.m.toFixed(2)} × 100 = ${rec.toFixed(1)} %<br>max = (m − S(${P.Tf}°C)·V) / m = (${P.m.toFixed(2)} − ${P.left.toFixed(3)}) / ${P.m.toFixed(2)} = ${theo.toFixed(1)} %</div>`;
 const losses=[["ما بقي ذائباً في الراشح الأم (حتمي)",P.left],["لم يذب (ماء قليل)",P.undis],["امتصه الفحم النشط",P.lossC],["تبلور في القمع البارد",P.lossF],["ذاب أثناء الغسل",P.lossW],["بقي على الجدران وورق الترشيح أثناء النقل (≈2%)",P.lossT]].filter(x=>x[1]>0.0005);
 h+=`<h3>أين ذهبت المادة؟</h3>`+tbl(["السبب","الكتلة (g)","% من الأصل"],losses.map(x=>[x[0],x[1].toFixed(3),(100*x[1]/P.m).toFixed(1)+"%"]));
 if(P.wet>0)h+=`<div class="warnbox">البلورات رطبة (+${P.wet.toFixed(3)} g ماء): النسبة الظاهرة ${rec.toFixed(1)}% والحقيقية ${recTrue.toFixed(1)}%. نسبة استرجاع أعلى من الحد النظري دليل على عدم التجفيف.</div>`;
 if(P.k==="benzoic"){const mpR=P.cool==="fast"?"119.5 – 121.5":"121.5 – 122.4";h+=`<h3>هل البلورات نقية؟</h3><p style="margin:0;font-size:14px">نقيس درجة انصهارها (الأسبوع 4): المتوقع <b class="ltr mono">${mpR} °C</b> مقابل ${S.mp}°C للنقي. ${P.cool==="fast"?"التبريد السريع حبس بعض الشوائب فاتسع المدى وانخفض.":"مدى ضيق قريب من المرجع ← نقية."}</p>`}
 const pts=[];for(let T=0;T<=100;T+=2)pts.push([T,solAt(P.k,T)]);const per=S.unit==="gL"?"g/L":"g/100 g ماء";const cH=S.unit==="gL"?P.m/P.V*1000:P.m/P.V*100;
 h+=`<h3>منحنى الذوبانية ومسار العملية</h3><div class="chart">${svgChart([{pts,col:"var(--teal)",label:S.ar}],{x0:0,x1:100,y0:0,y1:Math.max(...pts.map(p=>p[1]))*1.05,xl:"°C",yl:per,marks:[{x:P.Th,y:Math.min(cH,solAt(P.k,P.Th)),label:"محلول ساخن",col:"var(--danger)"},{x:P.Tf,y:solAt(P.k,P.Tf),label:"بارد",col:"var(--teal)"}],hlines:[{y:cH,label:"تركيز المادة الكلي"}],id:"rc"})}</div><p class="muted" style="margin:0">كل ما فوق المنحنى عند الحرارة المنخفضة يخرج بلورات. الفرق بين الخط المتقطع والمنحنى عند ${P.Tf}°C = الكمية المتبلورة نظرياً.</p>`;
 h+=`<h3>القواعد الذهبية لإعادة التبلور</h3><ol style="margin:0;padding-inline-start:20px;font-size:14px"><li>المذيب الجيد: يذيب المادة كثيراً ساخناً وقليلاً بارداً، ولا يتفاعل معها.</li><li>أقل كمية مذيب ساخن: كل mL زائد يحمل مادة إلى الراشح وتضيع.</li><li>الترشيح الساخن بقمع مسخن لإزالة غير الذائب دون تبلور مبكر.</li><li>التبريد البطيء = بلورات أكبر وأنقى.</li><li>الغسل بقليل من المذيب المثلج، ثم التجفيف التام قبل الوزن.</li></ol>`+recordBtn("rcRec");
 $("rcRes").innerHTML=h;$("rcRec").onclick=()=>NB.add({exp:"rc",title:"إعادة التبلور — "+S.ar,sample:S.ar,rows:[{m0:P.m,V:P.V,Th:P.Th,Tf:P.Tf,mf:P.mFinal}],res:{recovery:rec,mf:P.mFinal},ref:{max:theo},opts:{cool:P.cool,charcoal:$("rcC").checked,funnel:$("rcF").checked,dried:$("rcD").checked}})}
mkSec("rc","");
