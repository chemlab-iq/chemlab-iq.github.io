/* =====================================================================
   NOMENCLATURE ENGINE — names any common inorganic formula (IUPAC + Arabic),
   simple organic families, hydrates; explains every step.
   ===================================================================== */
/* anions: key (as written in formulas), charge, Arabic (% = cation slot), English, acid Ar, acid En, kind */
const ANIONS=[
 ["F",-1,"فلوريد","fluoride","حامض الهيدروفلوريك","hydrofluoric acid","mono"],
 ["Cl",-1,"كلوريد","chloride","حامض الهيدروكلوريك","hydrochloric acid","mono"],
 ["Br",-1,"بروميد","bromide","حامض الهيدروبروميك","hydrobromic acid","mono"],
 ["I",-1,"يوديد","iodide","حامض الهيدرويوديك","hydroiodic acid","mono"],
 ["O",-2,"أكسيد","oxide","","","mono"],
 ["S",-2,"كبريتيد","sulfide","حامض الهيدروكبريتيك","hydrosulfuric acid","mono"],
 ["Se",-2,"سيلينيد","selenide","حامض الهيدروسيلينيك","hydroselenic acid","mono"],
 ["Te",-2,"تيلوريد","telluride","","","mono"],
 ["N",-3,"نتريد","nitride","","","mono"],
 ["P",-3,"فوسفيد","phosphide","","","mono"],
 ["As",-3,"زرنيخيد","arsenide","","","mono"],
 ["H",-1,"هيدريد","hydride","","","mono"],
 ["C",-4,"كربيد","carbide","","","mono"],
 ["OH",-1,"هيدروكسيد","hydroxide","","","poly"],
 ["CN",-1,"سيانيد","cyanide","حامض الهيدروسيانيك","hydrocyanic acid","poly"],
 ["SCN",-1,"ثيوسيانات","thiocyanate","حامض الثيوسيانيك","thiocyanic acid","poly"],
 ["N3",-1,"أزيد","azide","حامض الهيدرازويك","hydrazoic acid","poly"],
 ["NO3",-1,"نترات","nitrate","حامض النتريك","nitric acid","ate"],
 ["NO2",-1,"نتريت","nitrite","حامض النتروز","nitrous acid","ite"],
 ["SO4",-2,"كبريتات","sulfate","حامض الكبريتيك","sulfuric acid","ate"],
 ["SO3",-2,"كبريتيت","sulfite","حامض الكبريتوز","sulfurous acid","ite"],
 ["HSO4",-1,"كبريتات % الهيدروجينية","hydrogen sulfate","","","poly"],
 ["HSO3",-1,"كبريتيت % الهيدروجينية","hydrogen sulfite","","","poly"],
 ["S2O3",-2,"ثيوكبريتات","thiosulfate","حامض الثيوكبريتيك","thiosulfuric acid","ate"],
 ["S2O8",-2,"بيروكسي ثنائي كبريتات","peroxydisulfate","","","poly"],
 ["HS",-1,"كبريتيد % الهيدروجيني","hydrogen sulfide","","","poly"],
 ["S2",-2,"ثنائي كبريتيد","disulfide","","","poly"],
 ["CO3",-2,"كربونات","carbonate","حامض الكربونيك","carbonic acid","ate"],
 ["HCO3",-1,"كربونات % الهيدروجينية","hydrogen carbonate","","","poly"],
 ["C2O4",-2,"أوكزالات","oxalate","حامض الأوكزاليك","oxalic acid","ate"],
 ["HC2O4",-1,"أوكزالات % الهيدروجينية","hydrogen oxalate","","","poly"],
 ["CH3COO",-1,"أسيتات","acetate","حامض الأسيتيك (الخليك)","acetic acid","ate"],
 ["C2H3O2",-1,"أسيتات","acetate","حامض الأسيتيك (الخليك)","acetic acid","ate"],
 ["HCOO",-1,"فورمات","formate","حامض الفورميك","formic acid","ate"],
 ["PO4",-3,"فوسفات","phosphate","حامض الفوسفوريك","phosphoric acid","ate"],
 ["HPO4",-2,"فوسفات % أحادية الهيدروجين","hydrogen phosphate","","","poly"],
 ["H2PO4",-1,"فوسفات % ثنائية الهيدروجين","dihydrogen phosphate","","","poly"],
 ["PO3",-3,"فوسفيت","phosphite","حامض الفوسفوروز","phosphorous acid","ite"],
 ["ClO",-1,"هيبوكلوريت","hypochlorite","حامض الهيبوكلوروز","hypochlorous acid","ite"],
 ["ClO2",-1,"كلوريت","chlorite","حامض الكلوروز","chlorous acid","ite"],
 ["ClO3",-1,"كلورات","chlorate","حامض الكلوريك","chloric acid","ate"],
 ["ClO4",-1,"بيركلورات","perchlorate","حامض البيركلوريك","perchloric acid","ate"],
 ["BrO",-1,"هيبوبروميت","hypobromite","حامض الهيبوبروموز","hypobromous acid","ite"],
 ["BrO3",-1,"برومات","bromate","حامض البروميك","bromic acid","ate"],
 ["IO3",-1,"يودات","iodate","حامض اليوديك","iodic acid","ate"],
 ["IO4",-1,"بيريودات","periodate","حامض البيريوديك","periodic acid","ate"],
 ["MnO4",-1,"برمنغنات","permanganate","حامض البرمنغنيك","permanganic acid","ate"],
 ["MnO4",-2,"منغنات","manganate","","","ate"],
 ["CrO4",-2,"كرومات","chromate","حامض الكروميك","chromic acid","ate"],
 ["Cr2O7",-2,"ثنائي كرومات","dichromate","حامض ثنائي الكروميك","dichromic acid","ate"],
 ["O2",-2,"بيروكسيد","peroxide","","","poly"],
 ["O2",-1,"فوق أكسيد","superoxide","","","poly"],
 ["SiO3",-2,"سيليكات","silicate","حامض السيليسيك","silicic acid","ate"],
 ["BO3",-3,"بورات","borate","حامض البوريك","boric acid","ate"],
 ["B4O7",-2,"رباعي بورات","tetraborate","","","ate"],
 ["AsO4",-3,"زرنيخات","arsenate","حامض الزرنيخيك","arsenic acid","ate"],
 ["AsO3",-3,"زرنيخيت","arsenite","حامض الزرنيخوز","arsenous acid","ite"],
 ["AlO2",-1,"ألومينات","aluminate","","","ate"],
 ["ZnO2",-2,"زنكات","zincate","","","ate"],
 ["NH2",-1,"أميد","amide","","","poly"],
 ["C2",-2,"كربيد","carbide (acetylide)","","","poly"],
 ["Fe(CN)6",-4,"سداسي سيانو حديدات (II)","hexacyanoferrate(II)","","","poly"],
 ["Fe(CN)6",-3,"سداسي سيانو حديدات (III)","hexacyanoferrate(III)","","","poly"]];
const ANI=ANIONS.map(a=>({k:a[0],q:a[1],ar:a[2],en:a[3],acAr:a[4],acEn:a[5],kind:a[6]}));
const POLYCAT={NH4:{q:1,ar:"الأمونيوم",en:"ammonium"}};
const ROMAN=["","I","II","III","IV","V","VI","VII","VIII"];
const PRE_AR=["","أحادي","ثنائي","ثلاثي","رباعي","خماسي","سداسي","سباعي","ثماني","تساعي","عشاري"];
const PRE_EN=["","mono","di","tri","tetra","penta","hexa","hepta","octa","nona","deca"];
const HYD_AR=["","أحادية الماء","ثنائية الماء","ثلاثية الماء","رباعية الماء","خماسية الماء","سداسية الماء","سباعية الماء","ثمانية الماء","تساعية الماء","عشارية الماء","أحادية عشرة الماء","ثنائية عشرة الماء"];
const HYD_EN=["","monohydrate","dihydrate","trihydrate","tetrahydrate","pentahydrate","hexahydrate","heptahydrate","octahydrate","nonahydrate","decahydrate","undecahydrate","dodecahydrate"];
const OLDN={Fe:{2:["حديدوز","ferrous"],3:["حديديك","ferric"]},Cu:{1:["نحاسوز","cuprous"],2:["نحاسيك","cupric"]},Sn:{2:["قصديروز","stannous"],4:["قصديريك","stannic"]},Pb:{2:["رصاصوز","plumbous"],4:["رصاصيك","plumbic"]},Hg:{1:["زئبقوز","mercurous"],2:["زئبقيك","mercuric"]},Co:{2:["كوبلتوز","cobaltous"],3:["كوبلتيك","cobaltic"]},Mn:{2:["منغنوز","manganous"],3:["منغنيك","manganic"]},Cr:{2:["كروموز","chromous"],3:["كروميك","chromic"]},Au:{1:["ذهبوز","aurous"],3:["ذهبيك","auric"]}};
const ORG_ROOT_AR=["","ميث","إيث","بروب","بيوت","بنت","هكس","هبت","أوكت","نون","ديك","أنديك","دوديك","تريديك","تتراديك","بنتاديك","هكساديك","هبتاديك","أوكتاديك","نوناديك","إيكوس"];
const ORG_ROOT_EN=["","meth","eth","prop","but","pent","hex","hept","oct","non","dec","undec","dodec","tridec","tetradec","pentadec","hexadec","heptadec","octadec","nonadec","icos"];
const SPECIAL={H2O:["الماء","water","اسم شائع معتمد في IUPAC (الاسم النظامي: أكسيد الهيدروجين، ولا يُستخدم)."],H2O2:["بيروكسيد الهيدروجين","hydrogen peroxide","يحتوي على مجموعة البيروكسيد O₂²⁻ (رابطة O–O)."],NH3:["الأمونيا","ammonia","اسم شائع معتمد (النظامي: أزان azane). قاعدة ضعيفة."],N2H4:["الهيدرازين","hydrazine","وقود صواريخ وكاسح أكسجين في مراجل البخار."],PH3:["الفوسفين","phosphine","غاز سام جداً."],AsH3:["الأرسين","arsine","غاز سام جداً."],SiH4:["السيلان","silane","يشتعل ذاتياً في الهواء."],B2H6:["ثنائي البوران","diborane",""],O3:["الأوزون","ozone","صورة تآصلية للأكسجين، ثلاث ذرات O."],H2:["الهيدروجين","hydrogen","جزيء ثنائي الذرة."],N2:["النيتروجين","nitrogen","جزيء ثنائي الذرة."],O2:["الأكسجين","oxygen","جزيء ثنائي الذرة."],F2:["الفلور","fluorine","جزيء ثنائي الذرة."],Cl2:["الكلور","chlorine","جزيء ثنائي الذرة."],Br2:["البروم","bromine","جزيء ثنائي الذرة."],I2:["اليود","iodine","جزيء ثنائي الذرة."],P4:["الفسفور الأبيض","white phosphorus","4 ذرات P على شكل هرم رباعي."],S8:["الكبريت","sulfur (cyclo-octasulfur)","حلقة من 8 ذرات."],C60:["الفوليرين","buckminsterfullerene","كرة من 60 ذرة كربون."],Fe3O4:["أكسيد الحديد (II,III)","iron(II,III) oxide","أكسيد مختلط FeO·Fe₂O₃: ذرة Fe²⁺ وذرتان Fe³⁺؛ لذلك متوسط الشحنة +8/3 ليس عدداً صحيحاً."],Pb3O4:["أكسيد الرصاص (II,IV)","lead(II,IV) oxide","الرصاص الأحمر: 2PbO·PbO₂."],Mn3O4:["أكسيد المنغنيز (II,III)","manganese(II,III) oxide","أكسيد مختلط."],Co3O4:["أكسيد الكوبلت (II,III)","cobalt(II,III) oxide","أكسيد مختلط."]};
const MX_=x=>`<bdi class="ltr mono">${x}</bdi>`;
const sgn=q=>q>0?"+"+q:"−"+Math.abs(q);
const supQ=q=>{const a=Math.abs(q);return(a>1?String(a).split("").map(d=>"⁰¹²³⁴⁵⁶⁷⁸⁹"[d]).join(""):"")+(q>0?"⁺":"⁻")};
const ionF=(k,q)=>pretty(k)+supQ(q);
const elAr=s=>ELN[s]||s;const elAl=s=>"ال"+elAr(s);const elEn=s=>(ELS[s]?ELS[s].en:s).toLowerCase();
function isMetal(s){const e=ELS[s];return e&&["am","ae","tm","pt","ln","ac"].includes(e.cat)}
function posOx(s){const e=ELS[s];return e?e.ox.filter(x=>x>0):[]}
/* tokenise a simple formula into [ [symbol|group, count] ...] at top level */
function topTokens(s){const out=[];let i=0;while(i<s.length){if(s[i]==="("){let d=1,j=i+1;while(j<s.length&&d){if(s[j]==="(")d++;if(s[j]===")")d--;j++}const inner=s.slice(i+1,j-1);let n="";while(/\d/.test(s[j]||""))n+=s[j++];out.push([inner,+n||1,true]);i=j;continue}
 const m=s.slice(i).match(/^([A-Z][a-z]?)(\d*)/);if(!m)throw "tok";out.push([m[1],+m[2]||1,false]);i+=m[0].length}return out}
function normF(f){return toAscii(f).replace(/\[/g,"(").replace(/\]/g,")").replace(/\((aq|s|l|g)\)/g,"").replace(/\^?\d*[+\-]$/,"")}
/* candidates for an anion string with its multiplicity */
function anionCands(rem){const out=[];if(!rem)return out;
 /* (X)n */
 const g=rem.match(/^\((.+)\)(\d*)$/);if(g){ANI.filter(a=>a.k===g[1]).forEach(a=>out.push({a,n:+g[2]||1}));return out}
 /* monatomic with a count first (MnO2 = Mn⁴⁺ + 2 O²⁻), then exact polyatomic keys (Na2O2 = peroxide, FeS2 = disulfide) */
 const m=rem.match(/^([A-Z][a-z]?)(\d+)$/);if(m)ANI.filter(a=>a.k===m[1]&&a.kind==="mono").forEach(a=>out.push({a,n:+m[2]}));
 ANI.filter(a=>a.k===rem).forEach(a=>out.push({a,n:1}));
 return out}
/* ionic naming core: cation {sym|poly, n}, anion {a, n} */
function nameIonic(cat,an,hyd){const steps=[];const isPoly=!!POLYCAT[cat.s];const a=an.a;
 const negTot=a.q*an.n;const qc=-negTot/cat.n;
 const catLabel=isPoly?`أيون الأمونيوم NH₄⁺`:`${cat.s} (${elAr(cat.s)})`;
 steps.push(isPoly?`الصيغة تبدأ بأيون الأمونيوم <b>NH₄⁺</b> وهو أيون موجب متعدد الذرات يتصرف مثل الفلز ← المركب <b>أيوني</b>.`:`الصيغة تبدأ بـ <b>${catLabel}</b> وهو <b>فلز</b> ← المركب <b>أيوني</b> (أيون موجب من الفلز + أيون سالب).`);
 steps.push(a.kind==="mono"?`الجزء <b class="ltr">${pretty(a.k)}</b> لافلز يكتسب إلكترونات ليكمل ثمانيته فيصبح أيون <b>${a.ar.replace(" %","").replace("%","")}</b> <span class="ltr">${ionF(a.k,a.q)}</span>. عند تسمية الأيون السالب البسيط نضيف المقطع «يد» (‎-ide).`:`الجزء <b class="ltr">${pretty(a.k)}</b> هو أيون متعدد الذرات اسمه <b>${a.ar.replace(" % "," ").replace("%","")}</b> (${a.en}) وشحنته <b class="ltr">${a.q}</b> — هذه الأيونات تُحفظ أسماؤها وشحناتها من الجدول.`);
 steps.push(`مجموع الشحنات السالبة = ${MX_(`${an.n} × (${sgn(a.q)}) = ${sgn(negTot)}`)}. المركب متعادل كهربائياً، إذن مجموع الشحنات الموجبة = ${MX_(sgn(-negTot))}${cat.n>1?`، موزعة على ${cat.n} ${isPoly?"أيونات":"ذرات"}`:""} ← شحنة ${isPoly?"الأيون":"الفلز"} = <b>${MX_((cat.n>1?`${sgn(-negTot)} ÷ ${cat.n} = `:"")+(Number.isInteger(qc)?sgn(qc):(-negTot+"/"+cat.n)))}</b>.`);
 let catAr,catEn,roman="",old=null;
 if(isPoly){catAr=POLYCAT[cat.s].ar;catEn=POLYCAT[cat.s].en}
 else{const ox=posOx(cat.s);const variable=ox.length>1;catAr=elAl(cat.s);catEn=elEn(cat.s);
  if(variable){roman=ROMAN[qc];steps.push(`${elAr(cat.s)} له أكثر من حالة تأكسد (${MX_(ox.map(sgn).join(", "))})، لذلك نكتب شحنته بالأرقام الرومانية بين قوسين: <b>(${roman})</b>.${cat.s==="Hg"&&qc===1?" ملاحظة: الزئبق (I) يوجد فعلياً كأيون ثنائي Hg₂²⁺ لذلك نكتب Hg₂Cl₂ وليس HgCl.":""}`);catAr+=` (${roman})`;catEn+=`(${roman})`;old=OLDN[cat.s]&&OLDN[cat.s][qc]}
  else steps.push(`${elAr(cat.s)} له حالة تأكسد واحدة فقط (${MX_(sgn(ox[0]))})، لذلك <b>لا</b> نكتب رقماً رومانياً.`)}
 const anAr=a.ar.includes("%")?a.ar.replace("%",catAr):a.ar+" "+catAr;
 let ar=anAr,en=catEn+" "+a.en;
 steps.push(`بالعربية نبدأ باسم <b>الأيون السالب</b> ثم اسم <b>الموجب</b> معرّفاً بـ «ال»: <b>${ar}</b>. وبالإنجليزية بالعكس: الموجب أولاً ثم السالب: <b class="ltr">${en}</b>.`);
 if(old)steps.push(`الاسم القديم (ما زال شائعاً): <b>${a.ar.includes("%")?a.ar.replace("%",old[0]):a.ar+" "+old[0]}</b> — <span class="ltr">${old[1]} ${a.en}</span>. القاعدة القديمة: «وز» (‎-ous) للشحنة الأقل و«يك» (‎-ic) للشحنة الأعلى.`);
 if(hyd){ar+=" "+(HYD_AR[hyd]||`(${hyd} جزيئات ماء)`);en+=" "+(HYD_EN[hyd]||`${hyd}-hydrate`);steps.push(`الجزء <b>·${hyd}H₂O</b> هو <b>ماء التبلور</b>: ${hyd} جزيئات ماء محبوسة في البلورة لكل وحدة صيغة. نضيف للاسم «${HYD_AR[hyd]||""}» (${HYD_EN[hyd]||""}).`)}
 steps.push(`التحقق: ${MX_(`${cat.n} × (${Number.isInteger(qc)?sgn(qc):"?"}) + ${an.n} × (${sgn(a.q)}) = 0`)} ✓`);
 const kind=a.k==="OH"?"base":a.k==="O"?"oxide":a.k==="H"&&!isPoly?"hydride":"salt";
 return{ok:true,type:"ionic",kind,ar,en,steps,cat:{s:cat.s,n:cat.n,q:qc,poly:isPoly},an:{k:a.k,q:a.q,n:an.n,ar:a.ar,en:a.en},old}}
function ionicFrom(s,hyd){/* returns best ionic interpretation or null */
 let cat,rest;const am=s.match(/^\(NH4\)(\d+)(.*)$/)||s.match(/^NH4()(.*)$/);
 if(am){cat={s:"NH4",n:+am[1]||1};rest=am[2]}
 else{const m=s.match(/^([A-Z][a-z]?)(\d*)(.*)$/);if(!m||!isMetal(m[1]))return null;cat={s:m[1],n:+m[2]||1};rest=m[3]}
 const cands=anionCands(rest);if(!cands.length)return{err:`لم أتعرف على الجزء «${pretty(rest)||"—"}» كأيون سالب معروف.`,cat};
 const good=[];for(const c of cands){const qc=-c.a.q*c.n/cat.n;if(cat.s==="NH4"){if(qc===1)good.push(c);continue}if(Number.isInteger(qc)&&posOx(cat.s).includes(qc))good.push(c)}
 if(!good.length){const c=cands[0];const qc=-c.a.q*c.n/cat.n;return{err:`لو كان «${pretty(rest)}» هو ${c.a.ar.replace(" % "," ").replace("%","")} (${ionF(c.a.k,c.a.q)}) فإن شحنة ${cat.s==="NH4"?"الأمونيوم":elAl(cat.s)} تصبح ${Number.isInteger(qc)?sgn(qc):(sgn(-c.a.q*c.n)+"/"+cat.n)}، وهذه ليست من حالات تأكسده المعروفة (${cat.s==="NH4"?"+1":posOx(cat.s).map(sgn).join("، ")}). تأكد من الصيغة.`,cat}}
 return nameIonic(cat,good[0],hyd)}
function nameAcid(s){const m=s.match(/^H(\d*)(.+)$/);if(!m)return null;const n=+m[1]||1;const rest=m[2];
 const cands=ANI.filter(a=>a.k===rest&&a.q===-n&&a.acAr);if(!cands.length)return null;const a=cands[0];const steps=[];
 steps.push(`الصيغة تبدأ بالهيدروجين <b>H</b> ويليه أيون سالب ← هذا <b>حامض</b> (يعطي أيونات H⁺ في الماء).`);
 steps.push(`الأيون السالب هو <b class="ltr">${ionF(a.k,a.q)}</b> (${a.ar.replace(" % "," ").replace("%","")}) وشحنته ${a.q}، لذلك يحتاج ${n} ${n>1?"ذرات":"ذرة"} هيدروجين لتتعادل الشحنة.`);
 let ar=a.acAr,en=a.acEn,gas=null;
 if(a.kind==="mono"){steps.push(`القاعدة: الأيون ينتهي بـ «يد» (‎-ide) ← الحامض يُسمى «حامض الهيدرو...يك» (hydro-…-ic acid).`);gas=[`${a.ar} الهيدروجين`,`hydrogen ${a.en}`];steps.push(`ملاحظة: المادة النقية (غير المذابة) تُسمى <b>${gas[0]}</b> (<span class="ltr">${gas[1]}</span>)، وعند إذابتها في الماء تصبح <b>${ar}</b>.`)}
 else if(a.kind==="ate")steps.push(`القاعدة: الأيون ينتهي بـ «ات» (‎-ate) ← الحامض ينتهي بـ «يك» (‎-ic): ${a.ar.replace(" % "," ").replace("%","")} ← <b>${ar}</b>.`);
 else if(a.kind==="ite")steps.push(`القاعدة: الأيون ينتهي بـ «يت» (‎-ite) ← الحامض ينتهي بـ «وز» (‎-ous): ${a.ar.replace(" % "," ").replace("%","")} ← <b>${ar}</b>.`);
 else steps.push(`الحامض المقابل لهذا الأيون: <b>${ar}</b>.`);
 if(s==="H3PO3")steps.push("ملاحظة متقدمة: في H₃PO₃ ذرة هيدروجين واحدة مرتبطة مباشرة بالفسفور، لذلك هو حامض ثنائي البروتون فقط.");
 return{ok:true,type:"acid",kind:"acid",ar,en,steps,gas,an:{k:a.k,q:a.q,n:1,ar:a.ar,en:a.en},nH:n}}
const IDE_EN={F:"fluoride",Cl:"chloride",Br:"bromide",I:"iodide",O:"oxide",S:"sulfide",Se:"selenide",Te:"telluride",N:"nitride",P:"phosphide",As:"arsenide",H:"hydride",C:"carbide",Si:"silicide",B:"boride"};
const IDE_AR={F:"فلوريد",Cl:"كلوريد",Br:"بروميد",I:"يوديد",O:"أكسيد",S:"كبريتيد",Se:"سيلينيد",Te:"تيلوريد",N:"نتريد",P:"فوسفيد",As:"زرنيخيد",H:"هيدريد",C:"كربيد",Si:"سيليسيد",B:"بوريد"};
function nameMolecular(toks){const [[A,nA],[B,nB]]=toks;if(!IDE_EN[B])return null;const steps=[];
 steps.push(`العنصران <b>${A}</b> (${elAr(A)}) و<b>${B}</b> (${elAr(B)}) ${["md"].includes(ELS[A].cat)?"شبه فلز ولافلز":"لافلزان"} ← المركب <b>جزيئي (تساهمي)</b>: الذرات تتشارك الإلكترونات ولا توجد أيونات، لذلك <b>لا نستخدم الشحنات</b> بل نستخدم <b>بادئات عددية</b> تبين عدد كل ذرة.`);
 const useMono=nB===1&&["O","F","Cl","Br","I"].includes(B);
 const pB_ar=nB>1||useMono?PRE_AR[nB]+" ":"";const pA_ar=nA>1?" "+PRE_AR[nA]:"";
 let pB_en=nB>1||useMono?PRE_EN[nB]:"";if(B==="O"&&pB_en&&/[ao]$/.test(pB_en))pB_en=pB_en.slice(0,-1);
 const pA_en=nA>1?PRE_EN[nA]:"";
 const ar=`${pB_ar}${IDE_AR[B]}${pA_ar?pA_ar+" "+elAl(A):" "+elAl(A)}`.replace(/\s+/g," ").trim();
 const en=`${pA_en}${elEn(A)} ${pB_en}${IDE_EN[B]}`;
 steps.push(`البادئات: ${[[nA,A],[nB,B]].map(([n,s])=>`${s}: ${n} ← «${PRE_AR[n]}» (${PRE_EN[n]})`).join(" · ")}.`);
 steps.push(`بالعربية: نبدأ بالعنصر الثاني مع المقطع «يد» ثم الأول: <b>${ar}</b>. البادئة «أحادي» لا تُكتب للعنصر الأول${useMono?"، وتُكتب للثاني عندما يكون أكسجين أو هالوجين لتمييز المركبات (مثل CO و CO₂)":""}.`);
 steps.push(`بالإنجليزية: العنصر الأول ثم الثاني منتهياً بـ ‎-ide: <b class="ltr">${en}</b>${B==="O"&&(nB===1||nB>=4)?" (يُحذف حرف a أو o من البادئة قبل oxide: monoxide, pentoxide)":""}.`);
 if(ELS[A].en_!=null&&ELS[B].en_!=null&&ELS[A].en_>ELS[B].en_&&A!=="H")steps.push(`تنبيه: العرف أن يُكتب العنصر الأقل سالبية كهربائية أولاً. هنا ${A} (${ELS[A].en_}) أعلى من ${B} (${ELS[B].en_})، فتأكد من ترتيب الصيغة.`);
 return{ok:true,type:"molecular",kind:"molecular",ar,en,steps}}
function nameOrganic(s,cnt){const C=cnt.C||0,H=cnt.H||0,O=cnt.O||0,N=cnt.N||0,X=(cnt.Cl||0)+(cnt.Br||0)+(cnt.F||0)+(cnt.I||0);const steps=[];
 const dbe=C+1+N/2-(H+X)/2;const others=Object.keys(cnt).filter(k=>!["C","H","O","N","Cl","Br","F","I","S"].includes(k));if(others.length||!C||!H)return null;
 const rootAr=ORG_ROOT_AR[C],rootEn=ORG_ROOT_EN[C];
 steps.push(`المركب يحتوي على <b>كربون وهيدروجين</b> ← مركب <b>عضوي</b>. عدد ذرات الكربون = <b>${C}</b>${rootAr?` ← المقطع الأساسي «${rootAr}» (${rootEn}-)`:""}.`);
 steps.push(`درجة عدم التشبع (عدد الحلقات + الروابط المزدوجة) = ${MX_(`C + 1 + N/2 − (H + X)/2 = ${C} + 1${N?` + ${N}/2`:""} − ${H+X}/2 = ${dbe}`)}.`);
 let ar=null,en=null,kind="organic";
 const cooh=s.match(/^(?:C(\d*)H(\d+)|H)COOH$/);const oh=s.match(/^C(\d*)H(\d+)OH$/);
 if(cooh){const c=C;if(H===2*c&&O===2&&ORG_ROOT_AR[c]){ar=`حامض ال${ORG_ROOT_AR[c]}انويك`;en=`${ORG_ROOT_EN[c]}anoic acid`;kind="acid";steps.push(`المجموعة <b>‎-COOH</b> (كربوكسيل) ← <b>حامض كربوكسيلي</b>. القاعدة: اسم الألكان + «ويك» (‎-oic acid). ذرة كربون COOH تُحسب ضمن السلسلة.`);const com={1:["الفورميك","formic"],2:["الأسيتيك (الخليك)","acetic"],3:["البروبيونيك","propionic"],4:["البيوتيريك","butyric"]}[c];if(com)steps.push(`الاسم الشائع: <b>حامض ${com[0]}</b> (${com[1]} acid).`)}}
 else if(oh&&H===2*C+2&&O===1&&ORG_ROOT_AR[C]){ar=`${ORG_ROOT_AR[C]}انول`;en=`${ORG_ROOT_EN[C]}anol`;kind="alcohol";steps.push(`المجموعة <b>‎-OH</b> مرتبطة بسلسلة ألكيل C${C>1?pretty(String(C)):""}H${pretty(String(2*C+1))} ← <b>كحول</b>. القاعدة: اسم الألكان مع استبدال «ان» بـ «انول» (‎-ane ← ‎-anol).`);if(C>=3)steps.push(`مع ${C} ذرات كربون أو أكثر يجب تحديد موقع OH برقم (مثل 1-${ar} أو 2-${ar}).`)}
 else if(!O&&!N&&!X&&!cnt.S){if(H===2*C+2){ar=rootAr?rootAr+"ان":null;en=rootEn?rootEn+"ane":null;kind="alkane";steps.push(`الصيغة تحقق <b>CₙH₂ₙ₊₂</b> (${MX_(`${H} = 2×${C} + 2`)}) ← <b>ألكان</b> مشبع (روابط أحادية فقط). اللاحقة «ان» (‎-ane).`);if(C>=4)steps.push(`ابتداءً من 4 ذرات كربون توجد <b>متماكبات</b> بنفس الصيغة (سلسلة مستقيمة أو متفرعة)؛ الاسم أعلاه للسلسلة المستقيمة (n-).`)}
  else if(H===2*C&&C>=2){ar=rootAr?rootAr+"ين":null;en=rootEn?rootEn+"ene":null;kind="alkene";steps.push(`الصيغة تحقق <b>CₙH₂ₙ</b> ← <b>ألكين</b> (رابطة مزدوجة واحدة C=C، اللاحقة «ين» ‎-ene)، أو <b>ألكان حلقي</b> (مثل ${rootAr}ان حلقي cyclo${rootEn}ane).`)}
  else if(H===2*C-2&&C>=2){ar=rootAr?rootAr+"اين":null;en=rootEn?rootEn+"yne":null;kind="alkyne";steps.push(`الصيغة تحقق <b>CₙH₂ₙ₋₂</b> ← <b>ألكاين</b> (رابطة ثلاثية C≡C، اللاحقة «اين» ‎-yne)، أو ألكادايين (رابطتان مزدوجتان).`)}
  else{kind="arom";steps.push(dbe>=4?`درجة عدم التشبع ${dbe} ≥ 4 ← غالباً مركب <b>أروماتي</b> (يحتوي حلقة بنزين).`:`هيدروكربون غير مشبع بـ ${dbe} روابط مزدوجة أو حلقات.`)}}
 else if(O===1&&!N&&!X&&H===2*C+2){steps.push(`الصيغة الجزيئية CₙH₂ₙ₊₂O تناسب <b>كحولاً</b> (R–OH) أو <b>إيثراً</b> (R–O–R′) — هذا مثال على <b>التماكب</b>: نفس الصيغة الجزيئية وتركيب مختلف. اكتب الصيغة البنائية المختصرة (مثل C₂H₅OH أو CH₃OCH₃) لتحديد الاسم.`)}
 else steps.push(`للتسمية الدقيقة للمركبات العضوية نحتاج <b>الصيغة البنائية</b> لا الجزيئية فقط، لأن الصيغة الواحدة قد تطابق عدة مركبات.`);
 if(C>20&&kind==="alkane"){ar=`ألكان بـ ${C} ذرة كربون`;en=`C${C} alkane`}
 return{ok:true,type:"organic",kind,ar,en,steps,dbe}}
/* ----------------------------------------------------------------------------- main */
function nameFormula(input){const raw=String(input||"").trim();if(!raw)return{ok:false,err:"اكتب صيغة."};
 let s=normF(raw);let hyd=0;const hm=s.match(/^(.+?)[*.](\d*)H2O$/);if(hm){s=hm[1];hyd=+hm[2]||1}
 let cnt;try{cnt=parseFormula(s)}catch(e){return{ok:false,err:"الصيغة غير مفهومة. تأكد من الأحرف الكبيرة والصغيرة (مثل Co كوبلت و CO أول أكسيد الكربون) ومن الأقواس."}}
 const bad=Object.keys(cnt).filter(k=>!ELS[k]);if(bad.length)return{ok:false,err:`«${bad.join("، ")}» ليس رمز عنصر. تذكّر: الحرف الأول كبير والثاني صغير (Cl وليس CL).`};
 const M=Object.keys(cnt).reduce((m,k)=>m+cnt[k]*AW[k],0)+hyd*(2*AW.H+AW.O);
 const base={formula:raw,ascii:s,hyd,cnt,M};const lib=(typeof LIBBY!=="undefined")?LIBBY[s+(hyd?"*"+hyd+"H2O":"")]:null;
 const fin=r=>Object.assign(base,r,{lib});
 if(SPECIAL[s]&&!hyd){const sp=SPECIAL[s];return fin({ok:true,type:"special",kind:Object.keys(cnt).length===1?"element":"special",ar:sp[0],en:sp[1],steps:[sp[2]?`${sp[2]}`:"اسم خاص معتمد."]})}
 const els=Object.keys(cnt);
 /* carboxylate salts written anion-first: CH3COONa, (CH3COO)2Pb, HCOOK */
 const cs=s.match(/^(CH3COO|HCOO|C2H3O2)([A-Z][a-z]?)(\d*)$/)||s.match(/^\((CH3COO|HCOO|C2H3O2)\)(\d+)([A-Z][a-z]?)$/);
 if(cs&&!hyd){const metal=isMetal(cs[2])?cs[2]:cs[3];const nA=isMetal(cs[2])?1:+cs[2];const nM=isMetal(cs[2])?(+cs[3]||1):1;const a=ANI.find(x=>x.k===cs[1]);if(isMetal(metal)){const r=nameIonic({s:metal,n:nM},{a,n:nA},0);r.steps.unshift(`الأملاح العضوية تُكتب أحياناً والأيون السالب أولاً (${pretty(s)}). نعيد ترتيبها ذهنياً: ${metal}${nM>1?nM:""}${nA>1?"(":""}${a.k}${nA>1?")"+nA:""}.`);return fin(r)}}
 if(els.length===1){const e=ELS[els[0]];const n=cnt[els[0]];return fin({ok:true,type:"element",kind:"element",ar:(n>1?`${PRE_AR[n]||n} ذرات `:"")+elAl(e.s),en:e.en.toLowerCase(),steps:[`الصيغة تحتوي عنصراً واحداً فقط ← هذه <b>مادة عنصرية</b> وليست مركباً.${n>1?` الرقم ${n} يعني أن الجزيء يتكون من ${n} ذرات مرتبطة.`:""}`]})}
 /* organic first when C and H both present and formula doesn't start with a metal / NH4 */
 const startsMetal=/^([A-Z][a-z]?)/.test(s)&&isMetal(s.match(/^([A-Z][a-z]?)/)[1]);
 const looksOrganic=cnt.C&&cnt.H&&!startsMetal&&!/^\(?NH4/.test(s)&&!/^H\d*(CO3|C2O4|CN|SCN|COO|C2H3O2)$/.test(s)&&!/^(HCO3|HC2O4)$/.test(s);
 if(/^H\d*[A-Z(]/.test(s)&&!looksOrganic){const r=nameAcid(s);if(r)return fin(r)}
 if(looksOrganic){const r=nameOrganic(s,cnt);if(r)return fin(r)}
 if(startsMetal||/^\(?NH4/.test(s)){const r=ionicFrom(s,hyd);if(r&&r.ok)return fin(r);if(r&&r.err)return fin({ok:false,err:r.err})}
 let toks;try{toks=topTokens(s)}catch(e){toks=null}
 if(toks&&toks.length===2&&!toks[0][2]&&!toks[1][2]&&!isMetal(toks[0][0])){const r=nameMolecular(toks);if(r){if(hyd){r.ar+=" "+HYD_AR[hyd];r.en+=" "+HYD_EN[hyd]}return fin(r)}}
 if(/^H/.test(s)){const r=nameAcid(s);if(r)return fin(r)}
 return fin({ok:false,err:"لم يستطع المحرك تسمية هذه الصيغة تلقائياً (قد تكون ملحاً مزدوجاً أو مركباً عضوياً يحتاج صيغة بنائية). ابحث عنها في مكتبة المركبات."})}
/* ---------------------------------------------------------------------- builder (criss-cross) */
const gcd=(a,b)=>b?gcd(b,a%b):a;
function buildIonic(catS,qc,anI){const a=ANI[anI];const qa=Math.abs(a.q);const L=qc*qa/gcd(qc,qa);const nc=L/qc,na=L/qa;
 const catF=catS==="NH4"?(nc>1?`(NH4)${nc}`:"NH4"):catS+(nc>1?nc:"");
 const polyA=a.kind!=="mono";const anF=na>1?(polyA?`(${a.k})${na}`:a.k+na):a.k;
 const r=nameIonic({s:catS,n:nc},{a,n:na},0);
 const cross=[`الشحنة الموجبة ${MX_(sgn(qc))} والسالبة ${MX_(sgn(a.q))}. أصغر مضاعف مشترك لـ ${qc} و${qa} هو <b>${L}</b>.`,`عدد الأيونات الموجبة = ${MX_(`${L} ÷ ${qc} = ${nc}`)}، وعدد الأيونات السالبة = ${MX_(`${L} ÷ ${qa} = ${na}`)}.`,(polyA&&na>1)||(catS==="NH4"&&nc>1)?`الأيون متعدد الذرات يوضع بين قوسين عندما يتكرر، والرقم خارج القوس.`:`الرقم 1 لا يُكتب.`,`طريقة التبادل (Criss-cross): رقم شحنة كل أيون يصبح رقماً سفلياً للآخر ثم نختصر.`];
 return{f:catF+anF,nc,na,L,cross,r}}
function libKey(f){let s=normF(f);let hyd=0;const hm=s.match(/^(.+?)[*.](\d*)H2O$/);if(hm){s=hm[1];hyd=+hm[2]||1}return s+(hyd?"*"+hyd+"H2O":"")}
