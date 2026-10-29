/* =====================================================================
   LECTURES 1–15 — each lecture is ONE complete page, in a fixed order:
   card → why named → goal → definitions → scientists → theory → apparatus → materials → safety →
   reactions → laws → procedure → interactive experiment → worked example → errors →
   worksheet (results, calculations) → questions → quick quiz → summary & report
   ===================================================================== */
const LDEV={1:"safe",2:"dens",3:"dens",4:"mp",5:"bp",6:"rc",7:"rc",8:"rx",9:"rx",10:"sol",11:"sol",12:"phx",13:"solb"};
const LSEC=["بطاقة الأسبوع","لماذا سُمّيت هكذا؟","الهدف","التعريفات","العلماء والمفكرون","النظرية","الأجهزة والأدوات","المواد والمحاليل","السلامة الخاصة بالتجربة","التفاعلات ونوعها","القوانين","طريقة العمل","التجربة التفاعلية","أدوات ومراجع هذا الأسبوع","مثال محلول","الأخطاء الشائعة وأثرها","ورقة العمل: النتائج","ورقة العمل: الحسابات","الأسئلة","الاختبار المتدرج: من الصفر إلى الاحتراف","الخلاصة والتقرير"];
const LSEN=["Lab card","Why the name?","Objective","Definitions","Scientists","Theory","Apparatus","Materials & solutions","Safety","Reactions & their types","Laws & equations","Procedure","Interactive experiment","Tools for this week","Worked example","Common errors","Worksheet: results","Worksheet: calculations","Questions","Levelled assessment","Summary & report"];
/* the course tools, distributed over the weeks by what each lab actually needs */
const WTOOLS={1:[["val","الدقة والضبط: كيف نقارن نتيجتنا بالقيمة المرجعية"],["nb","طريقة كتابة التقرير المختبري وتسجيل النتائج"]],
2:[["pt","كثافة العناصر واتجاهها في الجدول الدوري"],["nb","سجّل قراءات البكنوميتر وولّد التقرير"]],
3:[["mx","النفط الخام ومشتقاته كمخاليط وطرق فصلها"],["nb","سجّل قراءات الهيدروميتر ودرجة API"]],
4:[["ph","الانصهار على المستوى الجزيئي ومنحنى التسخين"],["nm","تسمية المركبات العضوية المستخدمة: حامض البنزويك، النفثالين، اليوريا"],["mx","الخليط اليوتكتي: لماذا تخفض الشوائب درجة الانصهار"]],
5:[["ph","الغليان وضغط البخار وتأثير الضغط الجوي"],["mx","التقطير كطريقة لفصل المخاليط"]],
6:[["mx","طرق الفصل: الإذابة، الترشيح، التبلور"],["ph","التبلور كتغير في الحالة"]],
7:[["tools","حاسبة المردود ونسبة الاسترجاع"],["mx","الترشيح بالتفريغ والتجفيف"],["nb","سجّل كتلة البلورات واحسب نسبة الاسترجاع"]],
8:[["eq","وازن معادلة KHP مع NaOH واحسب المولات"],["rxa","تفاعل التعادل ونوعه"],["tools","المعادلة الأيونية الصافية للتعادل"]],
9:[["rxa","أنواع تفاعلات الأحماض والقواعد"],["tools","الأيونات المتفرجة في التسحيح"],["eq","حساب تركيز الحامض المجهول"]],
10:[["eq","الكتلة المولية وتحويل الغرامات إلى مولات"],["pt","الكتل الذرية لحساب الكتلة المولية"],["nm","أسماء وصيغ المواد المذابة"]],
11:[["tools","أعداد التأكسد لحساب الوزن المكافئ في الأكسدة والاختزال"],["rxa","تفاعلات الأكسدة والاختزال"],["eq","موازنة معادلات KMnO₄ وK₂Cr₂O₇"]],
12:[["rx","اخلط حامضاً وقاعدة وشاهد تغير pH ولون الدليل"],["rxa","تفاعلات الأحماض والقواعد والتحلل المائي للأملاح"],["tools","تأين الأحماض والقواعد القوية والضعيفة"]],
13:[["tools","المعادلة الأيونية الصافية لتفاعلات الترسيب"],["rxa","تفاعل الترسيب (الإحلال المزدوج)"],["rx","اخلط AgNO₃ مع NaCl وشاهد الراسب"],["mx","المحلول المشبع وفوق المشبع"]],
14:[["quiz","بنك الاختبارات لكل المواضيع"],["pt","الجدول الدوري للمراجعة"],["nm","تسمية المركبات"],["rxa","كل أنواع التفاعلات"],["eq","الموازنة والحسابات"]],
15:[["quiz","اختبر نفسك قبل الامتحان"],["nb","راجع تقاريرك ونتائجك"]]};
const lsH=(k)=>`${LSEC[k]} <span class="sen">${LSEN[k]}</span>`;
let LEC={w:1,ans:false,mv:[]};
function lecRestore(){while(LEC.mv.length){const m=LEC.mv.pop();if(m.next&&m.next.parentNode===m.parent)m.parent.insertBefore(m.node,m.next);else m.parent.appendChild(m.node);m.node.hidden=true;m.node.style.cssText=m.css}}
function lecMove(id,slot,dev){const node=$("tab-"+id);if(!node||!$(slot))return false;if(LEC.mv.some(m=>m.node===node))return false;LEC.mv.push({node,parent:node.parentNode,next:node.nextSibling,css:node.style.cssText});$(slot).appendChild(node);node.hidden=false;if(dev&&id!=="rx"&&!node.className)node.style.cssText="display:flex;flex-direction:column;gap:14px";return true}
const TOOLNAME=id=>{if(id==="pt")return["🧩","الجدول الدوري","Periodic table"];const t=PTOOLS.find(x=>x[0]===id);return t?[t[1],t[2],t[4]||""]:["•",id,""]};
function lecMatCards(L){const ids=(L.mats||[]).filter(id=>MATBY[id]);let h="";if(ids.length)h+=`<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:8px">${ids.map(id=>{const m=MATBY[id];let M="";try{M=molarMass(m.fp||m.f).toFixed(2)+" g/mol"}catch(e){}return`<div class="stepc"><div class="row" style="justify-content:space-between"><b>${m.ar}</b><span class="pill ${STN[m.st]?STN[m.st][1]:""}">${STN[m.st]?STN[m.st][0]:""}</span></div><span class="ltr mono" style="text-align:start;font-size:17px">${pretty(m.f)}</span><span class="muted ltr" style="text-align:start">${m.en}${M?" · "+M:""}</span>${m.stock?`<span style="font-size:13px">التركيز: ${m.stock}</span>`:""}<span style="font-size:13px"><b>الخطر:</b> ${m.haz}</span><span class="ghs">${(m.ghs||[]).map(ghs).join("")}</span></div>`}).join("")}</div>`;
 if(L.mats2)h+=tbl(["المادة","التركيب","ملاحظة"],L.mats2);if(!h)h=`<p class="muted" style="margin:0">لا مواد كيميائية في هذا الأسبوع؛ نتدرب على الأدوات بالماء المقطر.</p>`;return h}

/* ---------- branches: each week opens as a hub of sub-interfaces ---------- */
const WTS={"1:mats":"رموز الخطورة GHS للمواد","1:val":"الدقة والضبط","2:mats":"كثافات مرجعية للمقارنة","2:pt":"الكثافة في الجدول الدوري","3:mx":"النفط الخام كخليط","3:mats":"خصائص المنتجات النفطية","4:ph":"الانصهار على المستوى الجزيئي","4:nm":"تسمية المركبات العضوية المستخدمة","4:mx":"الخليط اليوتكتي وأثر الشوائب","5:ph":"الغليان وضغط البخار","5:mx":"التقطير وفصل المخاليط","5:mats":"درجات غليان المذيبات","6:mx":"طرق الفصل: الإذابة والترشيح والتبلور","6:mats":"خصائص المذيب والمادة","6:ph":"التبلور كتغير في الحالة","7:tools":"حاسبة نسبة الاسترجاع","7:mx":"الترشيح بالتفريغ والتجفيف","8:eq":"موازنة معادلة KHP وحساب المولات","8:rxa":"تفاعل التعادل","8:tools":"المعادلة الأيونية للتعادل","9:rxa":"تفاعلات الأحماض والقواعد","9:tools":"الأيونات المتفرجة في التسحيح","9:eq":"حساب تركيز الحامض المجهول","10:eq":"حاسبة الكتلة المولية والمولات","10:pt":"الكتل الذرية","10:nm":"أسماء وصيغ المواد المذابة","10:mats":"تراكيز المحاليل التجارية","11:tools":"أعداد التأكسد والوزن المكافئ","11:rxa":"تفاعلات الأكسدة والاختزال","11:eq":"موازنة معادلات الأكسدة والاختزال","12:rx":"اخلط حامضاً وقاعدة وقِس pH","12:rxa":"تفاعلات الأحماض والقواعد والتحلل المائي","12:tools":"تأين الأحماض والقواعد","13:tools":"المعادلة الأيونية لتفاعلات الترسيب","13:rxa":"تفاعل الترسيب","13:rx":"تجربة ترسيب AgCl","13:mx":"المحلول المشبع وفوق المشبع","14:quiz":"بنك الاختبارات","14:pt":"الجدول الدوري","14:nm":"تسمية المركبات","14:rxa":"أنواع التفاعلات","14:eq":"الموازنة والحسابات","15:quiz":"بنك الاختبارات"};
const wtTitle=(w,id)=>WTS[w+":"+id]||TOOLNAME(id)[1];
const TOOLBR={mats:"prep",ph:"theory",mx:"theory",nm:"theory",rxa:"theory",pt:"theory",eq:"anal",tools:"anal",val:"anal",rx:"lab",quiz:"assess"};
const TOOLPFX={theory:"شرح تفاعلي",anal:"أداة الحساب",prep:"مرجع",lab:"تجربة حرة",assess:"",interactive:""};
function lecBranches(w){const B=lecBranches0(w);return isEN()?B.map(b=>Object.assign({},b,{ar:b.en,en:b.ar,parts:b.parts.map(p=>Object.assign({},p,{ar:p.en,en:p.ar}))})):B}
const BRP=(k,ico,ar,en,parts)=>({k,ico,ar,en,parts,secs:parts.flatMap(p=>p.secs)});
function lecBranches0(w){if(w===14)return[BRP("main","🔁","المراجعة الشاملة","Comprehensive review",[{k:"main",ar:"المراجعة الشاملة",en:"Review",secs:["review"]}]),BRP("interactive","🧩","المراجعة التفاعلية","Interactive review",[{k:"main",ar:"المراجعة التفاعلية",en:"Interactive review",secs:[]}]),BRP("assess","📝","التقييم","Assessment",[{k:"main",ar:"التقييم",en:"Assessment",secs:["assess"]}])];
 if(w===15)return[BRP("main","🧾","الامتحان التجريبي","Mock exam",[{k:"main",ar:"الامتحان التجريبي",en:"Mock exam",secs:["exam"]}]),BRP("assess","📝","التقييم","Assessment",[{k:"main",ar:"التقييم",en:"Assessment",secs:["assess"]}]),BRP("report","📓","التقرير","Report",[{k:"main",ar:"التقرير",en:"Report",secs:["nbk"]}])];
 return[BRP("explain","📖","شرح التجربة","About the experiment",[
   {k:"id",ico:"🏷",ar:"التعريف بالتجربة",en:"Introduction",secs:["card","goal","why","out"]},
   {k:"theory",ico:"💡",ar:"الأساس النظري",en:"Theory",secs:["idea","theory","defs","sci"]},
   {k:"rx",ico:"⚗",ar:w===1?"الوحدات والتطبيقات":"التفاعلات والتطبيقات",en:w===1?"Units & applications":"Reactions & applications",secs:w===1?["units","real"]:["rx","real"]}]),
  BRP("lab","🧪","المختبر","The lab",[
   {k:"app",ico:"🔬",ar:"الأجهزة والسلامة",en:"Apparatus & safety",secs:["app","safety"]},
   {k:"mats",ico:"🧫",ar:"المواد والعينات",en:"Materials & samples",secs:["mats"]},
   {k:"eq",ico:"📐",ar:"القوانين والحسابات",en:"Laws & calculations",secs:["laws","ex","src"]},
   {k:"proc",ico:"📋",ar:"طريقة العمل",en:"Procedure",secs:["proc","film"]},
   {k:"exp",ico:"🧪",ar:"التنفيذ العملي",en:"Hands-on run",secs:["prac"]},
   {k:"obs",ico:"🔎",ar:"المشاهدات ومصادر الخطأ",en:"Observations & errors",secs:["obs","read","err"]}]),
  BRP("assess","📝","النتائج والتقييم","Results & assessment",[
   {k:"sheet",ico:"📄",ar:"ورقة العمل",en:"Worksheet",secs:["res","calc","qs"]},
   {k:"sum",ico:"📌",ar:"الاستنتاج والخلاصة",en:"Conclusion",secs:["sum"]},
   {k:"test",ico:"🏆",ar:"الاختبار المتدرج",en:"Levelled test",secs:["assess"]},
   {k:"report",ico:"📓",ar:"التقرير",en:"Report",secs:["nbk"]}])]}
/* old addresses → new interface/part */
const LEGACYB={intro:["explain","id"],theory:["explain","theory"],prep:["lab","mats"],anal:["lab","eq"],report:["assess","report"]};
const PARTALIAS={"explain/film":["lab","proc"]};
const TOOLPART={ph:["explain","theory"],mx:["explain","theory"],nm:["explain","theory"],rxa:["explain","rx"],pt:["explain","theory"],eq:["lab","eq"],tools:["lab","eq"],val:["lab","eq"],rx:["lab","exp"],quiz:["assess","test"]};
function lecToolsOf(w,bk,pk){if(w<=13)return[];return(WTOOLS[w]||[]).filter(t=>{if(t[0]==="nb"||LDEV[w]===t[0])return false;if(w>=14)return(t[0]==="quiz"?"assess":"interactive")===bk;const m=TOOLPART[t[0]];return m&&m[0]===bk&&(!pk||m[1]===pk)})}
function lecSecs(w){const W=gwOf(w),LXw=lxOf(w);const ans=LEC.ans;const S={};
 if(w===14){S.review=["المراجعة الشاملة","Review",gdReview()];}
 if(w===15){S.exam=["الامتحان النهائي التجريبي","Mock exam",gdExam()];}
 S.assess=["الاختبار المتدرج: من الصفر إلى الاحتراف","Levelled assessment",asHTML()];
 S.nbk=["دفتر المختبر والتقرير","Lab notebook & report",`<p class="muted" style="margin:0">القراءات التي سجّلتها من الجهاز تظهر هنا؛ اختر التجربة واطبع التقرير.</p><div id="lecNbSlot" style="display:flex;flex-direction:column;gap:12px"></div>`];
 if(!W)return S;const ex=W.ex();
 const rxOne=r=>`${r[2]?`<div class="eqline">${prettyEq(r[0])}</div>`:rxaEq([r[0]])}<div class="row" style="gap:6px;margin:-4px 0 6px"><span class="pill" style="background:var(--teal-soft);color:var(--teal)">${L("نوع التفاعل","Reaction type")}: ${r[1]}</span></div>`;
 const rvCov=new Set();W.rx.items.forEach((r,i)=>{const sp=typeof rvForWeek==="function"?rvForWeek(w,i):null;if(sp&&sp.cover)sp.cover.forEach(j=>rvCov.add(j))});
 const rxBody=(W.rx.phys?`<p style="margin:0 0 6px">${W.rx.phys}</p>`:"")+W.rx.items.map((r,i)=>{if(rvCov.has(i))return"";const sp=typeof rvForWeek==="function"?rvForWeek(w,i):null;const grp=[r,...(sp&&sp.cover?sp.cover.map(j=>W.rx.items[j]).filter(Boolean):[])];return sp?`<div class="rvcard">${rvHTML(Object.assign({},sp,{eqTypes:grp.map(x=>L("نوع التفاعل","Reaction type")+": "+x[1])}))}</div>`:rxOne(r)}).join("");
 Object.assign(S,{
 card:["بطاقة التجربة","Experiment card",(()=>{const law=W.laws&&W.laws[0];const its=(typeof wsItems==="function"&&STKW[w])?wsItems(w):[];const nS=its.filter(x=>x.sj!=null).length,nR=its.filter(x=>x.reag).length;const R=[[L("اسم التجربة","Experiment"),`<b>${isEN()?W.en:W.ar}</b>`],[L("بالإنكليزية","In Arabic"),isEN()?`<span class="sar" lang="ar" dir="rtl">${W.ar}</span>`:`<span class="ltr">${W.en}</span>`],[L("الأسبوع والمدة","Week & duration"),`${w} / 15 · ${LXw.dur}`],[L("التجربة العملية","Practical lab"),SIM[w]?SIM[w].title:"—"],[L("الأجهزة الرئيسية","Main apparatus"),LXw.app.slice(0,4).map(a=>a[0]).join("، ")],[L("المواد","Materials"),nS?`${nS} ${L("عينة قابلة للاختبار","testable samples")} + ${nR} ${L("كاشف","reagents")}`:"—"],[L("القانون الرئيسي","Main law"),law?`${law[0]}: <bdi class="ltr mono">${law[1]}</bdi>`:"—"]];return`<div class="xcard">${R.map(r=>`<div><span>${r[0]}</span><b>${r[1]}</b></div>`).join("")}</div>`})()],
 out:["ماذا سيتعلم الطالب","Learning outcomes",`<p style="margin:0 0 4px">${L("بنهاية الأسبوع يستطيع الطالب أن:","By the end of the week the student can:")}</p><ol style="margin:0;padding-inline-start:22px">${LXw.out.map(o=>`<li>${o}</li>`).join("")}</ol>`],
 why:[LSEC[1],LSEN[1],`<p style="margin:0">${W.why}</p>`],
 goal:[LSEC[2],LSEN[2],`<p style="margin:0"><b>${W.goal}</b></p>`],
 defs:[LSEC[3],LSEN[3],`<dl class="props">${W.defs.map(d=>`<dt style="font-weight:700;color:var(--ink);font-size:13.5px">${d[0]}</dt><dd>${d[1]}</dd>`).join("")}</dl>`],
 sci:[LSEC[4],LSEN[4],`<div class="gsci">${W.sci.map(x=>`<div class="stepc"><b>${x[0]}</b><span class="ltr muted" style="text-align:start">${x[1]} · ${x[2]}</span><span style="font-size:14px">${x[3]}</span></div>`).join("")}</div>`],
 theory:[LSEC[5],LSEN[5],W.theory.map(x=>`<p style="margin:0 0 6px">${x}</p>`).join("")],
 app:[LSEC[6],LSEN[6],apCardsHTML(w)],
 film:SIM[w]?["فيلم التجربة: شاهد الخطوات متحركة","Experiment film: watch the steps animated",filmHTML(w)]:null,
 mats:STKW[w]?["مخزن الأسبوع: المواد والعينات","Week stockroom: materials & samples",weekStockHTML(w)]:[LSEC[7],LSEN[7],storeWeekHTML(w)],
 safety:[LSEC[8],LSEN[8],`<ul style="margin:0;padding-inline-start:20px">${LXw.safety.map(x=>`<li>${x}</li>`).join("")}</ul>${w>1?`<p class="muted" style="margin:0">القواعد العامة (النظارة، الصدرية، الحامض إلى الماء) في الأسبوع 1.</p>`:""}`],
 rx:[LSEC[9],LSEN[9],rxBody||"—"],
 laws:[LSEC[10],LSEN[10],LAWX[w]?lawsHTML(w):tbl(["القانون","الصيغة","الرموز"],W.laws.map(l=>[l[0],`<span class="ltr mono">${l[1]}</span>`,l[2]||""]))],
 prac:SIM[w]?["نفّذ التجربة بنفسك خطوة بخطوة","Run the experiment yourself, step by step",procHTML(w)]:null,
 idea:["الفكرة ببساطة","The idea in plain words",expIdea(w)],
 real:["أمثلة من الواقع والصناعة","Real-world & industry examples",expReal(w)],
 obs:["ماذا يحدث ولماذا؟","What happens and why?",expObs(w)],
 read:["كيف تقرأ نتيجتك؟","Interpreting your result",expRead(w)],
 src:typeof sourcesHTML==="function"&&SOURCES[w]?["المصادر المرجعية للثوابت والطرق","Primary sources of constants and methods",sourcesHTML(w)]:null,
 units:["الوحدات ونظام SI","Units & the SI system",unitsGlossaryHTML()],
proc:["طريقة العمل (خطوات التجربة)","Procedure (experiment steps)",`<ol class="procol">${LXw.proc.map(x=>`<li>${x}</li>`).join("")}</ol><p class="tip" style="margin:6px 0 0">${L("في المختبر الحقيقي تُكرَّر القياسات (عادة 3 مرات) ويُؤخذ المتوسط؛ في المحاكي تمثل كل جولة محاولة واحدة لعينة واحدة، فأعد التشغيل لتحصل على التكرار.","In the real lab, measurements are repeated (usually 3 times) and averaged; in the simulator each run is one trial on one sample, so run it again to get replicates.")}</p>`],
 dev:["الجهاز التفاعلي الحر","Free interactive device",`<details class="lecfold" id="lecDevFold"><summary>${L("افتح الجهاز الحر للتجريب بقيم من اختيارك","Open the free device to try your own values")}</summary><div id="lecDevSlot" style="display:flex;flex-direction:column;gap:14px;margin-top:8px"></div></details>`],
 ex:[LSEC[14],LSEN[14],`<p style="margin:0"><b>السؤال:</b> ${ex.q}</p><div class="calcout">${ex.s.join("<br>")}</div><p style="margin:0"><b>النتيجة:</b> ${ex.a}</p>`],
 err:[LSEC[15],LSEN[15],tbl(["الخطأ","أثره على النتيجة","كيف نتجنبه"],LXw.err)],
 res:[LSEC[16],LSEN[16],`<div class="tbl"><table class="gtable"><thead><tr>${W.sheet.head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${Array.from({length:W.sheet.rows},()=>`<tr>${W.sheet.head.map(()=>"<td></td>").join("")}</tr>`).join("")}</tbody></table></div>`],
 calc:[LSEC[17],LSEN[17],W.sheet.calc.map(c=>`<div class="gcalc"><b>${c}</b>${gLines(2)}</div>`).join("")],
 qs:[LSEC[18],LSEN[18],W.sheet.qs.map((q,k)=>`<div class="gq"><b>س${k+1}: ${q[0]}</b>${ans?`<div class="tip" style="margin-top:4px"><b>الإجابة النموذجية:</b> ${q[2]}</div>`:gLines(q[1])}</div>`).join("")],
 sum:[LSEC[20],LSEN[20],`<ul style="margin:0;padding-inline-start:20px;display:flex;flex-direction:column;gap:3px">${LXw.sum.map(x=>`<li><b>${x}</b></li>`).join("")}</ul>`]});
 if(isEN())for(const k in S)if(S[k])S[k]=[S[k][1],S[k][0],S[k][2]];
 return S}
const secBox=(n,t,e,html,id)=>`<section class="gsec"${id?` id="${id}"`:""}><div class="gnum">${n}</div><div class="gbody"><h3>${t} <span class="sen">${e}</span></h3>${html}</div></section>`;
function lecFlat(BR){const F=[];BR.forEach(b=>b.parts.forEach(p=>F.push([b,p])));return F}
function lecRender(){const w=LEC.w;lecRestore();if(LEGACYB[LEC.b]&&w<=13){const m=LEGACYB[LEC.b];LEC.b=m[0];LEC.p=m[1]}{const m=PARTALIAS[LEC.b+"/"+LEC.p];if(m&&w<=13){LEC.b=m[0];LEC.p=m[1]}}
 const BR=lecBranches(w);const bk=LEC.b&&BR.some(b=>b.k===LEC.b)?LEC.b:"";const S=lecSecs(w);const [tar,ten]=wTitle(w);
 const B=bk?BR.find(b=>b.k===bk):null;const P=B?(B.parts.find(p=>p.k===LEC.p)||B.parts[0]):null;
 const top=`<div class="panel" style="gap:8px"><div class="row" style="justify-content:space-between"><div class="row"><button class="btn sm" data-go="${bk?"ac/w/"+w:"ac"}">→ ${bk?L("واجهات الأسبوع","Week sections"):L("جدول الدروس","Lesson schedule")}</button><h2>${L("الأسبوع","Week")} ${w}: ${tar} <span class="sen">Week ${w}: ${ten}</span></h2></div><div class="row"><label class="row muted" style="gap:4px"><input type="checkbox" id="lecAns" ${LEC.ans?"checked":""}> ${L("أظهر الإجابات النموذجية","Show model answers")}</label><button class="btn sm" id="lecPrint">🖨 ${L("اطبع ورقة العمل","Print the worksheet")}</button></div></div>
 ${bk?`<div class="brtabs">${BR.map((b,i)=>`<button class="${b.k===bk?"on":""}" data-go="ac/w/${w}/${b.k}"><span>${i+1}</span><span>${b.ico}</span><b>${b.ar}</b></button>`).join("")}</div>`:""}</div>`;
 let body;
 if(!bk){body=`<div class="brgrid3">${BR.map((b,i)=>`<div class="brcard3"><button class="brh" data-go="ac/w/${w}/${b.k}"><span class="brn">${i+1}</span><span class="pico">${b.ico}</span><b>${b.ar} <span class="sen">${b.en}</span></b></button><div class="brparts">${b.parts.map((p,j)=>`<button data-go="ac/w/${w}/${b.k}/${p.k}"><span class="ptn">${i+1}.${j+1}</span><b>${p.ico||""} ${p.ar}</b><small>${p.secs.filter(k=>S[k]).map(k=>S[k][0]).concat(lecToolsOf(w,b.k,p.k).map(t=>wtTitle(w,t[0]))).join(" · ")}</small></button>`).join("")}</div></div>`).join("")}</div>
  <div class="row" style="justify-content:center"><button class="btn primary" data-go="ac/w/${w}/${BR[0].k}" style="padding:9px 26px">${L("ابدأ من","Start with")} ${BR[0].ar} ←</button></div>`}
 else{const bi=BR.indexOf(B);const F=lecFlat(BR);const fi=F.findIndex(x=>x[0]===B&&x[1]===P);let n=F.slice(0,fi).reduce((a,x)=>a+x[1].secs.filter(k=>S[k]).length,0);const pj=B.parts.indexOf(P);
  body=`<div class="brhead"><span class="pico">${B.ico}</span><div style="flex:1;min-width:0"><h2 style="margin:0">${B.ar} <span class="sen">${B.en}</span></h2><span class="muted">${L("الواجهة","Section")} ${bi+1} ${L("من","of")} ${BR.length}${B.parts.length>1?` · ${L("الجزء","Part")} ${bi+1}.${pj+1} ${P.ar}`:""} · ${L("الأسبوع","Week")} ${w}</span></div></div>
  ${B.parts.length>1?`<div class="ptabs">${B.parts.map((p,j)=>`<button class="${p===P?"on":""}" data-go="ac/w/${w}/${bk}/${p.k}"><span class="ptn">${bi+1}.${j+1}</span><span>${p.ico||""}</span><b>${p.ar}</b></button>`).join("")}</div>`:""}`
  +P.secs.filter(k=>S[k]).map(k=>secBox(++n,S[k][0],S[k][1],S[k][2])).join("")
  +lecToolsOf(w,bk,B.parts.length>1?P.k:null).map(t=>{const nm=TOOLNAME(t[0]);const pf=TOOLPFX[w>=14?(t[0]==="quiz"?"assess":"interactive"):({explain:"theory",lab:TOOLPART[t[0]][1]==="exp"?"lab":"anal",assess:"assess"})[bk]];return secBox(++n,(pf?pf+": ":"")+wtTitle(w,t[0]),nm[2],`<p class="muted" style="margin:0">${t[1]}.</p><div id="ts_${t[0]}" class="wtslot"></div>`)}).join("")
  +`<div class="row" style="justify-content:space-between">${fi>0?`<button class="btn" data-go="ac/w/${w}/${F[fi-1][0].k}/${F[fi-1][1].k}">→ ${F[fi-1][1].ar}</button>`:`<span></span>`}${fi<F.length-1?`<button class="btn primary" data-go="ac/w/${w}/${F[fi+1][0].k}/${F[fi+1][1].k}">${F[fi+1][0]!==B?F[fi+1][0].ar+": ":""}${F[fi+1][1].ar} ←</button>`:w<15?`<button class="btn primary" data-go="ac/w/${w+1}">${L("الأسبوع","Week")} ${w+1}: ${isEN()?GSH_EN[w+1]:GSH[w+1]} ←</button>`:""}</div>`}
 $("tab-lec").innerHTML=top+`<div id="lecDoc" style="display:flex;flex-direction:column;gap:10px">${body}</div>`+(!bk?`<div class="row" style="justify-content:space-between">${w>1?`<button class="btn" data-go="ac/w/${w-1}">→ ${L("الأسبوع","Week")} ${w-1}</button>`:"<span></span>"}${w<15?`<button class="btn primary" data-go="ac/w/${w+1}">${L("الأسبوع","Week")} ${w+1} ←</button>`:""}</div>`:"");
 pBind($("tab-lec"));
 $("lecAns").onchange=()=>{LEC.ans=$("lecAns").checked;GD.ans=LEC.ans;const y=window.scrollY;lecRender();window.scrollTo(0,y)};GD.ans=LEC.ans;
 $("lecPrint").onclick=()=>{let pa=$("printArea");if(!pa){pa=document.createElement("div");pa.id="printArea";document.body.appendChild(pa)}let n=0;const html=BR.map(b=>{const ks=b.secs.filter(k=>S[k]&&!["dev","assess","nbk","units","mats","prac","film"].includes(k));if(!ks.length)return"";return`<h2 style="margin:10px 0 4px;border-bottom:1px solid #000">${b.ar} · ${b.en}</h2>`+ks.map(k=>secBox(++n,S[k][0],S[k][1],S[k][2])).join("")}).join("");pa.innerHTML=`<div class="gprint" style="direction:${isEN()?"ltr":"rtl"};font-family:var(--f-body);color:#000"><div style="display:flex;justify-content:space-between;font-size:12px;border-bottom:1px solid #000;margin-bottom:6px"><span>${L("الاسم","Name")}: ................................</span><span>${L("المجموعة","Group")}: ..........</span><span>${L("التاريخ","Date")}: ..........</span></div><h1 style="font-size:20px">${L("الأسبوع","Week")} ${w}: ${tar}</h1>${html}</div>`;pa.querySelectorAll("button,svg.apsvg").forEach(x=>x.remove());pa.querySelectorAll("details").forEach(d=>d.open=true);window.print();setTimeout(()=>pa.innerHTML="",500)};
 if(!bk){if(typeof filmStop==="function")filmStop();return}
 if(typeof filmStop==="function"&&!$("filmBox"))filmStop();
 stkBind($("tab-lec"));apFit($("tab-lec"));if($("wsBox"))wsMount();if($("procBox"))procMount(w);if($("filmBox"))filmMount();if(typeof rvMount==="function")rvMount($("tab-lec"));
 if($("asBox"))asMount(w);
 if($("lecNbSlot")&&lecMove("nb","lecNbSlot",1)&&NAVINIT.nb)NAVINIT.nb();
 lecToolsOf(w,bk,B.parts.length>1?P.k:null).forEach(t=>{if(lecMove(t[0],"ts_"+t[0])){const f=NAVINIT[t[0]];if(f)f();if(t[0]==="rx"&&$("rxTitHead"))$("rxTitHead").hidden=true}});
 const dev=LDEV[w];if(dev&&$("lecDevSlot")){const fold=$("lecDevFold");const open=()=>{if(LEC.mv.some(m=>m.node===$("tab-"+dev)))return;lecMove(dev,"lecDevSlot",1);const f=NAVINIT[dev];if(dev==="rx"){titSetup();$("rxTitHead").hidden=false;setTimeout(()=>{(w===8?$("titPresetN"):$("titPresetS")).click()},30)}else if(f)f();
  if(w===3)setTimeout(()=>{const b=document.querySelector('#dMode [data-m="hyd"]');b&&b.click()},30);if(w===2)setTimeout(()=>{const b=document.querySelector('#dMode [data-m="pyc"]');b&&b.click()},30);
  if(w===11)setTimeout(()=>{const b=document.querySelector('#spMode [data-m="dil"]');b&&b.click()},30);if(w===10)setTimeout(()=>{const b=document.querySelector('#spMode [data-m="solid"]');b&&b.click()},30)};if(fold)fold.addEventListener("toggle",()=>{if(fold.open)open()});else open()}}
function lecInit(){lecRender()}
mkSec("lec","");
