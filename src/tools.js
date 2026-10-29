/* =====================================================================
   CALCULATION TOOLS — oxidation numbers, equation analysis (type, ionic & net ionic, redox), yield
   ===================================================================== */
const TYPNEG={O:-2,N:-3,S:-2,Se:-2,Te:-2,P:-3,As:-3,C:-4,Si:-4,B:-3,Cl:-1,Br:-1,I:-1,H:-1};
const FIXOX={Li:1,Na:1,K:1,Rb:1,Cs:1,Fr:1,Be:2,Mg:2,Ca:2,Sr:2,Ba:2,Ra:2,Al:3,Zn:2,Ag:1,Cd:2,Sc:3,Ga:3,F:-1};
function fracStr(x){if(Math.abs(x-Math.round(x))<1e-9)return(x>0?"+":"")+Math.round(x);for(let d=2;d<=12;d++){const n=x*d;if(Math.abs(n-Math.round(n))<1e-7)return(x>0?"+":"−")+Math.abs(Math.round(n))+"/"+d}return(x>0?"+":"")+x.toFixed(2)}
function splitCharge(f){const s=toAscii(f).replace(/\((aq|s|l|g)\)$/,"").trim();let m=s.match(/\^(\d*)([+-])$/);if(m)return{f:s.slice(0,s.length-m[0].length),q:(m[1]?+m[1]:1)*(m[2]==="+"?1:-1)};m=s.match(/\s(\d*)([+-])$/);if(m)return{f:s.slice(0,s.length-m[0].length).trim(),q:(m[1]?+m[1]:1)*(m[2]==="+"?1:-1)};if(/[A-Za-z0-9)\]][+-]$/.test(s))return{f:s.slice(0,-1),q:s.endsWith("+")?1:-1};return{f:s,q:0}}
/* general solver on element counts with total charge Q; returns {ox:{el:val}, steps:[]} */
function oxSolve(cnt,Q,label){const ox={},steps=[];const els=Object.keys(cnt);const metals=els.filter(e=>isMetal(e));
 if(els.length===1){ox[els[0]]=Q/cnt[els[0]];steps.push(Q?`${label}: أيون أحادي العنصر ← عدد التأكسد = الشحنة ÷ عدد الذرات = ${fracStr(ox[els[0]])}.`:`${label}: عنصر حر (غير متحد) ← عدد التأكسد = صفر.`);return{ox,steps}}
 els.forEach(e=>{if(FIXOX[e]!=null){ox[e]=FIXOX[e];steps.push(`${e} = ${fracStr(FIXOX[e])} (${e==="F"?"الفلور أعلى العناصر سالبية فهو دائماً −1":isMetal(e)?"فلز حالة تأكسده ثابتة في مركباته":""})`)}});
 if(cnt.H&&ox.H==null){if(metals.length&&els.every(e=>e==="H"||isMetal(e))){ox.H=-1;steps.push("H = −1 (هيدريد: الهيدروجين مرتبط بفلز فقط)")}else{ox.H=1;steps.push("H = +1 (مع اللافلزات)")}}
 let U=els.filter(e=>ox[e]==null);
 while(U.length>1){const nonm=U.filter(e=>TYPNEG[e]!=null);if(!nonm.length)break;const e=nonm.sort((a,b)=>(ELS[b].en_||0)-(ELS[a].en_||0))[0];ox[e]=TYPNEG[e];steps.push(`${e} = ${fracStr(TYPNEG[e])} (${e==="O"?"الأكسجين −2 في أغلب مركباته":"أعلى العناصر المجهولة سالبية، فيأخذ حالته السالبة المعتادة"})`);U=U.filter(x=>x!==e)}
 const known=els.filter(e=>ox[e]!=null).reduce((s,e)=>s+ox[e]*cnt[e],0);
 if(U.length===1){const e=U[0];ox[e]=(Q-known)/cnt[e];steps.push(`المجموع يجب أن يساوي ${Q?"شحنة الأيون ("+fracStr(Q)+")":"صفراً"}: <bdi class="ltr mono">${cnt[e]}×${e} + (${fracStr(known)}) = ${Q}</bdi> ← <bdi class="ltr mono">${e} = ${fracStr(ox[e])}</bdi>${Number.isInteger(ox[e])?"":" (قيمة كسرية = متوسط لذرات مختلفة الحالة)"}.`)}
 else if(U.length>1){const tot=U.reduce((s,e)=>s+cnt[e],0);const avg=(Q-known)/tot;U.forEach(e=>ox[e]=avg);steps.push(`بقي أكثر من فلز مجهول (${U.join("، ")}): لا يمكن تحديد كل واحد بالحساب وحده؛ المتوسط = ${fracStr(avg)}.`)}
 return{ox,steps}}
function oxNumbers(input){const {f,q}=splitCharge(input);let s=normF(f);let hyd=0;const hm=s.match(/^(.+?)[*.](\d*)H2O$/);if(hm){s=hm[1];hyd=+hm[2]||1}
 let cnt;try{cnt=parseFormula(s)}catch(e){return{ok:false,err:"صيغة غير مفهومة."}}if(Object.keys(cnt).some(k=>!ELS[k]))return{ok:false,err:"رمز عنصر غير صحيح."};
 const steps=[];let ox={};
 if(!q){const r=nameFormula(s);if(r.ok&&r.type==="ionic"){const c=r.cat,a=r.an;steps.push(`المركب أيوني: ${c.poly?"NH₄⁺":c.s} و<bdi class="ltr">${ionF(a.k,a.q)}</bdi> — نحسب كل أيون وحده.`);
   if(c.poly){const o=oxSolve(parseFormula("NH4"),1,"NH₄⁺");Object.assign(ox,o.ox);steps.push(...o.steps.map(x=>"• "+x))}else{ox[c.s]=c.q;steps.push(`• ${c.s} = ${fracStr(c.q)} (شحنة الأيون الموجب)`)}
   const ac=parseFormula(a.k);if(Object.keys(ac).length===1&&ox[Object.keys(ac)[0]]==null){const e=Object.keys(ac)[0];ox[e]=a.q/ac[e];steps.push(`• ${e} = ${fracStr(ox[e])} (أيون ${a.ar.replace(" % "," ").replace("%","")})`)}
   else{const o=oxSolve(ac,a.q,ionF(a.k,a.q));for(const k in o.ox)if(ox[k]==null)ox[k]=o.ox[k];steps.push(...o.steps.map(x=>"• "+x))}
   if(hyd)steps.push("ماء التبلور: H = +1 وO = −2 ولا يدخل في الحساب.");return{ok:true,ox,steps,cnt,q}}}
 const o=oxSolve(cnt,q,pretty(s)+(q?supQ(q):""));return{ok:true,ox:o.ox,steps:o.steps,cnt,q}}
/* ---------------------------------------------------------------- equation analysis */
const STRONG_ACID_AN=new Set(["Cl","Br","I","NO3","ClO4","ClO3","SO4"]);
const G1=new Set(["Li","Na","K","Rb","Cs"]);
function solRule(cat,an){const c=cat.poly?"NH4":cat.s,k=an.k;const g1=G1.has(c)||c==="NH4";
 if(g1)return[true,"أملاح الفلزات القلوية والأمونيوم ذائبة دائماً"];
 if(["NO3","CH3COO","C2H3O2","ClO3","ClO4","HCO3","MnO4","HSO4","H2PO4"].includes(k))return[true,"النترات والأسيتات والكلورات والبيركلورات ذائبة"];
 if(["Cl","Br","I"].includes(k)){if(c==="Ag"||(c==="Pb"&&cat.q===2)||(c==="Hg"&&cat.q===1)||(c==="Cu"&&cat.q===1))return[false,"الهاليدات ذائبة ما عدا مع Ag⁺ وPb²⁺ وHg₂²⁺ وCu⁺"];return[true,"الكلوريدات والبروميدات واليوديدات ذائبة غالباً"]}
 if(k==="SO4"){if(["Ba","Sr","Pb"].includes(c)||(c==="Hg"&&cat.q===1))return[false,"الكبريتات ذائبة ما عدا مع Ba²⁺ وSr²⁺ وPb²⁺"];if(["Ca","Ag"].includes(c))return[false,"كبريتات الكالسيوم والفضة قليلة الذوبان (تترسب من المحاليل المركزة)"];return[true,"الكبريتات ذائبة غالباً"]}
 if(k==="F"){if(["Ca","Mg","Sr","Ba","Pb"].includes(c))return[false,"فلوريدات Ca وMg وSr وBa وPb غير ذائبة"];return[true,"الفلوريدات ذائبة غالباً"]}
 if(k==="OH"){if(["Ba","Sr"].includes(c))return[true,"هيدروكسيدات Ba وSr ذائبة (قواعد قوية)"];if(c==="Ca")return[true,"هيدروكسيد الكالسيوم قليل الذوبان لكنه قاعدة قوية في المحلول"];return[false,"الهيدروكسيدات غير ذائبة ما عدا الفلزات القلوية وBa وSr (وCa قليلاً)"]}
 if(k==="S"){if(["Ca","Sr","Ba","Mg"].includes(c))return[true,"كبريتيدات الفلزات القلوية الترابية ذائبة (تتحلل مائياً)"];return[false,"الكبريتيدات غير ذائبة ما عدا القلوية والقلوية الترابية والأمونيوم"]}
 if(["SCN","CN"].includes(k)){if(["Ag","Hg","Pb"].includes(c)||(c==="Cu"&&cat.q===1))return[false,"ثيوسيانات وسيانيد الفضة غير ذائبة"];return[true,"ذائب غالباً"]}
 if(k==="Cr2O7")return[true,"ثنائي الكرومات ذائبة غالباً"];
 if(k==="CrO4"){if(["Ag","Pb","Ba","Sr","Hg"].includes(c))return[false,"كرومات Ag وPb وBa غير ذائبة (رواسب ملونة)"];return[true,"الكرومات ذائبة مع معظم الفلزات الأخرى"]}
 if(["O","O2"].includes(k))return[false,"أكاسيد الفلزات صلبة لا تُكتب كأيونات"];
 return[false,"الكربونات والفوسفات والكبريتيتات والأوكزالات غير ذائبة ما عدا القلوية والأمونيوم"]}
function speciesInfo(f0,st0){const {f,q}=splitCharge(f0);const s=f;
 if(q)return{kind:"ion",split:false,ions:[[f0,1]],st:"aq",why:"أيون"};
 if(s==="H2O")return{kind:"water",split:false,st:"l",why:"الماء إلكتروليت ضعيف جداً — لا يُجزأ"};
 let cnt;try{cnt=parseFormula(s)}catch(e){return{kind:"?",split:false,st:st0||""}}const els=Object.keys(cnt);
 if(els.length===1){const e=ELS[els[0]];const st=e.st==="g"?"g":e.st==="l"?"l":"s";return{kind:"element",split:false,st,why:"عنصر حر"}}
 if(["CO2","SO2","SO3","NO","NO2","N2O","CO","CH4","C2H6","C3H8","C4H10","C2H4","C2H2","H2S","NH3","O3","HCN"].includes(s)){return{kind:"molecular",split:false,st:["NH3","H2S","HCN"].includes(s)?"aq":"g",why:s==="NH3"?"قاعدة ضعيفة — تُكتب كجزيء":s==="H2S"||s==="HCN"?"حامض ضعيف — يُكتب كجزيء":"غاز جزيئي"}}
 if(s==="H2CO3")return{kind:"weak",split:false,st:"aq",why:"حامض ضعيف وغير مستقر: يتفكك إلى CO₂ + H₂O"};
 const r=nameFormula(s);
 if(r.ok&&r.type==="acid"){const strong=STRONG_ACID_AN.has(r.an.k);return strong?{kind:"sacid",split:true,st:"aq",ions:[["H^+",r.nH],[r.an.k+"^"+(Math.abs(r.an.q)>1?Math.abs(r.an.q):"")+"-",1]],why:"حامض قوي — يتأين كلياً"+(r.an.k==="SO4"?" (نعامل H₂SO₄ المخفف كمتأين كلياً للتبسيط)":"")}:{kind:"weak",split:false,st:"aq",why:"حامض ضعيف — يتأين جزئياً فيُكتب كجزيء"}}
 if(r.ok&&r.type==="organic"){if(r.kind==="acid")return{kind:"weak",split:false,st:"aq",why:"حامض عضوي ضعيف"};return{kind:"molecular",split:false,st:st0||"l",why:"مركب عضوي جزيئي"}}
 if(r.ok&&r.type==="ionic"){const c=r.cat,a=r.an;if(["O","O2","H"].includes(a.k)&&!c.poly)return{kind:"solid",split:false,st:"s",why:a.k==="H"?"هيدريد صلب":"أكسيد فلز صلب"};const [sol,why]=solRule(c,a);
  const ci=(c.poly?"NH4":c.s)+"^"+(c.q>1?c.q:"")+"+";const ai=a.k+"^"+(Math.abs(a.q)>1?Math.abs(a.q):"")+"-";return sol?{kind:a.k==="OH"?"sbase":"salt",split:true,st:"aq",ions:[[ci,c.n],[ai,a.n]],why}:{kind:"ppt",split:false,st:"s",why}}
 if(r.ok&&r.type==="molecular")return{kind:"molecular",split:false,st:st0||"g",why:"مركب جزيئي"};
 if(r.ok&&r.type==="special")return{kind:"molecular",split:false,st:st0||"",why:r.ar};
 return{kind:"?",split:false,st:st0||"",why:""}}
const ionPretty=k=>{const m=k.match(/^(.*)\^(\d*)([+-])$/);return m?pretty(m[1])+supQ((m[2]?+m[2]:1)*(m[3]==="+"?1:-1)):pretty(k)};
function analyzeEq(str){let b;try{b=balanceOrVerify(str)}catch(e){return{ok:false,err:e==="nosol"?"لا يمكن موازنة هذه المعادلة: تأكد أن النواتج صحيحة كيميائياً.":e==="arrow"?"اكتب سهماً واحداً بين المتفاعلات والنواتج (->).":"تعذرت الموازنة: "+e}}
 const L=b.L,R=b.R,co=b.coef.map(Number);const sp=[...L,...R];const info=sp.map(x=>speciesInfo(x.f,x.st));
 const fmt=(arr,start)=>arr.map((x,i)=>{const c=co[start+i];return(c>1?c+" ":"")+pretty(x.f)+"("+(info[start+i].st||"?")+")"}).join(" + ");
 const mol=fmt(L,0)+" → "+fmt(R,L.length);
 /* total ionic */const side=(arr,start)=>{const out=[];arr.forEach((x,i)=>{const I=info[start+i],c=co[start+i];if(I.split)I.ions.forEach(([ion,n])=>out.push([ion,n*c]));else out.push([x.f+"|"+(I.st||""),c])});return out};
 const TL=side(L,0),TR=side(R,L.length);const fmtT=a=>a.map(([k,c])=>{const [f,st]=k.split("|");return(c>1?c+" ":"")+(st!==undefined?pretty(f)+"("+st+")":ionPretty(f)+"(aq)")}).join(" + ");
 const agg=a=>{const m={};a.forEach(([k,c])=>m[k]=(m[k]||0)+c);return m};const AL=agg(TL),AR=agg(TR);const spect=[];
 Object.keys(AL).forEach(k=>{if(AR[k]&&!k.includes("|")){const m=Math.min(AL[k],AR[k]);spect.push(k);AL[k]-=m;AR[k]-=m}});
 let NL=Object.entries(AL).filter(x=>x[1]>0),NR=Object.entries(AR).filter(x=>x[1]>0);const g=[...NL,...NR].reduce((a,x)=>gcd(a,x[1]),0)||1;NL=NL.map(([k,c])=>[k,c/g]);NR=NR.map(([k,c])=>[k,c/g]);
 const chg=a=>a.reduce((s,[k,c])=>{if(k.includes("|"))return s;const m=k.match(/\^(\d*)([+-])$/);return s+(m?(m[1]?+m[1]:1)*(m[2]==="+"?1:-1)*c:0)},0);
 const net=NL.length&&NR.length?fmtT(NL)+" → "+fmtT(NR):null;
 /* redox */const oxs=sp.map(x=>oxNumbers(x.f));const chgs=[];const elsAll=[...new Set(sp.flatMap(x=>{try{return Object.keys(parseFormula(x.f))}catch(e){return[]}}))];
 elsAll.forEach(e=>{const lv=new Set(),rv=new Set();sp.forEach((x,i)=>{const o=oxs[i];if(!o.ok||o.ox[e]==null)return;(i<L.length?lv:rv).add(Math.round(o.ox[e]*1000)/1000)});const l=[...lv],r=[...rv];if(l.length&&r.length&&(l.length>1||r.length>1||l[0]!==r[0]))chgs.push({e,from:l,to:r})});
 const redox=chgs.length>0;let oxd=[],red=[];chgs.forEach(c=>{const d=Math.max(...c.to)-Math.min(...c.from);if(Math.max(...c.to)>Math.min(...c.from)&&c.to.some(t=>c.from.every(f=>t>f)))oxd.push(c);if(c.to.some(t=>c.from.every(f=>t<f)))red.push(c)});
 const agentOf=e=>L.filter((x,i)=>oxs[i].ok&&oxs[i].ox[e]!=null).map(x=>pretty(x.f));
 /* types */const types=[];const isEl=i=>info[i].kind==="element";const isOrg=x=>{try{const c=parseFormula(x.f);return c.C&&c.H}catch(e){return false}};
 const hasO2=L.some(x=>x.f==="O2");const prodCO2=R.some(x=>x.f==="CO2");if(hasO2&&L.some(isOrg)&&prodCO2)types.push(["احتراق","Combustion","مادة عضوية + O₂ ← CO₂ + H₂O مع انطلاق حرارة وضوء"]);
 else if(R.length===1&&L.length>=2)types.push(["اتحاد","Synthesis / combination","مادتان أو أكثر ← مادة واحدة"]);
 else if(L.length===1&&R.length>=2)types.push(["تفكك (تحلل)","Decomposition","مادة واحدة ← مادتان أو أكثر"]);
 else if(L.length===2&&R.length===2&&(isEl(0)||isEl(1))&&(isEl(L.length)||isEl(L.length+1)))types.push(["إحلال بسيط","Single displacement","عنصر نشط يحل محل عنصر أقل نشاطاً في مركبه (سلسلة النشاط)"]);
 else if(L.length===2&&R.length>=2&&!redox){types.push(["إحلال مزدوج","Double displacement","تتبادل الأيونات الموجبة والسالبة شركاءها"]);
  const acid=L.some((x,i)=>info[i].kind==="sacid"||(info[i].kind==="weak"&&(/^H/.test(x.f)||/COOH$/.test(x.f)))),base=L.some((x,i)=>info[i].kind==="sbase"||/OH\)?\d*$/.test(x.f)||x.f==="NH3");if(acid&&(base||L.some(x=>/CO3$/.test(x.f)))&&R.some(x=>x.f==="H2O"))types.push(["تعادل","Neutralization","حامض + قاعدة ← ملح + ماء"]);
  if(R.some((x,i)=>info[L.length+i].kind==="ppt"))types.push(["ترسيب","Precipitation","أحد النواتج غير ذائب فيتكون راسب"]);if(R.some(x=>["CO2","H2S","NH3","SO2"].includes(x.f)))types.push(["تكوين غاز","Gas formation","أحد النواتج غاز يتصاعد"])}
 if(redox)types.push(["أكسدة واختزال","Redox","تتغير أعداد تأكسد بعض العناصر (انتقال إلكترونات)"]);
 if(!net&&!redox&&types.length&&types[0][0]==="إحلال مزدوج")types.splice(0,types.length,["لا يحدث تفاعل","No reaction","كل النواتج ذائبة ولا يتكون ماء أو غاز أو راسب؛ الأيونات تبقى حرة في المحلول"]);
 const noIon=types.some(t=>["احتراق","اتحاد","تفكك (تحلل)"].includes(t[0]))&&!info.some(I=>I.kind==="ion");
 return{noIon,ok:true,b,L,R,co,info,mol,total:fmtT(TL)+" → "+fmtT(TR),net,spect,chgL:chg(NL),chgR:chg(NR),chgs,oxd,red,agentOf,types,oxs,sp}}
/* ---------------------------------------------------------------- UI */
let toolsReady=false;
function toolsInit(){if(toolsReady)return;toolsReady=true;
 $("tab-tools").innerHTML=`<div class="bgrid"><div class="panel"><h2>حاسبة أعداد التأكسد</h2><p class="muted" style="margin:0">اكتب صيغة مركب أو أيون (مثل <span class="ltr mono">K2Cr2O7</span> أو <span class="ltr mono">MnO4-</span> أو <span class="ltr mono">NH4+</span>).</p><div class="row"><input type="text" id="oxIn" dir="ltr" value="K2Cr2O7" style="flex:1;font-family:var(--f-mono);font-size:16px"><button class="btn primary" id="oxGo">احسب</button></div><div class="presets" id="oxEx"></div><div id="oxOut"></div>
  <details><summary style="cursor:pointer;font-weight:700">قواعد أعداد التأكسد</summary><ol style="margin:6px 0;padding-inline-start:20px;font-size:14px"><li>العنصر الحر (Fe، O₂، S₈) = صفر.</li><li>الأيون أحادي الذرة = شحنته (Na⁺ = +1، Cl⁻ = −1).</li><li>المجموع = صفر في المركب المتعادل، وشحنة الأيون في الأيون متعدد الذرات.</li><li>F = −1 دائماً. الفلزات القلوية +1، القلوية الترابية +2، Al = +3.</li><li>H = +1 مع اللافلزات، و −1 مع الفلزات (هيدريدات).</li><li>O = −2 غالباً؛ −1 في البيروكسيدات (H₂O₂)، و+2 في OF₂.</li><li>الهالوجينات −1 إلا إذا ارتبطت بالأكسجين أو بهالوجين أعلى سالبية.</li></ol></details></div>
 <div class="panel"><h2>تحليل معادلة كيميائية</h2><p class="muted" style="margin:0">اكتب معادلة (موزونة أو غير موزونة). يوازنها المختبر، يحدد نوع التفاعل، يكتب المعادلة الأيونية الكاملة والصافية، ويحدد التأكسد والاختزال.</p><div class="row"><input type="text" id="aeIn" dir="ltr" value="AgNO3 + NaCl -> AgCl + NaNO3" style="flex:1;font-family:var(--f-mono);font-size:16px"><button class="btn primary" id="aeGo">حلّل</button></div><div class="presets" id="aeEx"></div><div id="aeOut"></div></div></div>
 <div class="panel"><h2>حساب المردود والمادة المحددة</h2><div class="row"><input type="text" id="yIn" dir="ltr" value="CaCO3 + HCl -> CaCl2 + H2O + CO2" style="flex:1;font-family:var(--f-mono);font-size:16px"><button class="btn primary" id="yGo">جهّز</button></div><div id="yForm"></div><div id="yOut"></div></div>`;
 const OX=["H2SO4","KMnO4","MnO4-","Cr2O7^2-","NH4+","H2O2","Fe3O4","Na2S2O3","C2H5OH","OF2","NaH","SCN-","FeS2","CuSO4·5H2O"];$("oxEx").innerHTML=OX.map(f=>`<button class="chip ltr" data-f="${esc(f)}">${(()=>{const c=splitCharge(f);return pretty(c.f)+(c.q?supQ(c.q):"")})()}</button>`).join("");document.querySelectorAll("#oxEx .chip").forEach(b=>b.onclick=()=>{$("oxIn").value=b.dataset.f;oxRun()});
 const AE=["AgNO3 + NaCl -> AgCl + NaNO3","HCl + NaOH -> NaCl + H2O","H2SO4 + KOH -> K2SO4 + H2O","Na2CO3 + HCl -> NaCl + H2O + CO2","Zn + CuSO4 -> ZnSO4 + Cu","Fe + HCl -> FeCl2 + H2","C3H8 + O2 -> CO2 + H2O","KClO3 -> KCl + O2","H2 + O2 -> H2O","BaCl2 + Na2SO4 -> BaSO4 + NaCl","KMnO4 + HCl -> KCl + MnCl2 + Cl2 + H2O","Cu + HNO3 -> Cu(NO3)2 + NO + H2O","Pb(NO3)2 + KI -> PbI2 + KNO3","NaCl + KNO3 -> NaNO3 + KCl"];$("aeEx").innerHTML=AE.map(f=>`<button class="chip ltr" data-f="${esc(f)}">${f.replace("->","→")}</button>`).join("");document.querySelectorAll("#aeEx .chip").forEach(b=>b.onclick=()=>{$("aeIn").value=b.dataset.f;aeRun()});
 $("oxGo").onclick=oxRun;$("oxIn").onkeydown=e=>{if(e.key==="Enter")oxRun()};$("aeGo").onclick=aeRun;$("aeIn").onkeydown=e=>{if(e.key==="Enter")aeRun()};$("yGo").onclick=yForm;oxRun();aeRun();yForm()}
function oxRun(){const r=oxNumbers($("oxIn").value);if(!r.ok){$("oxOut").innerHTML=`<div class="warnbox">${r.err}</div>`;return}
 const els=Object.keys(r.cnt);const sum=els.reduce((s,e)=>s+(r.ox[e]||0)*r.cnt[e],0);
 $("oxOut").innerHTML=`<div class="ionbox" style="margin:6px 0">${els.map(e=>`<div><div class="ion">${e}</div><small>عدد التأكسد</small><div class="ion" style="color:var(--teal)">${r.ox[e]==null?"?":fracStr(r.ox[e])}</div></div>`).join("")}</div>
 <div class="stepc">${r.steps.map(s=>`<div style="font-size:14px">${s}</div>`).join("")}</div><div class="calcout">Σ = ${els.map(e=>`${r.cnt[e]}×(${r.ox[e]==null?"?":fracStr(r.ox[e])})`).join(" + ")} = ${fracStr(sum)}${r.q?` = charge ${fracStr(r.q)}`:""} ✓</div>`}
function aeRun(){const a=analyzeEq($("aeIn").value);if(!a.ok){$("aeOut").innerHTML=`<div class="warnbox">${a.err}</div>`;return}
 let h=`<h3>المعادلة الجزيئية الموزونة</h3><div class="eqline">${a.mol}</div>`;
 h+=`<div class="row" style="gap:6px">${a.types.map(t=>`<span class="pill" style="background:var(--teal-soft);color:var(--teal)" title="${t[2]}">${t[0]} <span class="ltr">(${t[1]})</span></span>`).join("")}</div><ul style="margin:0;padding-inline-start:20px;font-size:13.5px">${a.types.map(t=>`<li><b>${t[0]}:</b> ${t[2]}</li>`).join("")}</ul>`;
 h+=`<h3>حالة كل مادة</h3>`+tbl(["المادة","الحالة","يُجزأ لأيونات؟","السبب"],a.sp.map((x,i)=>[`<span class="ltr mono">${pretty(x.f)}</span>`,a.info[i].st||"—",a.info[i].split?'<span class="yes">نعم</span>':'<span class="no">لا</span>',a.info[i].why||""]));
 if(a.noIon)h+=`<div class="tip">هذا التفاعل (${a.types[0][0]}) لا يجري عادة في محلول مائي، لذلك لا نكتب له معادلة أيونية.</div>`;else{h+=`<h3>المعادلة الأيونية الكاملة</h3><div class="eqline">${a.total}</div>`;
 h+=`<h3>المعادلة الأيونية الصافية</h3>`+(a.net?`<div class="eqline big" style="font-size:18px">${a.net}</div><p class="muted" style="margin:0">الأيونات المتفرجة (حُذفت لأنها تظهر في الطرفين دون تغيير): ${a.spect.length?a.spect.map(k=>`<bdi class="ltr mono">${ionPretty(k)}</bdi>`).join("، "):"لا يوجد"}. التحقق من الشحنة: ${a.chgL} = ${a.chgR} ${a.chgL===a.chgR?"✓":"✗"}</p>`:`<div class="tip">كل الأيونات متفرجة ← <b>لا يحدث تفاعل فعلي</b>؛ المحلول مجرد خليط من الأيونات.</div>`);}
 if(a.chgs.length){h+=`<h3>التأكسد والاختزال</h3>`+tbl(["العنصر","في المتفاعلات","في النواتج","التغير"],a.chgs.map(c=>[c.e,c.from.map(fracStr).join("، "),c.to.map(fracStr).join("، "),c.to.some(t=>c.from.every(f=>t>f))?'<span class="no">تأكسد (فقد e⁻)</span>':'<span class="yes">اختزال (كسب e⁻)</span>']));
  h+=`<p style="margin:0;font-size:14px">${a.oxd.map(c=>`العنصر <b>${c.e}</b> تأكسد ← المادة <b class="ltr">${a.agentOf(c.e).join(" / ")}</b> هي <b>العامل المختزل</b>.`).join(" ")} ${a.red.map(c=>`العنصر <b>${c.e}</b> اختُزل ← المادة <b class="ltr">${a.agentOf(c.e).join(" / ")}</b> هي <b>العامل المؤكسد</b>.`).join(" ")}</p><p class="muted" style="margin:0">تذكّر: الأكسدة فقدان إلكترونات (يزداد عدد التأكسد)، والاختزال كسب إلكترونات (يقل عدد التأكسد).</p>`}
 h+=`<button class="btn sm" id="aeToBal">اشرح الموازنة خطوة بخطوة ←</button>`;$("aeOut").innerHTML=h;$("aeToBal").onclick=()=>{showTab("eq");doBalance($("aeIn").value)}}
function yForm(){let b;try{b=balanceOrVerify($("yIn").value)}catch(e){$("yForm").innerHTML=`<div class="warnbox">تعذرت الموازنة.</div>`;$("yOut").innerHTML="";return}
 const co=b.coef.map(Number);YB={b,co};
 $("yForm").innerHTML=`<div class="eqline">${b.L.map((x,i)=>(co[i]>1?co[i]+" ":"")+pretty(x.f)).join(" + ")} → ${b.R.map((x,i)=>(co[b.L.length+i]>1?co[b.L.length+i]+" ":"")+pretty(x.f)).join(" + ")}</div>
 <div class="calc">${b.L.map((x,i)=>`<label>كتلة ${pretty(x.f)} (g)<input type="number" class="yM" data-i="${i}" value="${i===0?"10.0":"10.0"}" step="any"></label>`).join("")}<label>الناتج المطلوب<select id="yP">${b.R.map((x,i)=>opt(i,pretty(x.f),i===0)).join("")}</select></label><label>الكتلة الفعلية التي حصلت عليها (g)<input type="number" id="yA" value="" step="any" placeholder="اختياري"></label></div>`;
 document.querySelectorAll(".yM,#yP,#yA").forEach(e=>e.oninput=e.onchange=yRun);yRun()}
let YB=null;
function yRun(){const {b,co}=YB;const L=b.L,R=b.R;const mm=L.map(x=>molarMass(x.f));const ms=[...document.querySelectorAll(".yM")].map(e=>+e.value);const n=ms.map((m,i)=>m/mm[i]);const ratio=n.map((v,i)=>v/co[i]);const lim=ratio.indexOf(Math.min(...ratio));
 const pi=+$("yP").value;const pf=R[pi].f;const pM=molarMass(pf);const pc=co[L.length+pi];const nP=ratio[lim]*pc;const mP=nP*pM;const act=$("yA").value?+$("yA").value:null;
 let h=tbl(["المتفاعل","الكتلة (g)","M (g/mol)","المولات","المولات ÷ المعامل"],L.map((x,i)=>[`<span class="ltr mono">${pretty(x.f)}</span>${i===lim?' <span class="pill" style="background:var(--danger-soft);color:var(--danger)">المحدد</span>':""}`,ms[i],mm[i].toFixed(2),n[i].toFixed(4),ratio[i].toFixed(4)]));
 const W=420;h+=`<svg viewBox="0 0 ${W} ${30+L.length*30}" style="width:100%;max-width:520px;direction:ltr" role="img" aria-label="مقارنة المتفاعلات">${L.map((x,i)=>{const w=Math.min(1,ratio[i]/Math.max(...ratio))*300;return`<text x="0" y="${24+i*30}" style="font:600 12px var(--f-mono);fill:var(--ink)">${pretty(x.f)}</text><rect x="90" y="${10+i*30}" width="${w}" height="18" rx="4" fill="${i===lim?"var(--danger)":"var(--teal)"}"/><text x="${96+w}" y="${24+i*30}" style="font:500 11px var(--f-mono);fill:var(--muted)">${ratio[i].toFixed(3)}</text>`}).join("")}</svg>`;
 h+=`<div class="calcout">limiting reagent: ${pretty(L[lim].f)} (smallest n/coef = ${ratio[lim].toFixed(4)})<br>n(${pretty(pf)}) = ${ratio[lim].toFixed(4)} × ${pc} = ${nP.toFixed(4)} mol<br>theoretical yield = ${nP.toFixed(4)} × ${pM.toFixed(2)} = <b>${mP.toFixed(3)} g</b>${act!=null?`<br>% yield = ${act} / ${mP.toFixed(3)} × 100 = <b>${(100*act/mP).toFixed(1)} %</b>`:""}</div>`;
 h+=`<h3>المتبقي من المتفاعلات الزائدة</h3>`+tbl(["المتفاعل","استُهلك (g)","يبقى (g)"],L.map((x,i)=>{const used=ratio[lim]*co[i]*mm[i];return[`<span class="ltr mono">${pretty(x.f)}</span>`,used.toFixed(3),(ms[i]-used).toFixed(3)]}));
 if(act!=null&&act>mP)h+=`<div class="warnbox">مردود أكبر من 100% مستحيل: الناتج غالباً غير جاف أو فيه شوائب.</div>`;else if(act!=null)h+=`<p class="muted" style="margin:0">المردود الفعلي أقل من النظري بسبب: تفاعل غير تام، تفاعلات جانبية، فقد أثناء الترشيح والنقل.</p>`;
 $("yOut").innerHTML=h}
mkSec("tools","");
