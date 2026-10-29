/* =====================================================================
   PHASE-CHANGE ENGINE — energy balance with latent heats (1 atm)
   c in J/(g·K), L in J/g, T in °C. Values from standard references (CRC, NIST), rounded.
   ===================================================================== */
const PHASE=[
 {id:"ice",ar:"الماء / الثلج",f:"H2O",mp:0,bp:100,cs:2.09,cl:4.18,cg:2.01,Lf:334,Lv:2257,T0:-20,cols:["#e3f1fa","#9fd0f0","rgba(240,248,255,.85)"],look:"ثلج شفاف مزرق",note:"الماء يتمدد عند التجمد (الثلج أقل كثافة من الماء)، لذلك يطفو الثلج."},
 {id:"stearic",ar:"حامض الستياريك",f:"C18H36O2",mp:69.3,bp:361,cs:1.6,cl:2.3,cg:1.7,Lf:199,Lv:270,T0:40,cols:["#f5f2e8","#efe7cf","rgba(255,255,255,.7)"],look:"صلب شمعي أبيض",note:"مادة شائعة في تجارب منحنى التبريد لأن درجة انصهارها قريبة من الغرفة وثابتة."},
 {id:"wax",ar:"شمع البرافين",f:"C25H52",mpLo:52,mpHi:58,mp:55,bp:null,cs:2.14,cl:2.9,Lf:210,T0:25,cols:["#f3efe2","#efe2b8","rgba(255,255,255,.7)"],look:"صلب شمعي",note:"الشمع خليط من هيدروكربونات مختلفة الطول، لذلك ينصهر على مدى (52–58°م) وليس عند درجة واحدة. لا يغلي بالمسخن هنا؛ يتحلل ويشتعل قبل غليانه."},
 {id:"naph",ar:"النفثالين",f:"C10H8",mp:80.3,bp:218,cs:1.30,cl:1.72,cg:1.3,Lf:148,Lv:337,T0:40,cols:["#f8f8f4","#f0eee4","rgba(255,255,255,.75)"],look:"بلورات بيضاء",note:"يتسامى ببطء حتى في حرارة الغرفة، لذلك تختفي كرات العث مع الوقت."},
 {id:"benzoic",ar:"حامض البنزويك",f:"C7H6O2",mp:122.4,bp:249.2,cs:1.20,cl:1.65,cg:1.2,Lf:147,Lv:414,T0:80,cols:["#f8f8f4","#efece0","rgba(255,255,255,.75)"],look:"بلورات بيضاء إبرية",note:"المادة المستخدمة في تجربة الانصهار (الأسبوع 4) وإعادة التبلور (الأسبوعان 6 و7)."},
 {id:"iodine",ar:"اليود",f:"I2",mp:113.7,bp:184.3,cs:0.214,cl:0.32,cg:0.145,Lf:61.6,Lv:164,T0:25,subl:true,cols:["#3b3448","#3a0f2a","rgba(162,75,207,.75)"],look:"بلورات رمادية سوداء لامعة",note:"اليود يتسامى بوضوح: يخرج منه بخار بنفسجي قبل أن ينصهر، لأن ضغط بخاره عالٍ نسبياً. عند ملامسة البخار سطحاً بارداً يتبلور مباشرة (ترسيب)."},
 {id:"etoh",ar:"الإيثانول",f:"C2H5OH",mp:-114.1,bp:78.4,cs:0.97,cl:2.44,cg:1.42,Lf:108,Lv:841,T0:20,cols:["#eef3f6","#e8f2f8","rgba(255,255,255,.8)"],look:"سائل عديم اللون",note:"درجة غليانه أقل من الماء لأن الروابط الهيدروجينية بين جزيئاته أضعف وأقل عدداً."},
 {id:"acetone",ar:"الأسيتون",f:"C3H6O",mp:-94.7,bp:56.1,cs:1.5,cl:2.17,cg:1.29,Lf:98,Lv:501,T0:20,cols:["#eef3f6","#e8f2f8","rgba(255,255,255,.8)"],look:"سائل عديم اللون",note:"يتبخر بسرعة لأن قوى التجاذب بين جزيئاته ضعيفة (لا روابط هيدروجينية بينها)."},
 {id:"dryice",ar:"الثلج الجاف (CO₂ الصلب)",f:"CO2",tsub:-78.5,cs:1.2,cg:0.84,Ls:571,T0:-100,cols:["#f4f7f9",null,"rgba(255,255,255,.9)"],look:"صلب أبيض يتصاعد منه ضباب",note:"عند الضغط الجوي لا يوجد CO₂ سائلاً: يتسامى مباشرة من صلب إلى غاز عند −78.5°م. الضباب الأبيض هو بخار ماء الهواء الذي تكثف من البرودة، وليس CO₂ نفسه."}
];
const PHBY=Object.fromEntries(PHASE.map(p=>[p.id,p]));
function phaseState(p,m){return{p,m,ms:p.T0<(p.mpLo??p.mp??p.tsub)?m:0,ml:p.T0<(p.mpLo??p.mp??p.tsub)?0:(p.tsub!=null?0:m),mg:0,T:p.T0,fMelt:p.T0<(p.mpLo??p.mp??-1e9)?0:1,t:0,Q:0,stage:""}}
/* advance by dt seconds with net power Pnet (W). Returns stage code */
function phaseStep(s,Pnet,dt){const p=s.p;let dQ=Pnet*dt;s.Q+=dQ;s.t+=dt;let guard=0;
 while(Math.abs(dQ)>1e-9&&guard++<8){
  if(p.tsub!=null){/* sublimation only */
   if(s.ms>1e-9&&Math.abs(s.T-p.tsub)<1e-9){if(dQ>0){const dm=Math.min(s.ms,dQ/p.Ls);s.ms-=dm;s.mg+=dm;dQ-=dm*p.Ls;s.stage="subl";continue}}
   const C=s.ms*p.cs;if(C<1e-9){s.stage="gone";return s.stage}const Tn=s.T+dQ/C;if(s.T<p.tsub&&Tn>=p.tsub){dQ-=(p.tsub-s.T)*C;s.T=p.tsub;continue}s.T=Tn;dQ=0;s.stage=s.T<p.tsub?"solid":"subl";break}
  const mpLo=p.mpLo??p.mp,mpHi=p.mpHi??p.mp;
  /* melting / freezing zone */
  if(s.T>=mpLo-1e-9&&s.T<=mpHi+1e-9&&((dQ>0&&s.ms>1e-9)||(dQ<0&&s.ml>1e-9))){const avail=dQ>0?s.ms:s.ml;const dm=Math.min(avail,Math.abs(dQ)/p.Lf);if(dQ>0){s.ms-=dm;s.ml+=dm}else{s.ml-=dm;s.ms+=dm}dQ-=Math.sign(dQ)*dm*p.Lf;const mt=s.ms+s.ml;s.fMelt=mt>0?s.ml/mt:1;s.T=mpLo+(mpHi-mpLo)*s.fMelt;s.stage=Pnet>=0?"melt":"freeze";if(Math.abs(dQ)<1e-9)break;continue}
  /* boiling / condensing (open vessel: vapour escapes) */
  if(p.bp!=null&&Math.abs(s.T-p.bp)<1e-9&&s.ml>1e-9&&dQ>0){const dm=Math.min(s.ml,dQ/p.Lv);s.ml-=dm;s.mg+=dm;dQ-=dm*p.Lv;s.stage="boil";if(s.ml<=1e-9){s.stage="gone";return s.stage}continue}
  const C=s.ms*p.cs+s.ml*p.cl;if(C<1e-9){s.stage="gone";return s.stage}
  let Tn=s.T+dQ/C;
  /* crossing thresholds */
  const marks=[mpLo,mpHi,p.bp].filter(x=>x!=null);let hit=null;for(const mk of marks){if((s.T<mk-1e-9&&Tn>=mk)||(s.T>mk+1e-9&&Tn<=mk)){if(hit==null||Math.abs(mk-s.T)<Math.abs(hit-s.T))hit=mk}}
  if(hit!=null){dQ-=(hit-s.T)*C;s.T=hit;if(hit===mpHi&&dQ<0&&s.ms<1e-9&&mpHi!==mpLo){/* entering mushy zone from above */}continue}
  s.T=Tn;dQ=0;s.stage=s.ms>1e-9&&s.ml>1e-9?(s.T>=mpLo?"melt":"solid"):s.ml>1e-9?"liquid":"solid";break}
 if(p.bp!=null&&s.ml>1e-9&&s.T>=p.bp-1e-9&&Pnet>0)s.stage="boil";
 return s.stage}
/* theoretical energy budget from T1 to T2 for mass m (J) with each stage */
function phaseBudget(p,m,T1,T2){const st=[];const mpLo=p.mpLo??p.mp,mpHi=p.mpHi??p.mp;
 if(p.tsub!=null){if(T1<p.tsub){const q=m*p.cs*(Math.min(T2,p.tsub)-T1);st.push(["تسخين الصلب","Q = m·c·ΔT",`${m} × ${p.cs} × (${fmtN(Math.min(T2,p.tsub))} − (${fmtN(T1)}))`,q])}if(T2>=p.tsub)st.push(["التسامي","Q = m·L",`${m} × ${p.Ls}`,m*p.Ls]);return st}
 let T=T1;if(T<mpLo&&T2>T){const e=Math.min(T2,mpLo);st.push(["تسخين الصلب","Q = m·cₛ·ΔT",`${m} × ${p.cs} × (${fmtN(e)} − ${fmtN(T)})`,m*p.cs*(e-T)]);T=e}
 if(T2>=mpLo&&T1<=mpHi)st.push(["الانصهار","Q = m·L_f",`${m} × ${p.Lf}`,m*p.Lf]);
 if(T2>mpHi){const s=Math.max(T1,mpHi),e=p.bp!=null?Math.min(T2,p.bp):T2;if(e>s)st.push(["تسخين السائل","Q = m·c_l·ΔT",`${m} × ${p.cl} × (${fmtN(e)} − ${fmtN(s)})`,m*p.cl*(e-s)])}
 if(p.bp!=null&&T2>=p.bp)st.push(["الغليان (التبخر)","Q = m·L_v",`${m} × ${p.Lv}`,m*p.Lv]);return st}
function fmtN(x){return Math.abs(x)>=100?x.toFixed(1):x.toFixed(1)}
