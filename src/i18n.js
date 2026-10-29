/* =====================================================================
   LANGUAGE — Arabic / English.
   Week content uses dedicated English objects (GW_EN, LX_EN, WEXP_EN, LAWX_EN).
   Interface text and the practical-lab scripts are translated by a phrase dictionary applied
   to rendered text nodes (longest phrase first, whole-word boundaries).
   ===================================================================== */
let LANG="ar";try{LANG=localStorage.getItem("freelab-lang")||"ar"}catch(e){}
const isEN=()=>LANG==="en";
try{document.documentElement.lang=LANG;document.documentElement.dir=LANG==="en"?"ltr":"rtl"}catch(e){}
const L=(ar,en)=>LANG==="en"?en:ar;
const I18N={};              /* ar phrase → en phrase (manual dictionary, i18n_dict.js) */
const I18N_NAMES={};        /* whole-text names from the data (applied only when a text node is exactly a name) */
let I18N_RE=null;
function i18nAdd(ar,en){if(!ar||!en||ar===en)return;ar=String(ar).trim();if(!/[\u0600-\u06FF]/.test(ar))return;if(!(ar in I18N_NAMES))I18N_NAMES[ar]=String(en).trim()}
function i18nDict(o){for(const k in o)I18N[k.trim()]=o[k];I18N_RE=null}
function i18nBuild(){const keys=Object.keys(I18N).sort((a,b)=>b.length-a.length).map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"));I18N_RE=keys.length?new RegExp("(?<![\\u0621-\\u064A])("+keys.join("|")+")(?![\\u0621-\\u064A])","g"):null}
function trText(s){if(!isEN()||!s||!/[\u0600-\u06FF]/.test(s))return s;const t=s.trim();if(I18N[t]!=null)return s.replace(t,I18N[t]);if(I18N_NAMES[t]!=null)return s.replace(t,I18N_NAMES[t]);if(!I18N_RE)i18nBuild();let r=I18N_RE?s.replace(I18N_RE,m=>I18N[m]):s;const t2=r.trim();if(I18N_NAMES[t2]!=null)r=r.replace(t2,I18N_NAMES[t2]);return r}
function translateDOM(root){if(!isEN()||!root)return;if(!I18N_RE)i18nBuild();const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null);const nodes=[];let n;while((n=w.nextNode()))if(/[؀-ۿ]/.test(n.nodeValue)&&!(n.parentElement&&n.parentElement.closest('.sar,#langBtn')))nodes.push(n);
 nodes.forEach(t=>{t.nodeValue=trText(t.nodeValue)});
 root.querySelectorAll("[placeholder],[title],[aria-label]").forEach(e=>{["placeholder","title","aria-label"].forEach(a=>{const v=e.getAttribute(a);if(v&&/[؀-ۿ]/.test(v))e.setAttribute(a,trText(v))})});
 [...(root.matches&&root.matches("button")?[root]:[]),...root.querySelectorAll("button")].forEach(bt=>{const tw=document.createTreeWalker(bt,NodeFilter.SHOW_TEXT);let x;while((x=tw.nextNode())){const v=x.nodeValue.replace(/^(\s*)→/,"$1←").replace(/←(\s*)$/,"→$1");if(v!==x.nodeValue)x.nodeValue=v}})}
/* ---------- content accessors ---------- */
const AR_EQ_FIX=s=>s.replace("(مركّز)","(conc.)").replace("حرارة شديدة","intense heat");
function gwOf(w){const A=GW.find(x=>x.w===w);if(!isEN()||!A)return A;const E=(typeof GW_EN!=="undefined")&&GW_EN.find(x=>x.w===w);if(!E)return A;
 return Object.assign({},A,{ar:E.ar,en:E.en,why:E.why,goal:E.goal,defs:E.defs,sci:E.sci,theory:E.theory,laws:E.laws,ex:E.ex,
  rx:{phys:E.rx.phys,items:A.rx.items.map((it,i)=>[AR_EQ_FIX(it[0]),E.rx.items[i]||it[1],it[2]])},
  sheet:Object.assign({},A.sheet,{head:E.sheet.head,calc:E.sheet.calc,qs:A.sheet.qs.map((q,i)=>[E.sheet.qs[i]?E.sheet.qs[i][0]:q[0],q[1],E.sheet.qs[i]?E.sheet.qs[i][1]:q[2]])})})}
function lxOf(w){const A=LX[w];if(!isEN()||!A)return A;const E=(typeof LX_EN!=="undefined")&&LX_EN[w];if(!E)return A;
 return Object.assign({},A,{out:E.out,safety:E.safety,proc:E.proc,err:E.err,sum:E.sum,app:A.app.map((a,i)=>[a[1],a[0],E.app[i]||a[2]]),mcq:A.mcq.map((m,i)=>E.mcq[i]?[E.mcq[i][0],E.mcq[i][1],m[2],E.mcq[i][2]]:m)})}
function wexpOf(w){return isEN()&&typeof WEXP_EN!=="undefined"&&WEXP_EN[w]?WEXP_EN[w]:WEXP[w]}
function lawxOf(w){const A=LAWX[w];if(!isEN()||!A)return A;const E=(typeof LAWX_EN!=="undefined")&&LAWX_EN[w];if(!E)return A;
 return A.map((x,i)=>{const e=E[i]||{};return Object.assign({},x,{n:x.en,en:x.n,who:e.who??x.who,unit:e.unit??x.unit,mean:e.mean??x.mean,use:e.use??x.use,ex:e.ex??x.ex,vars:x.vars.map(v=>[v[0],v[2],v[1],v[3]])})})}
function unitInfo(u){const U=UNITS[u];if(!U)return null;return isEN()?[U[1],U[0],(typeof UNITS_EN!=="undefined"&&UNITS_EN[u])||U[2]]:U}
/* ---------- switch ---------- */
function setLang(l){LANG=l;try{localStorage.setItem("freelab-lang",l)}catch(e){}document.documentElement.lang=l;document.documentElement.dir=l==="en"?"ltr":"rtl";langBtn();if(typeof route==="function")route()}
function langBtn(){const b=document.getElementById("langBtn");if(b){b.innerHTML=isEN()?"🌐 عربي":"🌐 English";b.title=isEN()?"التحويل إلى العربية":"Switch to English"}const br=document.querySelector(".brand span");if(br)br.innerHTML=isEN()?"<b>Virtual Analytical Chemistry Lab</b><small>Practical analytical chemistry</small>":"<b>المختبر الافتراضي للكيمياء التحليلية</b><small>الكيمياء التحليلية العملية</small>";document.title=isEN()?"Virtual Analytical Chemistry Lab":"المختبر الافتراضي للكيمياء التحليلية"}

/* ---------- automatic pairs from the data ---------- */
function i18nAuto(){const add=i18nAdd;
 try{["pyc","mp","bp","rc","tit","mol","norm","phl","phd","sol","safe","hyd","rcs"].forEach(k=>(STK[k]||[]).forEach(r=>add(r[0],r[1])));STK.ind.forEach(r=>{add(r[0],r[1]);});}catch(e){}
 try{INV.forEach(o=>{add(o.ar,o.en);add(o.colAr,o.colEn)})}catch(e){}
 try{Object.values(CAB).forEach(c=>add(c[0],c[1]))}catch(e){}
 try{RCSAMP.forEach(r=>add(r[1],r[2]))}catch(e){}
 try{PTOOLS.forEach(t=>add(t[2],t[4]))}catch(e){}
 try{ASLV.forEach(l=>{add(l.ar,l.en);add(l.d,l.de)})}catch(e){}
 try{LSEC.forEach((a,i)=>add(a,LSEN[i]))}catch(e){}
 try{GW.forEach(g=>add(g.ar,g.en))}catch(e){}
 try{for(let w=1;w<=15;w++)lecBranches0(w).forEach(b=>{add(b.ar,b.en);(b.parts||[]).forEach(p=>add(p.ar,p.en))})}catch(e){}
 try{Object.entries(STK.pycG).forEach(([k,v])=>add(v,{w:"Water",alc:"Alcohols",gly:"Glycols",amine:"Amines",ket:"Ketones & aldehydes",eth:"Ethers",est:"Esters",acid:"Acids & concentrated reagents",hc:"Aliphatic hydrocarbons",aro:"Aromatic hydrocarbons",hal:"Halogenated compounds",pol:"Polar solvents",el:"Liquid elements",aq:"Aqueous solutions",oil:"Oils & fuels"}[k]))}catch(e){}
 try{LTYPES.forEach(t=>add(t[1],t[2]))}catch(e){}
 try{add(SITE.name,SITE.nameEn);Object.values(SUBJ).forEach(s=>add(s.ar,s.en))}catch(e){}
 const GHSEN={GHS01:"Explosive",GHS02:"Flammable",GHS03:"Oxidizer",GHS04:"Compressed gas",GHS05:"Corrosive",GHS06:"Toxic",GHS07:"Irritant / harmful",GHS08:"Chronic health hazard",GHS09:"Environmental hazard"};try{Object.entries(GHSN).forEach(([k,v])=>add(v,GHSEN[k]))}catch(e){}
 try{Object.values(STN).forEach(v=>add(v[0],{"صلب":"Solid","سائل":"Liquid","غاز":"Gas","محلول مائي":"Aqueous"}[v[0]]))}catch(e){}
 }
/* ---------- observer: translate everything rendered while English is on ---------- */
let I18N_OBS=null;
function i18nWatch(){const root=document.querySelector(".wrap");if(!root||I18N_OBS)return;I18N_OBS=new MutationObserver(ms=>{if(!isEN())return;ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===3){if(/[\u0600-\u06FF]/.test(n.nodeValue)&&!(n.parentElement&&n.parentElement.closest('.sar,#langBtn')))n.nodeValue=trText(n.nodeValue)}else if(n.nodeType===1)translateDOM(n)}))});I18N_OBS.observe(root,{childList:true,subtree:true})}
