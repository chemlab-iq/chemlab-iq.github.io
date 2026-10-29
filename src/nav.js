/* =====================================================================
   NAVIGATION — sequential groups (basics → syllabus weeks → free lab → tools → training)
   ===================================================================== */
const NAVG=[
 {k:"lec",n:"1. المحاضرات",d:"15 محاضرة، كل محاضرة صفحة كاملة مع جهازها",items:[["lec","📘 المحاضرات 1–15"]]},
 {k:"basic",n:"2. المراجع العلمية",d:"العناصر، المواد، المركبات، التفاعلات، المخاليط",items:[["pt","🧩 الجدول الدوري"],["mats","🧪 مكتبة المواد"],["nm","🏷 المركبات والتسمية"],["rxa","⚗ أنواع التفاعلات"],["mx","🥛 المخاليط"]]},
 {k:"free",n:"3. المختبر الحر والأدوات",d:"اخلط أي مواد، الموازنة، التأكسد، المردود",items:[["rx","⚗ المختبر الحر"],["ph","🌡 تغيّر الحالة"],["eq","⚖ الموازنة والحسابات"],["tools","🧮 التأكسد والأيونية والمردود"]]},
 {k:"train",n:"4. التدريب والتقرير",d:"اختبارات، دفتر المختبر، التقرير",items:[["quiz","📝 الاختبارات"],["nb","📓 دفتر المختبر والتقرير"],["val","✓ دقة المحاكاة"]]}];
const NAVINIT={lec:()=>lecInit(),guide:()=>guideInit(),rxa:()=>rxaInit(),pt:()=>ptInit(),nm:()=>nmInit(),mx:()=>mxInit(),val:()=>valRender(),ph:()=>phDraw(),safe:()=>typeof safeInit==="function"&&safeInit(),dens:()=>typeof densInit==="function"&&densInit(),mp:()=>typeof mpInit==="function"&&mpInit(),bp:()=>typeof bpInit==="function"&&bpInit(),rc:()=>typeof rcInit==="function"&&rcInit(),sol:()=>typeof spInit==="function"&&spInit(),phx:()=>typeof phxInit==="function"&&phxInit(),solb:()=>typeof sbInit==="function"&&sbInit(),tools:()=>typeof toolsInit==="function"&&toolsInit(),quiz:()=>typeof quizInit==="function"&&quizInit(),nb:()=>typeof nbRender==="function"&&nbRender()};
let navCur="lec";
function navGroupOf(t){return NAVG.find(g=>g.items.some(i=>i[0]===t))||NAVG[0]}
function navDraw(){const g0=navGroupOf(navCur);
 $("navG").innerHTML=NAVG.map(g=>`<button class="${g===g0?"on":""}" data-g="${g.k}">${g.n}<small>${g.d}</small></button>`).join("");
 document.querySelectorAll("#navG button").forEach(b=>b.onclick=()=>{const g=NAVG.find(x=>x.k===b.dataset.g);showTab(g.items[0][0])});
 $("tabs").innerHTML=g0.items.map(i=>`<button data-t="${i[0]}" class="${i[0]===navCur?"on":""}">${i[1]}${i[2]?`<span class="wk" title="الأسبوع ${i[2]}"><bdi dir="ltr">W${i[2]}</bdi></span>`:""}</button>`).join("");
 document.querySelectorAll("#tabs button").forEach(b=>b.onclick=()=>showTab(b.dataset.t))}
function showTab(t){if(t!=="lec"&&typeof lecRestore==="function")lecRestore();navCur=t;const real=t==="tit"?"rx":t;
 document.querySelectorAll('section[id^="tab-"]').forEach(s=>s.hidden=s.id!=="tab-"+real);navDraw();
 if(t!=="mx"&&typeof mxStop==="function")mxStop();
 if(t==="tit")titSetup();else if(t==="rx")$("rxTitHead")&&($("rxTitHead").hidden=true);
 const f=NAVINIT[t];if(f)f();}
/* titration week: the reactions bench with the burette switched on and a standard set-up */
function titSetup(){let h=$("rxTitHead");if(!h){h=document.createElement("div");h.id="rxTitHead";h.className="panel";h.style.gridColumn="1/-1";
  h.innerHTML=`<div class="row" style="justify-content:space-between"><div><h2>التسحيح (الأسبوعان 8–9): معايرة حامض بقاعدة</h2><p class="muted" style="margin:0">في الدورق 25.00 mL من HCl تركيزه 0.1 M مع قطرتين من الفينولفثالين، وفي السحاحة NaOH تركيزه 0.1 M. أضف من السحاحة وراقب المنحنى ونقطة التكافؤ. غيّر الحامض أو القاعدة من الرف لتجربة حامض ضعيف (CH₃COOH) ولاحظ اختلاف شكل المنحنى ونقطة التكافؤ.</p></div><div class="row"><button class="btn sm" id="titPresetS">حامض قوي + قاعدة قوية</button><button class="btn sm" id="titPresetW">حامض ضعيف + قاعدة قوية</button><button class="btn sm" id="titPresetN">معايرة NaOH بـ KHP (معيار أولي)</button><button class="btn sm warn" id="titRec">📓 سجّل نتيجة التسحيح</button></div></div>
  <div class="tip" style="margin-top:6px"><b>القانون:</b> عند نقطة التكافؤ: <bdi class="ltr mono">n(H⁺) = n(OH⁻)</bdi> أي <bdi class="ltr mono">M₁V₁ / a = M₂V₂ / b</bdi> حيث a وb معاملات المعادلة الموزونة. للحامض الأحادي مع قاعدة أحادية: <bdi class="ltr mono">M_acid × V_acid = M_base × V_base</bdi>. وبالعيارية دائماً: <bdi class="ltr mono">N₁V₁ = N₂V₂</bdi>.</div>`;
  $("tab-rx").prepend(h);
  const preset=(acid,ind,base)=>{adds=[];prevSig=new Set();TIT.pts=[];TIT.v=0;TIT.running=false;acid.forEach(a=>adds.push(a));adds.push({id:ind,n:0,vol:0.1,drops:2,label:"قطرتان من "+MATBY[ind].ar});$("titOn").checked=true;$("titBody").hidden=false;$("titSel").value=base;$("titC").value="0.1";$("titTo").value="40";rxRun();titDraw()};
  $("titPresetS").onclick=()=>preset([{id:"hcl",n:0.0025,vol:25,C:0.1,label:"25.00 mL من HCl 0.1 M"}],"php","naoh");
  $("titPresetW").onclick=()=>preset([{id:"hac",n:0.0025,vol:25,C:0.1,label:"25.00 mL من CH₃COOH 0.1 M"}],"php","naoh");
  $("titPresetN").onclick=()=>preset([{id:"khp",n:0.5105/204.22,vol:30,label:"0.5105 g من KHP (204.22 g/mol) مذابة في 30 mL ماء"}],"php","naoh");
  $("titRec").onclick=()=>{const P=TIT.pts;if(P.length<5){flash("أكمل التسحيح أولاً");return}let veq=null,best=0;for(let i=1;i<P.length;i++){const dv=P[i][0]-P[i-1][0];if(dv<=0)continue;const d=(P[i][1]-P[i-1][1])/dv;if(Math.abs(d)>best){best=Math.abs(d);veq=(P[i][0]+P[i-1][0])/2}}
   const acid=adds.filter(a=>!a.tit&&["hcl","hac","khp","h2so4","h2c2o4"].includes(a.id));const nA=acid.reduce((s,a)=>s+a.n*(a.id==="h2so4"||a.id==="h2c2o4"?2:1),0);const Va=acid.reduce((s,a)=>s+(a.vol||0),0)||25;const Mb=+$("titC").value;
   NB.add({exp:"tit",title:"التسحيح — "+acid.map(a=>MATBY[a.id].ar).join(" + ")+" مع "+MATBY[$("titSel").value].ar,sample:acid.map(a=>MATBY[a.id].ar).join(" + "),rows:P.filter((p,i)=>i%Math.max(1,Math.floor(P.length/14))===0).map(p=>({V_b:p[0],pH:p[1]})),res:{veq,Mb,Va,Ma:Mb*veq/Va},ref:{veq:nA?nA/Mb*1000:null}})};
  $("titPresetS").onclick()}
 h.hidden=false}

