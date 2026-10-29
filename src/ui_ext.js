/* =====================================================================
   UI EXTENSIONS — periodic table, compounds & naming, mixtures
   ===================================================================== */
const sup=n=>String(n).split("").map(d=>"⁰¹²³⁴⁵⁶⁷⁸⁹"[d]||d).join("");
const STATE_AR={s:"صلب",l:"سائل",g:"غاز","?":"غير معروف"};
const STATE_COL={s:"#cdb48a",l:"#7cc0e8",g:"#c9aaf0","?":"#d3d8dc"};
const BLOCK_COL={s:"#f4a58a",p:"#f7d774",d:"#8fc3e8",f:"#b5e08f"};
const LATIN={Na:"Natrium",K:"Kalium",Fe:"Ferrum",Cu:"Cuprum",Ag:"Argentum",Sn:"Stannum",Sb:"Stibium",Au:"Aurum",Hg:"Hydrargyrum",Pb:"Plumbum",W:"Wolfram"};
const GRP_OLD=["","IA","IIA","IIIB","IVB","VB","VIB","VIIB","VIIIB","VIIIB","VIIIB","IB","IIB","IIIA","IVA","VA","VIA","VIIA","VIIIA"];
const fmtNum=(x,d)=>x==null?"—":(Math.abs(x)>=1000?Math.round(x).toString():(+x.toFixed(d==null?2:d)).toString());
function heat(t){/* 0..1 -> light yellow .. deep red */const s=[[255,246,200],[247,190,95],[226,110,60],[150,30,40]];const x=Math.max(0,Math.min(1,t))*3;const i=Math.min(2,Math.floor(x)),f=x-i;const c=s[i].map((v,k)=>Math.round(v+(s[i+1][k]-v)*f));return`rgb(${c})`}
const lumDark=col=>{const m=col.match(/\d+/g);if(!m||col[0]==="#"){return false}return(0.299*m[0]+0.587*m[1]+0.114*m[2])<120};
/* =============== PERIODIC TABLE =============== */
let ptSel=26,ptMode="cat",ptT=25,ptReady=false;
function ptVal(e){if(ptMode==="r")return e.r;if(ptMode==="ie")return e.ie;if(ptMode==="en")return e.en_;if(ptMode==="m")return e.m;if(ptMode==="mp")return e.sub!=null?e.sub:e.mp;if(ptMode==="d")return e.d;return null}
const PT_RANGE={r:[25,260,false,"pm"],ie:[370,2400,false,"kJ/mol"],en:[0.7,4.0,false,"Pauling"],m:[1,294,false,"g/mol"],mp:[-272,3500,false,"°C"],d:[0.08,22.6,true,"g/cm³ (الغازات g/L)"]};
function ptColor(e){if(ptMode==="cat")return ELCAT[e.cat][2];if(ptMode==="block")return BLOCK_COL[elPos(e.Z).block];if(ptMode==="st")return STATE_COL[stateAt(e,ptT)];
 const v=ptVal(e);if(v==null)return"#e3e6e8";const [lo,hi,lg]=PT_RANGE[ptMode];const t=lg?(Math.log(v)-Math.log(lo))/(Math.log(hi)-Math.log(lo)):(v-lo)/(hi-lo);return heat(t)}
function ptInit(){if(ptReady)return;ptReady=true;
 $("ptMode").onchange=()=>{ptMode=$("ptMode").value;$("ptTrow").hidden=ptMode!=="st";ptPaint()};
 $("ptT").oninput=()=>{ptT=+$("ptT").value;$("ptTv").textContent=ptT+" °C";ptPaint()};
 document.querySelectorAll("[data-tt]").forEach(b=>b.onclick=()=>{$("ptT").value=b.dataset.tt;$("ptT").oninput()});
 $("ptQ").oninput=ptPaint;
 let h=`<div class="pthead" style="grid-column:1;grid-row:1"></div>`;
 for(let g=1;g<=18;g++)h+=`<div class="pthead" style="grid-column:${g+1};grid-row:1">${g}<br>${GRP_OLD[g]}</div>`;
 for(let p=1;p<=7;p++)h+=`<div class="pthead" style="grid-column:1;grid-row:${p+1};align-self:center">${p}</div>`;
 h+=`<div class="ph" style="grid-column:4;grid-row:7">57–71<br>La–Lu</div><div class="ph" style="grid-column:4;grid-row:8">89–103<br>Ac–Lr</div>`;
 h+=`<div class="pthead" style="grid-column:2/5;grid-row:10;align-self:center;font-family:var(--f-body);font-size:11px">اللانثانيدات ←</div><div class="pthead" style="grid-column:2/5;grid-row:11;align-self:center;font-family:var(--f-body);font-size:11px">الأكتينيدات ←</div><div style="grid-column:1/20;grid-row:9;height:10px"></div>`;
 h+=`<div class="ptinfo" id="ptInfo"></div>`;
 h+=ELEM.map(e=>{const p=elPos(e.Z);return`<button class="el" data-z="${e.Z}" style="grid-column:${p.col+1};grid-row:${p.row+1}" title="${e.ar} — ${e.en}"><span class="z">${e.Z}</span><span class="stb"></span><span class="sy">${e.s}</span><span class="nm">${e.ar.replace(/\s*\(.*\)/,"")}</span><span class="ms">${e.mn?"["+e.m+"]":fmtNum(e.m,e.m<10?3:2)}</span></button>`}).join("");
 $("ptGrid").innerHTML=h;$("ptGrid").style.gridTemplateRows="auto repeat(7,auto) 10px auto auto";$("ptGrid").style.gridTemplateColumns="24px repeat(18,minmax(48px,1fr))";
 document.querySelectorAll("#ptGrid .el").forEach(b=>{b.onclick=()=>{ptSel=+b.dataset.z;ptPaint();ptDetail()};b.onmouseenter=()=>ptInfo(+b.dataset.z);b.onmouseleave=()=>ptInfo(ptSel)});
 ptPaint();ptDetail()}
function ptPaint(){const q=$("ptQ").value.trim().toLowerCase();let counts={};
 document.querySelectorAll("#ptGrid .el").forEach(b=>{const e=ELEM[+b.dataset.z-1];const c=ptColor(e);b.style.background=c;b.style.color=lumDark(c)?"#fff":"#16202a";
  const hit=q&&(e.s.toLowerCase()===q||e.ar.includes(q)||e.en.toLowerCase().includes(q)||String(e.Z)===q);b.classList.toggle("hit",!!hit);b.classList.toggle("dim",!!q&&!hit);b.classList.toggle("on",e.Z===ptSel);
  const st=stateAt(e,ptT);b.querySelector(".stb").textContent=ptMode==="st"?st.toUpperCase():"";const k=ptMode==="cat"?e.cat:ptMode==="block"?elPos(e.Z).block:ptMode==="st"?st:null;if(k)counts[k]=(counts[k]||0)+1});
 let L="";if(ptMode==="cat")L=Object.keys(ELCAT).map(k=>`<span class="legi"><i style="background:${ELCAT[k][2]}"></i>${ELCAT[k][0]} (${counts[k]||0})</span>`).join("");
 else if(ptMode==="block")L=["s","p","d","f"].map(k=>`<span class="legi"><i style="background:${BLOCK_COL[k]}"></i>الكتلة ${k} (${counts[k]||0})</span>`).join("")+`<span class="muted">الكتلة = نوع آخر مستوى فرعي يدخله الإلكترون الأخير.</span>`;
 else if(ptMode==="st")L=["s","l","g","?"].map(k=>`<span class="legi"><i style="background:${STATE_COL[k]}"></i>${STATE_AR[k]} (${counts[k]||0})</span>`).join("")+`<span class="muted">عند ${ptT} °C وضغط 1 atm. عند حرارة الغرفة سائلان فقط: البروم Br والزئبق Hg.</span>`;
 else{const [lo,hi,lg,u]=PT_RANGE[ptMode];L=`<span class="legi" style="padding:2px 10px">${lo} <span style="display:inline-block;width:160px;height:12px;border-radius:4px;background:linear-gradient(90deg,${heat(0)},${heat(.33)},${heat(.66)},${heat(1)})"></span> ${hi} ${u}${lg?" (مقياس لوغاريتمي)":""}</span><span class="legi"><i style="background:#e3e6e8"></i>غير معروف</span>`+(ptMode==="en"?`<span class="muted">السالبية تزداد من اليسار لليمين في الدورة، وتقل من الأعلى للأسفل في المجموعة. الفلور أعلاها (3.98).</span>`:ptMode==="r"?`<span class="muted">نصف القطر يزداد نزولاً في المجموعة (أغلفة أكثر) ويقل يميناً في الدورة (شحنة نواة أكبر تجذب الإلكترونات). أكبرها Cs وFr.</span>`:ptMode==="ie"?`<span class="muted">طاقة التأين الأولى = الطاقة اللازمة لنزع أبعد إلكترون. تزداد يميناً وتقل نزولاً؛ أعلاها He ثم Ne، وأقلها Cs وFr.</span>`:ptMode==="mp"?`<span class="muted">أعلاها التنغستن W (3422°م) والكربون يتسامى عند نحو 3642°م.</span>`:ptMode==="d"?`<span class="muted">أكثفها الأوزميوم Os (22.59). الغازات بوحدة g/L فتظهر فاتحة جداً.</span>`:"")}
 $("ptLeg").innerHTML=L;ptInfo(ptSel)}
function ptInfo(Z){const e=ELEM[Z-1];const c=ptColor(e);$("ptInfo").innerHTML=`<div class="big" style="background:${c};color:${lumDark(c)?"#fff":"#16202a"}"><span class="mono" style="font-size:11px">${e.Z}</span><b>${e.s}</b><span style="font-size:11px">${e.mn?"["+e.m+"]":e.m}</span></div><div style="min-width:0"><div style="font:700 18px var(--f-display)">${e.ar} <span class="muted ltr" style="font-size:13px">${e.en}</span></div><div class="muted">${ELCAT[e.cat][0]} · ${STATE_AR[stateAt(e,25)]} عند 25°م</div><div class="mono ltr" style="text-align:right;font-size:13px">${econfStr(e.Z,true)}</div></div>`}
function bohrSVG(Z){const sh=shells(Z);const R0=36,dR=21;const Rmax=R0+dR*(sh.length-1)+8;const e=ELEM[Z-1];const N=Math.round(e.m)-Z;
 let g=`<svg viewBox="${-Rmax} ${-Rmax} ${2*Rmax} ${2*Rmax}" role="img" aria-label="نموذج بور لذرة ${e.ar}">`;
 sh.forEach((n,i)=>{const r=R0+dR*i;g+=`<circle r="${r}" fill="none" style="stroke:var(--line)" stroke-width="1.4"/>`;let dots="";for(let k=0;k<n;k++){const a=2*Math.PI*k/n;dots+=`<circle cx="${(r*Math.cos(a)).toFixed(1)}" cy="${(r*Math.sin(a)).toFixed(1)}" r="${n>18?3:4}" fill="#2563eb"/>`}
  g+=`<g style="transform-origin:0 0;animation:spin ${18+i*8}s linear infinite${i%2?" reverse":""}">${dots}</g><text x="${r*0.71+4}" y="${-r*0.71-4}" class="ax" style="fill:var(--muted)">${n}</text>`});
 g+=`<circle r="25" fill="#e76f51"/><text y="-3" text-anchor="middle" style="font:700 11px var(--f-mono);fill:#fff">${Z}p⁺</text><text y="11" text-anchor="middle" style="font:600 10px var(--f-mono);fill:#fff">≈${N}n⁰</text></svg>`;return g}
function orbitalHTML(Z){const {occ,keys}=econf(Z);const sh=shells(Z);const nmax=sh.length;
 const val=keys.filter(k=>{const n=+k[0],l=k[1];return n===nmax||(l==="d"&&n===nmax-1&&occ[k]<10)||(l==="f"&&n===nmax-2&&occ[k]<14)||(l==="d"&&n===nmax-1&&elPos(Z).block==="d")||(l==="f"&&elPos(Z).block==="f"&&n===nmax-2)});
 return val.map(k=>{const cap={s:1,p:3,d:5,f:7}[k[1]];const e=occ[k];const box=[];for(let i=0;i<cap;i++){const up=i<e?1:0,dn=i<e-cap?1:0;box.push((up?"↑":"")+(dn?"↓":""))}return`<span class="orb"><span class="bx">${box.map(b=>`<span>${b}</span>`).join("")}</span>${k}${sup(e)}</span>`}).join("")}
function ionStory(e){const p=elPos(e.Z),v=valenceE(e);if(e.cat==="ng")return`غلافه الخارجي مكتمل (${e.Z===2?2:8} إلكترونات)، لذلك هو خامل كيميائياً تقريباً ولا يكوّن أيونات بسهولة.`;
 if(e.Z===1)return"يمكن أن يفقد إلكترونه فيصبح H⁺ (في الأحماض)، أو يكتسب إلكتروناً فيصبح هيدريد H⁻ (مع الفلزات النشطة مثل NaH).";
 if(v==null)return p.block==="d"?`فلز انتقالي: يفقد إلكترونات المستوى <bdi class="ltr">${p.period}s</bdi> أولاً ثم بعض إلكترونات d، لذلك له عدة حالات تأكسد (<bdi class="ltr">${e.ox.filter(x=>x>0).map(x=>"+"+x).join(", ")||"—"}</bdi>). أيوناته غالباً ملونة بسبب انتقالات إلكترونات d.`:"عنصر من الكتلة f: أغلب مركباته بحالة التأكسد +3.";
 if(isMetal(e.s)&&v>=4)return`فلز من الكتلة p لديه ${v} إلكترونات تكافؤ: يفقد إلكترونات p فقط أو s وp معاً، لذلك له حالتا تأكسد (<bdi class="ltr">${e.ox.filter(x=>x>0).map(x=>"+"+x).join(", ")}</bdi>)${e.s==="Pb"||e.s==="Bi"||e.s==="Tl"?"؛ والحالة الأقل هي الأكثر ثباتاً للعناصر الثقيلة (تأثير الزوج الخامل)":""}.`;
 if(v<=3&&isMetal(e.s))return`لديه ${v} ${v===1?"إلكترون":"إلكترونات"} تكافؤ؛ يفقدها بسهولة ليصل إلى توزيع الغاز النبيل السابق، فيصبح أيوناً موجباً <b class="ltr">${e.s}${v>1?sup(v):""}⁺</b>.`;
 if(v>=5)return`لديه ${v} إلكترونات تكافؤ؛ يكتسب ${8-v} ${8-v===1?"إلكتروناً":"إلكترونات"} ليكمل ثمانيته، فيصبح أيوناً سالباً <b class="ltr">${e.s}${8-v>1?sup(8-v):""}⁻</b> مع الفلزات، أو يتشارك الإلكترونات مع اللافلزات (روابط تساهمية).`;
 return`لديه ${v} إلكترونات تكافؤ؛ يميل إلى <b>المشاركة</b> بالإلكترونات (روابط تساهمية) بدل فقدها أو اكتسابها${e.s==="C"?"، ولهذا يكوّن الكربون سلاسل طويلة هي أساس الكيمياء العضوية والنفط":""}.`}
function ptDetail(){const e=ELEM[ptSel-1];const p=elPos(e.Z);const c=ptColor(e);const st25=stateAt(e,25);
 const comps=[];const seen=new Set();LIB.forEach(x=>{if(seen.has(x.f))return;try{if(parseFormula(x.f)[e.s]){seen.add(x.f);comps.push(x)}}catch(err){}});
 const mat=MAT.find(m=>m.f===e.s||m.f===e.s+"2");const A=Math.round(e.m);
 const dUnit=e.st==="g"?"g/L (0°م، 1 atm)":"g/cm³";
 $("ptDet").innerHTML=`<div class="edet"><div class="panel" style="background:var(--surface-2)">
  <div class="row" style="gap:14px;align-items:center"><div class="ptinfo" style="padding:0"><div class="big" style="width:110px;height:118px;background:${c};color:${lumDark(c)?"#fff":"#16202a"}"><span class="mono">${e.Z}</span><b style="font-size:44px">${e.s}</b><span class="mono" style="font-size:12px">${e.mn?"["+e.m+"]":e.m}</span></div></div>
   <div><h2 style="font-size:24px">${e.ar}</h2><div class="ltr muted" style="text-align:start;font-size:15px">${e.en}${LATIN[e.s]?` — الرمز من الاسم اللاتيني <b>${LATIN[e.s]}</b>`:""}</div><div class="row" style="gap:6px;margin-top:4px"><span class="pill" style="background:${ELCAT[e.cat][2]};color:#16202a">${ELCAT[e.cat][0]}</span><span class="pill ${STN[st25]?STN[st25][1]:""}">${STATE_AR[st25]} عند 25°م</span>${e.mn?`<span class="pill" style="background:var(--danger-soft);color:var(--danger)">مشع — لا نظير مستقر</span>`:""}</div></div></div>
  <dl class="props">
   <dt>العدد الذري Z</dt><dd><b class="mono">${e.Z}</b> = عدد البروتونات = عدد الإلكترونات في الذرة المتعادلة</dd>
   <dt>الكتلة الذرية</dt><dd class="mono">${e.mn?`[${e.m}] — عدد كتلي لأطول النظائر عمراً`:e.m+" g/mol"}</dd>
   <dt>النيوترونات</dt><dd>N ≈ A − Z = ${A} − ${e.Z} = <b class="mono">${A-e.Z}</b> <span class="muted">(تقريبي؛ يختلف بين النظائر)</span></dd>
   <dt>الموقع</dt><dd>الدورة <b>${p.period}</b> · ${p.group?`المجموعة <b>${p.group}</b> (${GRP_OLD[p.group]})`:"سلسلة "+(p.period===6?"اللانثانيدات":"الأكتينيدات")} · الكتلة <b>${p.block}</b></dd>
   <dt>التوزيع الإلكتروني</dt><dd class="mono ltr" style="text-align:right">${econfStr(e.Z,true)}${e.Z>18?`<br><span class="muted" style="font-size:12px">${econfStr(e.Z,false)}</span>`:""}${ECX[e.Z]?`<br><span style="font-family:var(--f-body);font-size:12.5px;color:var(--warn)">استثناء من قاعدة أوفباو: نصف الامتلاء أو الامتلاء التام للمستوى d/f أكثر استقراراً.</span>`:""}${e.Z>103?`<br><span style="font-family:var(--f-body);font-size:12.5px" class="muted">متوقع نظرياً (لم يُقس).</span>`:""}</dd>
   <dt>الأغلفة (K, L, M…)</dt><dd class="mono">${shells(e.Z).join(" , ")}</dd>
   ${valenceE(e)!=null?`<dt>إلكترونات التكافؤ</dt><dd class="mono">${valenceE(e)}</dd>`:""}
   <dt>حالات التأكسد</dt><dd class="mono">${e.ox.length?e.ox.map(x=>x>0?"+"+x:x).join("، "):"—"}</dd>
   <dt>نصف القطر التساهمي</dt><dd class="mono">${e.r==null?"—":e.r+" pm"}</dd><dt>طاقة التأين الأولى</dt><dd class="mono">${e.ie==null?"—":e.ie+" kJ/mol"}</dd>
   <dt>السالبية الكهربائية</dt><dd class="mono">${e.en_==null?"—":e.en_+" (Pauling)"}</dd>
   <dt>درجة الانصهار</dt><dd class="mono">${e.sub!=null?"— (يتسامى)":fmtNum(e.mp)+(e.mp!=null?" °C":"")}</dd>
   <dt>درجة الغليان</dt><dd class="mono">${e.sub!=null?`يتسامى عند ${e.sub} °C`:fmtNum(e.bp)+(e.bp!=null?" °C":"")}</dd>
   <dt>الكثافة</dt><dd class="mono">${e.d==null?"—":e.d+" "+dUnit}</dd>
  </dl>${ELNOTE[e.s]?`<p class="muted" style="margin:0">ملاحظة: ${ELNOTE[e.s]}</p>`:""}</div>
 <div class="panel"><div class="row" style="justify-content:space-between"><h3>نموذج بور (توزيع الإلكترونات على الأغلفة)</h3></div><div class="bohr">${bohrSVG(e.Z)}</div>
  <h3>مخطط المستويات الفرعية الخارجية</h3><div style="direction:ltr;text-align:center">${orbitalHTML(e.Z)}</div><p class="muted" style="margin:0">كل مربع = أوربيتال يتسع لإلكترونين باتجاهين متعاكسين (مبدأ باولي). الإلكترونات تملأ المربعات منفردة أولاً ثم تتزاوج (قاعدة هوند).</p>
  <h3>كيف يتفاعل؟</h3><p style="margin:0">${ionStory(e)}</p>
  <h3>الاستخدامات</h3><p style="margin:0">${e.use||"—"}</p>${ptIsoHTML(e)}${ptTrendHTML(e)}
  ${ELOIL[e.s]?`<div class="oil"><b>في صناعة النفط والغاز:</b> ${ELOIL[e.s]}</div>`:""}
  ${comps.length?`<h3>مركبات تحتوي ${e.ar} (${comps.length})</h3><div class="presets">${comps.slice(0,30).map(x=>`<button class="chip ltr" data-nm="${esc(x.f)}">${pretty(x.f)}</button>`).join("")}</div>`:""}
  <div class="row"><a class="btn sm" target="_blank" rel="noopener" href="https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(e.en+" element")}&title=Special:MediaSearch&type=image">📷 صور حقيقية للعنصر</a>${mat?`<button class="btn sm primary" id="ptBench">جرّبه في الكأس ←</button>`:""}</div></div></div>`;
 document.querySelectorAll("#ptDet [data-nm]").forEach(b=>b.onclick=()=>nmShow(b.dataset.nm));
 if(mat)$("ptBench").onclick=()=>{rxSel=mat.id;showTab("rx");rxShelf()}}
/* =============== NAMING =============== */
const KINDN={salt:"ملح (مركب أيوني)",base:"قاعدة (هيدروكسيد فلز)",acid:"حامض",oxide:"أكسيد فلز (أيوني)",hydride:"هيدريد فلز",molecular:"مركب جزيئي (تساهمي)",element:"مادة عنصرية",special:"اسم خاص معتمد",alkane:"ألكان (هيدروكربون مشبع)",alkene:"ألكين",alkyne:"ألكاين",alcohol:"كحول",organic:"مركب عضوي",arom:"هيدروكربون غير مشبع"};
let nmReady=false;
function nmShow(f){showTab("nm");$("nmIn").value=f;nmRun();window.scrollTo({top:$("tab-nm").offsetTop-10,behavior:"smooth"})}
const NM_EX=["NaCl","FeCl3","CuSO4·5H2O","Fe2(SO4)3","(NH4)3PO4","KMnO4","NaHCO3","Hg2Cl2","Na2O2","H2SO4","HNO2","HCl","N2O5","SF6","P4O10","CO","C8H18","C2H5OH","CH3COOH","K4[Fe(CN)6]","PbCrO4","Mg3N2"];
const B_NOTE={"Fe|3":{I:"عملياً لا يوجد يوديد الحديد (III): أيون I⁻ يختزل Fe³⁺ إلى Fe²⁺ ويتكوّن اليود.",CO3:"كربونات الحديد (III) لا توجد: أيون Fe³⁺ حامضي جداً فيتحلل الملح مائياً إلى Fe(OH)₃ ويتصاعد CO₂.",S:"كبريتيد الحديد (III) غير مستقر ويتحول إلى FeS والكبريت."},"Cu|2":{I:"عملياً Cu²⁺ مع I⁻ يعطي CuI (نحاس I) واليود، لأن I⁻ عامل مختزل.",CN:"Cu²⁺ مع CN⁻ يتحول إلى CuCN ويتصاعد غاز السيانوجين السام."},"Al|3":{CO3:"كربونات الألمنيوم لا توجد في الماء: تتحلل إلى Al(OH)₃ وCO₂.",S:"كبريتيد الألمنيوم يتحلل بالماء ويطلق H₂S."}};
function nmInit(){if(nmReady)return;nmReady=true;
 LIB.forEach(x=>{const r=nameFormula(x.f);x._ar=x.ar||r.ar||"";x._en=x.en||r.en||""});
 $("nmEx").innerHTML=NM_EX.map(f=>`<button class="chip ltr" data-f="${esc(f)}">${pretty(f)}</button>`).join("");
 document.querySelectorAll("#nmEx .chip").forEach(b=>b.onclick=()=>{$("nmIn").value=b.dataset.f;nmRun()});
 $("nmGo").onclick=nmRun;$("nmIn").onkeydown=e=>{if(e.key==="Enter")nmRun()};
 const CM=["Li","Na","K","Rb","Cs","Be","Mg","Ca","Sr","Ba","Al","Ga","Sn","Pb","Bi","Sc","Ti","V","Cr","Mn","Fe","Co","Ni","Cu","Zn","Ag","Cd","Hg","Au","Pt"];
 let co=`<option value="NH4|1">NH₄⁺ — الأمونيوم</option>`;CM.forEach(s=>{const ox=posOx(s).filter(q=>q<=4).sort((a,b)=>a-b);ox.forEach(q=>co+=`<option value="${s}|${q}" ${s==="Fe"&&q===3?"selected":""}>${s}${q>1?sup(q):""}⁺ — ${elAl(s)}${ox.length>1||posOx(s).length>1?" ("+ROMAN[q]+")":""}</option>`)});
 $("bCat").innerHTML=co;$("bAn").innerHTML=ANI.map((a,i)=>a.k==="C2H3O2"?"":`<option value="${i}" ${a.k==="SO4"?"selected":""}>${ionF(a.k,a.q)} — ${a.ar.replace(" % "," ").replace("%","")}</option>`).join("");
 $("bCat").onchange=$("bAn").onchange=bRun;bRun();nmRules();lbRender();nmRun()}
function nmRun(){const f=$("nmIn").value.trim();const r=nameFormula(f);const lib=r.lib||(()=>{try{return LIBBY[libKey(f)]}catch(e){return null}})();let h="";
 if(!r.ok&&!(lib&&lib.length)){$("nmOut").innerHTML=`<div class="oil" style="border-color:var(--danger);background:var(--danger-soft)">${r.err||"تعذرت التسمية."}</div>`;return}
 const L=lib&&lib[0];const ar=(L&&L.ar)||r.ar,en=(L&&L.en)||r.en;
 h+=`<div style="text-align:center"><div class="nmname">${ar||"—"}</div><div class="ltr" style="font-size:16px;color:var(--muted);text-align:center">${en||""}</div>
  <div class="row" style="justify-content:center;margin-top:6px"><span class="pill" style="background:var(--teal-soft);color:var(--teal)">${KINDN[r.kind]||"مركب"}</span>${L&&STN[L.st]?`<span class="pill ${STN[L.st][1]}">${STN[L.st][0]} عند 25°م</span>`:""}${r.M?`<span class="pill" style="background:var(--surface-2)">M = ${r.M.toFixed(2)} g/mol</span>`:""}</div></div>`;
 if(lib&&lib.length){const commons=[...new Set(lib.map(x=>x.c).filter(Boolean))];const alt=lib.filter(x=>x.ar&&x.ar!==ar).map(x=>x.ar);
  if(commons.length||alt.length||(L.ar&&r.ar&&r.ar!==L.ar))h+=`<dl class="props">${commons.length?`<dt>الاسم الشائع</dt><dd>${commons.join("، ")}</dd>`:""}${alt.length?`<dt>يُعرف أيضاً</dt><dd>${alt.join("، ")}</dd>`:""}${L.ar&&r.ok&&r.ar&&r.ar!==L.ar?`<dt>الاسم النظامي</dt><dd>${r.ar} <span class="ltr muted">(${r.en})</span></dd>`:""}${L.ce?`<dt>اسم آخر</dt><dd class="ltr" style="text-align:start">${L.ce}</dd>`:""}</dl>`}
 if(r.type==="ionic"){const c=r.cat,a=r.an;h+=`<div class="ionbox"><div><div class="ion">${c.n>1?c.n+" × ":""}${c.poly?"NH₄":c.s}${Number.isInteger(c.q)?(c.q>1?sup(c.q):"")+"⁺":""}</div><small>${c.poly?"الأمونيوم":elAl(c.s)} · شحنة <bdi class="ltr">${Number.isInteger(c.q)?"+"+c.q:"?"}</bdi></small></div><div class="op">+</div><div class="neg"><div class="ion">${a.n>1?a.n+" × ":""}${ionF(a.k,a.q)}</div><small>${a.ar.replace(" % "," ").replace("%","")}</small></div><div class="op">=</div><div style="border-color:var(--ok)"><div class="ion">0</div><small>مركب متعادل</small></div></div>`}
 h+=anatomyHTML(r.ascii?(f.includes("[")?f:f):f,"nmAnat");
 if(r.steps&&r.steps.length)h+=`<h3>خطوات التسمية</h3>`+r.steps.map((s,i)=>`<div class="stepc"><div class="sh"><span class="sn">${i+1}</span><div>${s}</div></div></div>`).join("");
 if(!r.ok&&r.err)h+=`<p class="muted">${r.err}</p>`;
 if(r.M){try{const c=Object.assign({},r.cnt);if(r.hyd){c.H=(c.H||0)+2*r.hyd;c.O=(c.O||0)+r.hyd}h+=`<h3>الكتلة المولية</h3>`+tbl(["العنصر","عدد الذرات","الكتلة الذرية","المساهمة"],Object.keys(c).map(k=>[`${k} (${elAr(k)})`,c[k],AW[k],(c[k]*AW[k]).toFixed(3)]))+`<div class="calcout">M = ${Object.keys(c).map(k=>`${c[k]}×${AW[k]}`).join(" + ")} = <b>${r.M.toFixed(2)} g/mol</b></div>`}catch(e){}}
 if(lib&&lib.length){const uses=[...new Set(lib.map(x=>x.use).filter(Boolean))];const oil=lib.map(x=>x.oil).filter(Boolean);if(uses.length)h+=`<p style="margin:0"><b>الاستخدامات:</b> ${uses.join("؛ ")}</p>`;oil.forEach(o=>h+=`<div class="oil"><b>في صناعة النفط والغاز:</b> ${o}</div>`)}
 const mat=MAT.find(m=>{try{return libKey(m.fp||m.f)===libKey(f)||libKey(m.f)===libKey(f)}catch(e){return false}});
 if(mat)h+=`<button class="btn primary" id="nmBench" style="align-self:flex-start">جرّبه في الكأس ←</button>`;
 $("nmOut").innerHTML=h;bindAnatomy(f,"nmAnat");if(mat)$("nmBench").onclick=()=>{rxSel=mat.id;showTab("rx");rxShelf()}}
function bRun(){const [cs,qs]=$("bCat").value.split("|");const q=+qs;const ai=+$("bAn").value;const a=ANI[ai];const B=buildIonic(cs,q,ai);
 const note=B_NOTE[cs+"|"+q]&&B_NOTE[cs+"|"+q][a.k];
 $("bOut").innerHTML=`<div class="ionbox" style="margin-top:6px"><div><div class="ion">${cs==="NH4"?"NH₄":cs}${q>1?sup(q):""}⁺</div><small>الموجب</small></div><div class="op">↘↙</div><div class="neg"><div class="ion">${ionF(a.k,a.q)}</div><small>السالب</small></div></div>
  <div class="eqline big">${pretty(B.f)}</div>
  <ol style="margin:0;padding-inline-start:20px;font-size:14px">${B.cross.map(x=>`<li>${x}</li>`).join("")}</ol>
  <div style="text-align:center"><div class="nmname" style="font-size:20px">${B.r.ar}</div><div class="ltr muted" style="text-align:center">${B.r.en}</div></div>
  ${note?`<div class="oil" style="border-color:var(--danger);background:var(--danger-soft)"><b>تنبيه كيميائي:</b> ${note}</div>`:""}
  <button class="btn sm" id="bToNm" style="align-self:flex-start">اشرح التسمية خطوة بخطوة ←</button>`;
 $("bToNm").onclick=()=>{$("nmIn").value=B.f;nmRun();$("nmOut").scrollIntoView({behavior:"smooth",block:"start"})}}
function nmRules(){const cats=[["Na⁺","الصوديوم"],["K⁺","البوتاسيوم"],["Ag⁺","الفضة"],["NH₄⁺","الأمونيوم"],["Mg²⁺","المغنيسيوم"],["Ca²⁺","الكالسيوم"],["Ba²⁺","الباريوم"],["Zn²⁺","الخارصين"],["Al³⁺","الألمنيوم"],["Fe²⁺ / Fe³⁺","الحديد (II) / (III)"],["Cu⁺ / Cu²⁺","النحاس (I) / (II)"],["Pb²⁺ / Pb⁴⁺","الرصاص (II) / (IV)"],["Sn²⁺ / Sn⁴⁺","القصدير (II) / (IV)"],["Hg₂²⁺ / Hg²⁺","الزئبق (I) / (II)"]];
 $("nmRules").innerHTML=`<h2>قواعد التسمية (مرجع سريع)</h2>
 <details open><summary style="cursor:pointer;font-weight:700">1. المركبات الأيونية (فلز + لافلز أو أيون متعدد الذرات)</summary><ul style="margin:6px 0;padding-inline-start:20px;font-size:14px"><li>بالعربية: <b>اسم الأيون السالب + اسم الفلز معرّفاً</b> (كلوريد الصوديوم). بالإنجليزية بالعكس (sodium chloride).</li><li>الأيون السالب البسيط ينتهي بـ «يد» ‎-ide: كلوريد، أكسيد، كبريتيد، نتريد.</li><li>الفلز الذي له أكثر من شحنة نكتب شحنته برقم روماني: FeCl₃ = كلوريد الحديد (III).</li><li>مجموع الشحنات = صفر دائماً.</li></ul></details>
 <details><summary style="cursor:pointer;font-weight:700">2. الأيونات الموجبة الشائعة</summary>${tbl(["الأيون","الاسم"],cats)}</details>
 <details><summary style="cursor:pointer;font-weight:700">3. الأيونات السالبة متعددة الذرات (احفظها)</summary>${tbl(["الأيون","العربي","English","الحامض المقابل"],ANI.filter(a=>a.kind!=="mono"&&a.k!=="C2H3O2").map(a=>[`<span class="ltr mono">${ionF(a.k,a.q)}</span>`,a.ar.replace(" % "," ").replace("%",""),`<span class="ltr">${a.en}</span>`,a.acAr||"—"]))}</details>
 <details><summary style="cursor:pointer;font-weight:700">4. المركبات الجزيئية (لافلز + لافلز): البادئات</summary>${tbl(["العدد","العربي","English"],PRE_AR.slice(1).map((p,i)=>[i+1,p,PRE_EN[i+1]]))}<p class="muted" style="margin:4px 0 0">N₂O₅ = خماسي أكسيد ثنائي النيتروجين (dinitrogen pentoxide). «أحادي» لا تُكتب للعنصر الأول.</p></details>
 <details><summary style="cursor:pointer;font-weight:700">5. الأحماض</summary><ul style="margin:6px 0;padding-inline-start:20px;font-size:14px"><li>أيون ينتهي بـ «يد» (‎-ide) ← حامض الهيدرو…يك: Cl⁻ ← HCl حامض الهيدروكلوريك.</li><li>أيون ينتهي بـ «ات» (‎-ate) ← …يك (‎-ic): SO₄²⁻ ← H₂SO₄ حامض الكبريتيك.</li><li>أيون ينتهي بـ «يت» (‎-ite) ← …وز (‎-ous): SO₃²⁻ ← H₂SO₃ حامض الكبريتوز.</li><li>بادئة «بير» (per-) تعني أكسجيناً أكثر و«هيبو» (hypo-) أكسجيناً أقل: ClO₄⁻ بيركلورات، ClO⁻ هيبوكلوريت.</li></ul></details>
 <details><summary style="cursor:pointer;font-weight:700">6. الأملاح المتميئة</summary>${tbl(["عدد جزيئات الماء","العربي","English"],HYD_AR.slice(1,11).map((p,i)=>[i+1,p,HYD_EN[i+1]]))}</details>
 <details><summary style="cursor:pointer;font-weight:700">7. الهيدروكربونات (أساس النفط)</summary>${tbl(["C","المقطع","ألكان CₙH₂ₙ₊₂","ألكين CₙH₂ₙ","ألكاين CₙH₂ₙ₋₂","الحالة"],[1,2,3,4,5,6,7,8,9,10].map(n=>[n,ORG_ROOT_AR[n]+" ("+ORG_ROOT_EN[n]+"-)",`${ORG_ROOT_AR[n]}ان <span class="ltr mono">C${n>1?pretty(String(n)):""}H${pretty(String(2*n+2))}</span>`,n>1?`${ORG_ROOT_AR[n]}ين`:"—",n>1?`${ORG_ROOT_AR[n]}اين`:"—",n<=4?"غاز":"سائل"]))}<p class="muted" style="margin:4px 0 0">الألكانات C1–C4 غازات (الغاز الطبيعي والغاز السائل)، C5–C17 سوائل (البنزين والكيروسين والديزل)، C18 فما فوق صلبة (الشموع).</p></details>`}
let lbCat="all";
function lbRender(){const q=$("lbQ").value.trim().toLowerCase();const cats=["all",...Object.keys(LIBCAT),"oil"];
 $("lbF").innerHTML=cats.map(c=>`<button class="chip ${c===lbCat?"on":""}" data-c="${c}">${c==="all"?`الكل (${LIB.length})`:c==="oil"?"🛢 نفط وغاز":LIBCAT[c]}</button>`).join("");
 document.querySelectorAll("#lbF .chip").forEach(b=>b.onclick=()=>{lbCat=b.dataset.c;lbRender()});
 const list=LIB.filter(x=>(lbCat==="all"||x.cat===lbCat||(lbCat==="oil"&&x.oil))&&(!q||(x.f+" "+pretty(x.f)+" "+x._ar+" "+x._en+" "+(x.c||"")).toLowerCase().includes(q)));
 $("lbList").innerHTML=list.map(x=>`<button class="mcard" data-f="${esc(x.f)}"><span class="f">${pretty(x.f)}</span><b>${x._ar}</b><span class="muted ltr" style="text-align:start;font-size:11.5px;line-height:1.3">${x._en}</span><span class="row" style="gap:4px"><span class="pill ${STN[x.st]?STN[x.st][1]:""}">${STN[x.st]?STN[x.st][0]:""}</span>${x.oil?'<span class="pill" style="background:var(--warn-soft);color:var(--warn)">🛢</span>':""}</span></button>`).join("")||'<p class="muted">لا نتائج.</p>';
 document.querySelectorAll("#lbList .mcard").forEach(b=>b.onclick=()=>{$("nmIn").value=b.dataset.f;nmRun();$("nmIn").scrollIntoView({behavior:"smooth",block:"center"})})}
$("lbQ").oninput=()=>{if(nmReady)lbRender()};
/* =============== MIXTURES =============== */
let mxReady=false,mxSel="muddy",mxCat="all",mxRAF=0,MX={};
const MXSIM={obm:{drop:"#cfe3ef",dir:1},emuls:{drop:"#7fb8d8",dir:1,slow:true},milk:{drop:"#fffef8",dir:-1,stable:true},mayo:{drop:"#f3dc8a",dir:-1,stable:true},oilwater:{top:"#e9c46a",bot:"#bfe1f2"},fes:{g:[["#6d7378",64],["#e8d33a",36]],mag:true},saltsand:{g:[["#ffffff",50],["#d9b77a",50]]},iodsand:{g:[["#3a3448",20],["#d9b77a",80]],subl:true},granite:{g:[["#e8a8a0",60],["#f4f4f0",30],["#2a2a2a",10]]},concrete:{g:[["#9a9690",70],["#c9c6bf",30]]}};
const PALETTE=["#2563eb","#e76f51","#2a9d8f","#e9c46a","#8e44ad","#6c757d","#d63384"];
function mxInit(){if(!mxReady){mxReady=true;mxTree();
  $("mxCmp").innerHTML=`<h3 style="margin-top:0">الخليط مقابل المركب</h3>`+tbl(["","الخليط","المركب"],[["التركيب","متغير (أي نسبة)","ثابت دائماً (قانون النسب الثابتة)"],["الخواص","كل مكوّن يحتفظ بخواصه","خواص جديدة تختلف عن عناصره"],["الفصل","بطرق فيزيائية (ترشيح، تقطير، مغناطيس…)","بتفاعل كيميائي فقط"],["عند التكوين","لا تتغير الطاقة تقريباً","تنبعث أو تُمتص طاقة"],["مثال","برادة الحديد + الكبريت (يفصلها المغناطيس)","كبريتيد الحديد FeS (لا يجذبه المغناطيس)"]]);
  $("mxLaser").onclick=()=>{MX.laser=!MX.laser;$("mxLaser").classList.toggle("primary",MX.laser);mxObs("laser")};
  $("mxSettle").onclick=()=>{MX.settle=true;MX.stir=0;mxObs("settle")};$("mxStir").onclick=()=>{MX.settle=false;MX.stir=1;mxReset(true);mxObs("stir")};
  $("mxSep").onclick=()=>{MX.sep=true;mxObs("sep")};
  mxList()}
 mxSelect(mxSel);mxLoop()}
function mxStop(){cancelAnimationFrame(mxRAF);mxRAF=0}
function mxTree(){const box=(x,y,w,t,s,c)=>`<rect x="${x-w/2}" y="${y}" width="${w}" height="${s?50:34}" rx="9" fill="${c}" stroke="rgba(0,0,0,.25)"/><text x="${x}" y="${y+21}" text-anchor="middle" style="font:700 13.5px var(--f-body);fill:#16202a">${t}</text>${s?`<text x="${x}" y="${y+40}" text-anchor="middle" style="font:500 11px var(--f-body);fill:#3b4650">${s}</text>`:""}`;
 const ln=(x1,y1,x2,y2)=>`<path d="M${x1} ${y1} C${x1} ${(y1+y2)/2} ${x2} ${(y1+y2)/2} ${x2} ${y2}" fill="none" style="stroke:var(--muted)" stroke-width="1.6"/>`;
 $("mxTree").innerHTML=`<svg viewBox="0 0 620 250" role="img" aria-label="تصنيف المادة">${ln(310,40,160,86)}${ln(310,40,460,86)}${ln(160,120,85,170)}${ln(160,120,235,170)}${ln(460,120,385,170)}${ln(460,120,535,170)}
 ${box(310,6,170,"المادة","",'#e9ecef')}${box(160,86,190,"مادة نقية","",'#cfe8f2')}${box(460,86,190,"خليط","",'#fde2c4')}
 ${box(85,170,150,"عنصر","Fe ، O₂ ، Cu",'#e3f1fa')}${box(235,170,150,"مركب","H₂O ، NaCl ، CO₂",'#e3f1fa')}${box(385,170,150,"متجانس","هواء، ماء مالح، سبائك",'#feefdc')}${box(535,170,150,"غير متجانس","رمل+ماء، زيت+ماء، حليب",'#feefdc')}
 <text x="160" y="160" text-anchor="middle" style="font:500 10.5px var(--f-body);fill:var(--muted)">تركيب ثابت</text><text x="460" y="160" text-anchor="middle" style="font:500 10.5px var(--f-body);fill:var(--muted)">تركيب متغير</text></svg>`}
function mxList(){const ts=["all",...Object.keys(MIXT)];$("mxF").innerHTML=ts.map(t=>`<button class="chip ${t===mxCat?"on":""}" data-c="${t}">${t==="all"?"الكل":MIXT[t].ar.replace(/ \(.*\)/,"")}</button>`).join("");
 document.querySelectorAll("#mxF .chip").forEach(b=>b.onclick=()=>{mxCat=b.dataset.c;mxList()});
 $("mxList").innerHTML=MIX.filter(m=>mxCat==="all"||m.t===mxCat).map(m=>`<button class="mcard ${m.id===mxSel?"on":""}" data-m="${m.id}"><b>${m.ar}</b><span class="muted" style="font-size:12px">${MIXT[m.t].ar.replace(/ \(.*\)/,"")}</span><span class="sw" style="background:${m.col}"></span></button>`).join("");
 document.querySelectorAll("#mxList .mcard").forEach(b=>b.onclick=()=>{mxSelect(b.dataset.m);mxList()})}
function mxSelect(id){mxSel=id;const m=MIXBY[id];const T=MIXT[m.t];MX={m,T,laser:MX.laser||false,settle:false,stir:0,sep:false,t:0,sim:MXSIM[id]||{}};mxReset(false);
 const sb=$("mxSep");const sim=MX.sim;sb.hidden=!(sim.mag||sim.subl);if(sim.mag)sb.textContent="🧲 مرّر المغناطيس";if(sim.subl)sb.textContent="🔥 سخّن الخليط";
 $("mxLaser").classList.toggle("primary",MX.laser);
 const tot=m.comp.reduce((s,c)=>s+(c[3]||0),0)||1;
 $("mxDet").innerHTML=`<div class="row" style="justify-content:space-between"><div><h2>${m.ar}</h2><div class="muted ltr" style="text-align:start">${m.en}</div></div><span class="pill" style="background:var(--teal-soft);color:var(--teal)">${T.ar}</span></div>
 <p style="margin:0">${T.desc}</p>
 ${tbl(["الخاصية","القيمة"],[["حجم الجسيمات",T.size],["متجانس؟",T.hom?'<span class="yes">نعم — طور واحد</span>':'<span class="no">لا — أكثر من طور</span>'],["تأثير تندال (يشتت الضوء)؟",T.tyn?'<span class="yes">نعم</span>':'<span class="no">لا</span>'],["يترسب أو ينفصل عند تركه؟",T.settle?'<span class="yes">نعم</span>':'<span class="no">لا</span>'],["يُفصل بورق الترشيح؟",T.filt?'<span class="yes">نعم</span>':'<span class="no">لا</span>']])}
 <h3>المكوّنات (تركيب نموذجي)</h3><div class="bar">${m.comp.map((c,i)=>c[3]?`<span title="${c[0]} ${c[2]}" style="width:${100*c[3]/tot}%;background:${PALETTE[i%PALETTE.length]}"></span>`:"").join("")}</div>
 ${tbl(["","المكوّن","الصيغة","النسبة"],m.comp.map((c,i)=>[`<i style="display:inline-block;width:12px;height:12px;border-radius:3px;background:${PALETTE[i%PALETTE.length]}"></i>`,c[0],c[1]?`<button class="chip ltr" data-nm="${esc(c[1])}">${pretty(c[1])}</button>`:"—",c[2]||"متغير"]))}
 ${m.elem?`<p class="muted" style="margin:0">${m.elem}</p>`:""}${m.note?`<p style="margin:0">${m.note}</p>`:""}
 <h3>طرق الفصل</h3>${m.sep.length?m.sep.map(k=>{const s=SEP[k];return`<div class="stepc"><b>${s[0]} <span class="ltr muted" style="font-weight:500">(${s[1]})</span></b><div style="font-size:14px">${s[2]}</div><div class="muted">الأداة: ${s[3]}</div></div>`}).join(""):`<p class="muted" style="margin:0">لا تُفصل مكوناتها بطرق فيزيائية بسيطة${m.t==="alloy"?" (السبيكة محلول صلب؛ تحتاج صهراً أو طرقاً كيميائية/كهربائية)":""}.</p>`}
 ${m.oil?`<div class="oil"><b>في صناعة النفط والغاز:</b> ${m.oil}</div>`:""}`;
 document.querySelectorAll("#mxDet [data-nm]").forEach(b=>b.onclick=()=>nmShow(b.dataset.nm));mxObs("init")}
function mxObs(k){const m=MX.m,T=MX.T,sim=MX.sim;let t="";const solid=m.t==="alloy"||(m.t==="hetero"&&m.st==="s");
 if(k==="init")t=`<b>${m.ar}:</b> ${T.ar}. جرّب الشعاع والترسيب والتحريك لتكتشف نوع الخليط بنفسك.`;
 if(k==="laser")t=!MX.laser?"أُطفئ الشعاع.":solid?"الشعاع لا ينفذ في المواد الصلبة المعتمة؛ اختبار تندال يُجرى على السوائل والغازات.":T.tyn?`<b>يظهر مسار الشعاع بوضوح</b> داخل الخليط: الجسيمات (${T.size}) كبيرة بما يكفي لتشتيت الضوء — هذا هو <b>تأثير تندال</b>${m.t==="coll"?" وهو العلامة المميزة للغرويات":""}.`:`<b>لا يُرى الشعاع داخل الخليط</b>: الجسيمات بحجم الجزيئات أصغر من أن تشتت الضوء ← ${m.t==="gasmix"?"خليط غازي متجانس":"محلول حقيقي"}.`;
 if(k==="settle")t=m.t==="susp"?"الجسيمات تهبط تدريجياً وتتجمع في القاع، والجسيمات الأكبر تهبط أسرع (سرعة الترسيب تتناسب مع مربع نصف القطر — قانون ستوكس). السائل فوقها يصبح أصفى.":m.t==="emul"?(sim.stable?"لا ينفصل تقريباً: المادة المستحلبة تحيط بالقطرات وتمنع اندماجها.":"القطرات تتجمع وتنفصل ببطء شديد؛ في الحقل يُسرَّع ذلك بالحرارة والمواد الكاسرة للمستحلب والمجال الكهربائي."):m.t==="immisc"?"السائلان منفصلان أصلاً: الأقل كثافة في الأعلى.":m.t==="coll"?"لا يترسب مهما طال الوقت: الحركة العشوائية (البراونية) الناتجة عن تصادم جزيئات الوسط تبقي الجسيمات الغروانية معلقة.":m.t==="hetero"&&!solid?"المواد الصلبة تترسب في القاع وقطرات النفط تطفو للأعلى؛ لهذا تُستخدم الفواصل الثقالية وأحواض الترسيب.":solid?"لا تغيير: المكوّنات صلبة ثابتة في مكانها.":"لا تغيير مهما طال الوقت: الخليط المتجانس مستقر ولا يترسب.";
 if(k==="stir")t=m.t==="susp"?"عادت الجسيمات لتنتشر في السائل فأصبح عكراً من جديد.":m.t==="immisc"?"تكوّنت قطرات مؤقتة من أحد السائلين داخل الآخر، لكنها ستنفصل وتعود طبقتين بعد قليل لعدم وجود مادة مستحلبة.":m.t==="emul"?"انتشرت القطرات من جديد.":"لا تغيير ملحوظ: الخليط متجانس أصلاً أو صلب.";
 if(k==="sep")t=sim.mag?"المغناطيس يجذب برادة الحديد فقط ويبقى الكبريت الأصفر: دليل على أن كل مكوّن احتفظ بخواصه ← <b>خليط</b>. (بعد التسخين وتكوّن FeS لن يعمل المغناطيس.)":sim.subl?"اليود يتسامى بالتسخين فيتصاعد بخار بنفسجي ويتبلور على السطح البارد، ويبقى الرمل في القاع.":"";
 $("mxObs").innerHTML=t}
function mxReset(keep){const m=MX.m,sim=MX.sim;const P=[];const rnd=Math.random;
 const tot=m.comp.reduce((s,c)=>s+(c[3]||0),0)||1;
 if(m.t==="gasmix"||(m.t==="coll"&&m.st==="g")){const n=m.t==="coll"?160:140;m.comp.forEach((c,i)=>{let k=Math.max(c[3]>0?1:0,Math.round(n*(c[3]||0)/tot));if(m.t==="coll")k=i>0?90:0;for(let j=0;j<k;j++)P.push({x:130+rnd()*260,y:110+rnd()*260,vx:(rnd()-.5)*3,vy:(rnd()-.5)*3,c:m.t==="coll"&&i>0?(m.id==="smoke"?"#3c3c3c":"#8fa3b4"):PALETTE[i%PALETTE.length],r:m.t==="coll"&&i>0?2:2.6})})}
 else if(m.t==="sol"||m.t==="coll"){const n=m.t==="coll"?170:60;for(let j=0;j<n;j++)P.push({x:126+rnd()*268,y:130+rnd()*250,c:m.t==="coll"?"rgba(255,255,255,.85)":"rgba(0,0,0,.25)",r:m.t==="coll"?1.8:1})}
 else if(m.t==="susp"){for(let j=0;j<220;j++){const r=1.4+rnd()*3;P.push({x:126+rnd()*268,y:130+rnd()*250,r,c:m.id==="blood"?"#5e0d0d":m.id==="chalk"?"#ffffff":m.id==="mud"?"#5d5246":"#6b5233",vy:0})}}
 else if(m.t==="emul"){for(let j=0;j<120;j++){P.push({x:130+rnd()*260,y:135+rnd()*240,r:2.5+rnd()*5,c:sim.drop||"#fff",vy:0})}}
 else if(m.t==="immisc"){if(keep)for(let j=0;j<70;j++)P.push({x:130+rnd()*260,y:150+rnd()*220,r:3+rnd()*6,c:j%2?sim.top:sim.bot,top:j%2===1})}
 else if(m.t==="hetero"&&m.st==="s"){const g=sim.g||[[m.col,100]];g.forEach(([c,p])=>{const k=Math.round(260*p/100);for(let j=0;j<k;j++){const a=rnd()*Math.PI,rr=rnd();P.push({x:260+Math.cos(a)*160*rr,y:360-Math.sin(a)*90*rr*(1-0.3*rr),c,r:2.5+rnd()*3,ox:0,oy:0,iron:c==="#6d7378",iod:c==="#3a3448"})}})}
 else if(m.t==="hetero"){for(let j=0;j<140;j++)P.push({x:126+rnd()*268,y:130+rnd()*250,r:1.5+rnd()*3.5,c:j%3?"#7d7a5a":"#3b3a35",vy:0})}
 else if(m.t==="alloy"){const W=11,H=8;const cells=[];m.comp.forEach((c,i)=>{const k=Math.round(W*H*(c[3]||0)/tot);for(let j=0;j<k;j++)cells.push(i)});while(cells.length<W*H)cells.push(0);cells.length=W*H;for(let i=cells.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[cells[i],cells[j]]=[cells[j],cells[i]]}
  cells.forEach((ci,k)=>P.push({gx:k%W,gy:Math.floor(k/W),c:PALETTE[ci%PALETTE.length]}))}
 MX.P=P;MX.t=0;MX.sep=false;MX.vap=[]}
function mxLoop(){const cv=$("mxCan");if(!cv)return;const g=cv.getContext("2d");const step=()=>{if($("tab-mx").hidden){mxRAF=0;return}mxDraw(g);mxRAF=requestAnimationFrame(step)};if(!mxRAF)mxRAF=requestAnimationFrame(step)}
function mxDraw(g){const m=MX.m,T=MX.T,sim=MX.sim,P=MX.P;MX.t++;const W=520,H=430;g.clearRect(0,0,W,H);
 const css=getComputedStyle(document.documentElement);const ink=css.getPropertyValue("--ink").trim()||"#152029";const muted=css.getPropertyValue("--muted").trim()||"#566570";
 const liquid=["sol","coll","susp","emul","immisc"].includes(m.t)&&m.st!=="g"||(m.t==="hetero"&&m.st!=="s");const gas=m.t==="gasmix"||(m.t==="coll"&&m.st==="g");
 const beakerPath=()=>{g.beginPath();g.moveTo(118,70);g.lineTo(118,378);g.quadraticCurveTo(118,392,132,392);g.lineTo(388,392);g.quadraticCurveTo(402,392,402,378);g.lineTo(402,70)};
 g.font="600 13px IBM Plex Sans Arabic, sans-serif";g.textAlign="center";
 if(liquid){const top=m.t==="immisc"?130:125;let col=m.col;
  if(m.t==="immisc"){g.fillStyle=sim.bot;g.fillRect(120,260,280,130);g.fillStyle=sim.top;g.fillRect(120,top,280,130);g.strokeStyle="rgba(0,0,0,.25)";g.beginPath();g.moveTo(120,260);g.lineTo(400,260);g.stroke()}
  else{g.globalAlpha=m.t==="susp"&&MX.settle?Math.max(0.35,1-MX.t/500):1;g.fillStyle=col;g.fillRect(120,top,280,268);g.globalAlpha=1}
  P.forEach(p=>{if(m.t==="sol"||m.t==="coll"){p.x+=(Math.random()-.5)*(m.t==="sol"?3:1.6);p.y+=(Math.random()-.5)*(m.t==="sol"?3:1.6);p.x=Math.max(122,Math.min(398,p.x));p.y=Math.max(top+3,Math.min(388,p.y))}
   else if(m.t==="susp"){if(MX.settle){p.vy=Math.min(p.vy+0.02,0.08*p.r*p.r);p.y+=p.vy;const floor=388-p.r;if(p.y>floor){p.y=floor-Math.random()*6}}else{p.y+=(Math.random()-.5)*1.2;p.x+=(Math.random()-.5)*1.2;if(MX.stir&&p.y>370)p.y=130+Math.random()*250}p.x=Math.max(122,Math.min(398,p.x));p.y=Math.max(top+3,Math.min(389,p.y))}
   else if(m.t==="emul"){const sd=sim.dir||1;if(MX.settle&&!sim.stable){p.y+=sd*0.012*p.r*p.r;if(sd>0&&p.y>384-p.r)p.y=384-p.r-Math.random()*4;if(sd<0&&p.y<top+p.r)p.y=top+p.r+Math.random()*4}else{p.x+=(Math.random()-.5)*.8;p.y+=(Math.random()-.5)*.8}p.x=Math.max(124,Math.min(396,p.x));p.y=Math.max(top+4,Math.min(386,p.y))}
   else if(m.t==="immisc"){p.y+=p.top?-0.06*p.r*p.r:0.06*p.r*p.r;if(p.top&&p.y<260&&p.y>top){p.dead=true}if(!p.top&&p.y>260){p.dead=true}}
   else if(m.t==="hetero"){if(MX.settle){p.vy=Math.min((p.vy||0)+0.03,0.05*p.r*p.r);p.y+=p.vy;if(p.y>386-p.r)p.y=386-p.r-Math.random()*5}}
   g.fillStyle=p.c;g.beginPath();g.arc(p.x,p.y,p.r,0,7);g.fill();if(m.t==="emul"){g.strokeStyle="rgba(0,0,0,.18)";g.stroke()}});
  if(m.t==="immisc")MX.P=P.filter(p=>!p.dead);
  /* glass */g.lineWidth=3;g.strokeStyle=ink;beakerPath();g.stroke();for(let y=150;y<=370;y+=55){g.beginPath();g.moveTo(386,y);g.lineTo(400,y);g.lineWidth=1.5;g.stroke()}}
 else if(gas){g.strokeStyle=ink;g.lineWidth=3;g.beginPath();g.ellipse(260,245,150,140,0,0,7);g.stroke();g.fillStyle=m.id==="fog"?"rgba(235,240,245,.55)":m.id==="smoke"?"rgba(150,150,150,.25)":"rgba(200,225,250,.18)";g.fill();g.fillStyle=ink;g.fillRect(240,96,40,14);
  P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;const dx=p.x-260,dy=p.y-245;const q=dx*dx/(145*145)+dy*dy/(135*135);if(q>1){const sc=0.985/Math.sqrt(q);p.x=260+dx*sc;p.y=245+dy*sc;let nx=dx/(145*145),ny=dy/(135*135);const nl=Math.hypot(nx,ny)||1;nx/=nl;ny/=nl;const vn=p.vx*nx+p.vy*ny;if(vn>0){p.vx-=2*vn*nx;p.vy-=2*vn*ny}}if(m.t==="coll"){p.vx+=(Math.random()-.5)*.3;p.vy+=(Math.random()-.5)*.3;p.vx*=.95;p.vy*=.95}g.fillStyle=p.c;g.beginPath();g.arc(p.x,p.y,p.r,0,7);g.fill()});
  if(m.t==="gasmix"){g.textAlign="right";m.comp.forEach((c,i)=>{if(!c[3])return;g.fillStyle=PALETTE[i%PALETTE.length];g.fillRect(498,22+i*20,12,12);g.fillStyle=ink;g.font="500 12px IBM Plex Sans Arabic, sans-serif";g.fillText(c[0],492,32+i*20)});g.textAlign="center"}}
 else if(m.t==="alloy"){/* ingot */g.fillStyle=m.col;g.beginPath();g.moveTo(70,330);g.lineTo(200,330);g.lineTo(180,380);g.lineTo(50,380);g.closePath();g.fill();g.strokeStyle=ink;g.lineWidth=2;g.stroke();g.fillStyle=muted;g.fillText("السبيكة",125,405);
  g.strokeStyle=muted;g.setLineDash([5,4]);g.beginPath();g.moveTo(180,340);g.lineTo(255,250);g.stroke();g.setLineDash([]);
  const ox=255,oy=70,cs=22;g.fillStyle="rgba(0,0,0,.04)";g.fillRect(ox-10,oy-10,11*cs+20,8*cs+20);g.strokeStyle=ink;g.strokeRect(ox-10,oy-10,11*cs+20,8*cs+20);
  P.forEach(p=>{const x=ox+p.gx*cs+cs/2+Math.sin((MX.t/9)+p.gx+p.gy)*0.8,y=oy+p.gy*cs+cs/2;g.fillStyle=p.c;g.beginPath();g.arc(x,y,9,0,7);g.fill();g.strokeStyle="rgba(0,0,0,.3)";g.stroke()});
  if(m.id==="steel"){g.fillStyle="#111";for(let k=0;k<8;k++){g.beginPath();g.arc(ox+(k*37%10+1)*cs,oy+(k*3%7+1)*cs,3.2,0,7);g.fill()}}
  g.fillStyle=muted;g.font="500 11.5px IBM Plex Sans Arabic, sans-serif";g.fillText("تكبير ذري: ذرات مختلفة موزعة عشوائياً في شبكة واحدة",376,oy+8*cs+30);
  g.textAlign="right";m.comp.forEach((c,i)=>{if(!c[3])return;g.fillStyle=PALETTE[i%PALETTE.length];g.beginPath();g.arc(224,48+i*22,6,0,7);g.fill();g.fillStyle=ink;g.font="500 12px IBM Plex Sans Arabic, sans-serif";g.fillText(c[0]+(c[1]?" ("+c[1]+")":""),214,52+i*22)});g.textAlign="center"}
 else if(m.t==="hetero"&&m.st==="s"){g.fillStyle=getComputedStyle(document.body).getPropertyValue("--surface")||"#fff";g.strokeStyle=ink;g.lineWidth=3;g.beginPath();g.ellipse(260,372,190,26,0,0,7);g.stroke();
  if(MX.sep&&sim.mag){g.fillStyle="#c0392b";g.fillRect(205,40,110,26);g.fillStyle="#7f8c8d";g.fillRect(205,66,22,30);g.fillRect(293,66,22,30);g.fillStyle=ink;g.fillText("مغناطيس",260,58)}
  P.forEach(p=>{if(MX.sep&&sim.mag&&p.iron){if(p.tx==null){p.tx=212+Math.random()*96;p.ty=98+Math.random()*26}p.x+=(p.tx-p.x)*0.05;p.y+=(p.ty-p.y)*0.05}if(MX.sep&&sim.subl&&p.iod){p.y-=1.5;p.r*=0.995;if(p.y<60)p.y=60}g.fillStyle=p.c;g.beginPath();if(p.c==="#ffffff"){g.rect(p.x-p.r,p.y-p.r,2*p.r,2*p.r)}else g.arc(p.x,p.y,p.r,0,7);g.fill();g.strokeStyle="rgba(0,0,0,.25)";g.lineWidth=.6;g.stroke()});
  if(MX.sep&&sim.subl){g.fillStyle="rgba(150,60,200,.25)";for(let k=0;k<6;k++){g.beginPath();g.arc(200+k*25,80+Math.sin(MX.t/10+k)*20,26,0,7);g.fill()}g.fillStyle="rgba(200,220,240,.5)";g.fillRect(150,40,220,18);g.fillStyle=ink;g.fillText("سطح بارد: يتبلور اليود هنا",260,34)}}
 /* laser */
 if(MX.laser){const y=gas?235:m.t==="immisc"?200:250;g.fillStyle="#333";g.fillRect(8,y-9,48,18);g.fillStyle=muted;g.font="500 11px IBM Plex Sans Arabic, sans-serif";g.fillText("ليزر",32,y-14);
  const inside=gas?[110,410]:[120,400];g.strokeStyle="rgba(255,30,30,.9)";g.lineWidth=2;g.beginPath();g.moveTo(56,y);g.lineTo(inside[0],y);g.moveTo(inside[1],y);g.lineTo(512,y);g.stroke();
  if(!(m.t==="alloy"||(m.t==="hetero"&&m.st==="s"))){if(T.tyn){const gr=g.createLinearGradient(0,y-10,0,y+10);gr.addColorStop(0,"rgba(255,40,40,0)");gr.addColorStop(.5,"rgba(255,40,40,.85)");gr.addColorStop(1,"rgba(255,40,40,0)");g.fillStyle=gr;g.fillRect(inside[0],y-10,inside[1]-inside[0],20)}
   g.fillStyle="rgba(255,40,40,.9)";g.beginPath();g.arc(inside[0],y,3,0,7);g.arc(inside[1],y,3,0,7);g.fill()}}
 if(MX.settle)MX.t++}

function ptIsoHTML(e){const a=ISO[e.s];if(!a)return"";const tot=a.reduce((x,y)=>x+y[2],0);const avg=a.reduce((x,y)=>x+y[1]*y[2],0)/tot;
 return`<h3>النظائر الطبيعية وحساب الكتلة الذرية</h3>`+tbl(["النظير","البروتونات","النيوترونات","الكتلة (u)","الوفرة %"],a.map(([A,m,p])=>[`<span class="ltr mono"><sup>${A}</sup>${e.s}</span>`,e.Z,A-e.Z,m,p]))+`<div class="calcout">Ar = Σ (mass × abundance) / 100 = ${a.map(([A,m,p])=>`${m} × ${p}`).join(" + ")} / 100 = <b>${avg.toFixed(3)}</b></div><p class="muted" style="margin:0">${a.length===1?"عنصر له نظير مستقر واحد فقط، لذلك كتلته الذرية = كتلة هذا النظير.":"لهذا الكتلة الذرية في الجدول ليست عدداً صحيحاً: إنها متوسط موزون لنظائر العنصر حسب وفرتها في الطبيعة."}</p>`}
function ptTrendHTML(e){if(e.Z>96)return"";const mk=(k,lab,u,col)=>{const pts=ELEM.filter(x=>x.Z<=86&&x[k]!=null).map(x=>[x.Z,x[k]]);const ys=pts.map(p=>p[1]);return svgChart([{pts,col}],{x0:1,x1:86,y0:0,y1:Math.max(...ys)*1.05,xl:"العدد الذري Z",yl:lab+" ("+u+")",marks:e[k]!=null&&e.Z<=86?[{x:e.Z,y:e[k],label:e.s}]:[],vlines:[2,10,18,36,54].map(z=>({x:z+0.5,label:"",col:"var(--line)"})),id:"tr"+k})};
 return`<h3>موقعه في الاتجاهات الدورية</h3><div class="chart">${mk("ie","طاقة التأين","kJ/mol","#e76f51")}</div><div class="chart">${mk("r","نصف القطر","pm","#2563eb")}</div><p class="muted" style="margin:0">لاحظ النمط المتكرر: القمم في طاقة التأين عند الغازات النبيلة والقيعان عند الفلزات القلوية، وعكسها في نصف القطر. هذا التكرار هو سبب تسمية الجدول «الدوري».</p>`}
