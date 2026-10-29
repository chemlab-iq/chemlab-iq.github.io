/* =====================================================================
   WEEKS 10–11 — PREPARING SOLUTIONS: molarity, normality, dilution
   M = n/V(L) = m/(Mw·V);  N = M × n_eq (equivalents per mole);  C1V1 = C2V2
   Stock molarity from mass fraction: M = 10·w(%)·ρ(g/mL)/Mw
   ===================================================================== */
const SPS=[
 {id:"nacl",ar:"كلوريد الصوديوم",f:"NaCl",M:58.44,n:1,nb:"شحنة الأيون الموجب (Na⁺)"},
 {id:"naoh",ar:"هيدروكسيد الصوديوم",f:"NaOH",M:40.00,n:1,nb:"عدد OH⁻",hyg:true,exo:true,note:"ماص للرطوبة وCO₂ من الهواء: يُوزن بسرعة، لذلك لا يصلح معياراً أولياً ويُعاير بـ KHP."},
 {id:"koh",ar:"هيدروكسيد البوتاسيوم",f:"KOH",M:56.11,n:1,nb:"عدد OH⁻",hyg:true,exo:true},
 {id:"na2co3",ar:"كربونات الصوديوم اللامائية",f:"Na2CO3",M:105.99,n:2,nb:"تتفاعل مع 2H⁺ (حتى CO₂)",prim:true},
 {id:"cuso4",ar:"كبريتات النحاس المائية",f:"CuSO4·5H2O",M:249.69,n:2,nb:"شحنة Cu²⁺",note:"الكتلة المولية تشمل 5 جزيئات ماء تبلور (90.08 g/mol منها ماء)."},
 {id:"oxal",ar:"حامض الأوكزاليك المائي",f:"H2C2O4·2H2O",M:126.07,n:2,nb:"2H⁺ (وفي الأكسدة 2e⁻ أيضاً)",prim:true},
 {id:"khp",ar:"فثالات البوتاسيوم الهيدروجينية (KHP)",f:"KHC8H4O4",M:204.22,n:1,nb:"H⁺ واحد",prim:true,note:"معيار أولي ممتاز: نقي، ثابت، غير ماص للرطوبة، كتلته المولية كبيرة فيقل خطأ الوزن."},
 {id:"borax",ar:"البوراكس",f:"Na2B4O7·10H2O",M:381.37,n:2,nb:"يتفاعل مع 2H⁺",prim:true},
 {id:"kmno4",ar:"برمنغنات البوتاسيوم",f:"KMnO4",M:158.03,n:5,nb:"5e⁻ في الوسط الحامضي (MnO₄⁻ → Mn²⁺)",note:"في الوسط المتعادل يكتسب 3e⁻ فقط (MnO₂)، لذلك تتغير العيارية حسب الوسط."},
 {id:"k2cr2o7",ar:"ثنائي كرومات البوتاسيوم",f:"K2Cr2O7",M:294.18,n:6,nb:"6e⁻ (Cr₂O₇²⁻ → 2Cr³⁺)",prim:true},
 {id:"agno3",ar:"نترات الفضة",f:"AgNO3",M:169.87,n:1,nb:"شحنة Ag⁺"},
 {id:"thio",ar:"ثيوكبريتات الصوديوم المائية",f:"Na2S2O3·5H2O",M:248.18,n:1,nb:"1e⁻ لكل S₂O₃²⁻ (مع اليود)"},
 {id:"feso4",ar:"كبريتات الحديد (II) المائية",f:"FeSO4·7H2O",M:278.01,n:1,nb:"1e⁻ (Fe²⁺ → Fe³⁺)"},
 {id:"gluc",ar:"الغلوكوز",f:"C6H12O6",M:180.16,n:0,nb:"لا يتأين؛ العيارية لا تنطبق"}];
const SPL=[
 {id:"hcl",ar:"حامض الهيدروكلوريك المركز",f:"HCl",M:36.46,w:37,rho:1.19,n:1},
 {id:"h2so4",ar:"حامض الكبريتيك المركز",f:"H2SO4",M:98.08,w:98,rho:1.84,n:2},
 {id:"hno3",ar:"حامض النتريك المركز",f:"HNO3",M:63.01,w:70,rho:1.42,n:1},
 {id:"acoh",ar:"حامض الأسيتيك الثلجي",f:"CH3COOH",M:60.05,w:99.7,rho:1.049,n:1},
 {id:"nh3",ar:"محلول الأمونيا المركز",f:"NH3",M:17.03,w:28,rho:0.90,n:1},
 {id:"h3po4",ar:"حامض الفوسفوريك",f:"H3PO4",M:98.00,w:85,rho:1.685,n:3},
 {id:"h2o2",ar:"بيروكسيد الهيدروجين",f:"H2O2",M:34.01,w:30,rho:1.11,n:2}];
const SPBY=Object.fromEntries(SPS.map(s=>[s.id,s])),SPLBY=Object.fromEntries(SPL.map(s=>[s.id,s]));
const NECK={25:8,50:10,100:12,250:15,500:18,1000:22};/* neck diameter mm */
let SP={ready:false,mode:"solid"};
function spInit(){if(SP.ready)return;SP.ready=true;
 $("tab-sol").innerHTML=`<div class="panel"><div class="row" style="justify-content:space-between"><div><h2>الأسبوعان 10–11: تحضير المحاليل — المولارية والعيارية والتخفيف</h2><p class="muted" style="margin:0"><b>المولارية M</b> = عدد مولات المذاب في لتر من المحلول. <b>العيارية N</b> = عدد المكافئات في لتر = M × عدد المكافئات للمول (n). نحضر المحلول بالوزن الدقيق والدورق الحجمي، أو بتخفيف محلول مركز.</p></div><div class="seg" id="spMode"><button data-m="solid" class="on">من مادة صلبة</button><button data-m="dil">تخفيف محلول مركز</button><button data-m="ser">سلسلة تخفيف</button></div></div></div>
 <div class="dgrid"><div class="panel dctl" id="spCtl"></div><div class="panel dstage"><div id="spSvg"></div><div class="lcd" id="spLcd" style="align-self:center;min-width:220px">0.0000 g</div><div class="explain" id="spObs"></div></div><div class="panel" id="spRes"></div></div>`;
 document.querySelectorAll("#spMode button").forEach(b=>b.onclick=()=>{SP.mode=b.dataset.m;document.querySelectorAll("#spMode button").forEach(x=>x.classList.toggle("on",x===b));spCtl()});spCtl()}
function spCtl(){let h="";
 if(SP.mode==="solid")h=`<h3 style="margin-top:0">المحلول المطلوب</h3><label>المذاب<select id="spS">${SPS.map(s=>opt(s.id,`${s.ar} — ${pretty(s.f)}`,s.id==="naoh")).join("")}</select></label>
  <div class="row"><label style="flex:1">التركيز<input type="number" id="spC" value="0.100" step="0.001"></label><label>الوحدة<select id="spU">${opt("M","مولاري M",1)}${opt("N","عياري N")}</select></label></div>
  <label>الدورق الحجمي<select id="spV">${[25,50,100,250,500,1000].map(v=>opt(v,v+" mL",v===250)).join("")}</select></label>
  <h3>التنفيذ</h3><label>الكتلة على الميزان (g)<input type="number" id="spM" value="0.0000" step="0.0001"></label><div class="row">${[1,0.1,0.01,0.001].map(d=>`<button class="btn sm" data-dm="${d}">+${d}</button>`).join("")}<button class="btn sm" data-dm="-0.01">−0.01</button><button class="btn sm" data-dm="-0.001">−0.001</button></div>
  <label class="chk"><input type="checkbox" id="spRinse" checked> اشطف الكأس والقمع 3 مرات وأضف الشطافة للدورق</label>
  <label class="chk" id="spCoolL"><input type="checkbox" id="spCool" checked> انتظر حتى يبرد المحلول قبل إكمال الحجم</label>
  <label class="chk" id="spSlowL"><input type="checkbox" id="spSlow"> تُرك المسحوق مكشوفاً دقائق قبل الوزن</label>
  <label><span>موضع التقعر بالنسبة للعلامة (mm): <b id="spFv" class="mono">0.0</b></span><input type="range" id="spF" min="-6" max="6" step="0.1" value="0"></label>
  <label>موضع عينك عند القراءة<select id="spEye">${opt("lvl","بمستوى العلامة",1)}${opt("up","أعلى من العلامة")}${opt("dn","أسفل من العلامة")}</select></label>
  <label class="chk"><input type="checkbox" id="spMix" checked> اقلب الدورق 10–15 مرة للتجانس</label>`;
 else if(SP.mode==="dil")h=`<h3 style="margin-top:0">التخفيف</h3><label>المحلول المركز<select id="spL">${SPL.map(s=>opt(s.id,`${s.ar} ${s.w}% (ρ ${s.rho})`,s.id==="hcl")).join("")}</select></label>
  <div class="row"><label style="flex:1">التركيز المطلوب (M)<input type="number" id="spC2" value="0.100" step="0.001"></label><label>الحجم (mL)<select id="spV2">${[100,250,500,1000].map(v=>opt(v,v+" mL",v===500)).join("")}</select></label></div>
  <label>أداة قياس الحجم<select id="spTool">${opt("pip","ماصة مدرجة 10 mL (±0.05)",1)}${opt("cyl","أسطوانة مدرجة 10 mL (±0.2)")}${opt("bur","سحاحة 50 mL (±0.05)")}</select></label>
  <label>الحجم الذي ستأخذه فعلاً (mL)<input type="number" id="spV1" step="0.01"></label>
  <label>الترتيب<select id="spOrd">${opt("a2w","أضف الحامض إلى الماء ببطء ✓",1)}${opt("w2a","أضف الماء إلى الحامض ✗")}</select></label>`;
 else h=`<h3 style="margin-top:0">سلسلة تخفيف</h3><label>المحلول الأصلي (M)<input type="number" id="srC" value="0.1" step="0.001"></label><label>عامل التخفيف في كل خطوة<select id="srF">${opt(10,"10× (1 mL ← 10 mL)",1)}${opt(5,"5×")}${opt(2,"2×")}</select></label><label>عدد الخطوات<input type="number" id="srN" value="5" min="1" max="8"></label><label>حجم كل دورق (mL)<select id="srV">${opt(10,"10 mL")}${opt(50,"50 mL")}${opt(100,"100 mL",1)}</select></label>`;
 $("spCtl").innerHTML=h;$("spLcd").hidden=SP.mode!=="solid";
 document.querySelectorAll("#spCtl input,#spCtl select").forEach(e=>e.oninput=e.onchange=()=>{if(e.id==="spF")$("spFv").textContent=(+e.value).toFixed(1);if(e.id==="spS"||e.id==="spL"){$("spV1")&&($("spV1").value="")}spCalc()});
 document.querySelectorAll("[data-dm]").forEach(b=>b.onclick=()=>{const m=Math.max(0,+$("spM").value+ +b.dataset.dm);$("spM").value=m.toFixed(4);spCalc()});spCalc()}
function spCalc(){let h="",g="",obs="";
 if(SP.mode==="solid"){const s=SPBY[$("spS").value];const V=+$("spV").value;const C=+$("spC").value;const U=$("spU").value;$("spCoolL").hidden=!s.exo;$("spSlowL").hidden=!s.hyg;
  if(U==="N"&&!s.n){h=`<div class="warnbox">${s.ar} لا يتأين، فلا معنى للعيارية. استخدم المولارية.</div>`}
  const Mt=U==="N"&&s.n?C/s.n:C;const need=Mt*V/1000*s.M;const m=+$("spM").value;$("spLcd").textContent=(m+(m>0?randn()*0.00008:0)).toFixed(4)+" g";
  const purity=s.hyg&&$("spSlow").checked?0.965:1;const loss=$("spRinse").checked?0.0:0.03;const area=Math.PI*Math.pow(NECK[V]/20,2);/* cm² */const eye=$("spEye").value;const fAct=+$("spF").value+(eye==="up"?-1.5:eye==="dn"?1.5:0);let Vact=V+fAct*area/1;/* mL (cm³) */if(s.exo&&!$("spCool").checked)Vact*=rhoWater(38)/rhoWater(22);
  const mix=$("spMix").checked;const nAct=m*purity*(1-loss)/s.M;const Mact=nAct/(Vact/1000);const err=pctErr(Mact,Mt);SP.last={s,V,Mt,need,m,Mact,err,Vact};
  h+=`<h2>الحسابات</h2><div class="calcout">${U==="N"&&s.n?`M = N / n = ${C} / ${s.n} = ${Mt.toFixed(4)} mol/L<br>`:""}n(solute) = M × V = ${Mt.toFixed(4)} × ${(V/1000).toFixed(3)} = ${(Mt*V/1000).toExponential(4)} mol<br>m = n × Mw = ${(Mt*V/1000).toExponential(4)} × ${s.M} = <b>${need.toFixed(4)} g</b></div>
  ${s.n?`<p style="margin:0;font-size:14px"><b>العيارية:</b> n = ${s.n} (${s.nb}) ← N = M × n = ${Mt.toFixed(4)} × ${s.n} = <b class="ltr mono">${(Mt*s.n).toFixed(4)} N</b>. الوزن المكافئ = Mw / n = ${(s.M/s.n).toFixed(2)} g/eq.</p>`:""}${s.note?`<div class="tip">${s.note}</div>`:""}`;
  if(m>0){h+=`<h3>المحلول الذي حضّرته فعلاً</h3>`+kvRes([["الكتلة المطلوبة",need.toFixed(4)+" g"],["الكتلة الموزونة",m.toFixed(4)+" g"],["الحجم الحقيقي",Vact.toFixed(2)+" mL"],["التركيز الحقيقي",Mact.toFixed(4)+" M"],["الخطأ",(err>=0?"+":"")+err.toFixed(2)+"%",errClass(err)]]);
   const why=[];if(Math.abs(m-need)/need>0.002)why.push(`الكتلة ${m>need?"أكبر":"أقل"} من المطلوب بـ ${(100*(m-need)/need).toFixed(2)}%.`);if(loss)why.push("لم تُشطف الأدوات: بقي نحو 3% من المذاب على جدار الكأس والقمع ← تركيز أقل.");if(purity<1)why.push("NaOH امتص الرطوبة وCO₂: جزء من الكتلة الموزونة ماء وكربونات ← تركيز أقل. لذلك يُعاير بمحلول قياسي.");
   if(Math.abs(fAct)>0.2)why.push(`التقعر ${fAct>0?"فوق":"تحت"} العلامة فعلياً بـ ${Math.abs(fAct).toFixed(1)} mm (= ${(Math.abs(fAct)*area).toFixed(2)} mL) ← تركيز ${fAct>0?"أقل":"أعلى"}.${eye!=="lvl"?" السبب: خطأ اختلاف المنظر (parallax) لأن عينك لم تكن بمستوى العلامة.":""}`);if(s.exo&&!$("spCool").checked)why.push("أكملت الحجم والمحلول دافئ (إذابة NaOH طاردة للحرارة): عند التبريد يتقلص الحجم تحت العلامة ← تركيز أعلى.");if(!mix)why.push("لم يُقلب الدورق: المحلول غير متجانس، الجزء العلوي أخف تركيزاً.");
   h+=why.length?`<ul style="margin:0;padding-inline-start:20px;font-size:14px">${why.map(x=>`<li>${x}</li>`).join("")}</ul>`:`<p class="tip" style="margin:0">ممتاز: تحضير دقيق.</p>`;h+=recordBtn("spRec")}
  else h+=`<p class="muted">زن الكتلة المحسوبة باستخدام الأزرار أو اكتبها.</p>`;
  g=spFlaskSVG(V,+$("spF").value,s.f==="CuSO4·5H2O"?"#8fc8ec":s.id==="kmno4"?"#7d1a6e":s.id==="k2cr2o7"?"#f08a24":"#c9e3f4",m>0,eye);
  obs="ضع المسحوق في كأس صغير وأذبه بقليل من الماء أولاً، ثم انقله للدورق. أكمل بالماء المقطر حتى يلامس <b>أسفل التقعر</b> العلامة وعينك بمستواها."}
 else if(SP.mode==="dil"){const s=SPLBY[$("spL").value];const C2=+$("spC2").value,V2=+$("spV2").value;const C1=10*s.w*s.rho/s.M;const V1=C2*V2/C1;if(!$("spV1").value)$("spV1").value=V1.toFixed(2);
  const v1=+$("spV1").value;const tool=$("spTool").value;const sd=tool==="cyl"?0.1:0.025;const v1a=v1+randn()*sd;const Cact=C1*v1a/V2;const err=pctErr(Cact,C2);SP.last={s,C1,V1,v1,Cact,err,C2,V2};
  h=`<h2>الحسابات</h2><div class="calcout">M(stock) = 10 × w% × ρ / Mw = 10 × ${s.w} × ${s.rho} / ${s.M} = <b>${C1.toFixed(2)} M</b><br>C₁V₁ = C₂V₂ → V₁ = ${C2} × ${V2} / ${C1.toFixed(2)} = <b>${V1.toFixed(2)} mL</b></div>
  <p style="margin:0;font-size:14px">اشرح للطالب: <b>عدد المولات لا يتغير بالتخفيف</b>؛ نضيف ماء فقط فيزداد الحجم ويقل التركيز. العيارية: N = ${C2} × ${s.n} = ${(C2*s.n).toFixed(3)} N.</p>`;
  if($("spOrd").value==="w2a")h+=`<div class="warnbox"><b>خطر!</b> إضافة الماء إلى ${s.f==="H2SO4"?"حامض الكبريتيك المركز":"الحامض المركز"} تولد حرارة شديدة تغلي الماء فجأة فيتطاير الحامض على وجهك. القاعدة: <b>الحامض إلى الماء، ببطء، مع التحريك</b>.</div>`;
  h+=kvRes([["الحجم المطلوب",V1.toFixed(2)+" mL"],["أخذت",v1.toFixed(2)+" mL"],["التركيز الناتج",Cact.toFixed(4)+" M"],["الخطأ",(err>=0?"+":"")+err.toFixed(2)+"%",errClass(err)]]);
  if(tool==="cyl")h+=`<p class="muted" style="margin:0">الأسطوانة المدرجة أقل دقة؛ للتحضير الدقيق استخدم ماصة أو سحاحة.</p>`;h+=`<div class="tip">المحاليل المحضرة بالتخفيف من حامض تجاري تكون تقريبية لأن نسبة w% غير دقيقة، لذلك <b>تُعاير</b> بعد التحضير (مثلاً HCl مع Na₂CO₃ أو البوراكس).</div>`+recordBtn("spRec");
  g=spFlaskSVG(V2,0,"#c9e3f4",true,"lvl");obs=`خذ ${V1.toFixed(2)} mL من المحلول المركز داخل خزانة الغازات وأضفه إلى نحو نصف حجم الدورق ماءً، ثم أكمل للعلامة بعد أن يبرد.`}
 else{const C0=+$("srC").value,F=+$("srF").value,N=+$("srN").value,V=+$("srV").value;const rows=[];let C=C0;for(let i=1;i<=N;i++){C=C/F;rows.push([i,`${(V/F).toFixed(V/F<1?2:1)} mL من الدورق ${i-1===0?"الأصلي":i-1} + ماء حتى ${V} mL`,C.toExponential(2)+" M",(C0/C).toExponential(0)+"×",C>=1e-7?(-Math.log10(C)).toFixed(0):"—"])}
  h=`<h2>سلسلة التخفيف</h2>`+tbl(["الدورق","طريقة التحضير","التركيز","التخفيف الكلي","−log C"],rows)+`<p style="margin:0;font-size:14px">كل خطوة تقسم التركيز على ${F}. بعد ${N} خطوات: ${C0} ÷ ${F}^${N} = ${C.toExponential(2)} M. تُستخدم السلاسل لتحضير المحاليل القياسية للمنحنيات المعيارية، وفي الأسبوع 12 لرؤية تغير pH مع التخفيف (لكل تخفيف 10× لحامض قوي يرتفع pH بمقدار 1 تقريباً).</p>`;
  g=`<svg viewBox="0 0 420 200" role="img" aria-label="سلسلة تخفيف">${Array.from({length:Math.min(N+1,7)},(_,i)=>{const x=20+i*56;const a=Math.max(0.05,0.9*Math.pow(1/F,i*0.6));return`<path d="M${x} 60 v100 q0 12 12 12 h20 q12 0 12 -12 v-100" fill="rgba(200,230,250,.2)" stroke="var(--ink)" stroke-width="2"/><rect x="${x+2}" y="90" width="40" height="80" fill="rgba(125,40,130,${a})"/><text x="${x+22}" y="190" text-anchor="middle" style="font:600 10px var(--f-mono);fill:var(--ink)">${i===0?"C₀":"÷"+Math.pow(F,i)}</text>`}).join("")}</svg>`;obs="الألوان توضيحية (محلول برمنغنات مخفف تدريجياً)."}
 $("spRes").innerHTML=h+spConvBox();$("spSvg").innerHTML=g;$("spObs").innerHTML=obs;if($("spRec"))$("spRec").onclick=spRecord}
function spConvBox(){return`<h3>تحويلات مفيدة</h3><div class="calcout">M = mol / L &nbsp; | &nbsp; N = M × n &nbsp; | &nbsp; eq.wt = Mw / n<br>% (w/v) = g / 100 mL &nbsp; | &nbsp; ppm (mg/L) = M × Mw × 1000<br>m (molality) = mol / kg solvent &nbsp; | &nbsp; C₁V₁ = C₂V₂ &nbsp; | &nbsp; N₁V₁ = N₂V₂</div>`}
function spFlaskSVG(V,f,col,filled,eye){const mark=95;const yM=mark-f*3;const g=`<svg viewBox="0 0 420 300" role="img" aria-label="دورق حجمي"><path d="M175 30 h30 v110 q60 30 60 90 q0 50 -75 50 q-75 0 -75 -50 q0 -60 60 -90 z" fill="rgba(200,230,250,.2)" stroke="var(--ink)" stroke-width="2.5"/>${filled?`<path d="M177 ${yM} h26 v${143-yM} q58 30 58 88 q0 46 -71 46 q-71 0 -71 -46 q0 -58 58 -88 z" fill="${col}" opacity=".9"/><path d="M177 ${yM} q13 6 26 0" fill="${col}" stroke="#5b7f96"/>`:""}<line x1="170" x2="210" y1="${mark}" y2="${mark}" stroke="#d33" stroke-width="2"/><text x="215" y="${mark+4}" style="font:600 11px var(--f-body);fill:#d33">العلامة ${V} mL</text>
 <g transform="translate(320 95)"><circle r="62" fill="#f6f9fb" stroke="var(--ink)" stroke-width="3"/><clipPath id="spm"><circle r="60"/></clipPath><g clip-path="url(#spm)"><rect x="-26" y="-70" width="52" height="140" fill="rgba(200,230,250,.3)" stroke="#5b7f96"/>${filled?`<path d="M-26 ${-f*10} q26 14 52 0 v80 h-52 z" fill="${col}" opacity=".9"/>`:""}<line x1="-30" x2="30" y1="0" y2="0" stroke="#d33" stroke-width="2"/></g><text y="80" text-anchor="middle" style="font:600 11px var(--f-body);fill:var(--muted)">تكبير عنق الدورق</text></g>
 <g transform="translate(${eye==="up"?280:eye==="dn"?280:280} ${eye==="up"?40:eye==="dn"?150:95})"><text style="font:22px sans-serif">👁</text></g></svg>`;return g}
function spRecord(){const L=SP.last;if(SP.mode==="solid")NB.add({exp:"sol",title:"تحضير محلول "+L.s.ar,sample:L.s.ar,rows:[{V:L.V,m:L.m,need:L.need}],res:{M:L.Mact,N:L.s.n?L.Mact*L.s.n:null},ref:{M:L.Mt}});else NB.add({exp:"sol",title:"تخفيف "+L.s.ar,sample:L.s.ar,rows:[{C1:L.C1,V1:L.v1,V2:L.V2}],res:{M:L.Cact},ref:{M:L.C2}})}
mkSec("sol","");
