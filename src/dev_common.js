/* =====================================================================
   DEVICE COMMON — section factory, notebook store, chart helper, numbers
   ===================================================================== */
function mkSec(id,html,cls){const s=document.createElement("section");s.id="tab-"+id;s.hidden=true;if(cls)s.className=cls;else s.style.cssText="display:flex;flex-direction:column;gap:14px";s.innerHTML=html;$("devHost").appendChild(s);return s}
const randn=()=>{let u=0,v=0;while(!u)u=Math.random();while(!v)v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)};
/* significant figures */
function sigFigs(str){str=String(str).trim().replace(/^[+-]/,"");if(/e/i.test(str))str=str.split(/e/i)[0];const d=str.replace(".","").replace(/^0+/,"");if(!str.includes("."))return d.replace(/0+$/,"").length||1;return d.length||1}
function roundSig(x,n){if(x===0||!isFinite(x))return String(x);const p=Math.floor(Math.log10(Math.abs(x)));const f=Math.pow(10,n-1-p);const r=Math.round(x*f)/f;return n-1-p>0?r.toFixed(n-1-p):String(r)}
const fx=(x,d)=>x==null||!isFinite(x)?"—":(+x).toFixed(d);
const pctErr=(m,t)=>100*(m-t)/t;
/* interpolate in a table [[x,y],...]; log=true interpolates log(y) */
function interp(tab,x,log){if(x<=tab[0][0]){const [a,b]=[tab[0],tab[1]];return lerp(a,b,x,log)}for(let i=1;i<tab.length;i++)if(x<=tab[i][0])return lerp(tab[i-1],tab[i],x,log);const n=tab.length;return lerp(tab[n-2],tab[n-1],x,log)}
function lerp(a,b,x,log){const t=(x-a[0])/(b[0]-a[0]);return log?Math.exp(Math.log(a[1])+t*(Math.log(b[1])-Math.log(a[1]))):a[1]+t*(b[1]-a[1])}
/* water density (g/cm³), Tanaka et al. 2001 (0–40 °C), uncertainty < 1 ppm */
function rhoWater(T){const a1=-3.983035,a2=301.797,a3=522528.9,a4=69.34881,a5=999.974950;return a5*(1-(T+a1)*(T+a1)*(T+a2)/(a3*(T+a4)))/1000}
/* generic SVG line chart: series [{pts:[[x,y]],col,dash,label}], opts {xl,yl,x0,x1,y0,y1,marks:[{x,y,label,col}],vlines:[{x,label}],hlines:[{y,label}]} */
function svgChart(series,o){const W=460,H=250,L=48,R=12,T=14,B=36;const X=v=>L+(v-o.x0)/(o.x1-o.x0)*(W-L-R),Y=v=>H-B-(v-o.y0)/(o.y1-o.y0)*(H-T-B);
 const nice=(a,b,n)=>{const st=Math.pow(10,Math.floor(Math.log10((b-a)/n)));const m=[1,2,2.5,5,10].find(k=>(b-a)/(st*k)<=n)||10;return st*m};
 let g=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.title||"رسم بياني")}">`;const sx=o.xs||nice(o.x0,o.x1,6),sy=o.ys||nice(o.y0,o.y1,5);
 for(let v=Math.ceil(o.y0/sy)*sy;v<=o.y1+1e-9;v+=sy)g+=`<line class="gr" x1="${L}" x2="${W-R}" y1="${Y(v)}" y2="${Y(v)}"/><text class="ax" x="${L-5}" y="${Y(v)+3}" text-anchor="end">${+v.toFixed(6)}</text>`;
 for(let v=Math.ceil(o.x0/sx)*sx;v<=o.x1+1e-9;v+=sx)g+=`<text class="ax" x="${X(v)}" y="${H-B+14}" text-anchor="middle">${+v.toFixed(6)}</text>`;
 g+=`<line x1="${L}" x2="${L}" y1="${T}" y2="${H-B}" style="stroke:var(--muted)"/><line x1="${L}" x2="${W-R}" y1="${H-B}" y2="${H-B}" style="stroke:var(--muted)"/>`;
 g+=`<text class="ax" style="font-family:var(--f-body)" x="${(L+W-R)/2}" y="${H-4}" text-anchor="middle">${o.xl||""}</text><text class="ax" style="font-family:var(--f-body)" x="11" y="${(T+H-B)/2}" transform="rotate(-90 11 ${(T+H-B)/2})" text-anchor="middle">${o.yl||""}</text>`;
 (o.hlines||[]).forEach(h=>{g+=`<line x1="${L}" x2="${W-R}" y1="${Y(h.y)}" y2="${Y(h.y)}" style="stroke:${h.col||"var(--accent)"}" stroke-dasharray="5 4"/><text class="ax" x="${W-R-2}" y="${Y(h.y)-4}" text-anchor="end" style="fill:var(--ink);font-family:var(--f-body)">${h.label||""}</text>`});
 (o.vlines||[]).forEach(h=>{g+=`<line x1="${X(h.x)}" x2="${X(h.x)}" y1="${T}" y2="${H-B}" style="stroke:${h.col||"var(--accent)"}" stroke-dasharray="5 4"/><text class="ax" x="${X(h.x)+4}" y="${T+10}" style="fill:var(--ink)">${h.label||""}</text>`});
 g+=`<clipPath id="cp${o.id||"c"}"><rect x="${L}" y="${T}" width="${W-L-R}" height="${H-T-B}"/></clipPath><g clip-path="url(#cp${o.id||"c"})">`;
 series.forEach(s=>{if(s.pts.length>1)g+=`<polyline points="${s.pts.map(p=>X(p[0]).toFixed(1)+","+Y(p[1]).toFixed(1)).join(" ")}" fill="none" stroke="${s.col||"var(--teal)"}" stroke-width="${s.w||2.2}" ${s.dash?`stroke-dasharray="${s.dash}"`:""}/>`;if(s.dots)s.pts.forEach(p=>g+=`<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="2.6" fill="${s.col||"var(--teal)"}"/>`)});g+=`</g>`;
 (o.marks||[]).forEach(m=>{g+=`<circle cx="${X(m.x)}" cy="${Y(m.y)}" r="5.5" fill="${m.col||"var(--accent)"}" stroke="var(--surface)" stroke-width="2"/>${m.label?`<text class="ax" x="${X(m.x)+8}" y="${Y(m.y)-8}" style="fill:var(--ink);font-weight:700;font-family:var(--f-body)">${m.label}</text>`:""}`});
 const leg=series.filter(s=>s.label);if(leg.length)g+=leg.map((s,i)=>`<rect x="${L+8+(i%3)*135}" y="${T+4+Math.floor(i/3)*14}" width="10" height="3" fill="${s.col}"/><text class="ax" x="${L+22+(i%3)*135}" y="${T+8+Math.floor(i/3)*14}" style="fill:var(--ink);font-family:var(--f-body)">${s.label}</text>`).join("");
 return g+`</svg>`}
/* =============== LAB NOTEBOOK STORE =============== */
const NB={key:"freelab-notebook-v1",runs:[],info:{name:"",group:"",date:"",teacher:""},
 load(){try{const s=JSON.parse(localStorage.getItem(this.key)||"null");if(s){this.runs=s.runs||[];this.info=Object.assign(this.info,s.info||{})}}catch(e){}},
 save(){try{localStorage.setItem(this.key,JSON.stringify({runs:this.runs,info:this.info}))}catch(e){}},
 add(run){run.t=new Date().toISOString();run.id="r"+Date.now()+Math.floor(Math.random()*1000);this.runs.push(run);this.save();flash("✓ سُجّلت في دفتر المختبر ("+run.title+")");if(typeof nbRender==="function"&&!$("tab-nb").hidden)nbRender()},
 del(id){this.runs=this.runs.filter(r=>r.id!==id);this.save()}};
NB.load();
function recordBtn(id,label){return`<button class="btn sm warn" id="${id}">📓 ${label||"سجّل في دفتر المختبر"}</button>`}
/* small helpers */
const opt=(v,t,sel)=>`<option value="${v}" ${sel?"selected":""}>${t}</option>`;
const kvRes=items=>`<div class="res">${items.map(([k,v,c])=>`<div class="${c||""}"><span>${k}</span><b>${v}</b></div>`).join("")}</div>`;
const errClass=e=>Math.abs(e)<=0.5?"good":Math.abs(e)<=2?"":"bad";
