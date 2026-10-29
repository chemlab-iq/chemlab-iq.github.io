/* =====================================================================
   REACTION VIDEO — every reaction plays like a short lab video: real glassware, drops falling,
   colour spreading through the liquid, bubbles, precipitate clouding and settling, gas carried
   through a delivery tube, thermometer and pH meter moving, synced captions and equations.
   Frame-rendered SVG (deterministic), so it can be paused and scrubbed like a video.
   ===================================================================== */
const RV={n:0,live:new Map(),playing:null};
const rvC=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const rvE=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
const rvR=(i,k)=>{const x=Math.sin(i*12.9898+k*78.233)*43758.5453;return x-Math.floor(x)};
const rvHex=c=>{c=String(c).replace("#","");if(c.length===3)c=c.split("").map(x=>x+x).join("");const n=parseInt(c,16);return[(n>>16)&255,(n>>8)&255,n&255]};
const rvToHex=a=>"#"+a.map(v=>Math.round(rvC(v,0,255)).toString(16).padStart(2,"0")).join("");
/* liquids: colour + opacity (o) */
const LQ={water:{c:"#bfe0f2",o:.42},milky:{c:"#f3f3ee",o:.97},pink:{c:"#e2407e",o:.6},pinkpale:{c:"#f28ab0",o:.42},purple:{c:"#57198a",o:.93},purplepale:{c:"#d39ad8",o:.42},
 orange:{c:"#e5770e",o:.84},green:{c:"#2f7f4f",o:.8},blue:{c:"#1d6fd0",o:.75},bluepale:{c:"#78aeea",o:.55},yellow:{c:"#f0c430",o:.62},chromate:{c:"#f3c010",o:.8},brown:{c:"#a95a1a",o:.85},
 bromine:{c:"#d2731f",o:.8},starch:{c:"#141d6b",o:.95},feII:{c:"#cfe6b8",o:.45},bleach:{c:"#e4ecbe",o:.5},acid:{c:"#ece6cf",o:.62},mncl2:{c:"#f0d6dc",o:.42},
 uiRed:{c:"#e53935",o:.75},uiOrange:{c:"#f39c12",o:.75},uiGreen:{c:"#43a047",o:.72},uiTeal:{c:"#1f9e8f",o:.72},uiBlue:{c:"#3949ab",o:.78}};
const rvLq=x=>typeof x==="string"?(LQ[x]||{c:x,o:.7}):x;
const rvMixL=(a,b,f)=>{a=rvLq(a);b=rvLq(b);const A=rvHex(a.c),B=rvHex(b.c);return{c:rvToHex(A.map((v,i)=>v+(B[i]-v)*f)),o:a.o+(b.o-a.o)*f}};
const rvTx=(x,y,t,o={})=>`<text x="${x}" y="${y}" text-anchor="${o.a||"middle"}" font-size="${o.s||12}" font-weight="${o.b?700:500}" fill="${o.c||"var(--ink)"}" style="font-family:${o.mono?"var(--f-mono)":"var(--f-body)"}" direction="${/[\u0600-\u06FF]/.test(String(t))?"rtl":"ltr"}">${t}</text>`;
const rvPill=(x,y,t,o={})=>{const w=Math.max(34,String(t).replace(/<[^>]+>/g,"").length*(o.s?o.s*.56:6.6)+16);return`<g><rect x="${x-w/2}" y="${y-12}" width="${w}" height="20" rx="10" fill="${o.bg||"var(--surface)"}" stroke="${o.st||"var(--line)"}" opacity=".96"/>${rvTx(x,y+2.5,t,{s:o.s||11.5,b:1,c:o.c})}</g>`};
const RVBY=262;
/* ---------- vessel geometry ---------- */
function rvGeo(V){const T=V.type||"tube";
 if(T==="tube"){const w=V.w||54,h=V.h||160,cx=V.x,top=V.top??(RVBY-h-14),bot=top+h,r=w/2,x0=cx-r,x1=cx+r;
  return{T,cx,top,bot,x0,x1,w,h,mouth:top,inner:[x0+3,x1-3],surf:l=>bot-l*(h-8),path:`M${x0} ${top} L${x0} ${bot-r} A${r} ${r} 0 0 0 ${x1} ${bot-r} L${x1} ${top}`,clip:`M${x0+1.5} ${top} L${x0+1.5} ${bot-r} A${r-1.5} ${r-1.5} 0 0 0 ${x1-1.5} ${bot-r} L${x1-1.5} ${top} Z`}}
 if(T==="beaker"){const w=V.w||150,h=V.h||128,cx=V.x,base=V.base??RVBY,top=base-h,x0=cx-w/2,x1=cx+w/2;
  return{T,cx,top,bot:base,x0,x1,w,h,mouth:top,inner:[x0+4,x1-4],surf:l=>base-l*h,path:`M${x0-6} ${top-4} L${x0} ${top+2} L${x0} ${base-8} Q${x0} ${base} ${x0+8} ${base} L${x1-8} ${base} Q${x1} ${base} ${x1} ${base-8} L${x1} ${top+2} L${x1+4} ${top-2}`,clip:`M${x0+2} ${top} L${x0+2} ${base-8} Q${x0+2} ${base-2} ${x0+9} ${base-2} L${x1-9} ${base-2} Q${x1-2} ${base-2} ${x1-2} ${base-8} L${x1-2} ${top} Z`}}
 /* conical (Erlenmeyer) flask */
 const s=V.s||1.25,nw=13*s,bw=62*s,h=118*s,nh=40*s,cx=V.x,base=V.base??RVBY,top=base-h;
 return{T:"flask",cx,top,bot:base,x0:cx-bw,x1:cx+bw,w:bw*2,h,mouth:top,inner:[cx-bw+8,cx+bw-8],neck:[cx-nw,cx+nw],surf:l=>base-l*h,
  path:`M${cx-nw-4} ${top} L${cx-nw} ${top+4} L${cx-nw} ${top+nh} L${cx-bw} ${base-7} Q${cx-bw} ${base} ${cx-bw+8} ${base} L${cx+bw-8} ${base} Q${cx+bw} ${base} ${cx+bw} ${base-7} L${cx+nw} ${top+nh} L${cx+nw} ${top+4} L${cx+nw+4} ${top}`,
  clip:`M${cx-nw+1.5} ${top} L${cx-nw+1.5} ${top+nh} L${cx-bw+2} ${base-7} Q${cx-bw+2} ${base-2} ${cx-bw+9} ${base-2} L${cx+bw-9} ${base-2} Q${cx+bw-2} ${base-2} ${cx+bw-2} ${base-7} L${cx+nw-1.5} ${top+nh} L${cx+nw-1.5} ${top} Z`}}
const rvWidthAt=(G,y)=>{if(G.T!=="flask")return[G.inner[0],G.inner[1]];const f=rvC((y-(G.top+40*1.25))/(G.bot-(G.top+40*1.25)));const hw=G.neck[1]-G.cx+(G.w/2-(G.neck[1]-G.cx)-8)*f;return[G.cx-hw+4,G.cx+hw-4]};
/* ---------- state of an event at time t ---------- */
const rvP=(e,t)=>rvC((t-e.at)/(e.d||0.001));
function rvState(S,t){const st={lvlA:S.A.lvl||0,lvlB:S.B?S.B.lvl||0:0,colA:rvLq(S.A.liq||"water"),colB:S.B?rvLq(S.B.liq||"water"):null,diff:null,diffB:null,temp:S.tools&&S.tools.therm!=null?S.tools.therm:null,ph:S.tools&&S.tools.ph!=null?S.tools.ph:null,swirl:0,heat:0};
 for(const e of S.ev){const p=rvP(e,t);if(t<e.at)continue;
  if(e.k==="pour"||e.k==="drip"||e.k==="burette")st.lvlA+=(e.amt||0)*rvE(p);
  if(e.k==="melt")st.lvlA+=(e.amt||0)*rvE(p);
  if(e.k==="col"){if(p<1&&e.spread){st.diff={from:st.colA,to:rvLq(e.to),f:rvE(p),up:e.spread==="up"}}else st.colA=rvMixL(st.colA,e.to,e.spread?1:rvE(p))}
  if(e.k==="bcol"){if(p<1&&e.spread){st.diffB={from:st.colB,to:rvLq(e.to),f:rvE(p)}}else st.colB=rvMixL(st.colB,e.to,e.spread?1:rvE(p))}
  if(e.k==="temp"){st.temp=e.from+(e.to-e.from)*rvE(p);if(p<1&&e.to>e.from)st.heat=1}
  if(e.k==="ph"){const pts=e.pts;let v=pts[0][1];for(let i=1;i<pts.length;i++){if(p<=pts[i][0]){const a=pts[i-1],b=pts[i];v=a[1]+(b[1]-a[1])*rvC((p-a[0])/(b[0]-a[0]||1));break}v=pts[i][1]}st.ph=v}
  if(e.k==="swirl"&&p<1)st.swirl=Math.sin((t-e.at)*7)*3.5*Math.sin(Math.PI*p);
  if(e.k==="heat"&&p<1)st.heat=1}
 return st}
/* ---------- drawing pieces ---------- */
function rvBackdrop(id){return`<defs><linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--surface)"/><stop offset="1" style="stop-color:var(--surface-2)"/></linearGradient>
<linearGradient id="${id}t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5d6d75"/><stop offset="1" stop-color="#3c4a51"/></linearGradient>
<linearGradient id="${id}g" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".18" stop-color="#fff" stop-opacity=".38"/><stop offset=".32" stop-color="#fff" stop-opacity="0"/><stop offset=".86" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".1"/></linearGradient>
<radialGradient id="${id}f"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#fffbe6"/><stop offset="1" stop-color="#fff3b0" stop-opacity="0"/></radialGradient></defs>
<rect x="0" y="0" width="560" height="${RVBY}" fill="url(#${id}w)"/><g opacity=".3">${Array.from({length:8},(_,i)=>`<line x1="${i*76+18}" y1="0" x2="${i*76+18}" y2="${RVBY}" stroke="var(--line)"/>`).join("")}</g><rect x="0" y="${RVBY}" width="560" height="48" fill="url(#${id}t)"/><rect x="0" y="${RVBY}" width="560" height="4" fill="#78909c"/>`}
function rvBubbles(n,x0,x1,yb,yt,t,sp,r0,r1,seed,env,col){let g="";for(let i=0;i<n;i++){if(rvR(i,seed+4)>env)continue;const ph=rvR(i,seed),v=sp*(.6+.8*rvR(i,seed+1));const y=yb-((t*v+ph)%1)*(yb-yt);const x=x0+rvR(i,seed+2)*(x1-x0)+Math.sin(t*4+i)*2;const r=r0+rvR(i,seed+3)*(r1-r0);g+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${col||"#fff"}" fill-opacity=".55" stroke="#fff" stroke-opacity=".9" stroke-width=".8"/>`}return g}
function rvCloud(x,y,t,p,col,o={}){let g="";const n=o.n||9;for(let i=0;i<n;i++){const a=rvR(i,31),life=((t*.25+a)%1);const yy=y-life*(o.rise||90)-6;const xx=x+(rvR(i,32)-.5)*(o.spread||40)+Math.sin(t+i)*6+life*(o.drift||10);const r=(o.r||12)*(.6+life*1.6);g+=`<circle cx="${xx.toFixed(1)}" cy="${yy.toFixed(1)}" r="${r.toFixed(1)}" fill="${col}" opacity="${(p*(o.op||.5)*(1-life)).toFixed(3)}"/>`}return g}
function rvSteam(x,y,t,a){if(a<=0)return"";let g="";for(let i=0;i<4;i++){const life=((t*.45+i/4)%1);const xx=x+(i-1.5)*9+Math.sin(t*2+i)*5;g+=`<path d="M${xx} ${y-life*55} q6 -8 0 -16 q-6 -8 0 -16" fill="none" stroke="var(--muted)" stroke-width="2" stroke-linecap="round" opacity="${(a*.55*(1-life)).toFixed(3)}"/>`}return g}
function rvTherm(G,temp,id){const x=G.cx+(G.T==="tube"?7:G.w*.26),top=G.top-62,bot=G.bot-14;const yT=v=>bot-(rvC((v+30)/140))*(bot-top-14);const yc=yT(temp);
 return`<rect x="${x-3.5}" y="${top}" width="7" height="${bot-top}" rx="3.5" fill="#fff" fill-opacity=".85" stroke="#90a4ae"/><circle cx="${x}" cy="${bot}" r="6" fill="#d32f2f"/><rect x="${x-1.6}" y="${yc.toFixed(1)}" width="3.2" height="${(bot-yc).toFixed(1)}" fill="#d32f2f"/>${rvPill(x+(G.T==="tube"?-46:46),top+12,`${temp.toFixed(1)} °C`,{c:"#c62828"})}`}
function rvPHmeter(x,y,ph){return`<rect x="${x-46}" y="${y-30}" width="92" height="58" rx="8" fill="#eceff1" stroke="#78909c" stroke-width="2"/><rect x="${x-38}" y="${y-22}" width="76" height="28" rx="4" fill="#1d2b22"/>${rvTx(x+32,y-1,ph.toFixed(2),{a:"end",s:19,mono:1,c:"#9cf2b4"})}${rvTx(x,y+20,"pH",{s:10,c:"#546e7a",b:1})}`}
function rvDropper(G,e,t,lab,off){const p=rvP(e,t);const tip=G.mouth-16,x=G.cx+(off||0);let g=`<g><rect x="${x-3}" y="${tip-40}" width="6" height="40" fill="#e3f2fd" stroke="#90a4ae"/><path d="M${x-3} ${tip} L${x} ${tip+8} L${x+3} ${tip}" fill="#e3f2fd" stroke="#90a4ae"/><ellipse cx="${x}" cy="${tip-50}" rx="${8+(p>0&&p<1?Math.abs(Math.sin((t-e.at)*e.n/e.d*Math.PI))*-2:0)}" ry="13" fill="#c62828"/></g>`;
 if(t>=e.at&&t<=e.at+e.d+.5){const surf=e.surf;for(let i=0;i<e.n;i++){const ti=e.at+i*e.d/e.n,f=(t-ti)/.45;if(f>=0&&f<=1){const yy=tip+8+(surf-tip-8)*f*f;g+=`<ellipse cx="${x}" cy="${yy.toFixed(1)}" rx="3" ry="4" fill="${rvLq(e.col||"water").c}" fill-opacity="${Math.max(.6,rvLq(e.col||"water").o)}" stroke="#fff" stroke-width=".6"/>`}}}
 return g+(lab?rvPill(x+(off?-58:62),tip-46,lab,{c:"var(--teal)"}):"")}
function rvBurette(G,e,t,lab,stt){const x=G.cx,top=8,tip=G.mouth-10;const p=e?rvP(e,t):0;const lv0=e?e.l0:.15,lv=lv0+(e?(e.l1-lv0)*rvE(p):0);const bl=top+6+(tip-46-top)*lv;
 let g=`<rect x="${x+G.w/2+26}" y="${top-6}" width="6" height="${RVBY-top+6}" fill="#90a4ae"/><rect x="${x+G.w/2+6}" y="${RVBY-8}" width="46" height="8" rx="2" fill="#546e7a"/><rect x="${x+6}" y="${top+60}" width="${G.w/2+22}" height="6" rx="2" fill="#78909c"/><rect x="${x+4}" y="${top+55}" width="8" height="16" rx="2" fill="#607d8b"/>
 <rect x="${x-6}" y="${top}" width="12" height="${tip-40-top}" fill="#fff" fill-opacity=".6" stroke="#90a4ae"/><rect x="${x-5}" y="${bl.toFixed(1)}" width="10" height="${(tip-41-bl).toFixed(1)}" fill="${rvLq(e&&e.col||"water").c}" fill-opacity="${rvLq(e&&e.col||"water").o}"/>
 ${Array.from({length:10},(_,i)=>`<line x1="${x-6}" y1="${top+10+i*(tip-60-top)/10}" x2="${x}" y2="${top+10+i*(tip-60-top)/10}" stroke="#607d8b" stroke-width=".7"/>`).join("")}
 <rect x="${x-9}" y="${tip-40}" width="18" height="8" rx="2" fill="#37474f"/><path d="M${x-2} ${tip-32} L${x-1} ${tip} L${x+1} ${tip} L${x+2} ${tip-32}" fill="#e3f2fd" stroke="#90a4ae"/>`;
 if(e&&p>0&&p<1){const rate=e.rate||3;for(let i=0;i<3;i++){const f=((t-e.at)*rate/3+i/3)%1;const yy=tip+(stt-tip)*f*f;g+=`<ellipse cx="${x}" cy="${yy.toFixed(1)}" rx="2.6" ry="3.4" fill="${rvLq(e.col||"water").c}" fill-opacity="${Math.max(.55,rvLq(e.col||"water").o)}"/>`}}
 return g+(lab?rvPill(x-62,top+40,lab,{c:"var(--teal)"}):"")}
function rvPourer(G,e,t,lab){const p=rvP(e,t);const tilt=t<e.at?0:t>e.at+e.d?0:Math.sin(Math.PI*p)*58;const bx=G.cx-G.w/2-44,by=G.mouth-40;const lq=rvLq(e.col||"acid");const rem=1-rvE(p)*.7;
 let g=`<g transform="rotate(${tilt.toFixed(1)} ${bx+22} ${by})"><path d="M${bx} ${by-38} L${bx} ${by} L${bx+44} ${by} L${bx+44} ${by-38}" fill="#fff" fill-opacity=".35" stroke="#90a4ae" stroke-width="2"/><rect x="${bx+2}" y="${by-30*rem}" width="40" height="${30*rem}" fill="${lq.c}" fill-opacity="${lq.o}"/></g>`;
 if(p>.12&&p<.9){const lx=bx+46,ly=by-30;g+=`<path d="M${lx} ${ly} Q${lx+14} ${ly+6} ${G.cx-G.w*.18} ${e.surf}" fill="none" stroke="${lq.c}" stroke-opacity="${Math.max(.6,lq.o)}" stroke-width="3.5" stroke-linecap="round"/>`}
 return g+(lab?rvPill(bx+22,by-52,lab,{c:"var(--teal)"}):"")}
function rvBurner(x,y,on,t,col){const fl=on?1+Math.sin(t*23)*.08+Math.sin(t*11)*.06:0;return`<rect x="${x-14}" y="${RVBY-10}" width="28" height="10" rx="2" fill="#37474f"/><rect x="${x-5}" y="${y}" width="10" height="${RVBY-10-y}" fill="#90a4ae"/>${on?`<path d="M${x-7} ${y} Q${x-9} ${y-22*fl} ${x} ${y-40*fl} Q${x+9} ${y-22*fl} ${x+7} ${y} Z" fill="${col||"#4f7bff"}" opacity=".85"/><path d="M${x-3} ${y} Q${x-4} ${y-10} ${x} ${y-20*fl} Q${x+4} ${y-10} ${x+3} ${y} Z" fill="#bfe1ff"/>`:""}`}
function rvHotplate(G,on){const x=G.cx,w=G.w+40;return`<rect x="${x-w/2}" y="${RVBY-20}" width="${w}" height="20" rx="4" fill="#cfd8dc" stroke="#90a4ae"/><rect x="${x-w/2+8}" y="${RVBY-20}" width="${w-16}" height="4" fill="${on?"#e53935":"#90a4ae"}" opacity="${on?.85:1}"/><circle cx="${x+w/2-14}" cy="${RVBY-10}" r="4" fill="${on?"#ff7043":"#78909c"}"/>`}
function rvIce(G){let g=`<path d="M${G.x0-30} ${RVBY-70} L${G.x0-22} ${RVBY} L${G.x1+22} ${RVBY} L${G.x1+30} ${RVBY-70}" fill="#e3f2fd" fill-opacity=".7" stroke="#90a4ae" stroke-width="2"/>`;for(let i=0;i<12;i++){const x=G.x0-22+rvR(i,5)*(G.w+44),y=RVBY-8-rvR(i,6)*55;if(x>G.x0+6&&x<G.x1-6&&y>RVBY-60)continue;g+=`<rect x="${x-7}" y="${y-7}" width="14" height="14" rx="3" fill="#fff" stroke="#b3d4ea" transform="rotate(${(rvR(i,7)*40-20).toFixed(0)} ${x} ${y})"/>`}return g}
/* ---------- contents inside the liquid of a vessel ---------- */
function rvInside(S,G,st,t,which){let g="";const lvl=which==="B"?st.lvlB:st.lvlA;const ys=G.surf(lvl),yb=G.bot-4;const [ix0,ix1]=rvWidthAt(G,(ys+yb)/2);
 for(const e of S.ev){if(((e.v||"A")!==which&&e.k!=="pipe")||(t<e.at&&e.k!=="melt"&&e.k!=="dis"))continue;const p=rvP(e,t),te=Math.max(0,t-e.at);
  if(e.k==="flash"){(e.times||[]).forEach((tt,i)=>{const f=(t-e.at-tt)/1.1;if(f>=0&&f<=1){g+=`<ellipse cx="${G.cx+(rvR(i,9)-.5)*20}" cy="${ys+10+f*14}" rx="${(6+f*26).toFixed(1)}" ry="${(4+f*12).toFixed(1)}" fill="${rvLq(e.col).c}" opacity="${(.85*(1-f)).toFixed(3)}"/>`}})}
  if(e.k==="ppt"){const col=e.col||"#f7f7f2",n=e.n||70,layer=e.layer||14;const cloud=.6*rvC(p*3)*(1-.8*rvC((p-.4)/.6));g+=`<rect x="${G.x0}" y="${ys}" width="${G.w}" height="${yb-ys+4}" fill="${col}" opacity="${cloud.toFixed(3)}"/>`;
   for(let i=0;i<n;i++){const a=rvR(i,11);const sx=ix0+rvR(i,12)*(ix1-ix0),sy=ys+4+a*.45*(yb-ys);const ey=yb-rvR(i,13)*layer;const f=rvE(rvC((p-.22-a*.25)/.55));const y=sy+(ey-sy)*f;const op=rvC(p*5-a*1.5);if(op<=0)continue;g+=`<circle cx="${(sx+Math.sin(te*2+i)*(1-f)*3).toFixed(1)}" cy="${y.toFixed(1)}" r="${(1.4+rvR(i,14)*2.2).toFixed(1)}" fill="${col}" stroke="rgba(0,0,0,.12)" stroke-width=".4" opacity="${op.toFixed(2)}"/>`}
   const lh=layer*rvC((p-.45)/.55);if(lh>0)g+=`<rect x="${G.x0}" y="${(yb-lh+3).toFixed(1)}" width="${G.w}" height="${(lh+2).toFixed(1)}" fill="${col}"/>`}
  if(e.k==="fizz"){const env=rvC(te*3)*(p>.88?(1-p)/.12:1);if(p<1)g+=rvBubbles(e.n||34,ix0+4,ix1-4,yb-(e.from==="solid"?8:2),ys+3,t,e.sp||.9,1.2,e.big?4.5:3,17+(which==="B"?50:0),env)+(env>.3?Array.from({length:9},(_,i)=>`<circle cx="${(ix0+6+rvR(i,21)*(ix1-ix0-12)).toFixed(1)}" cy="${(ys+1+Math.sin(t*9+i)*1.2).toFixed(1)}" r="${(1.5+rvR(i,22)*2.4).toFixed(1)}" fill="#fff" opacity="${(.8*env).toFixed(2)}"/>`).join(""):"")}
  if(e.k==="pipe"&&which==="B"){const env=rvC(te*2)*(p>.92?(1-p)/.08:1);const ex=G.cx+2,ey=G.bot-16;if(p<1)g+=rvBubbles(18,ex-5,ex+5,ey,ys+2,t,1.1,1.8,3.6,63,env)}
  if(e.k==="boil"){const env=rvC(te*1.5)*(p>.9?(1-p)/.1:1);if(p<1)g+=rvBubbles(30,ix0+8,ix1-8,yb-2,ys+3,t,1.6,2.5,6,41,env)}
  if(e.k==="blow"){const env=rvC(te*3)*(p>.9?(1-p)/.1:1);if(p<1)g+=rvBubbles(22,G.cx-2,G.cx+16,yb-12,ys+2,t,1.3,2,4.2,71,env)}
  if(e.k==="dis"){const n=e.n||7,col=e.col||"#fafafa";for(let i=0;i<n;i++){const f=rvE(rvC((p-rvR(i,15)*.35)/.65));const r=(e.r||6)*(1-f)*(.75+rvR(i,16)*.5);if(r<.3)continue;const x=ix0+10+rvR(i,17)*(ix1-ix0-20),y=yb-r-1;g+=e.shape==="crys"?`<rect x="${(x-r).toFixed(1)}" y="${(y-r).toFixed(1)}" width="${(2*r).toFixed(1)}" height="${(2*r).toFixed(1)}" fill="${col}" stroke="rgba(0,0,0,.25)" stroke-width=".6" transform="rotate(${(rvR(i,18)*60).toFixed(0)} ${x} ${y})"/>`:`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(r*1.25).toFixed(1)}" ry="${r.toFixed(1)}" fill="${col}" stroke="rgba(0,0,0,.2)" stroke-width=".6"/>`;
    if(e.streak&&f>0&&f<1){g+=`<path d="M${x} ${y} q${8*Math.sin(t+i)} -${20} 0 -${40*f+10} q${-6} -12 ${4} -${24*f}" fill="none" stroke="${rvLq(e.streak).c}" stroke-width="${(5*(1-f)+2).toFixed(1)}" stroke-linecap="round" opacity="${(.55*(1-f*.6)).toFixed(2)}"/>`}}}
  if(e.k==="melt"){const n=e.n||5;for(let i=0;i<n;i++){const f=rvE(rvC((p-rvR(i,25)*.3)/.7));const s=(e.r||13)*(1-f);if(s<.5)continue;const x=ix0+14+rvR(i,26)*(ix1-ix0-28),y=ys-2+rvR(i,27)*14;g+=`<rect x="${(x-s).toFixed(1)}" y="${(y-s*.6).toFixed(1)}" width="${(2*s).toFixed(1)}" height="${(2*s*.9).toFixed(1)}" rx="${(s*.3).toFixed(1)}" fill="#f4fbff" fill-opacity=".9" stroke="#a7cbe4" transform="rotate(${(rvR(i,28)*30-15).toFixed(0)} ${x} ${y})"/>`}}
  if(e.k==="crys"){const n=e.n||26;for(let i=0;i<n;i++){const f=rvE(rvC((p-rvR(i,35)*.55)/.45));if(f<=0)continue;const bx=ix0+6+rvR(i,36)*(ix1-ix0-12),by=yb-1;const L=(10+rvR(i,37)*22)*f,a=-Math.PI/2+(rvR(i,38)-.5)*1.6;g+=`<line x1="${bx.toFixed(1)}" y1="${by}" x2="${(bx+Math.cos(a)*L).toFixed(1)}" y2="${(by+Math.sin(a)*L).toFixed(1)}" stroke="#6f8a99" stroke-width="3.6" stroke-linecap="round"/><line x1="${bx.toFixed(1)}" y1="${by}" x2="${(bx+Math.cos(a)*L).toFixed(1)}" y2="${(by+Math.sin(a)*L).toFixed(1)}" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`}}
  if(e.k==="coat"){const sx=G.cx-5,sy=ys-30;g+=`<rect x="${sx}" y="${sy+30}" width="10" height="${(yb-sy-34).toFixed(1)}" fill="${e.col}" opacity="${(.95*rvE(p)).toFixed(2)}"/>`;
   if(e.tree){for(let i=0;i<14;i++){const f=rvE(rvC((p-rvR(i,45)*.5)/.5));if(f<=0)continue;const y=sy+40+rvR(i,46)*(yb-sy-50),side=i%2?1:-1,L=(8+rvR(i,47)*12)*f;const x2=sx+5+side*(5+L),y2=y-L*.5;g+=`<path d="M${sx+5+side*5} ${y.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)} M${(sx+5+side*(5+L*.5)).toFixed(1)} ${(y-L*.25).toFixed(1)} l${side*4} ${-5*f}" stroke="${e.col}" stroke-width="1.8" fill="none"/>`}}}
 }
 return g}
/* ---------- one full frame ---------- */
function rvFrame(S,t,id){if(S.tools&&S.tools.hotplate&&S.A.base==null)S.A.base=RVBY-20;const st=rvState(S,t);const A=rvGeo(S.A),B=S.B?rvGeo(S.B):null,tl=S.tools||{};
 let g=rvBackdrop(id);
 if(S.board){const xs=S.A.hide?[150,410]:[A.x0,A.x1,B?B.x0:A.x0,B?B.x1:A.x1];const x0=Math.min(...xs)-46,x1=Math.max(...xs)+46;g+=`<rect x="${x0}" y="34" width="${x1-x0}" height="${RVBY-34}" rx="10" fill="#26343b"/><rect x="${x0}" y="34" width="${x1-x0}" height="${RVBY-34}" rx="10" fill="none" stroke="#3d4f58" stroke-width="2"/>`}
 const heating=st.heat>0||S.ev.some(e=>(e.k==="boil"||e.k==="heat")&&t>=e.at&&t<=e.at+e.d);
 if(tl.ice)g+=rvIce(A);
 if(tl.hotplate)g+=rvHotplate(A,heating);
 if(tl.burner)g+=rvBurner(A.cx,Math.min(RVBY-24,A.bot+42),heating||tl.burner==="on",t,tl.flame);
 if(tl.rack){const xs=[A.cx,B&&B.cx].filter(x=>x!=null);g+=`<rect x="${Math.min(...xs)-50}" y="${RVBY-60}" width="${Math.max(...xs)-Math.min(...xs)+100}" height="8" rx="2" fill="#a1887f"/><rect x="${Math.min(...xs)-46}" y="${RVBY-60}" width="6" height="60" fill="#8d6e63"/><rect x="${Math.max(...xs)+40}" y="${RVBY-60}" width="6" height="60" fill="#8d6e63"/>`}
 if(tl.clamp)g+=`<rect x="${A.x0-70}" y="${A.top+30}" width="70" height="7" fill="#78909c"/><rect x="${A.x0-74}" y="${A.top-30}" width="6" height="${RVBY-A.top+30}" fill="#90a4ae"/><rect x="${A.x0-90}" y="${RVBY-8}" width="40" height="8" rx="2" fill="#546e7a"/>`;
 /* vessels */
 const vessel=(G,V,lvl,col,diff,which)=>{const cid=`${id}${which}`;const ys=G.surf(lvl);let h=`<clipPath id="${cid}"><path d="${G.clip}"/></clipPath><g clip-path="url(#${cid})">`;
  if(lvl>0){h+=`<rect x="${G.x0-6}" y="${ys.toFixed(1)}" width="${G.w+12}" height="${(G.bot-ys+4).toFixed(1)}" fill="${col.c}" fill-opacity="${col.o.toFixed(3)}"/>`;
   if(diff){const H=G.bot-ys;const front=diff.f*1.25*H;const gid=`${id}${which}d`;const up=diff.up;h+=`<linearGradient id="${gid}" x1="0" y1="${up?1:0}" x2="0" y2="${up?0:1}"><stop offset="0" stop-color="${diff.to.c}" stop-opacity="${diff.to.o}"/><stop offset=".72" stop-color="${diff.to.c}" stop-opacity="${diff.to.o*.85}"/><stop offset="1" stop-color="${diff.to.c}" stop-opacity="0"/></linearGradient><rect x="${G.x0-6}" y="${(up?G.bot+4-front:ys).toFixed(1)}" width="${G.w+12}" height="${front.toFixed(1)}" fill="url(#${gid})"/>`;
    if(!up)for(let i=0;i<5;i++){const xx=G.inner[0]+rvR(i,51)*(G.inner[1]-G.inner[0]);h+=`<path d="M${xx.toFixed(1)} ${ys} q${(6*Math.sin(t*2+i)).toFixed(1)} ${front*.5} 0 ${(front*.9+8).toFixed(1)}" stroke="${diff.to.c}" stroke-width="5" fill="none" opacity="${(.35*(1-diff.f)).toFixed(2)}" stroke-linecap="round"/>`}}
   h+=`<path d="M${G.x0} ${ys} Q${G.cx} ${ys+3} ${G.x1} ${ys}" fill="none" stroke="#fff" stroke-opacity=".65" stroke-width="1.4"/>`}
  if(V.solid){const so=V.solid;const dis=S.ev.find(e=>e.k==="dis"&&(e.v||"A")===which);const hs=S.ev.find(e=>e.k==="solidcol"&&t>=e.at);const sc=hs?rvMixL(rvLq(so.col),rvLq(hs.to),rvE(rvP(hs,t))).c:so.col;
   if(!dis){const n=so.n||9;const yb=G.bot-4;const [a0,a1]=rvWidthAt(G,yb-6);for(let i=0;i<n;i++){const shr=S.ev.find(e=>e.k==="shrink"&&(e.v||"A")===which);const f=shr?rvE(rvP(shr,t))*(shr.to??.6):0;const r=(so.r||6)*(.7+rvR(i,61)*.6)*(1-f);const x=a0+6+rvR(i,62)*(a1-a0-12),y=yb-r-(i%3)*r*1.1;h+=so.shape==="ribbon"?"":`<path d="M${(x-r).toFixed(1)} ${(y+r*.4).toFixed(1)} L${(x-r*.3).toFixed(1)} ${(y-r).toFixed(1)} L${(x+r).toFixed(1)} ${(y-r*.4).toFixed(1)} L${(x+r*.6).toFixed(1)} ${(y+r).toFixed(1)} Z" fill="${sc}" stroke="rgba(0,0,0,.28)" stroke-width=".7"/>`}}}
  if(V.strip)h+=`<rect x="${G.cx-5}" y="${G.top-34}" width="10" height="${G.bot-G.top+24}" fill="${V.strip}" stroke="rgba(0,0,0,.25)"/>`;
  h+=rvInside(S,G,st,t,which)+`</g>`;
  if(V.strip)h+=`<rect x="${G.cx-5}" y="${G.top-34}" width="10" height="34" fill="${V.strip}" stroke="rgba(0,0,0,.25)"/>`;
  h+=`<path d="${G.path}" fill="url(#${id}g)" stroke="#90a4ae" stroke-width="2.2" stroke-linejoin="round"/>`;
  if(V.stopper)h+=`<rect x="${G.x0-3}" y="${G.top-6}" width="${G.w+6}" height="16" rx="3" fill="#6d4c41"/>`;
  if(V.label&&which!=="A")h+=rvPill(G.cx,G.T==="tube"?Math.min(RVBY+28,G.bot+30):RVBY+28,V.label,{s:11});return h};
 const sw=st.swirl;if(!S.A.hide)g+=`<g transform="rotate(${sw.toFixed(2)} ${A.cx} ${A.bot})">${vessel(A,S.A,st.lvlA,st.colA,st.diff,"A")}</g>`+(S.A.label?(tl.clamp?rvPill(A.x1+70,A.bot-14,S.A.label,{s:11}):rvPill(A.cx,A.T==="tube"?Math.min(RVBY+28,A.bot+30):RVBY+28,S.A.label,{s:11})):"");
 if(B)g+=vessel(B,S.B,st.lvlB,st.colB,st.diffB,"B");
 /* delivery tube A → B */
 if(B&&S.pipe!==false){const ax=A.cx+9,y0=A.top-6,yT=Math.min(A.top,B.top)-34,ex=B.cx+2,ey=B.bot-16;const d=`M${ax} ${y0} L${ax} ${yT+8} Q${ax} ${yT} ${ax+8} ${yT} L${ex-8} ${yT} Q${ex} ${yT} ${ex} ${yT+8} L${ex} ${ey}`;g+=`<path d="${d}" fill="none" stroke="#90a4ae" stroke-width="7" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#f4fbff" stroke-width="4" stroke-linejoin="round"/>`;
  const pe=S.ev.find(e=>e.k==="pipe");if(pe&&t>=pe.at&&t<=pe.at+pe.d){const L1=yT-y0,segs=[[ax,y0,ax,yT],[ax,yT,ex,yT],[ex,yT,ex,ey]];const lens=segs.map(s=>Math.hypot(s[2]-s[0],s[3]-s[1])),tot=lens.reduce((a,b)=>a+b,0);for(let i=0;i<7;i++){let f=((t-pe.at)*.55+i/7)%1,dd=f*tot,k=0;while(k<2&&dd>lens[k]){dd-=lens[k];k++}const s=segs[k],q=dd/lens[k];g+=`<circle cx="${(s[0]+(s[2]-s[0])*q).toFixed(1)}" cy="${(s[1]+(s[3]-s[1])*q).toFixed(1)}" r="1.7" fill="#fff" stroke="#9fb7c6" stroke-width=".6"/>`}}
  if(S.pipeLabel)g+=rvPill((ax+ex)/2,yT-14,S.pipeLabel,{c:"var(--muted)",s:10.5})}
 /* tools above / beside */
 for(const e of S.ev){if(e.k==="drip"){e.surf=A.surf(st.lvlA);if(t>=e.at-1.2&&t<=e.at+e.d+1)g+=rvDropper(A,e,t,e.lab,S.A.stopper?-10:0)}
  if(e.k==="pour"){e.surf=A.surf(st.lvlA);if(t>=e.at-1&&t<=e.at+e.d+1)g+=rvPourer(A,e,t,e.lab)}
  if(e.k==="gas"&&t>=e.at){const p=rvP(e,t);const env=rvC((t-e.at)*1.2)*(e.fade&&p>.8?(1-p)/.2:1);g+=rvCloud(A.cx,A.mouth,t,env,rvLq(e.col).c,{op:e.op||.55,spread:A.w*.8,r:A.T==="tube"?9:14})+(e.lab&&env>.4?rvPill(A.cx+(A.T==="tube"?64:90),A.mouth-40,e.lab,{c:e.labc||"var(--danger)"}):"")}
  if(e.k==="paper"){const p=rvP(e,t);if(t>=e.at-.8){const c=rvMixL(rvLq(e.from),rvLq(e.to),rvE(p));g+=`<rect x="${A.cx-5}" y="${A.mouth-58}" width="10" height="44" rx="1.5" fill="${c.c}" stroke="rgba(0,0,0,.2)"/><path d="M${A.cx} ${A.mouth-58} L${A.cx+30} ${A.mouth-80}" stroke="#78909c" stroke-width="3"/>${e.lab?rvPill(A.cx+66,A.mouth-84,e.lab,{c:"var(--teal)"}):""}`}}
  if(e.k==="blow"&&t>=e.at-.6&&t<=e.at+e.d+.6){g+=`<path d="M${A.cx+8} ${A.surf(st.lvlA)+ (A.bot-A.surf(st.lvlA))*.75} L${A.cx+8} ${A.top-40} L${A.cx+40} ${A.top-62}" fill="none" stroke="#b0bec5" stroke-width="6" stroke-linecap="round"/>${e.lab?rvPill(A.cx+80,A.top-66,e.lab,{c:"var(--teal)"}):""}`}
  if(e.k==="stir"&&t>=e.at&&t<=e.at+e.d){const a=Math.sin((t-e.at)*6)*A.w*.22;g+=`<line x1="${A.cx+a}" y1="${A.bot-10}" x2="${A.cx+a*.4+20}" y2="${A.top-40}" stroke="#cfe3ef" stroke-width="5" stroke-linecap="round"/>`}
  if(e.k==="burn"){const p=rvP(e,t);const on=t>=e.at&&p<1;const fl=on?(.8+Math.sin(t*37)*.1+Math.sin(t*13)*.1):0;const x=A.cx,y=130;g+=`<line x1="${x-120}" y1="${y+60}" x2="${x-14}" y2="${y+4}" stroke="#78909c" stroke-width="4"/>`;const len=60*(1-rvE(p)*.85);g+=`<line x1="${x-14}" y1="${y+4}" x2="${x-14+len}" y2="${y+4-len*.25}" stroke="#cfd8dc" stroke-width="3"/>`;if(t>=e.at)g+=`<path d="M${x-14} ${y+6} l${len*.8} ${-len*.2}" stroke="#fafafa" stroke-width="5" opacity=".9"/>`;if(on){const fx=x-14+len,fy=y+4-len*.25;g+=`<circle cx="${fx}" cy="${fy}" r="${(70*fl).toFixed(1)}" fill="url(#${id}f)" opacity="${fl.toFixed(2)}"/><circle cx="${fx}" cy="${fy}" r="9" fill="#fff"/>`+rvCloud(fx,fy-6,t,.8,"#eceff1",{op:.5,spread:24,r:8,rise:70})}}
  if(e.k==="flame"&&t<e.at){const x=e.x||A.cx;g+=`<rect x="${x-16}" y="${RVBY-10}" width="32" height="10" rx="2" fill="#37474f"/><rect x="${x-6}" y="${RVBY-70}" width="12" height="60" fill="#90a4ae"/>`}
  if(e.k==="flame"&&t>=e.at){const p=rvP(e,t);const fl=1+Math.sin(t*21)*.07;const x=e.x||A.cx,y=RVBY-70;const yel=e.col==="yellow";g+=`<rect x="${x-16}" y="${RVBY-10}" width="32" height="10" rx="2" fill="#37474f"/><rect x="${x-6}" y="${y}" width="12" height="${RVBY-10-y}" fill="#90a4ae"/><path d="M${x-10} ${y} Q${x-14} ${y-40*fl} ${x} ${y-(yel?110:80)*fl} Q${x+14} ${y-40*fl} ${x+10} ${y} Z" fill="${yel?"#ffb300":"#3d6bff"}" opacity="${yel?.9:.75}"/>${yel?rvCloud(x,y-110,t,rvC(p*3),"#424242",{op:.35,spread:20,r:10,rise:80}):`<path d="M${x-5} ${y} Q${x-6} ${y-18} ${x} ${y-34*fl} Q${x+6} ${y-18} ${x+5} ${y} Z" fill="#a8d1ff"/>`}${e.lab?rvPill(x+95,y-60,e.lab,{c:yel?"#e65100":"#1e40af"}):""}`}
  if(e.k==="frost"&&t>=e.at){const p=rvE(rvP(e,t));g+=`<rect x="${A.x0-4}" y="${A.bot-6}" width="${A.w+8}" height="8" fill="#fff" opacity="${(.9*p).toFixed(2)}"/>`+Array.from({length:16},(_,i)=>`<path d="M${A.x0+rvR(i,81)*A.w} ${A.bot-2} l${(rvR(i,82)-.5)*6} ${-(4+rvR(i,83)*10)*p}" stroke="#fff" stroke-width="2" opacity="${p.toFixed(2)}"/>`).join("")}
  if(e.k==="drops"&&t>=e.at){const p=rvE(rvP(e,t));g+=Array.from({length:10},(_,i)=>`<circle cx="${(A.x0+4+rvR(i,91)*(A.w-8)).toFixed(1)}" cy="${(A.top+6+rvR(i,92)*30).toFixed(1)}" r="${(1.5+rvR(i,93)*1.6).toFixed(1)}" fill="#bfe0f2" stroke="#fff" opacity="${(p*rvC(p*3-rvR(i,94))).toFixed(2)}"/>`).join("")}}
 const bu=S.ev.find(e=>e.k==="burette");if(tl.burette)g+=rvBurette(A,bu,t,tl.burette,A.surf(st.lvlA));
 if(st.temp!=null)g+=rvTherm(A,st.temp,id);
 const steamA=(st.temp!=null&&st.temp>58)?rvC((st.temp-58)/25):0;const stE=S.ev.find(e=>e.k==="steam"&&t>=e.at);g+=rvSteam(A.cx,A.mouth-6,t,Math.max(steamA,stE?rvC((t-stE.at)*1.5)*(stE.d&&t>stE.at+stE.d?0:1):0));
 if(st.ph!=null)g+=rvPHmeter(tl.phx||A.x1+80,tl.phy||RVBY-120,st.ph)+`<line x1="${(tl.phx||A.x1+80)-30}" y1="${(tl.phy||RVBY-120)+28}" x2="${A.cx-A.w*.18}" y2="${A.surf(st.lvlA)+18}" stroke="#455a64" stroke-width="3"/>`;
 if(S.hood){const vb=(S.vb||"0 0 560 310").split(" ").map(Number);g+=rvPill(vb[0]+vb[2]-80,24,L("⚠ داخل خزانة الغازات","⚠ Inside the fume hood"),{c:"var(--danger)",bg:"var(--danger-soft)",st:"var(--danger)"})}
 return g}
/* ---------- player ---------- */
const RVSPEC={};
function rvKey(spec){const k="rv"+(++RV.n);RVSPEC[k]=spec;return k}
function rvHTML(spec){if(!spec)return"";const k=rvKey(spec);return`<div class="rv" data-rv="${k}"></div>`}
function rvDur(S){return Math.max(...S.ev.map(e=>e.at+(e.d||0)))+1.4}
function rvCap(S,t){let c=null;for(const e of S.ev)if(e.cap&&t>=e.at-0.05)c=e.cap;return c?L(c[0],c[1]):""}
function rvEqs(S,t){return(S.eq||[]).map((q,i)=>{const on=t>=q[1]-.05;const cur=on&&!(S.eq[i+1]&&t>=S.eq[i+1][1]-.05);const ty=S.eqTypes&&S.eqTypes[i];return`<div class="rveq ${on?"on":""} ${cur?"cur":""}"><span>${prettyEq(q[0])}</span>${ty?`<small>${ty}</small>`:""}</div>`}).join("")}
function rxaEqTxt(s){return`<span>${prettyEq(s)}</span>`}
function rvMount(root){(root||document).querySelectorAll(".rv[data-rv]:not([data-on])").forEach(box=>{const S=RVSPEC[box.dataset.rv];if(!S)return;box.dataset.on="1";const id=box.dataset.rv;const T=rvDur(S);
 box.innerHTML=`${S.title?`<div class="rvtt">🎬 ${L(S.title[0],S.title[1])}</div>`:""}<div class="rvscr"><svg viewBox="${S.vb||"0 0 560 310"}" preserveAspectRatio="xMidYMid meet" direction="ltr" role="img" aria-label="${S.title?L(S.title[0],S.title[1]):"reaction"}"></svg><button class="rvbig" aria-label="${L("تشغيل","Play")}">▶</button></div>
 <div class="rvcap"></div>${S.eq&&S.eq.length?`<div class="rveqs"></div>`:""}
 <div class="rvbar"><button class="btn sm rvpp">▶</button><button class="btn sm rvre" title="${L("من البداية","Restart")}">↺</button><input type="range" class="rvsc" min="0" max="${T.toFixed(2)}" step="0.01" value="0"><select class="rvsp"><option value=".6">0.6×</option><option value="1" selected>1×</option><option value="1.6">1.6×</option></select></div>`;
 const P={S,T,t:0,play:false,raf:0,last:0,spd:1,box,id,lastCap:"",lastEq:""};RV.live.set(id,P);
 const svg=box.querySelector("svg"),cap=box.querySelector(".rvcap"),eqs=box.querySelector(".rveqs"),sc=box.querySelector(".rvsc"),pp=box.querySelector(".rvpp"),big=box.querySelector(".rvbig");
 P.draw=()=>{svg.innerHTML=rvFrame(S,P.t,id);const c=rvCap(S,P.t);if(c!==P.lastCap){cap.innerHTML=c||"&nbsp;";P.lastCap=c}if(eqs){const q=rvEqs(S,P.t);if(q!==P.lastEq){eqs.innerHTML=q;P.lastEq=q}}sc.value=P.t.toFixed(2)};
 P.stop=()=>{P.play=false;cancelAnimationFrame(P.raf);pp.textContent="▶";big.style.display="flex";big.textContent=P.t>=T-.01?"↺":"▶"};
 P.go=()=>{if(RV.playing&&RV.playing!==P)RV.playing.stop();RV.playing=P;if(P.t>=T-.01)P.t=0;P.play=true;pp.textContent="⏸";big.style.display="none";P.last=performance.now();const step=now=>{if(!P.play)return;if(!document.body.contains(box)){P.stop();RV.live.delete(id);return}P.t=Math.min(T,P.t+(now-P.last)/1000*P.spd);P.last=now;P.draw();if(P.t>=T){P.stop();return}P.raf=requestAnimationFrame(step)};P.raf=requestAnimationFrame(step)};
 pp.onclick=()=>P.play?P.stop():P.go();big.onclick=()=>P.go();box.querySelector(".rvre").onclick=()=>{P.t=0;P.draw();P.go()};
 sc.oninput=()=>{P.t=+sc.value;if(P.play){P.last=performance.now()}P.draw();if(!P.play)big.style.display="none"};box.querySelector(".rvsp").onchange=e=>{P.spd=+e.target.value};
 P.t=Math.min(T*.02,.2);P.draw();big.style.display="flex";
 if("IntersectionObserver"in window){const io=new IntersectionObserver(es=>{es.forEach(en=>{P.vis=en.isIntersecting?en.intersectionRatio:0;
   if(P.vis>.55&&!P.auto){if(!(RV.playing&&RV.playing.play&&RV.playing!==P)){P.auto=1;P.go()}}
   if(!en.isIntersecting&&P.play){P.stop();rvAutoNext()}})},{threshold:[0,.3,.55,.8,1]});io.observe(box)}})}

/* reaction atlas: a "watch" button under each example that has a video */
function rvAtlasBtn(eq){return(typeof rvForEq==="function"&&rvForEq(eq))?`<div class="rvat"><button class="btn sm rvopen" data-rveq="${encodeURIComponent(eq)}">🎬 ${L("شاهد التفاعل","Watch the reaction")}</button><div class="rvslot"></div></div>`:""}
document.addEventListener("click",ev=>{const b=ev.target.closest&&ev.target.closest(".rvopen");if(!b)return;const slot=b.parentElement.querySelector(".rvslot");if(!slot)return;
 if(slot.firstChild){const open=slot.hidden;slot.hidden=!open;b.classList.toggle("on",open);if(!open){const P=[...RV.live.values()].find(p=>slot.contains(p.box));if(P)P.stop()}return}
 const sp=rvForEq(decodeURIComponent(b.dataset.rveq));if(!sp)return;slot.innerHTML=rvHTML(sp);b.classList.add("on");rvMount(slot);const P=[...RV.live.values()].find(p=>slot.contains(p.box));if(P){P.auto=1;P.go()}});

function rvAutoNext(){for(const Q of RV.live.values()){if(!Q.auto&&(Q.vis||0)>.55&&document.body.contains(Q.box)){Q.auto=1;Q.go();return}}}
