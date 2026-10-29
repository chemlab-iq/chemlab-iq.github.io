/* =====================================================================
   CHEM CORE — atomic weights, formula parsing & anatomy, auto-balancer
   ===================================================================== */
const AW={H:1.008,He:4.0026,Li:6.94,Be:9.0122,B:10.81,C:12.011,N:14.007,O:15.999,F:18.998,Ne:20.180,Na:22.990,Mg:24.305,Al:26.982,Si:28.085,P:30.974,S:32.06,Cl:35.45,Ar:39.948,K:39.098,Ca:40.078,Ti:47.867,Cr:51.996,Mn:54.938,Fe:55.845,Co:58.933,Ni:58.693,Cu:63.546,Zn:65.38,As:74.922,Se:78.971,Br:79.904,Sr:87.62,Ag:107.868,Cd:112.41,Sn:118.71,I:126.904,Ba:137.327,Pt:195.08,Au:196.97,Hg:200.59,Pb:207.2};
const ELN={H:"هيدروجين",He:"هيليوم",Li:"ليثيوم",Be:"بريليوم",B:"بورون",C:"كربون",N:"نيتروجين",O:"أكسجين",F:"فلور",Ne:"نيون",Na:"صوديوم",Mg:"مغنيسيوم",Al:"ألمنيوم",Si:"سيليكون",P:"فسفور",S:"كبريت",Cl:"كلور",Ar:"أرغون",K:"بوتاسيوم",Ca:"كالسيوم",Ti:"تيتانيوم",Cr:"كروم",Mn:"منغنيز",Fe:"حديد",Co:"كوبلت",Ni:"نيكل",Cu:"نحاس",Zn:"خارصين",As:"زرنيخ",Se:"سيلينيوم",Br:"بروم",Sr:"سترونشيوم",Ag:"فضة",Cd:"كادميوم",Sn:"قصدير",I:"يود",Ba:"باريوم",Pt:"بلاتين",Au:"ذهب",Hg:"زئبق",Pb:"رصاص"};
const METALS=new Set(["Li","Be","Na","Mg","Al","K","Ca","Ti","Cr","Mn","Fe","Co","Ni","Cu","Zn","Sr","Ag","Cd","Sn","Ba","Pt","Au","Hg","Pb"]);
const SUBD="₀₁₂₃₄₅₆₇₈₉",SUPD="⁰¹²³⁴⁵⁶⁷⁸⁹";
function toAscii(s){return String(s).replace(/[₀-₉]/g,c=>SUBD.indexOf(c)).replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g,c=>"^"+SUPD.indexOf(c)).replace(/⁺/g,"+").replace(/⁻/g,"-").replace(/[·•∙]/g,"*").replace(/\s+/g,"")}
function pretty(s){/* ascii formula -> unicode subscripts; charges ^2+ -> superscript */
 s=String(s).replace(/\*/g,"·");let out="",i=0;while(i<s.length){const c=s[i];
  if(c==="^"){i++;let ch="";while(i<s.length&&/[0-9+\-]/.test(s[i]))ch+=s[i++];out+=ch.replace(/\d/g,d=>SUPD[d]).replace(/\+/g,"⁺").replace(/-/g,"⁻");continue}
  if(/\d/.test(c)){const prev=out.slice(-1);if(out===""||prev==="·"||prev===" "){out+=c}else out+=SUBD[c];i++;continue}
  out+=c;i++}return out}
/* parse to element counts; supports (), [], hydrate dot, leading coefficient on hydrate part, charges */
function parseFormula(f){let s=toAscii(f).replace(/\(aq\)|\(s\)|\(l\)|\(g\)/g,"");s=s.replace(/\^?\d*[+\-]$/,"");const parts=s.split("*");const tot={};
 for(let p of parts){let mult=1;const m=p.match(/^(\d+)(.*)$/);if(m){mult=+m[1];p=m[2]}const c=parseGroup(p);for(const k in c)tot[k]=(tot[k]||0)+c[k]*mult}return tot}
function parseGroup(s){const st=[{}];let i=0;while(i<s.length){const ch=s[i];
 if(ch==="("||ch==="["){st.push({});i++}
 else if(ch===")"||ch==="]"){i++;let n="";while(/\d/.test(s[i]||""))n+=s[i++];const g=st.pop(),t=st[st.length-1];if(!t)throw "bracket";for(const k in g)t[k]=(t[k]||0)+g[k]*(+n||1)}
 else{const m=s.slice(i).match(/^([A-Z][a-z]?)(\d*)/);if(!m)throw "char:"+ch;if(!(m[1] in AW))throw "el:"+m[1];const t=st[st.length-1];t[m[1]]=(t[m[1]]||0)+(+m[2]||1);i+=m[0].length}}
 if(st.length!==1)throw "bracket";return st[0]}
function molarMass(f){const c=parseFormula(f);let m=0;for(const k in c)m+=c[k]*AW[k];return m}
/* tokens for the interactive "anatomy" view */
function formulaTokens(f){const s=toAscii(f);const toks=[];let i=0,depth=0;
 const m0=s.match(/^(\d+)/);if(m0){toks.push({t:"coef",v:m0[1]});i=m0[1].length}
 while(i<s.length){const c=s[i];
  if(c==="*"){i++;const m=s.slice(i).match(/^(\d+)/);toks.push({t:"dot",v:m?m[1]:"1"});if(m)i+=m[1].length;continue}
  if(c==="("||c==="["){toks.push({t:"open",v:c});depth++;i++;continue}
  if(c===")"||c==="]"){i++;let n="";while(/\d/.test(s[i]||""))n+=s[i++];toks.push({t:"close",v:c,n:+n||1});depth--;continue}
  if(c==="^"){i++;let ch="";while(i<s.length&&/[0-9+\-]/.test(s[i]))ch+=s[i++];toks.push({t:"charge",v:ch});continue}
  const m=s.slice(i).match(/^([A-Z][a-z]?)(\d*)/);if(!m)throw "char";toks.push({t:"el",v:m[1],n:m[2]?+m[2]:1,shown:!!m[2]});i+=m[0].length}
 return toks}

/* ---------------- exact rational arithmetic for the balancer ---------------- */
const babs=x=>x<0n?-x:x;const bgcd=(a,b)=>{a=babs(a);b=babs(b);while(b){[a,b]=[b,a%b]}return a};
function Fr(n,d){if(d===undefined)d=1n;n=BigInt(n);d=BigInt(d);if(d<0n){n=-n;d=-d}const g=bgcd(n,d)||1n;return{n:n/g,d:d/g}}
const fsub=(a,b)=>Fr(a.n*b.d-b.n*a.d,a.d*b.d),fmul=(a,b)=>Fr(a.n*b.n,a.d*b.d),fdiv=(a,b)=>Fr(a.n*b.d,a.d*b.n),fz=a=>a.n===0n;
/* parse "A + B -> C + D" */
function parseEquation(str){let s=String(str).replace(/⟶|→|⇒|=>|->|=/g,"→").replace(/⇌|<=>/g,"→");const sides=s.split("→");if(sides.length!==2)throw "arrow";
 const side=t=>{t=t.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]*[⁺⁻]/g,m=>"^"+m.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g,c=>SUPD.indexOf(c)).replace("⁺","+").replace("⁻","-"));t=t.replace(/\^(\d*)\+/g,"^$1PLUS");return t.split("+").map(x=>x.replace(/PLUS/g,"+").trim()).filter(Boolean).map(x=>{let st="";const ms=x.match(/\((aq|s|l|g)\)$/);if(ms){st=ms[1];x=x.slice(0,-ms[0].length)}let c=null;const mc=x.match(/^(\d+)\s*(?=[A-Z(\[])/);if(mc){c=+mc[1];x=x.slice(mc[0].length)}return{f:toAscii(x),st,c}})};
 const L=side(sides[0]),R=side(sides[1]);if(!L.length||!R.length)throw "empty";return{L,R}}
function balance(str){const {L,R}=parseEquation(str);const sp=[...L,...R];const counts=sp.map(x=>parseFormula(x.f));
 /* charge balance as an extra "element" when ions are present */
 const charge=f=>{const m=toAscii(f).match(/\^?(\d*)([+\-])$/);if(!m)return 0;const n=m[1]?+m[1]:1;return m[2]==="+"?n:-n};
 const els=[...new Set(counts.flatMap(c=>Object.keys(c)))];const hasCharge=sp.some(x=>charge(x.f)!==0);
 const rows=els.map(e=>sp.map((x,j)=>Fr((counts[j][e]||0)*(j<L.length?1:-1))));if(hasCharge)rows.push(sp.map((x,j)=>Fr(charge(x.f)*(j<L.length?1:-1))));
 /* RREF */
 const M=rows.map(r=>r.slice()),nc=sp.length;let piv=[],r=0;
 for(let c=0;c<nc&&r<M.length;c++){let p=r;while(p<M.length&&fz(M[p][c]))p++;if(p===M.length)continue;[M[r],M[p]]=[M[p],M[r]];const pv=M[r][c];M[r]=M[r].map(x=>fdiv(x,pv));for(let i=0;i<M.length;i++)if(i!==r&&!fz(M[i][c])){const f=M[i][c];M[i]=M[i].map((x,k)=>fsub(x,fmul(f,M[r][k])))}piv.push(c);r++}
 const free=[...Array(nc).keys()].filter(c=>!piv.includes(c));
 if(free.length===0)throw "nosol";if(free.length>1)throw "multi";
 const fc=free[0];const v=Array(nc).fill(null);v[fc]=Fr(1);piv.forEach((c,i)=>{v[c]=Fr(-M[i][fc].n,M[i][fc].d)});
 let lcm=1n;v.forEach(x=>{lcm=lcm*x.d/bgcd(lcm,x.d)});let ints=v.map(x=>x.n*lcm/x.d);let g=0n;ints.forEach(x=>g=bgcd(g,x));ints=ints.map(x=>x/g);if(ints[0]<0n)ints=ints.map(x=>-x);
 if(ints.some(x=>x<=0n))throw "neg";const coef=ints.map(Number);
 return{L,R,sp,counts,els,coef,steps:balanceSteps(L,R,counts,els,coef)}}
/* narrate the "inspection" method using the exact answer: metals → other non-metals → H → O */
function balanceSteps(L,R,counts,els,coef){const nL=L.length,sp=[...L,...R];
 const rank=e=>METALS.has(e)?0:e==="H"?2:e==="O"?3:1;const order=els.slice().sort((a,b)=>rank(a)-rank(b)||els.indexOf(a)-els.indexOf(b));
 const cur=Array(sp.length).fill(1),set=Array(sp.length).fill(false);
 const tally=()=>els.map(e=>{let l=0,r=0;sp.forEach((x,j)=>{const n=(counts[j][e]||0)*cur[j];if(j<nL)l+=n;else r+=n});return[e,l,r]});
 const steps=[{kind:"start",coef:cur.slice(),tally:tally()}];
 const why={0:"نبدأ بالفلزات لأنها تظهر عادة في مركب واحد فقط في كل طرف.",1:"ثم اللافلزات غير الهيدروجين والأكسجين.",2:"نترك الهيدروجين قبل الأخير لأنه يظهر في مركبات كثيرة (الماء والأحماض).",3:"الأكسجين أخيراً، لأنه يظهر غالباً في أكثر المركبات، فيتوازن تلقائياً بعد ضبط الباقي."};
 for(const e of order){const before=tally().find(t=>t[0]===e);const changed=[];
  sp.forEach((x,j)=>{if((counts[j][e]||0)&&!set[j]){if(cur[j]!==coef[j])changed.push([j,cur[j],coef[j]]);cur[j]=coef[j];set[j]=true}});
  const after=tally().find(t=>t[0]===e);steps.push({kind:"el",el:e,why:why[rank(e)],before,after,changed,coef:cur.slice(),tally:tally()})}
 return steps}
function eqString(L,R,coef,withStates){const f=(x,c)=>(c>1?c+" ":"")+pretty(x.f)+(withStates&&x.st?"("+x.st+")":"");return L.map((x,i)=>f(x,coef[i])).join(" + ")+" → "+R.map((x,i)=>f(x,coef[L.length+i])).join(" + ")}
/* quick: balance a molecular equation built from formulas, return pretty string or null */
function autoEq(lhs,rhs,states){try{const b=balance(lhs.join(" + ")+" -> "+rhs.join(" + "));if(states){b.L.forEach((x,i)=>x.st=states[i]||"");b.R.forEach((x,i)=>x.st=states[b.L.length+i]||"")}return{str:eqString(b.L,b.R,b.coef,!!states),b}}catch(e){return null}}

/* verify an equation whose coefficients are written in it (used for redox with several valid balancings) */
function verifyEq(str){const {L,R}=parseEquation(str);const sp=[...L,...R];const coef=sp.map(x=>x.c||1);const counts=sp.map(x=>parseFormula(x.f));const els=[...new Set(counts.flatMap(c=>Object.keys(c)))];
 const ok=els.every(e=>{let l=0,r=0;sp.forEach((x,j)=>{const n=(counts[j][e]||0)*coef[j];if(j<L.length)l+=n;else r+=n});return l===r});return{L,R,sp,counts,els,coef,ok,steps:balanceSteps(L,R,counts,els,coef)}}
function balanceOrVerify(str){try{return balance(str)}catch(e){if(e==="multi"){const v=verifyEq(str);if(v.ok&&v.sp.some(x=>x.c))return Object.assign(v,{multi:true});throw "multi"}throw e}}
