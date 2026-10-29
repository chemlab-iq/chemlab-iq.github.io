/* =====================================================================
   WEEKS 11–12 — pH of strong acids, strong bases and their salts (plus weak species for contrast)
   Exact values from the equilibrium solver (water autoionisation, activities by Davies, Kw(T)).
   ===================================================================== */
const PHX=[
 {id:"hcl",ar:"حامض الهيدروكلوريك",f:"HCl",g:"sa",t:C=>[{H:C,Cl:C},{}]},
 {id:"hno3",ar:"حامض النتريك",f:"HNO3",g:"sa",t:C=>[{H:C},{NO3:{z:-1,c:C}}]},
 {id:"h2so4",ar:"حامض الكبريتيك",f:"H2SO4",g:"sa",t:C=>[{H:2*C,SO4:C},{}],note:"البروتون الأول يتأين كلياً، والثاني جزئياً (Ka₂ = 1.0×10⁻²)، لذلك pH أعلى قليلاً من −log(2C)."},
 {id:"naoh",ar:"هيدروكسيد الصوديوم",f:"NaOH",g:"sb",t:C=>[{H:-C},{Na:{z:1,c:C}}]},
 {id:"koh",ar:"هيدروكسيد البوتاسيوم",f:"KOH",g:"sb",t:C=>[{H:-C},{K:{z:1,c:C}}]},
 {id:"baoh2",ar:"هيدروكسيد الباريوم",f:"Ba(OH)2",g:"sb",t:C=>[{Ba:C,H:-2*C},{}],n:2},
 {id:"nacl",ar:"كلوريد الصوديوم",f:"NaCl",g:"ns",t:C=>[{Cl:C},{Na:{z:1,c:C}}],why:"ملح من حامض قوي (HCl) وقاعدة قوية (NaOH): أيوناته لا تتفاعل مع الماء ← متعادل."},
 {id:"kno3",ar:"نترات البوتاسيوم",f:"KNO3",g:"ns",t:C=>[{},{K:{z:1,c:C},NO3:{z:-1,c:C}}],why:"ملح من HNO₃ القوي وKOH القوي ← متعادل."},
 {id:"na2so4",ar:"كبريتات الصوديوم",f:"Na2SO4",g:"ns",t:C=>[{SO4:C},{Na:{z:1,c:2*C}}],why:"تقريباً متعادل؛ أيون SO₄²⁻ قاعدة ضعيفة جداً (لأن HSO₄⁻ حامض متوسط القوة) فيرتفع pH قليلاً جداً."},
 {id:"nh4cl",ar:"كلوريد الأمونيوم",f:"NH4Cl",g:"hs",t:C=>[{NH3:C,H:C,Cl:C},{}],why:"ملح من قاعدة ضعيفة (NH₃) وحامض قوي: أيون NH₄⁺ يعطي H⁺ للماء (NH₄⁺ ⇌ NH₃ + H⁺) ← <b>حامضي</b>."},
 {id:"naac",ar:"أسيتات الصوديوم",f:"CH3COONa",g:"hs",t:C=>[{Ac:C},{Na:{z:1,c:C}}],why:"ملح من حامض ضعيف وقاعدة قوية: أيون CH₃COO⁻ يأخذ H⁺ من الماء ويطلق OH⁻ ← <b>قاعدي</b>."},
 {id:"na2co3",ar:"كربونات الصوديوم",f:"Na2CO3",g:"hs",t:C=>[{CO3:C},{Na:{z:1,c:2*C}}],why:"CO₃²⁻ قاعدة قوية نسبياً (CO₃²⁻ + H₂O ⇌ HCO₃⁻ + OH⁻) ← <b>قاعدي بوضوح</b>."},
 {id:"hac",ar:"حامض الأسيتيك (ضعيف للمقارنة)",f:"CH3COOH",g:"wa",t:C=>[{H:C,Ac:C},{}],pK:4.76},
 {id:"nh3",ar:"الأمونيا (ضعيفة للمقارنة)",f:"NH3",g:"wb",t:C=>[{NH3:C},{}],pK:4.75}];
const PHXBY=Object.fromEntries(PHX.map(s=>[s.id,s]));
const PHG={sa:"حوامض قوية",sb:"قواعد قوية",ns:"أملاح متعادلة",hs:"أملاح تتحلل مائياً",wa:"حامض ضعيف",wb:"قاعدة ضعيفة"};
let PX={ready:false};
function phxSolve(s,C,T){const [tot,sp]=s.t(C);return eqSolve(tot,sp,T)}
function phxInit(){if(PX.ready)return;PX.ready=true;
 let so="";Object.keys(PHG).forEach(g=>{so+=`<optgroup label="${PHG[g]}">`+PHX.filter(s=>s.g===g).map(s=>opt(s.id,`${s.ar} ${pretty(s.f)}`,s.id==="hcl")).join("")+"</optgroup>"});
 $("tab-phx").innerHTML=`<div class="panel"><h2>الأسبوعان 11–12: الأس الهيدروجيني pH للحوامض والقواعد القوية وأملاحها</h2><p class="muted" style="margin:0"><b class="ltr">pH = −log[H⁺]</b>. الماء النقي عند <bdi class="ltr">25°C</bdi>: <bdi class="ltr"><b>[H⁺] = [OH⁻] = 1.0×10⁻⁷ M</b></bdi> لذلك <bdi class="ltr"><b>pH = 7</b></bdi>. الحامض القوي يتأين كلياً: <bdi class="ltr"><b>[H⁺] = C</b></bdi>. القاعدة القوية: <bdi class="ltr"><b>[OH⁻] = C</b></bdi>. ودائماً: <bdi class="ltr"><b>pH + pOH = 14</b></bdi>.</p></div>
 <div class="dgrid"><div class="panel dctl"><label>المحلول<select id="pxS">${so}</select></label>
  <label><span>التركيز: <b id="pxCv" class="mono ltr">0.010 M</b></span><input type="range" id="pxC" min="-8" max="0" step="0.05" value="-2"></label>
  <div class="row">${[1,0.1,0.01,0.001,1e-4,1e-6,1e-8].map(c=>`<button class="chip ltr" data-pc="${c}">${c>=0.001?c:c.toExponential(0)}</button>`).join("")}</div>
  <label>درجة الحرارة (°C)<input type="number" id="pxT" value="25" min="0" max="60" step="1"></label>
  <div class="tip">قارن: حامض قوي وملحه، ثم ملحاً يتحلل مائياً مثل NH₄Cl أو CH₃COONa. وجرّب HCl بتركيز 10⁻⁸ M: هل يصبح pH = 8؟</div>${recordBtn("pxRec","سجّل هذا القياس")}</div>
 <div class="panel dstage"><div id="pxSvg"></div><div class="res" id="pxLive"></div></div>
 <div class="panel" id="pxRes"></div></div>`;
 $("pxS").onchange=$("pxT").onchange=pxCalc;$("pxC").oninput=pxCalc;document.querySelectorAll("[data-pc]").forEach(b=>b.onclick=()=>{$("pxC").value=Math.log10(+b.dataset.pc);pxCalc()});$("pxRec").onclick=()=>{const L=PX.last;NB.add({exp:"ph",title:"pH — "+L.s.ar+" "+L.C.toExponential(2)+" M",sample:L.s.ar,rows:[{C:L.C,pH:L.e.pH}],res:{pH:L.e.pH,pHc:L.e.pHc},ref:{ideal:L.ideal}})};pxCalc()}
function pxIdeal(s,C,T){const pKw=pKwT(T);const steps=[];let pH;
 if(s.g==="sa"){const n=s.id==="h2so4"?2:1;const H=n*C;pH=-Math.log10(H);steps.push(`[H⁺] = ${n>1?n+" × ":""}C = ${H.toExponential(2)} M`,`pH = −log(${H.toExponential(2)}) = ${pH.toFixed(2)}`)}
 else if(s.g==="sb"){const n=s.n||1;const OH=n*C;const pOH=-Math.log10(OH);pH=pKw-pOH;steps.push(`[OH⁻] = ${n>1?n+" × ":""}C = ${OH.toExponential(2)} M`,`pOH = −log(${OH.toExponential(2)}) = ${pOH.toFixed(2)}`,`pH = ${pKw.toFixed(2)} − ${pOH.toFixed(2)} = ${pH.toFixed(2)}`)}
 else if(s.g==="ns"){pH=pKw/2;steps.push(`ملح متعادل ← pH = pKw/2 = ${pH.toFixed(2)}`)}
 else if(s.id==="nh4cl"){const pKa=pKw-4.75;pH=0.5*(pKa-Math.log10(C));steps.push(`Ka(NH₄⁺) = Kw / Kb(NH₃) ← pKa = ${pKw.toFixed(2)} − 4.75 = ${pKa.toFixed(2)}`,`pH = ½(pKa − log C) = ½(${pKa.toFixed(2)} − (${Math.log10(C).toFixed(2)})) = ${pH.toFixed(2)}`)}
 else if(s.id==="naac"){const pKb=pKw-4.76;const pOH=0.5*(pKb-Math.log10(C));pH=pKw-pOH;steps.push(`Kb(CH₃COO⁻) = Kw / Ka ← pKb = ${pKb.toFixed(2)}`,`pOH = ½(pKb − log C) = ${pOH.toFixed(2)}`,`pH = ${pKw.toFixed(2)} − ${pOH.toFixed(2)} = ${pH.toFixed(2)}`)}
 else if(s.id==="na2co3"){const pKb=pKw-10.33;const pOH=0.5*(pKb-Math.log10(C));pH=pKw-pOH;steps.push(`Kb₁(CO₃²⁻) = Kw / Ka₂ ← pKb = ${pKw.toFixed(2)} − 10.33 = ${pKb.toFixed(2)}`,`pOH = ½(pKb − log C) = ${pOH.toFixed(2)} ← pH = ${pH.toFixed(2)}`)}
 else if(s.g==="wa"){pH=0.5*(s.pK-Math.log10(C));steps.push(`حامض ضعيف: pH = ½(pKa − log C) = ½(${s.pK} − (${Math.log10(C).toFixed(2)})) = ${pH.toFixed(2)}`)}
 else{const pOH=0.5*(s.pK-Math.log10(C));pH=pKw-pOH;steps.push(`قاعدة ضعيفة: pOH = ½(pKb − log C) = ${pOH.toFixed(2)} ← pH = ${pH.toFixed(2)}`)}
 return{pH,steps}}
function pxCalc(){const s=PHXBY[$("pxS").value];const C=Math.pow(10,+$("pxC").value);const T=+$("pxT").value;$("pxCv").textContent=(C>=0.001?C.toFixed(C>=0.1?2:4):C.toExponential(1))+" M";
 const e=phxSolve(s,C,T);const id=pxIdeal(s,C,T);PX.last={s,C,e,ideal:id.pH};const H=e.c.H,OH=e.c["OH-"]||Math.pow(10,-pKwT(T))/H;
 const col=k=>{const c=spectralRGB(indicatorConc({[k]:3},e.pH,0.01),2.0);return`rgb(${c.join(",")})`};const lit=e.pH<4.5?"#d9534f":e.pH>8.3?"#3b6fd8":"#a678c9";
 $("pxSvg").innerHTML=`<svg viewBox="0 0 420 250" role="img" aria-label="جهاز pH والأدلة"><rect x="20" y="30" width="120" height="150" rx="14" fill="#2c3e50"/><rect x="34" y="46" width="92" height="44" rx="6" fill="#0f1f14"/><text x="80" y="76" text-anchor="middle" style="font:700 22px var(--f-mono);fill:#7dff9a">${e.pH.toFixed(2)}</text><text x="80" y="110" text-anchor="middle" style="font:600 11px var(--f-body);fill:#fff">جهاز pH</text><text x="80" y="128" text-anchor="middle" style="font:500 10px var(--f-mono);fill:#bcd">${T} °C</text><path d="M80 180 v40" stroke="#555" stroke-width="3"/>
  ${[["univ","الدليل العام"],["php","فينولفثالين"],["mo","مثيل برتقالي"]].map(([k,n],i)=>`<g transform="translate(${180+i*70} 40)"><path d="M0 0 v150 q0 16 16 16 q16 0 16 -16 v-150" fill="rgba(200,230,250,.18)" stroke="var(--ink)" stroke-width="2"/><path d="M2 60 v90 q0 14 14 14 q14 0 14 -14 v-90 z" fill="${col(k)}"/><text x="16" y="190" text-anchor="middle" style="font:600 10px var(--f-body);fill:var(--ink)">${n}</text></g>`).join("")}
  <rect x="34" y="200" width="16" height="40" fill="${lit}" stroke="#666"/><text x="58" y="225" style="font:600 10px var(--f-body);fill:var(--ink)">ورق تباع الشمس</text></svg>`;
 $("pxLive").innerHTML=`<div><span>pH (الجهاز)</span><b>${e.pH.toFixed(2)}</b></div><div><span>[H⁺] M</span><b>${H.toExponential(2)}</b></div><div><span>[OH⁻] M</span><b>${OH.toExponential(2)}</b></div><div><span>pOH</span><b>${(-Math.log10(OH)).toFixed(2)}</b></div>`;
 const pts=[];for(let L=-8;L<=0.001;L+=0.1){pts.push([-L,phxSolve(s,Math.pow(10,L),T).pH])}
 const nat=e.pH<pKwT(T)/2-0.3?"حامضي":e.pH>pKwT(T)/2+0.3?"قاعدي":"متعادل تقريباً";
 let h=`<h2>${s.ar} — <bdi class="ltr">${(C>=0.001?C:C.toExponential(1))} M</bdi></h2>`+kvRes([["المحلول",nat],["pH بقانون الكتاب",id.pH.toFixed(2)],["pH الدقيق (تراكيز)",e.pHc.toFixed(2)],["pH الجهاز (نشاط)",e.pH.toFixed(2)]]);
 h+=`<h3>الحل خطوة بخطوة</h3><div class="calcout">${id.steps.join("<br>")}</div>${s.why?`<p style="margin:0;font-size:14px">${s.why}</p>`:""}${s.note?`<p class="muted" style="margin:0">${s.note}</p>`:""}`;
 const diff=Math.abs(id.pH-e.pHc);if(diff>0.05){h+=`<div class="tip">${C<2e-6&&(s.g==="sa"||s.g==="sb")?`<b>لماذا يختلف القانون هنا؟</b> عند التراكيز الصغيرة جداً يصبح H⁺ الناتج من تأين الماء نفسه (10⁻⁷ M) مهماً. قانون الكتاب يعطي ${id.pH.toFixed(2)} وهذا مستحيل للحامض (pH > 7)! الحل الصحيح يجمع المصدرين: [H⁺]² − C[H⁺] − Kw = 0 ← pH = ${e.pHc.toFixed(2)}.`:C>0.05?"عند التراكيز العالية تقل «فعالية» الأيونات بسبب تجاذبها، فيقرأ الجهاز (النشاط) قيمة تختلف قليلاً عن الحساب البسيط. معامل النشاط هنا γ ≈ "+e.gamma1.toFixed(2)+".":"الفرق ناتج عن التقريب في قانون الكتاب (يهمل تأين الماء أو التأين الثاني)."}</div>`}
 h+=`<h3>pH مقابل التركيز</h3><div class="chart">${svgChart([{pts,col:"var(--teal)",label:s.ar}],{x0:0,x1:8,y0:0,y1:14,xl:"−log C",yl:"pH",hlines:[{y:pKwT(T)/2,label:"متعادل"}],marks:[{x:-Math.log10(C),y:e.pH,label:e.pH.toFixed(2)}],id:"px"})}</div><p class="muted" style="margin:0">للحامض القوي: كل تخفيف 10 مرات يرفع pH بمقدار 1 تقريباً، لكنه لا يتجاوز 7 مهما خُفف. للقاعدة القوية ينخفض pH بمقدار 1 ولا ينزل تحت 7.</p>`;
 h+=`<h3>مقارنة سريعة عند نفس التركيز</h3>`+tbl(["المحلول","النوع","pH"],PHX.map(x=>[x.ar,PHG[x.g],phxSolve(x,C,T).pH.toFixed(2)]));
 h+=`<p class="muted" style="margin:0">عند <bdi class="ltr">${T}°C</bdi>: <bdi class="ltr">Kw = ${Math.pow(10,-pKwT(T)).toExponential(2)} (pKw = ${pKwT(T).toFixed(2)})</bdi>، لذلك الماء المتعادل له <bdi class="ltr">pH = ${(pKwT(T)/2).toFixed(2)}</bdi>.</p>`;
 $("pxRes").innerHTML=h}
mkSec("phx","");
