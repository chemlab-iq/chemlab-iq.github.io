/* =====================================================================
   EQUILIBRIUM SOLVER — speciation with activities (Davies), solids by Ksp
   Constants: log K at 25 °C, I = 0 (Martell & Smith / NIST SRD 46; Harris, Quantitative Chemical Analysis)
   ===================================================================== */
const ECOMP={H:1,Cl:-1,Br:-1,I:-1,SCN:-1,SO4:-2,CO3:-2,Ac:-1,NH3:0,Ox:-2,P:-2,CrO4:-2,Cu:2,Ag:1,Fe3:3,Fe2:2,Zn:2,Pb:2,Ba:2,Ca:2,Mg:2,Mn:2};
/* species: name, stoichiometry over components, logK (formation from components), charge */
const ESP=[
 ["OH-",{H:-1},null,-1],
 ["HSO4-",{H:1,SO4:1},1.99,-1],
 ["HCO3-",{H:1,CO3:1},10.33,-1],["H2CO3",{H:2,CO3:1},16.68,0],
 ["HAc",{H:1,Ac:1},4.76,0],
 ["NH4+",{H:1,NH3:1},9.25,1],
 ["HOx-",{H:1,Ox:1},4.27,-1],["H2Ox",{H:2,Ox:1},5.52,0],
 ["HP-",{H:1,P:1},5.41,-1],["H2P",{H:2,P:1},8.36,0],
 ["HCrO4-",{H:1,CrO4:1},6.51,-1],["Cr2O7^2-",{H:2,CrO4:2},14.56,-2],
 ["CuOH+",{Cu:1,H:-1},-7.95,1],["Cu(NH3)^2+",{Cu:1,NH3:1},4.31,2],["Cu(NH3)2^2+",{Cu:1,NH3:2},7.98,2],["Cu(NH3)3^2+",{Cu:1,NH3:3},11.02,2],["Cu(NH3)4^2+",{Cu:1,NH3:4},13.32,2],
 ["Ag(NH3)+",{Ag:1,NH3:1},3.31,1],["Ag(NH3)2+",{Ag:1,NH3:2},7.23,1],["AgCl(aq)",{Ag:1,Cl:1},3.31,0],["AgCl2-",{Ag:1,Cl:2},5.25,-1],
 ["FeOH^2+",{Fe3:1,H:-1},-2.19,2],["Fe(OH)2+",{Fe3:1,H:-2},-5.67,1],["FeSCN^2+",{Fe3:1,SCN:1},3.03,2],["FeCl^2+",{Fe3:1,Cl:1},1.48,2],["FeCl2+",{Fe3:1,Cl:2},2.13,1],
 ["FeOH+",{Fe2:1,H:-1},-9.5,1],
 ["ZnOH+",{Zn:1,H:-1},-8.96,1],["Zn(OH)3-",{Zn:1,H:-3},-28.4,-1],["Zn(OH)4^2-",{Zn:1,H:-4},-40.5,-2],["Zn(NH3)4^2+",{Zn:1,NH3:4},9.06,2],
 ["PbOH+",{Pb:1,H:-1},-7.71,1],["PbI+",{Pb:1,I:1},1.92,1],["PbI2(aq)",{Pb:1,I:2},3.20,0],["PbCl+",{Pb:1,Cl:1},1.55,1],["PbCl2(aq)",{Pb:1,Cl:2},2.00,0],["Pb(OH)3-",{Pb:1,H:-3},-28.06,-1],
 ["CaOH+",{Ca:1,H:-1},-12.78,1],["CaCO3(aq)",{Ca:1,CO3:1},3.22,0],["CaHCO3+",{Ca:1,CO3:1,H:1},11.43,1],["CaSO4(aq)",{Ca:1,SO4:1},2.31,0],
 ["MgOH+",{Mg:1,H:-1},-11.44,1],["MgSO4(aq)",{Mg:1,SO4:1},2.23,0],["MnOH+",{Mn:1,H:-1},-10.59,1],
 ["BaSO4(aq)",{Ba:1,SO4:1},2.7,0]
];
/* solids: formula, dissolution stoichiometry (components), log Ksp (hydroxides written with H+: M(OH)n + nH+ ⇌ M + nH2O) */
const ESOL=[
 ["AgCl",{Ag:1,Cl:1},-9.74],["AgBr",{Ag:1,Br:1},-12.30],["AgI",{Ag:1,I:1},-16.08],["AgSCN",{Ag:1,SCN:1},-12.0],["Ag2CO3",{Ag:2,CO3:1},-11.09],["Ag2CrO4",{Ag:2,CrO4:1},-11.96],["Ag2SO4",{Ag:2,SO4:1},-4.92],["Ag2O",{Ag:2,H:-2},12.58],
 ["PbI2",{Pb:1,I:2},-8.15],["PbCl2",{Pb:1,Cl:2},-4.77],["PbBr2",{Pb:1,Br:2},-5.18],["PbSO4",{Pb:1,SO4:1},-7.80],["PbCrO4",{Pb:1,CrO4:1},-12.55],["PbCO3",{Pb:1,CO3:1},-13.13],["Pb(OH)2",{Pb:1,H:-2},13.08],
 ["BaSO4",{Ba:1,SO4:1},-9.96],["BaCO3",{Ba:1,CO3:1},-8.29],["BaCrO4",{Ba:1,CrO4:1},-9.92],
 ["CaCO3",{Ca:1,CO3:1},-8.48],["CaSO4",{Ca:1,SO4:1},-4.31],["Ca(OH)2",{Ca:1,H:-2},22.80],["CaC2O4",{Ca:1,Ox:1},-8.64],
 ["Cu(OH)2",{Cu:1,H:-2},8.34],["CuCO3",{Cu:1,CO3:1},-9.85],
 ["Fe(OH)3",{Fe3:1,H:-3},3.96],["Fe(OH)2",{Fe2:1,H:-2},11.69],["FeCO3",{Fe2:1,CO3:1},-10.51],
 ["Zn(OH)2",{Zn:1,H:-2},11.48],["ZnCO3",{Zn:1,CO3:1},-9.82],["Mg(OH)2",{Mg:1,H:-2},16.75],["MgCO3",{Mg:1,CO3:1},-5.17],["Mn(OH)2",{Mn:1,H:-2},15.28]
];
const pKwT=TC=>{const T=TC+273.15;return 4470.99/T-6.0875+0.01706*T};
function davies(I,TC){const A=0.4918+0.0006614*TC+0.000004975*TC*TC;/* ≈0.509 at 25 °C */const s=Math.sqrt(I);return z=>-A*z*z*(s/(1+s)-0.3*I)}
/* totals: {comp: mol/L}; spect: {charge: Σ z·c for non-reacting ions (Na+, K+, NO3-, MnO4-, ...)}, I-contribution list */
function eqSolve(tot,specIons,TC){TC=TC??25;const comps=Object.keys(ECOMP).filter(c=>c==="H"||Math.abs(tot[c]||0)>1e-14);const idx=Object.fromEntries(comps.map((c,i)=>[c,i]));
 const sp=ESP.filter(s=>Object.keys(s[1]).every(c=>c in idx)).map(s=>({n:s[0],nu:s[1],lk:s[2]===null?-pKwT(TC):s[2],z:s[3]}));
 comps.forEach(c=>sp.push({n:c,nu:{[c]:1},lk:0,z:ECOMP[c],free:true}));
 const sol=ESOL.filter(s=>Object.keys(s[1]).every(c=>c in idx)).map(s=>({f:s[0],nu:s[1],lk:s[2],S:0,on:false}));
 const nC=comps.length;let X=comps.map(c=>c==="H"?-7:Math.log10(Math.max(Math.abs(tot[c]||0),1e-12)));
 let lg={};let I=0;for(const k in specIons)I+=0.5*specIons[k].z*specIons[k].z*specIons[k].c;
 const T=comps.map(c=>tot[c]||0);
 const conc=()=>{const g=davies(I,TC);return sp.map(s=>{let l=s.lk;for(const c in s.nu)l+=s.nu[c]*(X[idx[c]]+g(ECOMP[c]));l-=g(s.z);return Math.pow(10,Math.max(-40,Math.min(5,l)))})};
 const ln10=Math.LN10;let C=conc();
 for(let outer=0;outer<14;outer++){
  for(let it=0;it<200;it++){const g=davies(I,TC);C=conc();const act=sol.filter(s=>s.on);const N=nC+act.length;const F=new Array(N).fill(0),J=[...Array(N)].map(()=>new Array(N).fill(0));
   sp.forEach((s,i)=>{for(const a in s.nu){const ja=idx[a];F[ja]+=s.nu[a]*C[i];for(const b in s.nu)J[ja][idx[b]]+=ln10*s.nu[a]*s.nu[b]*C[i]}});
   act.forEach((s,k)=>{for(const a in s.nu){F[idx[a]]+=s.nu[a]*s.S;J[idx[a]][nC+k]+=s.nu[a]}let si=-s.lk;for(const a in s.nu){si+=s.nu[a]*(X[idx[a]]+g(ECOMP[a]));J[nC+k][idx[a]]+=s.nu[a]}F[nC+k]=si});
   for(let j=0;j<nC;j++)F[j]-=T[j];
   let err=0;for(let j=0;j<nC;j++){const sc=Math.max(Math.abs(T[j]),1e-10);err=Math.max(err,Math.abs(F[j])/sc)}for(let k=0;k<act.length;k++)err=Math.max(err,Math.abs(F[nC+k]));
   if(err<1e-10)break;const d=gauss(J,F.map(v=>-v));if(!d)break;let mx=0;for(let j=0;j<nC;j++)mx=Math.max(mx,Math.abs(d[j]));const lam=mx>1.5?1.5/mx:1;
   for(let j=0;j<nC;j++)X[j]+=lam*d[j];act.forEach((s,k)=>{s.S+=lam*d[nC+k]})}
  /* ionic strength update */
  C=conc();let I2=0;sp.forEach((s,i)=>{I2+=0.5*s.z*s.z*C[i]});for(const k in specIons)I2+=0.5*specIons[k].z*specIons[k].z*specIons[k].c;I2=Math.min(I2,2);
  /* active set */
  const g=davies(I2,TC);let changed=false;const neg=sol.filter(s=>s.on&&s.S<0);if(neg.length){neg.forEach(s=>{s.on=false;s.S=0});changed=true}
  else{let best=null,bsi=1e-7;sol.filter(s=>!s.on).forEach(s=>{let si=-s.lk;for(const a in s.nu)si+=s.nu[a]*(X[idx[a]]+g(ECOMP[a]));if(si>bsi){bsi=si;best=s}});if(best){best.on=true;best.S=0;changed=true}}
  const dI=Math.abs(I2-I);I=I2;if(!changed&&dI<1e-6)break}
 C=conc();const g=davies(I,TC);const out={};sp.forEach((s,i)=>out[s.n]=C[i]);
 const pHc=-X[idx.H],pH=-(X[idx.H]+g(1));
 return{c:out,solids:sol.filter(s=>s.on&&s.S>1e-12).map(s=>({f:s.f,S:s.S})),pH,pHc,I,gamma1:Math.pow(10,g(1))}}
function gauss(A,b){const n=b.length;const M=A.map((r,i)=>[...r,b[i]]);for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(M[r][c])>Math.abs(M[p][c]))p=r;if(Math.abs(M[p][c])<1e-300)return null;[M[c],M[p]]=[M[p],M[c]];for(let r=0;r<n;r++){if(r===c)continue;const f=M[r][c]/M[c][c];if(f)for(let k=c;k<=n;k++)M[r][k]-=f*M[c][k]}}return M.map((r,i)=>r[n]/r[i])}

/* ---------- materials → equilibrium components (mol per formula unit) ---------- */
const EQMAT={hcl:{H:1,Cl:1},h2so4:{H:2,SO4:1},hac:{H:1,Ac:1},naoh:{Na:1,H:-1},koh:{K:1,H:-1},nh3:{NH3:1},nh4cl:{NH3:1,H:1,Cl:1},caoh2:{Ca:1,H:-2},nacl:{Na:1,Cl:1},kcl:{K:1,Cl:1},kno3:{K:1,NO3:1},
 na2co3:{Na:2,CO3:1},nahco3:{Na:1,CO3:1,H:1},caco3:{Ca:1,CO3:1},cacl2:{Ca:1,Cl:2},cuso4:{Cu:1,SO4:1},fecl3:{Fe3:1,Cl:4,H:1},feso4:{Fe2:1,SO4:1},agno3:{Ag:1,NO3:1},ki:{K:1,I:1},kbr:{K:1,Br:1},pbno3:{Pb:1,NO3:2},bacl2:{Ba:1,Cl:2},kscn:{K:1,SCN:1},
 kmno4:{K:1,MnO4:1,H:20,SO4:10},k2cr2o7:{K:2,CrO4:2,H:2},k2cro4:{K:2,CrO4:1},h2o2:{H2O2:1},h2c2o4:{Ox:1,H:2},khp:{K:1,P:1,H:1},co2:{CO3:1,H:2},i2:{I2:1},starch:{starch:1}};
const SPECT={Na:1,K:1,NO3:-1,MnO4:-1};/* non-reacting ions: tracked for charge/ionic strength only */

/* ---------- spectral colour (Beer–Lambert → CIE 1931 → sRGB) ---------- */
const D65=[49.98,54.65,82.75,91.49,93.43,86.68,104.86,117.01,117.81,114.86,115.92,108.81,109.35,107.80,104.79,107.69,104.41,104.05,100.00,96.33,95.79,88.69,90.01,89.60,87.70,83.29,83.70,80.03,80.21,82.28,78.28,69.72,71.61,74.35,61.60,69.89,75.09,63.59,46.42,66.81,63.38];
const gp=(l,m,s1,s2)=>{const t=(l-m)/(l<m?s1:s2);return Math.exp(-0.5*t*t)};
const CMF=D65.map((_,i)=>{const l=380+10*i;return[1.056*gp(l,599.8,37.9,31.0)+0.362*gp(l,442.0,16.0,26.7)-0.065*gp(l,501.1,20.4,26.2),0.821*gp(l,568.8,46.9,40.5)+0.286*gp(l,530.9,16.3,31.1),1.217*gp(l,437.0,11.8,36.0)+0.681*gp(l,459.0,26.0,13.8)]});
const YW=CMF.reduce((s,c,i)=>s+c[1]*D65[i],0),XW=CMF.reduce((s,c,i)=>s+c[0]*D65[i],0)/YW,ZW=CMF.reduce((s,c,i)=>s+c[2]*D65[i],0)/YW;
/* absorption bands: [λmax nm, ε max (L mol⁻¹ cm⁻¹), FWHM nm] */
const BANDS={"Cu":[[810,10,250]],"CuOH+":[[800,10,250]],"Cu(NH3)^2+":[[730,22,240]],"Cu(NH3)2^2+":[[670,32,230]],"Cu(NH3)3^2+":[[630,42,220]],"Cu(NH3)4^2+":[[600,52,210]],
 "Fe3":[[300,1500,90]],"FeOH^2+":[[297,2000,100]],"Fe(OH)2+":[[300,2000,110]],"FeCl^2+":[[336,2000,118]],"FeCl2+":[[348,2800,130]],"FeOH^2+":[[300,2000,110],[400,120,120]],"Fe(OH)2+":[[310,1800,120],[420,150,120]],"FeSCN^2+":[[447,4700,135]],"Fe2":[[970,2,320]],"FeOH+":[[970,2,320]],
 "MnO4":[[507,1700,38],[526,2400,40],[546,2350,38],[566,1500,40]],"Mn":[[400,0.03,60]],"Cr2O7^2-":[[350,3000,80],[440,280,90]],"CrO4":[[372,4800,85]],"HCrO4-":[[350,1600,90]],
 "I2":[[353,26400,70],[460,1100,150]],"SI":[[615,38000,150]],
 "php:In":[[553,30000,46],[522,14000,56]],"mo:HIn":[[505,47000,110]],"mo:In":[[464,27000,110]],"btb:HIn":[[433,18000,105]],"btb:In":[[617,39000,95]],"tb:H2In":[[544,30000,100]],"tb:HIn":[[430,15000,100]],"tb:In":[[596,33000,100]],"mr:HIn":[[520,40000,110]],"mr:In":[[430,20000,110]]};
function spectralRGB(conc,path){path=path||2.0;const A=new Array(41).fill(0);for(const k in conc){const c=conc[k];const b=BANDS[k];if(!b||!(c>0))continue;for(let i=0;i<41;i++){const l=380+10*i;for(const [m,e,w] of b){const s=w/2.355;A[i]+=e*c*path*Math.exp(-0.5*((l-m)/s)**2)}}}
 for(let i=0;i<41;i++)A[i]=2.6*(1-Math.exp(-A[i]/2.6));/* soft display ceiling: keeps hue order for very dark solutions */
 let X=0,Y=0,Z=0;for(let i=0;i<41;i++){const t=Math.pow(10,-Math.min(A[i],8))*D65[i];X+=CMF[i][0]*t;Y+=CMF[i][1]*t;Z+=CMF[i][2]*t}X/=YW;Y/=YW;Z/=YW;
 X*=0.9505/XW;Z*=1.089/ZW;/* adapt the analytic CMF white to D65 */
 const r=3.2406*X-1.5372*Y-0.4986*Z,g=-0.9689*X+1.8758*Y+0.0415*Z,b=0.0557*X-0.2040*Y+1.0570*Z;const comp=v=>{v=Math.max(0,Math.min(1,v));return Math.round(255*(v<=0.0031308?12.92*v:1.055*Math.pow(v,1/2.4)-0.055))};
 return[comp(r),comp(g),comp(b)]}
/* indicator speciation (stock: php 1 % in EtOH, mo 0.1 %, btb 0.04 %, universal ≈ mix) → mol per drop (0.05 mL) */
const INDQ={php:0.05e-3*10/318.3,mo:0.05e-3*2/327.3,btb:0.05e-3*1/624.4,univ:0.05e-3*0.7/400};
function indicatorConc(ind,pH,Vl){const out={};const fr=(pKa)=>1/(1+Math.pow(10,pKa-pH));
 for(const k in ind){const n=(INDQ[k]||0)*ind[k];const c=n/Vl;if(k==="php"){out["php:In"]=(out["php:In"]||0)+c*fr(9.4)}else if(k==="mo"){const f=fr(3.46);out["mo:In"]=(out["mo:In"]||0)+c*f;out["mo:HIn"]=(out["mo:HIn"]||0)+c*(1-f)}else if(k==="btb"){const f=fr(7.1);out["btb:In"]=(out["btb:In"]||0)+c*f;out["btb:HIn"]=(out["btb:HIn"]||0)+c*(1-f)}
  else if(k==="univ"){/* Yamada-type: thymol blue, methyl red, bromothymol blue, phenolphthalein */const f1=fr(1.7),f2=fr(8.9);out["tb:H2In"]=(out["tb:H2In"]||0)+c*(1-f1);out["tb:HIn"]=(out["tb:HIn"]||0)+c*f1*(1-f2);out["tb:In"]=(out["tb:In"]||0)+c*f1*f2;const m=fr(5.0);out["mr:HIn"]=(out["mr:HIn"]||0)+c*(1-m);out["mr:In"]=(out["mr:In"]||0)+c*m;const bb=fr(7.1);out["btb:In"]=(out["btb:In"]||0)+c*bb;out["btb:HIn"]=(out["btb:HIn"]||0)+c*(1-bb);out["php:In"]=(out["php:In"]||0)+c*fr(9.4)}}return out}
