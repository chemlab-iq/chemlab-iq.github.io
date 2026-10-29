/* =====================================================================
   LAB STOCKROOM — every reagent and sample used in the 15 weeks, with its real colour,
   formula, Arabic/English name, state, molar mass, properties, hazards, storage and the weeks it is used in;
   a colours-of-precipitates-and-ions shelf; and the apparatus inventory.
   Row: [id, ar, en, formula, state, cabinet, colourHex|"none", colourAr, colourEn, look, weeks, ghs, extra]
   ===================================================================== */
const CAB={acid:["الحوامض","Acids","🟥","خزانة الحوامض (أبيض: أكّال). بعيداً عن القواعد والفلزات. النتريك منفصل عن العضويات."],
 base:["القواعد","Bases","🟦","خزانة القواعد (أبيض: أكّال)، محكمة الغلق لأن NaOH وKOH تمتص الرطوبة وCO₂."],
 salt:["الأملاح","Salts","⬜","الرفوف العامة (أخضر: خطر منخفض) في عبوات محكمة جافة."],
 std:["المعايير الأولية","Primary standards","⭐","تُحفظ في المجفف (Desiccator) بعد تجفيفها بالفرن."],
 oxid:["المؤكسدات","Oxidizers","🟨","خزانة المؤكسدات (أصفر)؛ بعيداً عن المواد العضوية والقابلة للاشتعال."],
 ind:["الأدلة","Indicators","🎨","قناني قطّارة صغيرة، بعيداً عن الضوء."],
 solv:["المذيبات العضوية","Organic solvents","🔥","خزانة المواد القابلة للاشتعال (أحمر)، مهواة وبعيدة عن اللهب."],
 org:["المواد العضوية الصلبة","Organic solids","🧴","عبوات زجاجية محكمة؛ النفثالين والفينول في خزانة السموم."],
 petro:["المنتجات النفطية والعينات","Petroleum products & samples","🛢","عبوات معدنية أو زجاجية بنية محكمة، في خزانة القابلة للاشتعال."],
 metal:["الفلزات","Metals","⚙","عبوات جافة؛ المغنيسيوم بعيداً عن الماء والحوامض."],
 gas:["الغازات","Gases","💨","أسطوانات مثبتة بسلاسل؛ H₂S والكلور داخل خزانة الغازات فقط."],
 ppt:["ألوان الرواسب والأيونات","Precipitate & ion colours","🌈","نواتج تفاعلات تتكون في التجربة ولا تُخزن؛ تُجمع في حاوية النفايات الكيميائية."]};
const INVRAW=[
/* acids */
["hcl37","حامض الهيدروكلوريك المركز","Hydrochloric acid, conc.","HCl","aq","acid","none","عديم اللون (قد يميل للأصفر)","colourless (may be faint yellow)","سائل يدخّن في الهواء برائحة لاذعة خانقة",[11],["GHS05","GHS07"],{stock:"37% · ρ = 1.18 g/mL · ≈ 12 M"}],
["hcl","حامض الهيدروكلوريك المخفف","Hydrochloric acid, dilute","HCl","aq","acid","none","عديم اللون","colourless","محلول شفاف بلا رائحة تقريباً",[9,12],["GHS05","GHS07"],{stock:"0.1 M"}],
["h2so4c","حامض الكبريتيك المركز","Sulfuric acid, conc.","H2SO4","l","acid","none","عديم اللون","colourless","سائل زيتي ثقيل بلا رائحة",[1,11],["GHS05"],{stock:"98% · ρ = 1.84 g/mL · ≈ 18.4 M",note:"يسحب الماء بشدة: يفحّم السكر والورق."}],
["h2so4","حامض الكبريتيك المخفف","Sulfuric acid, dilute","H2SO4","aq","acid","none","عديم اللون","colourless","محلول شفاف",[11,12],["GHS05"],{stock:"0.05–0.5 M"}],
["hno3","حامض النتريك المركز","Nitric acid, conc.","HNO3","aq","acid","#f6efc8","عديم اللون إلى أصفر باهت","colourless to pale yellow","يصفرّ مع الوقت لتفككه بالضوء إلى NO₂ البني",[11,12],["GHS03","GHS05"],{stock:"70% · ρ = 1.42 g/mL · ≈ 15.8 M"}],
["hac","حامض الخليك (الأسيتيك)","Acetic acid","CH3COOH","l","acid","none","عديم اللون","colourless","سائل برائحة الخل النفاذة؛ الثلجي يتجمد عند 16.6°C",[9,12],["GHS02","GHS05"],{stock:"الثلجي 99.7% ≈ 17.4 M · المخفف 0.1 M",bp:"118.1°C",rho:"1.049 g/mL"}],
["h3po4","حامض الفوسفوريك","Phosphoric acid","H3PO4","aq","acid","none","عديم اللون","colourless","سائل لزج كالشراب",[11],["GHS05"],{stock:"85% · ρ = 1.685 g/mL · ≈ 14.6 M"}],
["benzoic","حامض البنزويك","Benzoic acid","C6H5COOH","s","acid","#f7f7f4","أبيض","white","بلورات إبرية أو صفائح بيضاء لامعة، رائحة خفيفة",[4,6,7],["GHS05","GHS07"],{mp:"122.35°C",note:"ذوبانيته في الماء: 2.9 g/L عند 20°C و56 g/L عند 100°C."}],
["salic","حامض الساليسيليك","Salicylic acid","C7H6O3","s","acid","#f7f7f4","أبيض","white","بلورات إبرية بيضاء",[4],["GHS05","GHS07"],{mp:"159°C"}],
["cinn","حامض السيناميك","trans-Cinnamic acid","C9H8O2","s","acid","#f7f7f4","أبيض","white","بلورات بيضاء برائحة القرفة الخفيفة",[4],["GHS07"],{mp:"133°C"}],
["stearic","حامض الستياريك","Stearic acid","C17H35COOH","s","acid","#f4f2ea","أبيض شمعي","waxy white","قشور أو حبيبات شمعية بيضاء",[4],[],{mp:"69.3°C",note:"مكوّن رئيسي في الصابون والشموع."}],
/* primary standards */
["khp","فثالات البوتاسيوم الهيدروجينية (KHP)","Potassium hydrogen phthalate","KHC8H4O4","s","std","#f7f7f4","أبيض","white","مسحوق بلوري أبيض ثابت لا يمتص الرطوبة",[8],[],{note:"معيار أولي لمعايرة القواعد. يُجفف عند 110°C.",M:"204.22"}],
["oxal","حامض الأوكزاليك المائي","Oxalic acid dihydrate","H2C2O4*2H2O","s","std","#f7f7f4","أبيض","white","بلورات منشورية بيضاء",[10,11],["GHS05","GHS06"],{note:"معيار أولي للقواعد ولبرمنغنات البوتاسيوم. سام بالبلع."}],
["na2co3","كربونات الصوديوم اللامائية","Sodium carbonate, anhydrous","Na2CO3","s","std","#f7f7f4","أبيض","white","مسحوق أبيض ناعم (صودا الغسيل)",[10,11,12],["GHS07"],{note:"معيار أولي لمعايرة الحوامض. محلوله قاعدي pH ≈ 11.6."}],
["borax","البوراكس","Borax (sodium tetraborate decahydrate)","Na2B4O7*10H2O","s","std","#f7f7f4","أبيض","white","بلورات أو مسحوق أبيض",[11],["GHS08"],{note:"معيار أولي لمعايرة الحوامض."}],
/* bases */
["naohs","هيدروكسيد الصوديوم الصلب","Sodium hydroxide pellets","NaOH","s","base","#f7f7f4","أبيض","white","حبيبات (أقراص) بيضاء شمعية تمتص الرطوبة وتلتصق",[8,10],["GHS05"],{note:"ليس معياراً أولياً لأنه يمتص الماء وCO₂."}],
["naoh","هيدروكسيد الصوديوم المخفف","Sodium hydroxide solution","NaOH","aq","base","none","عديم اللون","colourless","محلول شفاف ملمسه صابوني",[8,9,11,12],["GHS05"],{stock:"0.1 M (يُعاير بـ KHP)"}],
["koh","هيدروكسيد البوتاسيوم","Potassium hydroxide","KOH","s","base","#f7f7f4","أبيض","white","حبيبات بيضاء ماصة للرطوبة",[10,12],["GHS05","GHS07"],{note:"يُستخدم محلوله الكحولي لقياس الرقم الحامضي TAN للزيوت."}],
["baoh2","هيدروكسيد الباريوم","Barium hydroxide","Ba(OH)2*8H2O","s","base","#f7f7f4","أبيض","white","بلورات بيضاء؛ محلوله عديم اللون",[12],["GHS05","GHS06"],{}],
["caoh2","هيدروكسيد الكالسيوم (الجير المطفأ)","Calcium hydroxide (slaked lime)","Ca(OH)2","s","base","#f7f7f4","أبيض","white","مسحوق أبيض؛ محلوله الصافي «ماء الجير» عديم اللون",[13],["GHS05","GHS07"],{note:"ذوبانيته تقل بالتسخين (عكس معظم المواد)."}],
["nh3","محلول الأمونيا","Ammonia solution","NH3","aq","base","none","عديم اللون","colourless","سائل برائحة نفاذة خانقة",[11,12],["GHS05","GHS07","GHS09"],{stock:"المركز 28% · ρ = 0.90 g/mL ≈ 14.8 M"}],
/* salts */
["nacl","كلوريد الصوديوم","Sodium chloride","NaCl","s","salt","#f7f7f4","أبيض","white","بلورات مكعبة بيضاء؛ محلوله عديم اللون",[6,10,12,13],[],{mp:"801°C",note:"ذوبانيته شبه ثابتة مع الحرارة (36 g/100 g عند 20°C)."}],
["kcl","كلوريد البوتاسيوم","Potassium chloride","KCl","s","salt","#f7f7f4","أبيض","white","بلورات مكعبة بيضاء",[13],[],{}],
["kno3","نترات البوتاسيوم","Potassium nitrate","KNO3","s","oxid","#f7f7f4","أبيض","white","بلورات منشورية عديمة اللون أو مسحوق أبيض",[13],["GHS03"],{note:"ذوبانيته ترتفع بشدة مع الحرارة: 31.6 g/100 g عند 20°C و110 عند 60°C."}],
["nano3","نترات الصوديوم","Sodium nitrate","NaNO3","s","oxid","#f7f7f4","أبيض","white","بلورات بيضاء",[13],["GHS03","GHS07"],{}],
["kclo3","كلورات البوتاسيوم","Potassium chlorate","KClO3","s","oxid","#f7f7f4","أبيض","white","بلورات بيضاء",[13],["GHS03","GHS07","GHS09"],{note:"مؤكسد قوي: لا يُطحن مع مواد عضوية أو كبريت."}],
["nh4cl","كلوريد الأمونيوم","Ammonium chloride","NH4Cl","s","salt","#f7f7f4","أبيض","white","مسحوق بلوري أبيض؛ يتسامى عند التسخين",[12,13],["GHS07"],{note:"محلوله حامضي (pH ≈ 5.1 لـ 0.1 M)."}],
["na2so4","كبريتات الصوديوم","Sodium sulfate","Na2SO4","s","salt","#f7f7f4","أبيض","white","مسحوق أبيض",[12],[],{}],
["naac","أسيتات الصوديوم","Sodium acetate","CH3COONa","s","salt","#f7f7f4","أبيض","white","بلورات بيضاء؛ محلوله قاعدي ضعيف",[9,12],[],{}],
["nahco3","بيكربونات الصوديوم","Sodium bicarbonate","NaHCO3","s","salt","#f7f7f4","أبيض","white","مسحوق أبيض (صودا الخبز)",[1],[],{note:"تُستخدم لمعادلة انسكاب الحوامض."}],
["caco3","كربونات الكالسيوم","Calcium carbonate","CaCO3","s","salt","#f4f4f0","أبيض","white","مسحوق أو قطع رخام بيضاء",[13],[],{note:"مكوّن صخور الكربونات في المكامن، ويُذاب بـ HCl في تحميض الآبار."}],
["cacl2","كلوريد الكالسيوم","Calcium chloride","CaCl2","s","salt","#f7f7f4","أبيض","white","حبيبات بيضاء شديدة الامتصاص للرطوبة (مجفف)",[7],["GHS07"],{note:"يُستخدم مجففاً في المجففات (Desiccator)."}],
["li2co3","كربونات الليثيوم","Lithium carbonate","Li2CO3","s","salt","#f7f7f4","أبيض","white","مسحوق أبيض",[13],["GHS07"],{note:"ذوبانيته تقل بالتسخين."}],
["bacl2","كلوريد الباريوم","Barium chloride","BaCl2*2H2O","s","salt","#f7f7f4","أبيض","white","بلورات بيضاء؛ محلوله عديم اللون",[13],["GHS06"],{note:"سام بالبلع. يُستخدم للكشف عن الكبريتات (راسب أبيض)."}],
["agno3","نترات الفضة","Silver nitrate","AgNO3","s","oxid","#f7f7f4","أبيض (عديم اللون)","white / colourless","بلورات عديمة اللون؛ تسوَدّ بالضوء وتصبغ الجلد بالأسود",[13],["GHS03","GHS05","GHS09"],{note:"يُحفظ في قنينة بنية بعيداً عن الضوء."}],
["pbno3","نترات الرصاص","Lead(II) nitrate","Pb(NO3)2","s","salt","#f7f7f4","أبيض","white","بلورات بيضاء",[13],["GHS03","GHS06","GHS08","GHS09"],{note:"سام ومسبب للعقم: قفازات دائماً."}],
["ki","يوديد البوتاسيوم","Potassium iodide","KI","s","salt","#f7f7f4","أبيض","white","بلورات بيضاء؛ تصفرّ ببطء في الهواء",[13],[],{}],
["kbr","بروميد البوتاسيوم","Potassium bromide","KBr","s","salt","#f7f7f4","أبيض","white","بلورات بيضاء",[13],[],{}],
["kscn","ثيوسيانات البوتاسيوم","Potassium thiocyanate","KSCN","s","salt","#f7f7f4","أبيض","white","بلورات عديمة اللون؛ يعطي لوناً أحمر دموياً مع Fe³⁺",[12],["GHS07"],{}],
["cuso4","كبريتات النحاس المائية","Copper(II) sulfate pentahydrate","CuSO4*5H2O","s","salt","#1f6fd1","أزرق","blue","بلورات زرقاء لامعة؛ محلولها أزرق سماوي",[10],["GHS07","GHS09"],{sol:"#5aaee8",solAr:"محلول أزرق",note:"تفقد ماء التبلور بالتسخين فتصبح بيضاء (CuSO₄ اللامائية)."}],
["cuso4a","كبريتات النحاس اللامائية","Copper(II) sulfate, anhydrous","CuSO4","s","salt","#eef0ee","أبيض مائل للرمادي","greyish white","مسحوق أبيض يزرقّ عند ملامسة الماء (كاشف للرطوبة)",[10],["GHS07","GHS09"],{}],
["feso4","كبريتات الحديد الثنائي المائية","Iron(II) sulfate heptahydrate","FeSO4*7H2O","s","salt","#b9e3a8","أخضر باهت","pale green","بلورات خضراء مزرقة؛ محلولها أخضر باهت جداً",[11],["GHS07"],{sol:"#e1f2d6",solAr:"محلول أخضر باهت",note:"يتأكسد في الهواء إلى Fe³⁺ فيصفرّ."}],
["fecl3","كلوريد الحديد الثلاثي","Iron(III) chloride hexahydrate","FeCl3*6H2O","s","salt","#c9822a","أصفر بني","yellow-brown","كتل صفراء بنية ماصة للرطوبة؛ محلولها أصفر برتقالي",[12],["GHS05","GHS07"],{sol:"#e3a63a",solAr:"محلول أصفر برتقالي",note:"محلوله حامضي بسبب التحلل المائي لـ Fe³⁺."}],
/* oxidizers */
["kmno4","برمنغنات البوتاسيوم","Potassium permanganate","KMnO4","s","oxid","#3a0d4f","بنفسجي داكن (شبه أسود)","dark purple, almost black","بلورات بلمعان معدني؛ محلولها بنفسجي شديد",[1,11],["GHS03","GHS07","GHS09"],{sol:"#8e24aa",solAr:"محلول بنفسجي",note:"يصبح عديم اللون تقريباً (Mn²⁺) في الوسط الحامضي، وراسباً بنياً (MnO₂) في المتعادل."}],
["k2cr2o7","ثنائي كرومات البوتاسيوم","Potassium dichromate","K2Cr2O7","s","oxid","#f07a12","برتقالي","orange","بلورات برتقالية زاهية؛ محلولها برتقالي",[11],["GHS03","GHS05","GHS06","GHS08","GHS09"],{sol:"#f59b2b",solAr:"محلول برتقالي",note:"مسرطن (Cr⁶⁺). يتحول إلى الأخضر (Cr³⁺) عند الاختزال."}],
["k2cro4","كرومات البوتاسيوم","Potassium chromate","K2CrO4","s","oxid","#f5d000","أصفر","yellow","بلورات صفراء؛ محلولها أصفر",[9,13],["GHS06","GHS08","GHS09"],{sol:"#f7e04a",solAr:"محلول أصفر",note:"دليل طريقة مور لترسيب الكلوريد (يعطي راسباً أحمر طوبياً مع Ag⁺)."}],
["h2o2","بيروكسيد الهيدروجين","Hydrogen peroxide","H2O2","aq","oxid","none","عديم اللون","colourless","سائل شفاف يتفكك ببطء إلى ماء وأكسجين",[11],["GHS03","GHS05","GHS07"],{stock:"30% · ρ = 1.11 g/mL ≈ 9.8 M"}],
["i2","اليود","Iodine","I2","s","oxid","#3d2b4a","رمادي أسود بلمعان بنفسجي","grey-black with violet lustre","بلورات تتسامى بأبخرة بنفسجية؛ محلوله في KI بني",[13],["GHS07","GHS09"],{sol:"#8a4a12",solAr:"محلول بني (في KI)"}],
/* indicators */
["php","الفينولفثالين","Phenolphthalein","C20H14O4","aq","ind","#ff5fa8","عديم اللون في الحامض ← وردي في القاعدة","colourless (acid) → pink (base)","مسحوق أبيض يُذاب في الإيثانول",[8,9],["GHS08"],{range:"pH 8.2 – 10.0",acid:"none",base:"#ff5fa8"}],
["mo","المثيل البرتقالي","Methyl orange","C14H14N3NaO3S","aq","ind","#ef8a17","أحمر في الحامض ← أصفر في القاعدة","red (acid) → yellow (base)","مسحوق برتقالي",[9],["GHS06"],{range:"pH 3.1 – 4.4",acid:"#e53935",base:"#fbc02d"}],
["btb","بروموثيمول الأزرق","Bromothymol blue","C27H28Br2O5S","aq","ind","#3a9d5d","أصفر في الحامض، أخضر متعادل، أزرق في القاعدة","yellow → green → blue","مسحوق كريمي يُذاب في الإيثانول",[9,12],[],{range:"pH 6.0 – 7.6",acid:"#f2d33a",base:"#1e5fb4"}],
["univ","الدليل العام","Universal indicator","—","aq","ind","#43a047","طيف ألوان: أحمر (1) ← أخضر (7) ← بنفسجي (14)","red → green → violet","خليط أدلة في الإيثانول",[12],["GHS02"],{range:"pH 1 – 14",acid:"#e53935",base:"#6a1b9a"}],
["litmus","ورق تباع الشمس","Litmus paper","—","s","ind","#7b5aa6","أحمر في الحامض ← أزرق في القاعدة","red (acid) → blue (base)","شرائط ورقية مصبوغة بصبغة الأشنات",[12],[],{range:"pH 4.5 – 8.3",acid:"#d32f2f",base:"#1e63c4"}],
["starch","محلول النشا","Starch solution","(C6H10O5)n","aq","ind","none","عديم اللون إلى معتم قليلاً ← أزرق أسود مع اليود","colourless → blue-black with iodine","محلول غروي يُحضر ساخناً",[11],[],{acid:"none",base:"#1b1f4f"}],
/* organic solvents */
["h2o","الماء المقطر","Distilled water","H2O","l","solv","none","عديم اللون","colourless","سائل شفاف بلا رائحة",[1,2,4,5,6,7,8,9,10,11,12,13],[],{mp:"0°C",bp:"100.0°C",rho:"0.99705 g/mL (25°C)"}],
["etoh","الإيثانول","Ethanol","C2H5OH","l","solv","none","عديم اللون","colourless","سائل متطاير برائحة الكحول",[2,5],["GHS02","GHS07"],{bp:"78.4°C",rho:"0.7893 g/mL (20°C)"}],
["meoh","الميثانول","Methanol","CH3OH","l","solv","none","عديم اللون","colourless","سائل متطاير؛ سام جداً (يسبب العمى)",[2,5],["GHS02","GHS06","GHS08"],{bp:"64.7°C",rho:"0.7914 g/mL"}],
["acetone","الأسيتون","Acetone","CH3COCH3","l","solv","none","عديم اللون","colourless","سائل سريع التطاير برائحة مميزة",[2,5],["GHS02","GHS07"],{bp:"56.1°C",rho:"0.7899 g/mL",note:"يُستخدم لشطف وتجفيف الزجاجيات."}],
["hexane","n-الهكسان","n-Hexane","C6H14","l","solv","none","عديم اللون","colourless","سائل متطاير برائحة البنزين الخفيفة",[2,5],["GHS02","GHS07","GHS08","GHS09"],{bp:"68.7°C",rho:"0.6594 g/mL"}],
["heptane","n-الهبتان","n-Heptane","C7H16","l","solv","none","عديم اللون","colourless","سائل متطاير؛ مرجع رقم الأوكتان (صفر)",[2,5],["GHS02","GHS07","GHS08","GHS09"],{bp:"98.4°C",rho:"0.6837 g/mL"}],
["octane","n-الأوكتان","n-Octane","C8H18","l","solv","none","عديم اللون","colourless","سائل برائحة البنزين",[5],["GHS02","GHS07","GHS08","GHS09"],{bp:"125.7°C"}],
["cyhex","الهكسان الحلقي","Cyclohexane","C6H12","l","solv","none","عديم اللون","colourless","سائل متطاير",[5],["GHS02","GHS07","GHS08","GHS09"],{bp:"80.7°C"}],
["toluene","التولوين","Toluene","C6H5CH3","l","solv","none","عديم اللون","colourless","سائل برائحة عطرية حلوة",[2,5],["GHS02","GHS07","GHS08"],{bp:"110.6°C",rho:"0.8669 g/mL"}],
["benzene","البنزين العطري","Benzene","C6H6","l","solv","none","عديم اللون","colourless","سائل برائحة عطرية؛ مسرطن (للعرض فقط)",[5],["GHS02","GHS07","GHS08"],{bp:"80.1°C"}],
["etac","أسيتات الإيثيل","Ethyl acetate","CH3COOC2H5","l","solv","none","عديم اللون","colourless","سائل برائحة فاكهية",[5],["GHS02","GHS07"],{bp:"77.1°C"}],
["glycerol","الغليسرين","Glycerol","C3H8O3","l","solv","none","عديم اللون","colourless","سائل لزج حلو الطعم",[2],[],{rho:"1.2613 g/mL",bp:"290°C"}],
["meg","إيثيلين غلايكول (MEG)","Ethylene glycol","C2H6O2","l","solv","none","عديم اللون","colourless","سائل لزج؛ يُستخدم مانعاً للتجمد ولتجفيف الغاز",[2],["GHS07","GHS08"],{rho:"1.1135 g/mL"}],
/* organic solids */
["naph","النفثالين","Naphthalene","C10H8","s","org","#f7f7f4","أبيض","white","بلورات بيضاء برائحة كرات العثّ؛ تتسامى",[4],["GHS07","GHS08","GHS09"],{mp:"80.26°C"}],
["acetan","الأسيتانيليد","Acetanilide","C8H9NO","s","org","#f7f7f4","أبيض","white","صفائح بيضاء لامعة",[4],["GHS07"],{mp:"114.3°C"}],
["urea","اليوريا","Urea","CO(NH2)2","s","org","#f7f7f4","أبيض","white","بلورات أو حبيبات بيضاء (سماد)",[4],[],{mp:"133°C",note:"تتفكك فوق درجة انصهارها بقليل."}],
["pdcb","بارا-ثنائي كلوروبنزين","p-Dichlorobenzene","C6H4Cl2","s","org","#f7f7f4","أبيض","white","بلورات بيضاء برائحة قوية؛ تتسامى",[4],["GHS07","GHS08","GHS09"],{mp:"53.5°C"}],
["vanil","الفانيلين","Vanillin","C8H8O3","s","org","#f6efda","أبيض إلى أصفر باهت","white to pale yellow","إبر برائحة الفانيلا",[4],["GHS07"],{mp:"81.5°C"}],
["aspirin","الأسبرين (حامض الأسيتيل ساليسيليك)","Aspirin","C9H8O4","s","org","#f7f7f4","أبيض","white","بلورات أو مسحوق أبيض",[4],["GHS07"],{mp:"≈ 135°C (يتفكك)"}],
["phenol","الفينول","Phenol","C6H5OH","s","org","#f3e3e0","عديم اللون يميل للوردي","colourless, turns pinkish in air","بلورات تتلون بالتأكسد؛ أكّال وسام",[4],["GHS05","GHS06","GHS08"],{mp:"40.9°C"}],
["wax","شمع البارافين","Paraffin wax","C25H52","s","petro","#f3efe2","أبيض شمعي","waxy white","كتل شمعية من تكرير النفط",[4,7],[],{mp:"≈ 50–65°C (حسب الدرجة)",note:"خليط ألكانات طويلة، لذلك ينصهر بمدى لا بنقطة."}],
/* petroleum */
["cond","مكثفات غازية","Gas condensate","C5–C10","l","petro","#f6f0d0","عديم اللون إلى قشي باهت","colourless to pale straw","سائل خفيف جداً متطاير",[3],["GHS02","GHS08"],{api:"≈ 60 °API"}],
["gaso","بنزين السيارات","Gasoline (petrol)","C5–C12","l","petro","#f5e7a0","أصفر باهت","pale yellow","سائل متطاير برائحة مميزة (قد يُصبغ تجارياً)",[2,3],["GHS02","GHS07","GHS08","GHS09"],{api:"≈ 58 °API",rho:"≈ 0.745 g/mL"}],
["kero","الكيروسين / وقود الطائرات","Kerosene / Jet A-1","C10–C16","l","petro","#f3e7b5","عديم اللون إلى قشي","colourless to straw","سائل زيتي خفيف (النفط الأبيض)",[2,3],["GHS02","GHS07","GHS08","GHS09"],{api:"≈ 45 °API",rho:"≈ 0.80 g/mL"}],
["dies","الديزل (زيت الغاز)","Diesel (gas oil)","C10–C22","l","petro","#e8c65a","أصفر إلى كهرماني فاتح","yellow to light amber","سائل زيتي",[2,3],["GHS02","GHS07","GHS08","GHS09"],{api:"≈ 36 °API",rho:"≈ 0.84 g/mL"}],
["lube","زيت التزييت (زيت محركات)","Lubricating oil","C20–C40","l","petro","#c98a2b","كهرماني","amber","سائل لزج",[2,3],[],{rho:"≈ 0.88 g/mL"}],
["kirk","نفط خام خفيف (نمط كركوك)","Light crude (Kirkuk type)","خليط هيدروكربونات","l","petro","#2b1d0e","بني داكن مخضر","dark greenish-brown","سائل معتم متوسط اللزوجة",[3],["GHS02","GHS07","GHS08","GHS09"],{api:"≈ 35 °API",note:"قد يحتوي H₂S: لا تشمه."}],
["basm","نفط خام متوسط (نمط البصرة المتوسط)","Medium crude (Basrah Medium type)","خليط هيدروكربونات","l","petro","#1f150b","أسود بني","brownish black","سائل معتم",[3],["GHS02","GHS07","GHS08","GHS09"],{api:"≈ 29 °API"}],
["bash","نفط خام ثقيل (نمط البصرة الثقيل)","Heavy crude (Basrah Heavy type)","خليط هيدروكربونات","l","petro","#140d07","أسود","black","سائل معتم لزج",[3],["GHS02","GHS07","GHS08","GHS09"],{api:"≈ 24 °API"}],
["xhvy","نفط ثقيل جداً","Extra-heavy crude","خليط هيدروكربونات","l","petro","#0b0705","أسود","black","سائل شديد اللزوجة شبه صلب",[3],["GHS07","GHS08","GHS09"],{api:"≈ 12 °API"}],
["brine","محلول ملحي 10%","10% NaCl brine","NaCl + H2O","aq","petro","none","عديم اللون","colourless","يمثل المياه المصاحبة لإنتاج النفط",[2],[],{rho:"1.0707 g/mL"}],
["sea","ماء البحر","Seawater (3.5%)","—","aq","petro","#dceef4","عديم اللون إلى مزرق خفيف","colourless, faint blue in bulk","ماء مالح غني بالكبريتات (يُحقن في المكامن)",[2,13],[],{rho:"1.0248 g/mL"}],
["olive","زيت الزيتون","Olive oil","—","l","petro","#b7a531","أصفر مخضر","greenish yellow","سائل زيتي (عينة غير نفطية للمقارنة)",[2],[],{rho:"0.913 g/mL"}],
/* metals */
["zn","الخارصين (الزنك)","Zinc","Zn","s","metal","#9aa3a8","رمادي فضي","silvery grey","حبيبات أو شرائط",[13],["GHS09"],{note:"يُستخدم في الحماية الكاثودية للأنابيب."}],
["mg","المغنيسيوم","Magnesium","Mg","s","metal","#c9ced2","فضي لامع","shiny silver","شريط فضي يحترق بلهب أبيض ساطع",[13],["GHS02"],{}],
["cu","النحاس","Copper","Cu","s","metal","#c46a3a","أحمر بني","reddish brown","سلك أو صفائح",[13],[],{}],
/* gases */
["co2","ثاني أكسيد الكربون","Carbon dioxide","CO2","g","gas","none","عديم اللون","colourless","غاز بلا رائحة أثقل من الهواء؛ يعكّر ماء الجير",[8,13],["GHS04"],{}],
["ch4","الميثان","Methane","CH4","g","gas","none","عديم اللون","colourless","غاز بلا رائحة (المكوّن الرئيسي للغاز الطبيعي)",[5],["GHS02","GHS04"],{}],
["c3h8","البروبان","Propane","C3H8","g","gas","none","عديم اللون","colourless","غاز يُسال تحت الضغط (غاز الطبخ مع البيوتان)",[5],["GHS02","GHS04"],{}],
["h2s","كبريتيد الهيدروجين","Hydrogen sulfide","H2S","g","gas","none","عديم اللون","colourless","رائحة البيض الفاسد بتراكيز منخفضة، ويشلّ حاسة الشم بالتراكيز العالية",[3],["GHS02","GHS04","GHS06","GHS09"],{note:"قاتل فوق 500 ppm؛ شائع في الحقول النفطية الحامضية."}],
["cl2","الكلور","Chlorine","Cl2","g","gas","#c7d64a","أصفر مخضر","yellow-green","غاز خانق برائحة المبيّض (ينتج من خلط المبيّض بالحامض)",[1],["GHS03","GHS04","GHS06","GHS09"],{}],
["no2","ثاني أكسيد النتروجين","Nitrogen dioxide","NO2","g","gas","#a5481b","بني محمر","reddish brown","غاز سام يتصاعد من حامض النتريك المركز",[11],["GHS03","GHS04","GHS05","GHS06"],{}],
/* precipitates and ions */
["agcl","كلوريد الفضة","Silver chloride","AgCl","s","ppt","#f7f7f4","أبيض (يبنفسج بالضوء)","white (darkens in light)","راسب أبيض متجبن",[13],[],{ksp:"1.8×10⁻¹⁰"}],
["agbr","بروميد الفضة","Silver bromide","AgBr","s","ppt","#f3eac0","أصفر كريمي باهت","pale cream","راسب كريمي",[13],[],{ksp:"5.0×10⁻¹³"}],
["agi","يوديد الفضة","Silver iodide","AgI","s","ppt","#f6dd55","أصفر","yellow","راسب أصفر",[13],[],{ksp:"8.3×10⁻¹⁷"}],
["ag2cro4","كرومات الفضة","Silver chromate","Ag2CrO4","s","ppt","#a2361d","أحمر طوبي","brick red","راسب أحمر طوبي (نقطة نهاية طريقة مور)",[13],[],{ksp:"1.1×10⁻¹²"}],
["baso4","كبريتات الباريوم","Barium sulfate","BaSO4","s","ppt","#f7f7f4","أبيض","white","راسب أبيض ناعم جداً (قشور الآبار)",[13],[],{ksp:"1.1×10⁻¹⁰"}],
["pbi2","يوديد الرصاص","Lead(II) iodide","PbI2","s","ppt","#f5c400","أصفر ذهبي","bright golden yellow","راسب أصفر زاهٍ؛ يذوب ساخناً ويتبلور «مطراً ذهبياً» عند التبريد",[13],[],{ksp:"9.8×10⁻⁹"}],
["caco3p","كربونات الكالسيوم (راسب)","Calcium carbonate (precipitate)","CaCO3","s","ppt","#f7f7f4","أبيض","white","عكارة بيضاء في ماء الجير مع CO₂",[13],[],{ksp:"3.4×10⁻⁹"}],
["caf2","فلوريد الكالسيوم","Calcium fluoride","CaF2","s","ppt","#f7f7f4","أبيض","white","راسب أبيض",[13],[],{ksp:"3.5×10⁻¹¹"}],
["mgoh2","هيدروكسيد المغنيسيوم","Magnesium hydroxide","Mg(OH)2","s","ppt","#f7f7f4","أبيض","white","راسب أبيض هلامي",[13],[],{ksp:"5.6×10⁻¹²"}],
["cuoh2","هيدروكسيد النحاس","Copper(II) hydroxide","Cu(OH)2","s","ppt","#7fb6e6","أزرق فاتح","pale blue","راسب أزرق هلامي (Cu²⁺ + OH⁻)",[13],[],{}],
["feoh2","هيدروكسيد الحديد الثنائي","Iron(II) hydroxide","Fe(OH)2","s","ppt","#6f8f52","أخضر داكن (عكر)","dirty green","راسب أخضر يتحول بنياً في الهواء",[13],[],{}],
["feoh3","هيدروكسيد الحديد الثلاثي","Iron(III) hydroxide","Fe(OH)3","s","ppt","#8a3b12","بني محمر","red-brown","راسب بني محمر هلامي (لون الصدأ)",[13],[],{ksp:"2.8×10⁻³⁹"}],
["mno2","ثنائي أكسيد المنغنيز","Manganese dioxide","MnO2","s","ppt","#3b2a20","بني داكن إلى أسود","dark brown to black","راسب بني من اختزال KMnO₄ في الوسط المتعادل",[11],[],{}],
["cr3","أيون الكروم الثلاثي","Chromium(III) ion","Cr^3+","aq","ppt","#2f7d4a","أخضر","green","لون محلول ثنائي الكرومات بعد اختزاله",[11],[],{}],
["mn2","أيون المنغنيز الثنائي","Manganese(II) ion","Mn^2+","aq","ppt","#f4dfe4","وردي باهت جداً (شبه عديم اللون)","very pale pink","لون محلول البرمنغنات بعد اختزاله في الوسط الحامضي",[11],[],{}],
["cu2","أيون النحاس الثنائي","Copper(II) ion (aq)","Cu^2+","aq","ppt","#5aaee8","أزرق سماوي","sky blue","[Cu(H₂O)₆]²⁺ في الماء",[10],[],{}],
["cunh3","معقد النحاس الأموني","Tetraamminecopper(II)","[Cu(NH3)4]^2+","aq","ppt","#1a3fa8","أزرق ملكي داكن","deep royal blue","عند إضافة الأمونيا الزائدة لمحلول النحاس",[12],[],{}],
["fescn","معقد ثيوسيانات الحديد","Iron(III) thiocyanate","[Fe(SCN)]^2+","aq","ppt","#8b0000","أحمر دموي","blood red","كاشف حساس جداً لأيونات Fe³⁺",[12],[],{}],
["i2starch","معقد اليود والنشا","Starch–iodine complex","I2 + starch","aq","ppt","#1b1f4f","أزرق أسود","blue-black","يظهر بأثر ضئيل من اليود (نقطة نهاية التسحيح اليودي)",[11],[],{}],
["cudep","راسب النحاس الفلزي","Copper metal deposit","Cu","s","ppt","#b5653a","أحمر بني","reddish brown","يترسب على الخارصين في محلول كبريتات النحاس (إحلال)",[13],[],{}]];
const INV=INVRAW.map(r=>{const o={id:r[0],ar:r[1],en:r[2],f:r[3],st:r[4],cab:r[5],col:r[6],colAr:r[7],colEn:r[8],look:r[9],weeks:r[10],ghs:r[11],x:r[12]||{}};
 try{if(/[A-Z]/.test(o.f)&&!/[–\s]/.test(o.f)&&!/^\(C6H10O5\)n$/.test(o.f)&&!/\+/.test(o.f))o.M=o.x.M?+o.x.M:molarMass(o.f.replace(/\^.*$/,""))}catch(e){}
 const m=(typeof MATBY!=="undefined")&&MATBY[{h2so4c:"h2so4",hcl37:"hcl",naohs:"naoh",acetone:"acetone",hexane:"hexane"}[o.id]||o.id];if(m){o.haz=m.haz;o.aid=m.aid;o.disp=m.disp;o.use=m.use;o.oil=m.oil}return o});
const INVBY=Object.fromEntries(INV.map(o=>[o.id,o]));
let ST={tab:"chem",cab:"all",w:0,q:""};
const swatch=(c,size=46,title="")=>c==="none"?`<span class="sw none" style="width:${size}px;height:${size}px" title="${title}"></span>`:`<span class="sw" style="width:${size}px;height:${size}px;background:${c}" title="${title}"></span>`;
const ixt=v=>isEN()&&v&&typeof INVX_EN!=="undefined"&&INVX_EN[v]?INVX_EN[v]:v;
const GHS_EN={GHS01:"Explosive",GHS02:"Flammable",GHS03:"Oxidizer",GHS04:"Compressed gas",GHS05:"Corrosive",GHS06:"Toxic",GHS07:"Irritant / harmful",GHS08:"Chronic health hazard",GHS09:"Environmental hazard"};
function invCard(o){const st=STN[o.st]||["",""];const ind=o.cab==="ind"&&(o.x.acid||o.x.base);const E=isEN();
 const nm=E?`<b>${o.en}</b><small class="sar">${o.ar}</small>`:`<b>${o.ar}</b><small class="ltr">${o.en}</small>`;
 const col=E?`🎨 ${o.colEn} <span class="sen sar">${o.colAr}</span>`:`🎨 ${o.colAr} <span class="sen">${o.colEn}</span>`;
 return`<details class="invc"><summary><span class="invsw">${ind?`<span class="indsw">${swatch(o.x.acid||"none",22,L("حامضي","acidic"))}<span>${E?"→":"←"}</span>${swatch(o.x.base||o.col,22,L("قاعدي","basic"))}</span>`:o.x.sol?`<span class="indsw">${swatch(o.col,30,E?o.colEn:o.colAr)}${swatch(o.x.sol,22,ixt(o.x.solAr))}</span>`:swatch(o.col,40,E?o.colEn:o.colAr)}</span>
 <span class="invt">${nm}<span class="ltr mono invf">${o.f.match(/[A-Z]/)&&!/[–\s]/.test(o.f)?pretty(o.f):o.f}</span><span class="invcol">${col}</span></span>
 <span class="invm"><span class="pill ${st[1]}">${st[0]}</span>${o.M?`<span class="muted ltr" style="font-size:12px">${o.M.toFixed(2)} g/mol</span>`:""}<span class="ghs">${(o.ghs||[]).slice(0,3).map(ghs).join("")}</span></span></summary>
 <div class="invd">${row(L("المظهر","Appearance"),bd(ixt(o.look)))}${o.x.sol?row(L("لون المحلول","Solution colour"),`${swatch(o.x.sol,16)} ${ixt(o.x.solAr)}`):""}${o.x.range?row(L("مدى التغير","Transition range"),`<bdi class="ltr">${o.x.range}</bdi>`):""}${o.x.stock?row(L("التركيز المتوفر","Stock concentration"),bd(ixt(o.x.stock))):""}
 ${o.x.mp?row(L("درجة الانصهار","Melting point"),`<bdi class="ltr">${o.x.mp}</bdi>`):""}${o.x.bp?row(L("درجة الغليان","Boiling point"),`<bdi class="ltr">${o.x.bp}</bdi>`):""}${o.x.rho?row(L("الكثافة","Density"),bd(ixt(o.x.rho))):""}${o.x.api?row(L("درجة API","API gravity"),`<bdi class="ltr">${o.x.api}</bdi>`):""}${o.x.ksp?row("Ksp",`<bdi class="ltr">${o.x.ksp}</bdi>`):""}
 ${o.x.note?row(L("ملاحظة","Note"),bd(ixt(o.x.note))):""}${o.haz?row(L("الخطورة","Hazard"),bd(ixt(o.haz))):(o.ghs||[]).length?row(L("الخطورة","Hazard"),o.ghs.map(g=>E?GHS_EN[g]:GHSN[g]).join(E?", ":"، ")):""}${o.aid?row(L("الإسعاف","First aid"),bd(ixt(o.aid))):""}${o.disp?row(L("التخلص","Disposal"),bd(ixt(o.disp))):""}
 ${row(L("التخزين","Storage"),`${CAB[o.cab][2]} ${bd(ixt(CAB[o.cab][3]))}`)}${o.use?row(L("الاستخدامات","Uses"),bd(ixt(o.use))):""}${o.oil?row(L("في صناعة النفط","In the oil industry"),bd(ixt(o.oil))):""}
 ${o.weeks.length?row(L("يُستخدم في","Used in"),o.weeks.map(w=>`<button class="chip" data-go="ac/w/${w}">${L("الأسبوع","Week")} ${w}</button>`).join(" ")):""}</div></details>`}
const row=(k,v)=>`<div class="invr"><b>${k}:</b> <span>${v}</span></div>`;
function storeEquip(){const m=new Map();for(let w=1;w<=13;w++){const E=lxOf(w).app||[];(LX[w].app||[]).forEach((a,i)=>{const k=a[1].toLowerCase();if(!m.has(k))m.set(k,{ar:a[0],en:a[1],d:isEN()&&E[i]?E[i][2]:a[2],w:[]});m.get(k).w.push(w)})}return[...m.values()]}
function storeRender(){const box=$("tab-store");
 const head=`<div class="panel"><div class="row" style="justify-content:space-between"><h2>${L(`🧪 مخزن المختبر <span class="sen">Lab stockroom</span>`,"🧪 Lab stockroom")}</h2><button class="btn sm" data-go="ac">${L("→ الصفحة الرئيسية للمادة","← Subject home")}</button></div>
 <p class="muted" style="margin:0">${L("كل المواد والعينات المستخدمة في الأسابيع الـ 15 بلونها الحقيقي وصيغتها واسمها بالعربي والإنكليزي وخطورتها ومكان تخزينها. اضغط على أي مادة لعرض تفاصيلها.","Every chemical and sample used in the 15 weeks, with its real colour, formula, Arabic and English name, hazards and storage place. Tap any item to see its details.")}</p>
 <div class="brtabs">${[["exp",L("📚 مخازن التجارب","📚 Experiment stocks"),Object.keys(STKDEF).length+L(" تجربة"," experiments")],["chem",L("🧪 المواد والعينات","🧪 Chemicals & samples"),INV.filter(o=>o.cab!=="ppt").length],["ppt",L("🌈 ألوان الرواسب والأيونات","🌈 Precipitate & ion colours"),INV.filter(o=>o.cab==="ppt").length],["eq",L("🔬 الأجهزة والأدوات","🔬 Apparatus"),storeEquip().length]].map(t=>`<button class="${ST.tab===t[0]?"on":""}" data-stab="${t[0]}"><b>${t[1]}</b> <span class="muted">(${t[2]})</span></button>`).join("")}</div>
 <div class="row" style="gap:8px"><input type="search" id="stQ" value="${ST.q}" placeholder="${L("ابحث بالاسم العربي أو الإنكليزي أو الصيغة أو اللون…","Search by Arabic or English name, formula or colour…")}" style="flex:1;min-width:200px"><select id="stW"><option value="0">${L("كل الأسابيع","All weeks")}</option>${Array.from({length:13},(_,i)=>`<option value="${i+1}"${ST.w===i+1?" selected":""}>${L("الأسبوع","Week")} ${i+1}: ${isEN()?GSH_EN[i+1]:GSH[i+1]}</option>`).join("")}</select></div>
 ${ST.tab==="chem"?`<div class="row wfilt" style="gap:6px"><button class="chip${ST.cab==="all"?" on":""}" data-cab="all">${L("الكل","All")}</button>${Object.entries(CAB).filter(([k])=>k!=="ppt").map(([k,c])=>`<button class="chip${ST.cab===k?" on":""}" data-cab="${k}">${c[2]} ${L(c[0]+` <span class="sen">${c[1]}</span>`,c[1])}</button>`).join("")}</div>`:""}</div>`;
 let body="";const q=ST.q.trim().toLowerCase();
 const EXPN=isEN()?[["safe","🦺 Safety",1],["pyc","⚖ Pycnometer",2],["hyd","🛢 Hydrometer & API",3],["mp","🔥 Melting point",4],["bp","♨ Boiling point",5],["rc","❄ Recrystallization","6–7"],["tit","💧 Titration","8–9"],["mol","🧴 Molarity",10],["norm","⚗ Normality",11],["ph","🎨 pH",12],["sol","📈 Solubility",13]]:[["safe","🦺 السلامة",1],["pyc","⚖ البكنوميتر",2],["hyd","🛢 الهيدروميتر وAPI",3],["mp","🔥 الانصهار",4],["bp","♨ الغليان",5],["rc","❄ إعادة التبلور","6–7"],["tit","💧 التسحيح","8–9"],["mol","🧴 المولارية",10],["norm","⚗ العيارية",11],["ph","🎨 pH",12],["sol","📈 الذوبانية",13]];
 if(ST.tab==="exp"){ST.exp=ST.exp||"pyc";body=`<div class="panel" style="gap:8px"><div class="row wfilt" style="gap:6px">${EXPN.map(e=>`<button class="chip${ST.exp===e[0]?" on":""}" data-exp="${e[0]}">${e[1]} <span class="sen">W${e[2]}</span></button>`).join("")}</div>${stkHTML(ST.exp,"s")}</div>`}
 else if(ST.tab==="eq"){const EQ=storeEquip().filter(e=>(!ST.w||e.w.includes(ST.w))&&(!q||(e.ar+" "+e.en+" "+e.d).toLowerCase().includes(q)));body=`<div class="panel"><div class="tbl"><table><tr>${isEN()?"<th>Apparatus</th><th>Arabic</th><th>Function and use</th><th>Weeks</th>":"<th>الأداة</th><th>English</th><th>الوظيفة وطريقة الاستخدام</th><th>الأسابيع</th>"}</tr>${EQ.map(e=>`<tr><td><b>${isEN()?e.en:e.ar}</b></td><td${isEN()?"":` class="ltr"`}>${isEN()?e.ar:e.en}</td><td>${bd(e.d)}</td><td>${e.w.map(w=>`<button class="chip" data-go="ac/w/${w}">${w}</button>`).join(" ")}</td></tr>`).join("")}</table></div><p class="muted" style="margin:0">${EQ.length} ${L("أداة","items")}</p></div>`}
 else{const IL=INV.filter(o=>(ST.tab==="ppt"?o.cab==="ppt":o.cab!=="ppt")&&(ST.tab!=="chem"||ST.cab==="all"||o.cab===ST.cab)&&(!ST.w||o.weeks.includes(ST.w))&&(!q||(o.ar+" "+o.en+" "+o.f+" "+pretty(o.f)+" "+o.colAr+" "+o.colEn).toLowerCase().includes(q)));
  const groups=ST.tab==="ppt"?[["ppt",IL]]:Object.keys(CAB).filter(k=>k!=="ppt").map(k=>[k,IL.filter(o=>o.cab===k)]).filter(g=>g[1].length);
  body=groups.map(([k,arr])=>`<div class="panel" style="gap:8px"><h3 style="margin:0">${CAB[k][2]} ${L(CAB[k][0]+` <span class="sen">${CAB[k][1]}</span>`,CAB[k][1])} <span class="muted" style="font-size:13px">(${arr.length})</span></h3><p class="muted" style="margin:0;font-size:13px">${ixt(CAB[k][3])}</p><div class="invg">${arr.map(invCard).join("")}</div></div>`).join("")||`<div class="panel"><p class="muted" style="margin:0">${L("لا توجد مواد مطابقة.","No matching items.")}</p></div>`}
 box.innerHTML=head.replace(/<div class="row" style="gap:8px"><input type="search" id="stQ"[\s\S]*?<\/select><\/div>/,ST.tab==="exp"?'<input type="hidden" id="stQ"><select id="stW" hidden></select>':"$&")+body;pBind(box);box.querySelectorAll("[data-exp]").forEach(b=>b.onclick=()=>{ST.exp=b.dataset.exp;storeRender()});stkBind(box);
 box.querySelectorAll("[data-stab]").forEach(b=>b.onclick=()=>{ST.tab=b.dataset.stab;storeRender()});box.querySelectorAll("[data-cab]").forEach(b=>b.onclick=()=>{ST.cab=b.dataset.cab;storeRender()});
 $("stW").onchange=()=>{ST.w=+$("stW").value;storeRender()};let t;$("stQ").oninput=()=>{clearTimeout(t);t=setTimeout(()=>{ST.q=$("stQ").value;const pos=$("stQ").selectionStart;storeRender();$("stQ").focus();try{$("stQ").setSelectionRange(pos,pos)}catch(e){}},200)}}
/* materials of one week, for the week page */
function storeWeekHTML(w){const IL=INV.filter(o=>o.weeks.includes(w)&&o.cab!=="ppt"&&!(o.id==="h2o"&&w!==1&&w!==2));const P=INV.filter(o=>o.weeks.includes(w)&&o.cab==="ppt");
 return(IL.length?`<div class="invg">${IL.map(invCard).join("")}</div>`:`<p class="muted" style="margin:0">${L("لا مواد كيميائية في هذا الأسبوع؛ نتدرب على الأدوات بالماء المقطر.","No chemicals this week; we practise with the apparatus using distilled water.")}</p>`)+(P.length?`<h4 style="margin:10px 0 4px">${L("🌈 الألوان التي ستراها في نواتج التجربة","🌈 Colours you will see in the products")}</h4><div class="invg">${P.map(invCard).join("")}</div>`:"")}
mkSec("store","");
